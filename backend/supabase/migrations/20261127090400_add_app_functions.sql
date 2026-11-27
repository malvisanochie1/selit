-- Functions the apps call directly (supabase.rpc). Each one checks who is
-- calling before it does anything.

create table public.apartment_views (
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  viewer_key text not null,
  viewed_on date not null default current_date,
  primary key (apartment_id, viewer_key, viewed_on)
);

alter table public.apartment_views enable row level security;
revoke all on public.apartment_views from anon, authenticated;

-- A stable, anonymous key for whoever is looking: their account if signed in,
-- otherwise a hash of their network address.
create function private.viewer_key()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select auth.uid())::text,
    encode(extensions.digest(
      coalesce(split_part(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1), 'unknown'),
      'sha256'), 'hex')
  );
$$;

-- ---------------------------------------------------------------------------
-- Health
-- ---------------------------------------------------------------------------

-- Called on a schedule so the free project never pauses for inactivity.
create function public.ping()
returns boolean
language sql
stable
set search_path = ''
as $$
  select true;
$$;

-- ---------------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------------

create function public.record_listing_view(p_listing uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.listing_views (listing_id, viewer_key)
  select id, private.viewer_key() from public.listings
  where id = p_listing and status = 'active' and seller_id is distinct from (select auth.uid())
  on conflict do nothing;

  if found then
    update public.listings set views_count = views_count + 1 where id = p_listing;
  end if;
end;
$$;

create function public.record_apartment_view(p_apartment uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.apartment_views (apartment_id, viewer_key)
  select id, private.viewer_key() from public.apartments
  where id = p_apartment and status = 'available' and agent_id is distinct from (select auth.uid())
  on conflict do nothing;

  if found then
    update public.apartments set views_count = views_count + 1 where id = p_apartment;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Selling
-- ---------------------------------------------------------------------------

-- Issues a short code the seller writes on paper and photographs beside the
-- item. It proves they actually have it in hand.
create function public.issue_listing_check()
returns table (id uuid, code text, expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_alphabet constant text := 'ACDEFHJKMNPRTUVWXY34679';
  v_code text := '';
  v_bytes bytea := extensions.gen_random_bytes(6);
begin
  if v_user is null then
    raise exception 'sign_in_required' using errcode = 'P0001';
  end if;
  perform private.require_active_account();
  perform private.enforce_rate_limit('listing.check', 10, interval '1 hour');

  for i in 0..5 loop
    v_code := v_code || substr(v_alphabet, 1 + get_byte(v_bytes, i) % length(v_alphabet), 1);
  end loop;

  return query
  insert into public.listing_checks as c (seller_id, code)
  values (v_user, 'SL-' || v_code)
  returning c.id, c.code, c.expires_at;
end;
$$;

-- ---------------------------------------------------------------------------
-- Apartments
-- ---------------------------------------------------------------------------

-- Agents confirm every 14 days that a place is still free, or it drops out of
-- the feed. Stale listings are how fake agents catch students.
create function public.renew_apartment(p_apartment uuid)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_renewed timestamptz;
begin
  perform private.require_active_account();

  update public.apartments
  set last_renewed_at = now(),
      status = case when status = 'taken' then 'available'::public.apartment_status else status end,
      taken_reports = 0
  where id = p_apartment and agent_id = (select auth.uid()) and status in ('available', 'taken')
  returning last_renewed_at into v_renewed;

  if v_renewed is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  delete from public.apartment_feedback where apartment_id = p_apartment and kind = 'report-taken';
  return v_renewed;
end;
$$;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------

create function private.hash_id_number(p_number text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select encode(extensions.hmac(
    upper(regexp_replace(p_number, '[^A-Za-z0-9]', '', 'g')),
    (select value from public.app_secrets where name = 'id_number_pepper'),
    'sha256'), 'hex');
$$;

-- The full ID number is never stored: only its last four characters and a
-- keyed hash, which is enough to catch a banned person signing up again.
create function public.submit_verification(
  p_id_type public.id_document_type,
  p_id_number text,
  p_id_photo_path text,
  p_selfie_paths text[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_number text := upper(regexp_replace(coalesce(p_id_number, ''), '[^A-Za-z0-9]', '', 'g'));
  v_hash text;
  v_note text;
  v_id uuid;
  v_path text;
begin
  if v_user is null then
    raise exception 'sign_in_required' using errcode = 'P0001';
  end if;
  perform private.require_active_account();
  perform private.enforce_rate_limit('verification.submit', 3, interval '1 day');

  if exists (select 1 from public.profiles where id = v_user and verification_status in ('pending', 'verified')) then
    raise exception 'already_submitted' using errcode = 'P0001';
  end if;

  if (p_id_type = 'nin' and v_number !~ '^[0-9]{11}$') or char_length(v_number) not between 6 and 20 then
    raise exception 'invalid_id_number' using errcode = 'P0001';
  end if;

  if cardinality(coalesce(p_selfie_paths, '{}')) not between 1 and 3 then
    raise exception 'selfie_required' using errcode = 'P0001';
  end if;

  foreach v_path in array array_append(p_selfie_paths, p_id_photo_path) loop
    if v_path is null or split_part(v_path, '/', 1) <> v_user::text or not exists (
      select 1 from storage.objects where bucket_id = 'verifications' and name = v_path
    ) then
      raise exception 'photo_missing' using errcode = 'P0001';
    end if;
  end loop;

  v_hash := private.hash_id_number(v_number);

  select case
    when exists (
      select 1 from public.verifications v join public.profiles p on p.id = v.user_id
      where v.id_number_hash = v_hash and p.status = 'banned'
    ) then 'ID matches a banned account'
    when exists (
      select 1 from public.verifications v
      where v.id_number_hash = v_hash and v.user_id <> v_user and v.status = 'verified'
    ) then 'ID already verified on another account'
  end into v_note;

  insert into public.verifications (user_id, id_type, id_number_last4, id_number_hash, id_photo_path, selfie_paths, review_note)
  values (v_user, p_id_type, right(v_number, 4), v_hash, p_id_photo_path, p_selfie_paths, v_note)
  returning id into v_id;

  update public.profiles set verification_status = 'pending' where id = v_user;
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------

create function private.require_admin()
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end;
$$;

-- Approves or rejects a verification. Returns the photo paths so the admin
-- app can delete the files straight away; ID photos are never kept.
create function public.decide_verification(p_verification uuid, p_approve boolean, p_note text default null)
returns text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.verifications%rowtype;
begin
  perform private.require_admin();

  select * into v_row from public.verifications where id = p_verification and status = 'pending' for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  update public.verifications
  set status = case when p_approve then 'verified'::public.verification_status else 'rejected'::public.verification_status end,
      review_note = left(nullif(btrim(coalesce(p_note, '')), ''), 200),
      reviewed_by = (select auth.uid()),
      reviewed_at = now(),
      id_photo_path = null,
      selfie_paths = '{}'
  where id = p_verification;

  update public.profiles
  set verification_status = case when p_approve then 'verified'::public.verification_status else 'rejected'::public.verification_status end
  where id = v_row.user_id;

  return array_remove(array_append(v_row.selfie_paths, v_row.id_photo_path), null);
end;
$$;

create function public.moderate_listing(p_listing uuid, p_status public.listing_status, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();
  update public.listings
  set status = p_status,
      review_reason = case when p_status in ('rejected', 'removed') then left(nullif(btrim(coalesce(p_reason, '')), ''), 200) end
  where id = p_listing;
  if not found then
    raise exception 'not_found' using errcode = 'P0001';
  end if;
end;
$$;

create function public.moderate_apartment(p_apartment uuid, p_status public.apartment_status, p_confirmed boolean default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();
  update public.apartments
  set status = p_status,
      is_confirmed = coalesce(p_confirmed, is_confirmed),
      last_renewed_at = case when p_status = 'available' then now() else last_renewed_at end
  where id = p_apartment;
  if not found then
    raise exception 'not_found' using errcode = 'P0001';
  end if;
end;
$$;

create function public.set_account_status(p_user uuid, p_status public.account_status)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();
  if p_user = (select auth.uid()) then
    raise exception 'cannot_change_self' using errcode = 'P0001';
  end if;
  update public.profiles set status = p_status where id = p_user;
  if not found then
    raise exception 'not_found' using errcode = 'P0001';
  end if;
end;
$$;

create function public.resolve_report(p_report uuid, p_status public.report_status)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();
  update public.reports set status = p_status where id = p_report;
  if not found then
    raise exception 'not_found' using errcode = 'P0001';
  end if;
end;
$$;

create function public.admin_overview()
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();
  return json_build_object(
    'members', (select count(*) from public.profiles),
    'sellers', (select count(*) from public.profiles where role = 'seller'),
    'verified', (select count(*) from public.profiles where verification_status = 'verified'),
    'banned', (select count(*) from public.profiles where status = 'banned'),
    'activeListings', (select count(*) from public.listings where status = 'active'),
    'soldListings', (select count(*) from public.listings where status = 'sold'),
    'pendingListings', (select count(*) from public.listings where status = 'pending'),
    'availableApartments', (select count(*) from public.apartments where status = 'available'),
    'pendingApartments', (select count(*) from public.apartments where status = 'pending'),
    'pendingVerifications', (select count(*) from public.verifications where status = 'pending'),
    'openReports', (select count(*) from public.reports where status = 'open'),
    'newMembersThisWeek', (select count(*) from public.profiles where created_at > now() - interval '7 days')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Housekeeping (service role only, run by the scheduled workflow)
-- ---------------------------------------------------------------------------

-- Clears logs and old records, and hands back the photos that are no longer
-- needed so the caller can delete them from storage. Keeps the free plan's
-- 500 MB database and 1 GB of storage well clear of their limits.
create function public.run_maintenance()
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_listing_photos text[];
  v_apartment_photos text[];
  v_check_photos text[];
begin
  delete from public.action_log where created_at < now() - interval '7 days';
  delete from public.listing_views where viewed_on < current_date - 60;
  delete from public.apartment_views where viewed_on < current_date - 60;

  with gone as (
    delete from public.listings
    where (status in ('sold', 'removed', 'rejected') and updated_at < now() - interval '30 days')
    returning photo_paths
  )
  select coalesce(array_agg(p), '{}') into v_listing_photos from gone, unnest(gone.photo_paths) p;

  with gone as (
    delete from public.apartments
    where (status in ('taken', 'removed', 'rejected') and updated_at < now() - interval '30 days')
       or last_renewed_at < now() - interval '60 days'
    returning photo_paths
  )
  select coalesce(array_agg(p), '{}') into v_apartment_photos from gone, unnest(gone.photo_paths) p;

  with gone as (
    delete from public.listing_checks
    where (used_at is null and expires_at < now() - interval '1 day')
       or (used_at is not null and used_at < now() - interval '30 days')
    returning photo_path
  )
  select coalesce(array_agg(photo_path) filter (where photo_path is not null), '{}') into v_check_photos from gone;

  return json_build_object(
    'listing-photos', v_listing_photos,
    'apartment-photos', v_apartment_photos,
    'listing-checks', v_check_photos
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Who may call what
-- ---------------------------------------------------------------------------

revoke execute on all functions in schema public from public, anon, authenticated;
revoke execute on all functions in schema private from public;

grant execute on function public.ping() to anon, authenticated;
grant execute on function public.record_listing_view(uuid) to anon, authenticated;
grant execute on function public.record_apartment_view(uuid) to anon, authenticated;
grant execute on function public.issue_listing_check() to authenticated;
grant execute on function public.renew_apartment(uuid) to authenticated;
grant execute on function public.submit_verification(public.id_document_type, text, text, text[]) to authenticated;
grant execute on function public.decide_verification(uuid, boolean, text) to authenticated;
grant execute on function public.moderate_listing(uuid, public.listing_status, text) to authenticated;
grant execute on function public.moderate_apartment(uuid, public.apartment_status, boolean) to authenticated;
grant execute on function public.set_account_status(uuid, public.account_status) to authenticated;
grant execute on function public.resolve_report(uuid, public.report_status) to authenticated;
grant execute on function public.admin_overview() to authenticated;
grant execute on function public.run_maintenance() to service_role;

-- Helpers used inside policies and triggers run with the caller's rights.
grant execute on all functions in schema private to anon, authenticated, service_role;
revoke execute on function private.hash_id_number(text) from anon, authenticated;
