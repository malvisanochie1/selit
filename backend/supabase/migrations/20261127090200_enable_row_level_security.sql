-- Who can read and write what. Every table has row-level security on; a table
-- without a policy for an action refuses that action outright.

alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_contacts enable row level security;
alter table public.listings enable row level security;
alter table public.listing_views enable row level security;
alter table public.listing_checks enable row level security;
alter table public.reviews enable row level security;
alter table public.review_reactions enable row level security;
alter table public.apartments enable row level security;
alter table public.apartment_feedback enable row level security;
alter table public.reports enable row level security;
alter table public.verifications enable row level security;
alter table public.action_log enable row level security;
alter table public.app_secrets enable row level security;

revoke all on public.app_secrets from anon, authenticated;
revoke all on public.action_log from anon, authenticated;
revoke all on public.listing_views from anon, authenticated;

-- Banned members disappear from public view, along with everything they posted.
create function private.is_member_visible(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = p_user and status <> 'banned');
$$;

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

create policy "Anyone can read categories" on public.categories
  for select using (true);

create policy "Admins manage categories" on public.categories
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

create policy "Anyone can read visible profiles" on public.profiles
  for select using (status <> 'banned' or id = (select auth.uid()) or private.is_admin());

create policy "People update their own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or private.is_admin())
  with check (id = (select auth.uid()) or private.is_admin());

-- Phone numbers are for signed-in members only.
create policy "Members can read contacts" on public.profile_contacts
  for select to authenticated using (private.is_member_visible(profile_id) or private.is_admin());

create policy "People update their own contact" on public.profile_contacts
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------

create policy "Anyone can read live listings" on public.listings
  for select using (
    (status in ('active', 'sold') and private.is_member_visible(seller_id))
    or seller_id = (select auth.uid())
    or private.is_admin()
  );

create policy "Members create their own listings" on public.listings
  for insert to authenticated with check (seller_id = (select auth.uid()));

create policy "Sellers update their own listings" on public.listings
  for update to authenticated
  using (seller_id = (select auth.uid()) or private.is_admin())
  with check (seller_id = (select auth.uid()) or private.is_admin());

create policy "Sellers delete their own listings" on public.listings
  for delete to authenticated using (seller_id = (select auth.uid()) or private.is_admin());

create policy "Sellers read their own item checks" on public.listing_checks
  for select to authenticated using (seller_id = (select auth.uid()) or private.is_admin());

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------

create policy "Anyone can read reviews" on public.reviews
  for select using (private.is_member_visible(reviewer_id) or private.is_admin());

create policy "Members write reviews" on public.reviews
  for insert to authenticated with check (reviewer_id = (select auth.uid()));

create policy "Reviewers and sellers update reviews" on public.reviews
  for update to authenticated
  using (reviewer_id = (select auth.uid()) or seller_id = (select auth.uid()) or private.is_admin())
  with check (reviewer_id = (select auth.uid()) or seller_id = (select auth.uid()) or private.is_admin());

create policy "Reviewers delete their reviews" on public.reviews
  for delete to authenticated using (reviewer_id = (select auth.uid()) or private.is_admin());

create policy "Anyone can read reactions" on public.review_reactions
  for select using (true);

create policy "Members react" on public.review_reactions
  for insert to authenticated with check (user_id = (select auth.uid()));

create policy "Members undo their reaction" on public.review_reactions
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Apartments
-- ---------------------------------------------------------------------------

-- Listings an agent hasn't renewed in 14 days drop out of public view.
create policy "Anyone can read fresh apartments" on public.apartments
  for select using (
    (
      status in ('available', 'taken')
      and last_renewed_at > now() - interval '14 days'
      and private.is_member_visible(agent_id)
    )
    or agent_id = (select auth.uid())
    or private.is_admin()
  );

create policy "Verified agents create apartments" on public.apartments
  for insert to authenticated with check (agent_id = (select auth.uid()));

create policy "Agents update their apartments" on public.apartments
  for update to authenticated
  using (agent_id = (select auth.uid()) or private.is_admin())
  with check (agent_id = (select auth.uid()) or private.is_admin());

create policy "Agents delete their apartments" on public.apartments
  for delete to authenticated using (agent_id = (select auth.uid()) or private.is_admin());

create policy "Members read their own feedback" on public.apartment_feedback
  for select to authenticated using (user_id = (select auth.uid()) or private.is_admin());

create policy "Members leave feedback" on public.apartment_feedback
  for insert to authenticated with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Safety
-- ---------------------------------------------------------------------------

create policy "Members file reports" on public.reports
  for insert to authenticated with check (reporter_id = (select auth.uid()));

create policy "Reporters and admins read reports" on public.reports
  for select to authenticated using (reporter_id = (select auth.uid()) or private.is_admin());

create policy "Admins handle reports" on public.reports
  for update to authenticated using (private.is_admin()) with check (private.is_admin());

-- Verifications are created through submit_verification(), never directly.
create policy "People read their own verification" on public.verifications
  for select to authenticated using (user_id = (select auth.uid()) or private.is_admin());
