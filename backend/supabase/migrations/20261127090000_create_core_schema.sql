-- Core tables for Selit. Business rules live in the next migration; access
-- rules (row-level security) in the one after that.

create extension if not exists pgcrypto with schema extensions;

-- Internal helpers live in their own schema, which the public API never
-- exposes, so they can't be called directly from an app.
create schema private;
grant usage on schema private to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('buyer', 'seller', 'admin');
create type public.account_status as enum ('active', 'watchlist', 'banned');
create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.listing_status as enum ('active', 'sold', 'pending', 'rejected', 'removed');
create type public.apartment_type as enum (
  'self-contain', 'single-room', 'one-bedroom', 'two-bedroom', 'shared'
);
create type public.apartment_status as enum ('available', 'taken', 'pending', 'rejected', 'removed');
create type public.report_target as enum ('listing', 'user', 'apartment');
create type public.report_status as enum ('open', 'reviewing', 'actioned', 'dismissed');
create type public.id_document_type as enum ('nin', 'voters-card', 'drivers-licence', 'passport');

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

create table public.categories (
  slug text primary key,
  name text not null,
  sort_order smallint not null default 0,
  is_paused boolean not null default false
);

insert into public.categories (slug, name, sort_order) values
  ('hostel-items', 'Hostel items', 1),
  ('furniture', 'Furniture', 2),
  ('kitchen', 'Kitchen', 3),
  ('electronics', 'Electronics', 4),
  ('phones', 'Phones & gadgets', 5),
  ('textbooks', 'Textbooks', 6),
  ('books', 'Books', 7),
  ('fashion', 'Fashion', 8),
  ('room-decor', 'Room & décor', 9),
  ('sports', 'Sports & fitness', 10),
  ('other', 'Other', 11);

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  school text not null default '' check (char_length(school) <= 160),
  department text not null default '' check (char_length(department) <= 80),
  bio text not null default '' check (char_length(bio) <= 300),
  avatar_path text check (char_length(avatar_path) <= 300),
  role public.user_role not null default 'buyer',
  status public.account_status not null default 'active',
  verification_status public.verification_status not null default 'unverified',
  rating_average numeric(3, 2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Phone numbers live apart from profiles so they can be shown to signed-in
-- users only, which keeps them away from scrapers.
create table public.profile_contacts (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  whatsapp text not null default '' check (whatsapp = '' or whatsapp ~ '^234[789][01][0-9]{8}$'),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Items for sale
-- ---------------------------------------------------------------------------

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 5 and 90),
  description text not null check (char_length(description) between 20 and 2000),
  price integer not null check (price between 50 and 50000000),
  category text not null references public.categories (slug),
  condition text not null check (condition in ('new', 'like-new', 'good', 'fairly-used', 'fair')),
  school text not null check (char_length(school) between 3 and 160),
  meetup_spot text not null check (char_length(meetup_spot) between 3 and 120),
  photo_paths text[] not null check (cardinality(photo_paths) between 1 and 5),
  status public.listing_status not null default 'pending',
  review_reason text,
  check_id uuid,
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', description), 'B')
  ) stored
);

create index listings_feed_idx on public.listings (status, created_at desc);
create index listings_category_idx on public.listings (category, status, created_at desc);
create index listings_school_idx on public.listings (school, status, created_at desc);
create index listings_seller_idx on public.listings (seller_id, created_at desc);
create index listings_search_idx on public.listings using gin (search);

-- One view per visitor per day, so the counter can't be inflated by refreshing.
create table public.listing_views (
  listing_id uuid not null references public.listings (id) on delete cascade,
  viewer_key text not null,
  viewed_on date not null default current_date,
  primary key (listing_id, viewer_key, viewed_on)
);

-- A one-time code a seller writes on paper and photographs beside the item.
create table public.listing_checks (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  code text not null,
  photo_path text,
  expires_at timestamptz not null default now() + interval '30 minutes',
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.listings
  add constraint listings_check_id_fkey foreign key (check_id) references public.listing_checks (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(btrim(comment)) between 3 and 1000),
  seller_reply text check (char_length(seller_reply) <= 1000),
  seller_replied_at timestamptz,
  helpful_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (seller_id, reviewer_id),
  check (seller_id <> reviewer_id)
);

create index reviews_seller_idx on public.reviews (seller_id, created_at desc);

create table public.review_reactions (
  review_id uuid not null references public.reviews (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Apartments
-- ---------------------------------------------------------------------------

create table public.apartments (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles (id) on delete cascade,
  agency_name text not null default '' check (char_length(agency_name) <= 80),
  title text not null check (char_length(title) between 8 and 90),
  description text not null check (char_length(description) between 30 and 2000),
  type public.apartment_type not null,
  rent_per_year integer not null check (rent_per_year between 10000 and 100000000),
  agency_fee integer not null default 0 check (agency_fee between 0 and 100000000),
  caution_fee integer not null default 0 check (caution_fee between 0 and 100000000),
  school text not null check (char_length(school) between 3 and 160),
  area text not null check (char_length(area) between 2 and 80),
  distance_to_campus text not null check (char_length(distance_to_campus) between 2 and 40),
  amenities text[] not null default '{}' check (cardinality(amenities) <= 12),
  photo_paths text[] not null check (cardinality(photo_paths) between 2 and 8),
  status public.apartment_status not null default 'pending',
  is_confirmed boolean not null default false,
  visitor_confirmations integer not null default 0,
  taken_reports integer not null default 0,
  last_renewed_at timestamptz not null default now(),
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index apartments_feed_idx on public.apartments (status, last_renewed_at desc);
create index apartments_school_idx on public.apartments (school, status, last_renewed_at desc);
create index apartments_agent_idx on public.apartments (agent_id, created_at desc);

create table public.apartment_feedback (
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('confirm-real', 'report-taken')),
  created_at timestamptz not null default now(),
  primary key (apartment_id, user_id, kind)
);

-- ---------------------------------------------------------------------------
-- Safety
-- ---------------------------------------------------------------------------

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type public.report_target not null,
  target_id uuid not null,
  reason text not null check (
    reason in ('scam', 'too-cheap', 'upfront-payment', 'unsafe-location', 'already-taken', 'offensive', 'other')
  ),
  details text not null default '' check (char_length(details) <= 1000),
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);

create index reports_queue_idx on public.reports (target_type, status, created_at desc);

create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  id_type public.id_document_type not null,
  id_number_last4 text not null check (id_number_last4 ~ '^[A-Za-z0-9]{4}$'),
  -- A keyed hash lets us spot a banned person's ID being reused without
  -- keeping the full number.
  id_number_hash text not null,
  id_photo_path text,
  selfie_paths text[] not null default '{}' check (cardinality(selfie_paths) <= 3),
  status public.verification_status not null default 'pending',
  review_note text check (char_length(review_note) <= 200),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index verifications_queue_idx on public.verifications (status, created_at);
create index verifications_hash_idx on public.verifications (id_number_hash);

-- Every abusable action is recorded here so limits can be enforced per user.
create table public.action_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);

create index action_log_lookup_idx on public.action_log (user_id, action, created_at desc);

-- Server-only secrets. No policies are ever added, so only security-definer
-- functions can read it.
create table public.app_secrets (
  name text primary key,
  value text not null
);

insert into public.app_secrets (name, value)
values ('id_number_pepper', encode(extensions.gen_random_bytes(32), 'hex'));

-- ---------------------------------------------------------------------------
-- Keep updated_at honest
-- ---------------------------------------------------------------------------

create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function private.touch_updated_at();
create trigger profile_contacts_touch before update on public.profile_contacts
  for each row execute function private.touch_updated_at();
create trigger listings_touch before update on public.listings
  for each row execute function private.touch_updated_at();
create trigger reviews_touch before update on public.reviews
  for each row execute function private.touch_updated_at();
create trigger apartments_touch before update on public.apartments
  for each row execute function private.touch_updated_at();
create trigger reports_touch before update on public.reports
  for each row execute function private.touch_updated_at();
