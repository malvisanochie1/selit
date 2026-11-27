// Runs every migration on an in-memory Postgres (PGlite) with small stand-ins
// for Supabase's auth and storage schemas, then checks the rules from the
// point of view of anonymous visitors, members and admins.
//
// Run with: npm run test --workspace backend

import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../supabase/migrations');
const db = new PGlite({ extensions: { pgcrypto } });

await db.exec(`
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema extensions; create schema auth; create schema storage;
grant usage on schema public, auth, storage, extensions to anon, authenticated, service_role;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid default gen_random_uuid() primary key, bucket_id text, name text, owner uuid);
alter table storage.objects enable row level security;
create function storage.foldername(name text) returns text[] language sql immutable as $$
  select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
grant execute on function auth.uid() to anon, authenticated;
`);

for (const f of fs.readdirSync(dir).sort()) {
  try {
    await db.exec(fs.readFileSync(path.join(dir, f), 'utf8'));
    console.log('ok', f);
  } catch (e) {
    console.log('FAIL', f, e.message);
    process.exit(1);
  }
}

await db.exec(`
grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
grant select, insert, update, delete on storage.objects to authenticated;
revoke all on public.app_secrets, public.action_log, public.listing_views, public.apartment_views from anon, authenticated;
`);

const A = '00000000-0000-0000-0000-00000000000a';
const B = '00000000-0000-0000-0000-00000000000b';
const ADMIN = '00000000-0000-0000-0000-0000000000ad';
const OLD = '00000000-0000-0000-0000-0000000000cc';

let pass = 0;
let fail = 0;
async function as(user, sql, params) {
  return db.transaction(async (tx) => {
    if (user) {
      await tx.exec(
        `set local role authenticated; select set_config('request.jwt.claim.sub', '${user}', true);`,
      );
    } else {
      await tx.exec(`set local role anon; select set_config('request.jwt.claim.sub', '', true);`);
    }
    return tx.query(sql, params);
  });
}
async function expectOk(name, fn) {
  try {
    const r = await fn();
    pass++;
    console.log('  ✓', name);
    return r;
  } catch (e) {
    fail++;
    console.log('  ✗', name, '→', e.message);
  }
}
async function expectErr(name, fn, match) {
  try {
    await fn();
    fail++;
    console.log('  ✗', name, '→ no error');
  } catch (e) {
    if (!match || e.message.includes(match)) {
      pass++;
      console.log('  ✓', name, `(${e.message})`);
    } else {
      fail++;
      console.log('  ✗', name, '→ wrong error', e.message);
    }
  }
}
function check(name, cond, info = '') {
  if (cond) {
    pass++;
    console.log('  ✓', name);
  } else {
    fail++;
    console.log('  ✗', name, info);
  }
}

await db.exec(`
insert into auth.users (id, raw_user_meta_data) values
 ('${A}', '{"full_name":"Ada Obi","account_type":"seller"}'),
 ('${B}', '{"full_name":"Bayo"}'),
 ('${ADMIN}', '{"full_name":"Admin"}'),
 ('${OLD}', '{"full_name":"Old Seller"}');
update public.profiles set role='admin' where id='${ADMIN}';
update public.profiles set created_at = now() - interval '90 days' where id='${OLD}';
`);

console.log('profiles');
let r = await db.query(`select id, role, full_name from public.profiles order by full_name`);
check('profiles created by trigger', r.rows.length === 4);
await as(B, `update public.profiles set role='admin', bio='hi' where id=$1`, [B]);
r = await db.query(`select role, bio from public.profiles where id=$1`, [B]);
check(
  'cannot self-promote to admin',
  r.rows[0].role === 'buyer' && r.rows[0].bio === 'hi',
  JSON.stringify(r.rows[0]),
);
await as(B, `update public.profiles set bio='x' where id=$1`, [A]);
r = await db.query(`select bio from public.profiles where id=$1`, [A]);
check('cannot edit others', r.rows[0].bio === '');
r = await as(null, `select * from public.profile_contacts`);
check('anon cannot read contacts', r.rows.length === 0);
r = await as(B, `select * from public.profile_contacts`);
check('member can read contacts', r.rows.length === 4);
r = await db.query(
  `select count(*)::int n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and proname like 'refresh%'`,
);
check('helpers not exposed in public API', r.rows[0].n === 0);
await expectErr('cannot read secrets', () => as(B, `select * from public.app_secrets`));

console.log('listings');
const listing = (seller, price = 15000) => ({
  sql: `insert into public.listings (seller_id, title, description, price, category, condition, school, meetup_spot, photo_paths)
        values ($1, 'Reading table', 'Sturdy wooden reading table, barely used', $2, 'furniture', 'good', 'Delta State University', 'School gate', '{a.webp}') returning id, status, seller_id, review_reason`,
  params: [seller, price],
});
let L = await expectOk('new seller creates listing', () =>
  as(A, listing(B).sql, listing(B).params),
);
check(
  'seller forced to caller and pending',
  L && L.rows[0].seller_id === A && L.rows[0].status === 'pending',
  JSON.stringify(L?.rows[0]),
);
const pendingId = L.rows[0].id;
r = await as(null, `select id from public.listings`);
check('pending hidden from public', r.rows.length === 0);
let O = await as(OLD, listing(OLD).sql, listing(OLD).params);
check('established seller goes live', O.rows[0].status === 'active');
const liveId = O.rows[0].id;
r = await db.query(`select role from public.profiles where id=$1`, [OLD]);
check('buyer became seller', r.rows[0].role === 'seller');
for (let i = 0; i < 5; i++)
  await as(OLD, listing(OLD, 14000 + i * 500).sql, listing(OLD, 14000 + i * 500).params);
r = await as(OLD, listing(OLD, 2000).sql, listing(OLD, 2000).params);
check(
  'too-cheap goes to review',
  r.rows[0].status === 'pending' && r.rows[0].review_reason?.includes('below'),
  JSON.stringify(r.rows[0]),
);
await expectErr(
  'seller cannot approve own',
  () => as(A, `update public.listings set status='active' where id=$1`, [pendingId]),
  'status_not_allowed',
);
await as(OLD, `update public.listings set status='sold', views_count=999 where id=$1`, [liveId]);
r = await db.query(`select status, views_count from public.listings where id=$1`, [liveId]);
check(
  'seller marks sold, cannot fake views',
  r.rows[0].status === 'sold' && r.rows[0].views_count === 0,
);
await as(OLD, `update public.listings set status='active' where id=$1`, [liveId]);
await as(B, `update public.listings set title='Hacked title' where id=$1`, [liveId]);
r = await db.query(`select title from public.listings where id=$1`, [liveId]);
check('others cannot edit', r.rows[0].title === 'Reading table');
await as(null, `select public.record_listing_view($1)`, [liveId]);
await as(null, `select public.record_listing_view($1)`, [liveId]);
await as(B, `select public.record_listing_view($1)`, [liveId]);
r = await db.query(`select views_count from public.listings where id=$1`, [liveId]);
check('views deduplicated', r.rows[0].views_count === 2, r.rows[0].views_count);
await as(ADMIN, `select public.moderate_listing($1, 'active')`, [pendingId]);
r = await as(null, `select id from public.listings where id=$1`, [pendingId]);
check('admin approves listing', r.rows.length === 1);
await expectErr(
  'non-admin cannot moderate',
  () => as(B, `select public.moderate_listing($1, 'removed')`, [liveId]),
  'forbidden',
);

console.log('item check');
r = await as(A, `select * from public.issue_listing_check()`);
check('check code issued', /^SL-[A-Z0-9]{6}$/.test(r.rows[0].code), r.rows[0].code);
const checkId = r.rows[0].id;
await db.query(`insert into storage.objects (bucket_id, name) values ('listing-checks', $1)`, [
  `${A}/${checkId}.webp`,
]);
const withCheck = { ...listing(A) };
withCheck.sql = withCheck.sql
  .replace('photo_paths)', 'photo_paths, check_id)')
  .replace("'{a.webp}')", `'{a.webp}', '${checkId}')`);
r = await as(A, withCheck.sql, withCheck.params);
check(
  'check attached',
  r.rows[0].review_reason === 'New seller, item check attached',
  r.rows[0].review_reason,
);

console.log('reviews');
await expectOk('buyer reviews seller', () =>
  as(
    B,
    `insert into public.reviews (seller_id, reviewer_id, rating, comment) values ($1, $1, 4, 'Smooth deal')`,
    [OLD],
  ),
);
r = await db.query(`select rating_average, review_count from public.profiles where id=$1`, [OLD]);
check(
  'rating recomputed',
  Number(r.rows[0].rating_average) === 4 && r.rows[0].review_count === 1,
  JSON.stringify(r.rows[0]),
);
await as(OLD, `update public.reviews set rating=5, seller_reply='Thank you' where seller_id=$1`, [
  OLD,
]);
r = await db.query(`select rating, seller_reply from public.reviews where seller_id=$1`, [OLD]);
check(
  'seller replies but cannot change rating',
  r.rows[0].rating === 4 && r.rows[0].seller_reply === 'Thank you',
);
await expectErr('cannot review self', () =>
  as(
    OLD,
    `insert into public.reviews (seller_id, reviewer_id, rating, comment) values ($1, $1, 5, 'Great me')`,
    [OLD],
  ),
);
await as(
  A,
  `insert into public.review_reactions (review_id, user_id) select id, $1 from public.reviews limit 1`,
  [B],
);
r = await db.query(`select helpful_count from public.reviews`);
check('helpful counted', r.rows[0].helpful_count === 1);

console.log('apartments');
const apt = `insert into public.apartments (agent_id, title, description, type, rent_per_year, school, area, distance_to_campus, photo_paths)
  values ($1, 'Self-contain near main gate', 'Clean self-contain with water and prepaid meter, tiled', 'self-contain', 250000, 'Delta State University', 'Anwai', '5 min walk', '{a,b}') returning id, status`;
await expectErr('unverified cannot list apartment', () => as(B, apt, [B]), 'verification_required');
await db.query(
  `insert into storage.objects (bucket_id, name) values ('verifications', $1), ('verifications', $2)`,
  [`${B}/id.webp`, `${B}/selfie.webp`],
);
await expectErr(
  'bad NIN rejected',
  () =>
    as(B, `select public.submit_verification('nin', '123', $1, $2)`, [
      `${B}/id.webp`,
      [`${B}/selfie.webp`],
    ]),
  'invalid_id_number',
);
await expectErr(
  'cannot use others photos',
  () =>
    as(B, `select public.submit_verification('nin', '12345678901', $1, $2)`, [
      `${A}/id.webp`,
      [`${B}/selfie.webp`],
    ]),
  'photo_missing',
);
const V = await as(B, `select public.submit_verification('nin', '1234 5678 901', $1, $2) as id`, [
  `${B}/id.webp`,
  [`${B}/selfie.webp`],
]);
r = await db.query(`select id_number_last4, length(id_number_hash) h from public.verifications`);
check('only last4 + hash stored', r.rows[0].id_number_last4 === '8901' && r.rows[0].h === 64);
r = await as(ADMIN, `select public.decide_verification($1, true) as paths`, [V.rows[0].id]);
check('decision returns photos to delete', r.rows[0].paths.length === 2);
r = await db.query(`select verification_status from public.profiles where id=$1`, [B]);
check('profile verified', r.rows[0].verification_status === 'verified');
const AP = await as(B, apt, [B]);
check('verified agent lists, pending', AP.rows[0].status === 'pending');
await as(ADMIN, `select public.moderate_apartment($1, 'available', true)`, [AP.rows[0].id]);
r = await as(null, `select id from public.apartments`);
check('approved apartment public', r.rows.length === 1);
await db.query(`update public.apartments set last_renewed_at = now() - interval '15 days'`);
r = await as(null, `select id from public.apartments`);
check('stale apartment hidden', r.rows.length === 0);
await as(B, `select public.renew_apartment($1)`, [AP.rows[0].id]);
r = await as(null, `select id from public.apartments`);
check('renewed apartment back', r.rows.length === 1);
for (const u of [A, OLD, ADMIN])
  await as(
    u,
    `insert into public.apartment_feedback (apartment_id, user_id, kind) values ($1, $2, 'report-taken')`,
    [AP.rows[0].id, u],
  );
r = await db.query(`select status, taken_reports from public.apartments`);
check(
  '3 taken reports mark taken',
  r.rows[0].status === 'taken' && r.rows[0].taken_reports === 3,
  JSON.stringify(r.rows[0]),
);

console.log('reports');
for (const u of [A, B, ADMIN])
  await as(
    u,
    `insert into public.reports (reporter_id, target_type, target_id, reason) values ($1, 'listing', $2, 'scam')`,
    [u, liveId],
  );
r = await db.query(`select status from public.listings where id=$1`, [liveId]);
check('3 reports pull listing', r.rows[0].status === 'pending');
r = await as(A, `select * from public.reports`);
check('reporter sees only own', r.rows.length === 1);
await as(ADMIN, `select public.set_account_status($1, 'banned')`, [OLD]);
r = await as(null, `select id from public.listings where seller_id=$1`, [OLD]);
check('banned seller listings hidden', r.rows.length === 0);
await expectErr(
  'banned cannot list',
  () => as(OLD, listing(OLD).sql, listing(OLD).params),
  'account_restricted',
);

console.log('storage');
await expectOk('upload own folder', () =>
  as(A, `insert into storage.objects (bucket_id, name) values ('listing-photos', $1)`, [
    `${A}/x.webp`,
  ]),
);
await expectErr('upload others folder', () =>
  as(A, `insert into storage.objects (bucket_id, name) values ('listing-photos', $1)`, [
    `${B}/x.webp`,
  ]),
);
r = await as(A, `select name from storage.objects where bucket_id='verifications'`);
check('private photos hidden', r.rows.length === 0);

console.log('admin + maintenance');
r = await as(ADMIN, `select public.admin_overview() as o`);
check('overview', r.rows[0].o.members === 4, JSON.stringify(r.rows[0].o));
await expectErr('members cannot run maintenance', () => as(A, `select public.run_maintenance()`));
await db.exec(`alter table public.listings disable trigger user`);
await db.query(
  `update public.listings set status='sold', updated_at = now() - interval '40 days' where seller_id=$1`,
  [OLD],
);
await db.exec(`alter table public.listings enable trigger user`);
r = await db.query(`select public.run_maintenance() as m`);
check('maintenance returns photos', r.rows[0].m['listing-photos'].length > 0);
r = await as(ADMIN, `select public.admin_list_members() as m`);
check('admin lists members', r.rows[0].m.total === 4);
r = await as(ADMIN, `select public.admin_list_reports('listing') as m`);
check(
  'admin lists reports',
  r.rows[0].m.total === 3 && r.rows[0].m.items[0].reporter_name,
  JSON.stringify(r.rows[0].m.items[0]),
);
r = await as(ADMIN, `select public.admin_category_stats() as m`);
check('category stats', r.rows[0].m.length === 11);
await expectErr(
  'members cannot list members',
  () => as(A, `select public.admin_list_members()`),
  'forbidden',
);
r = await as(null, `select public.ping() as p`);
check('ping', r.rows[0].p === true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
