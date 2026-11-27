-- Business rules enforced inside the database, so they hold no matter which
-- app (or tampered app) sends the request.
--
-- Guard triggers only restrict the "anon" and "authenticated" roles. Functions
-- marked security definer run as the table owner, which lets trusted internal
-- updates (ratings, counters, admin decisions) pass through the guards.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create function private.is_client_request()
returns boolean
language sql
stable
set search_path = ''
as $$
  select current_user in ('anon', 'authenticated');
$$;

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and status <> 'banned'
  );
$$;

-- Raises "rate_limited" once a user has done an action too often in a window.
create function private.enforce_rate_limit(p_action text, p_limit integer, p_window interval)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_count integer;
begin
  if v_user is null then
    return;
  end if;

  select count(*) into v_count
  from public.action_log
  where user_id = v_user and action = p_action and created_at > now() - p_window;

  if v_count >= p_limit then
    raise exception 'rate_limited' using errcode = 'P0001', hint = p_action;
  end if;

  insert into public.action_log (user_id, action) values (v_user, p_action);
end;
$$;

create function private.require_active_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.profiles where id = (select auth.uid()) and status = 'banned') then
    raise exception 'account_restricted' using errcode = 'P0001';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- New accounts
-- ---------------------------------------------------------------------------

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := left(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 80);
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    case when char_length(v_name) >= 2 then v_name else 'Selit user' end,
    case when new.raw_user_meta_data ->> 'account_type' = 'seller' then 'seller'::public.user_role
         else 'buyer'::public.user_role end
  );
  insert into public.profile_contacts (profile_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- People may edit their own details, and switch from buyer to seller, but
-- never their role, status, verification or rating.
create function private.guard_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not private.is_client_request() or private.is_admin() then
    return new;
  end if;

  new.id := old.id;
  new.role := case when old.role = 'buyer' and new.role = 'seller' then 'seller'::public.user_role else old.role end;
  new.status := old.status;
  new.verification_status := old.verification_status;
  new.rating_average := old.rating_average;
  new.review_count := old.review_count;
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger profiles_guard before update on public.profiles
  for each row execute function private.guard_profile_update();

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------

-- Bait listings use prices far below what similar items sell for.
create function private.is_suspiciously_cheap(p_category text, p_price integer, p_exclude uuid default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  with recent as (
    select price from public.listings
    where category = p_category
      and status in ('active', 'sold')
      and (p_exclude is null or id <> p_exclude)
    order by created_at desc
    limit 200
  )
  select case
    when (select count(*) from recent) < 5 then false
    else p_price < 0.35 * (select percentile_cont(0.5) within group (order by price) from recent)
  end;
$$;

-- Marks a seller's item-check code as used once its photo is uploaded,
-- returning the code's id when it's valid.
create function private.consume_listing_check(p_check_id uuid, p_seller uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_photo text;
begin
  if p_check_id is null then
    return null;
  end if;

  select name into v_photo from storage.objects
  where bucket_id = 'listing-checks' and name like p_seller::text || '/' || p_check_id::text || '.%'
  limit 1;

  if v_photo is null then
    return null;
  end if;

  update public.listing_checks
  set used_at = now(), photo_path = v_photo
  where id = p_check_id and seller_id = p_seller and used_at is null and expires_at > now();

  return case when found then p_check_id else null end;
end;
$$;

create function private.prepare_listing_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_profile public.profiles%rowtype;
  v_is_new_seller boolean;
  v_open_count integer;
begin
  if private.is_client_request() then
    new.seller_id := (select auth.uid());
  end if;

  select * into v_profile from public.profiles where id = new.seller_id;
  if v_profile.status = 'banned' then
    raise exception 'account_restricted' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.categories where slug = new.category and is_paused) then
    raise exception 'category_paused' using errcode = 'P0001';
  end if;

  v_is_new_seller := v_profile.created_at > now() - interval '30 days'
    and v_profile.verification_status <> 'verified';

  if v_is_new_seller then
    select count(*) into v_open_count from public.listings
    where seller_id = new.seller_id and status in ('active', 'pending');
    if v_open_count >= 5 then
      raise exception 'listing_limit' using errcode = 'P0001';
    end if;
  end if;

  perform private.enforce_rate_limit('listing.create', 20, interval '1 day');

  -- Selling something makes you a seller.
  if v_profile.role = 'buyer' then
    update public.profiles set role = 'seller' where id = new.seller_id;
  end if;

  new.check_id := private.consume_listing_check(new.check_id, new.seller_id);
  new.views_count := 0;
  new.created_at := now();

  if private.is_suspiciously_cheap(new.category, new.price) then
    new.status := 'pending';
    new.review_reason := 'Price is far below similar items';
  elsif v_is_new_seller then
    new.status := 'pending';
    new.review_reason := case when new.check_id is null then 'New seller' else 'New seller, item check attached' end;
  else
    new.status := 'active';
    new.review_reason := null;
  end if;

  return new;
end;
$$;

create trigger listings_prepare before insert on public.listings
  for each row execute function private.prepare_listing_insert();

-- Sellers may edit their item and switch it between live and sold. Only
-- admins approve, reject or remove.
create function private.guard_listing_update()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_content_changed boolean;
begin
  if not private.is_client_request() or private.is_admin() then
    return new;
  end if;

  new.id := old.id;
  new.seller_id := old.seller_id;
  new.views_count := old.views_count;
  new.check_id := old.check_id;
  new.created_at := old.created_at;
  new.review_reason := old.review_reason;

  if new.status <> old.status and not (old.status in ('active', 'sold') and new.status in ('active', 'sold')) then
    raise exception 'status_not_allowed' using errcode = 'P0001';
  end if;

  v_content_changed := (new.title, new.description, new.price, new.category, new.condition, new.photo_paths)
    is distinct from (old.title, old.description, old.price, old.category, old.condition, old.photo_paths);

  if old.status = 'rejected' and v_content_changed then
    new.status := 'pending';
    new.review_reason := 'Edited after rejection';
  elsif new.price <> old.price and private.is_suspiciously_cheap(new.category, new.price, old.id) then
    new.status := 'pending';
    new.review_reason := 'Price is far below similar items';
  end if;

  return new;
end;
$$;

create trigger listings_guard before update on public.listings
  for each row execute function private.guard_listing_update();

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------

create function private.refresh_seller_rating(p_seller uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles p
  set rating_average = coalesce(r.average, 0), review_count = coalesce(r.total, 0)
  from (
    select round(avg(rating)::numeric, 2) as average, count(*)::integer as total
    from public.reviews where seller_id = p_seller
  ) r
  where p.id = p_seller;
$$;

create function private.on_review_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.refresh_seller_rating(coalesce(new.seller_id, old.seller_id));
  return null;
end;
$$;

create trigger reviews_rating after insert or delete or update of rating on public.reviews
  for each row execute function private.on_review_changed();

create function private.guard_review()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
begin
  if not private.is_client_request() or private.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    perform private.require_active_account();
    perform private.enforce_rate_limit('review.create', 10, interval '1 day');
    new.reviewer_id := v_user;
    new.seller_reply := null;
    new.seller_replied_at := null;
    new.helpful_count := 0;
    return new;
  end if;

  -- Reviewers edit their words; sellers only ever add a reply.
  new.id := old.id;
  new.seller_id := old.seller_id;
  new.reviewer_id := old.reviewer_id;
  new.helpful_count := old.helpful_count;
  new.created_at := old.created_at;

  if v_user = old.seller_id then
    new.rating := old.rating;
    new.comment := old.comment;
    new.seller_replied_at := case when new.seller_reply is distinct from old.seller_reply then now() else old.seller_replied_at end;
  else
    new.seller_reply := old.seller_reply;
    new.seller_replied_at := old.seller_replied_at;
  end if;
  return new;
end;
$$;

create trigger reviews_guard before insert or update on public.reviews
  for each row execute function private.guard_review();

create function private.on_reaction_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_review uuid := coalesce(new.review_id, old.review_id);
begin
  update public.reviews
  set helpful_count = (select count(*) from public.review_reactions where review_id = v_review)
  where id = v_review;
  return null;
end;
$$;

create trigger review_reactions_count after insert or delete on public.review_reactions
  for each row execute function private.on_reaction_changed();

create function private.prepare_reaction()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_client_request() then
    new.user_id := (select auth.uid());
  end if;
  return new;
end;
$$;

create trigger review_reactions_prepare before insert on public.review_reactions
  for each row execute function private.prepare_reaction();

-- ---------------------------------------------------------------------------
-- Apartments
-- ---------------------------------------------------------------------------

create function private.prepare_apartment_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_client_request() then
    new.agent_id := (select auth.uid());
    if not private.is_admin() and not exists (
      select 1 from public.profiles
      where id = new.agent_id and verification_status = 'verified' and status <> 'banned'
    ) then
      raise exception 'verification_required' using errcode = 'P0001';
    end if;
    perform private.enforce_rate_limit('apartment.create', 5, interval '1 day');
  end if;

  new.status := 'pending';
  new.is_confirmed := false;
  new.visitor_confirmations := 0;
  new.taken_reports := 0;
  new.views_count := 0;
  new.last_renewed_at := now();
  new.created_at := now();
  return new;
end;
$$;

create trigger apartments_prepare before insert on public.apartments
  for each row execute function private.prepare_apartment_insert();

create function private.guard_apartment_update()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_content_changed boolean;
begin
  if not private.is_client_request() or private.is_admin() then
    return new;
  end if;

  new.id := old.id;
  new.agent_id := old.agent_id;
  new.is_confirmed := old.is_confirmed;
  new.visitor_confirmations := old.visitor_confirmations;
  new.taken_reports := old.taken_reports;
  new.views_count := old.views_count;
  new.last_renewed_at := old.last_renewed_at;
  new.created_at := old.created_at;

  if new.status <> old.status and not (old.status in ('available', 'taken') and new.status in ('available', 'taken')) then
    raise exception 'status_not_allowed' using errcode = 'P0001';
  end if;

  v_content_changed := (new.title, new.description, new.rent_per_year, new.agency_fee, new.caution_fee, new.photo_paths)
    is distinct from (old.title, old.description, old.rent_per_year, old.agency_fee, old.caution_fee, old.photo_paths);

  -- New photos or new prices must be looked at again before students rely on them.
  if v_content_changed then
    new.status := 'pending';
    new.is_confirmed := false;
  end if;
  return new;
end;
$$;

create trigger apartments_guard before update on public.apartments
  for each row execute function private.guard_apartment_update();

create function private.prepare_apartment_feedback()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_client_request() then
    perform private.require_active_account();
    new.user_id := (select auth.uid());
  end if;
  return new;
end;
$$;

create trigger apartment_feedback_prepare before insert on public.apartment_feedback
  for each row execute function private.prepare_apartment_feedback();

create function private.on_apartment_feedback()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.apartments a
  set visitor_confirmations = (
        select count(*) from public.apartment_feedback where apartment_id = a.id and kind = 'confirm-real'),
      taken_reports = (
        select count(*) from public.apartment_feedback where apartment_id = a.id and kind = 'report-taken')
  where a.id = new.apartment_id;

  -- Several students saying it's gone is enough to stop showing it as available.
  update public.apartments
  set status = 'taken'
  where id = new.apartment_id and status = 'available' and taken_reports >= 3;
  return null;
end;
$$;

create trigger apartment_feedback_count after insert on public.apartment_feedback
  for each row execute function private.on_apartment_feedback();

-- ---------------------------------------------------------------------------
-- Reports
-- ---------------------------------------------------------------------------

create function private.prepare_report()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_client_request() then
    perform private.enforce_rate_limit('report.create', 10, interval '1 day');
    new.reporter_id := (select auth.uid());
    new.status := 'open';
  end if;
  return new;
end;
$$;

create trigger reports_prepare before insert on public.reports
  for each row execute function private.prepare_report();

-- Three separate reports pull an item off the feed until someone looks at it.
create function private.on_report_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_open integer;
begin
  select count(*) into v_open from public.reports
  where target_type = new.target_type and target_id = new.target_id and status = 'open';

  if v_open < 3 then
    return null;
  end if;

  if new.target_type = 'listing' then
    update public.listings set status = 'pending', review_reason = 'Reported by several people'
    where id = new.target_id and status = 'active';
  elsif new.target_type = 'apartment' then
    update public.apartments set status = 'pending', is_confirmed = false
    where id = new.target_id and status = 'available';
  elsif new.target_type = 'user' then
    update public.profiles set status = 'watchlist'
    where id = new.target_id and status = 'active';
  end if;
  return null;
end;
$$;

create trigger reports_threshold after insert on public.reports
  for each row execute function private.on_report_created();
