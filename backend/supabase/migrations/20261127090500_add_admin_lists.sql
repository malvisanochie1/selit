-- Read-only lists for the admin dashboard. They join data members can't see
-- directly (emails, reporters, private photo paths), so each one checks that
-- the caller is an admin first.

create function public.admin_list_members(
  p_role public.user_role default null,
  p_status public.account_status default null,
  p_search text default null,
  p_page integer default 1,
  p_limit integer default 20
)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_limit integer := least(greatest(coalesce(p_limit, 20), 1), 100);
  v_offset integer := (greatest(coalesce(p_page, 1), 1) - 1) * v_limit;
  v_search text := nullif(btrim(coalesce(p_search, '')), '');
  v_total integer;
  v_items json;
begin
  perform private.require_admin();

  with members as (
    select p.*, u.email
    from public.profiles p join auth.users u on u.id = p.id
    where (p_role is null or p.role = p_role)
      and (p_status is null or p.status = p_status)
      and (v_search is null or p.full_name ilike '%' || v_search || '%' or u.email ilike '%' || v_search || '%')
  )
  select
    (select count(*) from members),
    coalesce((
      select json_agg(row_to_json(m)) from (
        select id, email, full_name, school, role, status, verification_status, avatar_path, created_at
        from members order by created_at desc limit v_limit offset v_offset
      ) m
    ), '[]')
  into v_total, v_items;

  return json_build_object('total', v_total, 'items', v_items);
end;
$$;

create function public.admin_list_verifications(p_page integer default 1, p_limit integer default 20)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_limit integer := least(greatest(coalesce(p_limit, 20), 1), 100);
  v_offset integer := (greatest(coalesce(p_page, 1), 1) - 1) * v_limit;
begin
  perform private.require_admin();

  return json_build_object(
    'total', (select count(*) from public.verifications where status = 'pending'),
    'items', coalesce((
      select json_agg(row_to_json(v)) from (
        select v.id, v.user_id, p.full_name, u.email, v.id_type, v.id_number_last4,
               v.id_photo_path, v.selfie_paths, v.review_note, v.status, v.created_at
        from public.verifications v
        join public.profiles p on p.id = v.user_id
        join auth.users u on u.id = v.user_id
        where v.status = 'pending'
        order by v.created_at
        limit v_limit offset v_offset
      ) v
    ), '[]')
  );
end;
$$;

create function public.admin_list_reports(
  p_target public.report_target,
  p_status public.report_status default null,
  p_page integer default 1,
  p_limit integer default 20
)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_limit integer := least(greatest(coalesce(p_limit, 20), 1), 100);
  v_offset integer := (greatest(coalesce(p_page, 1), 1) - 1) * v_limit;
begin
  perform private.require_admin();

  return json_build_object(
    'total', (
      select count(*) from public.reports
      where target_type = p_target and (p_status is null or status = p_status)
    ),
    'items', coalesce((
      select json_agg(row_to_json(r)) from (
        select r.id, r.target_type, r.target_id, r.reason, r.details, r.status, r.created_at,
               coalesce(p.full_name, 'Member') as reporter_name,
               coalesce(l.title, a.title, t.full_name, 'Removed') as target_title
        from public.reports r
        left join public.profiles p on p.id = r.reporter_id
        left join public.listings l on r.target_type = 'listing' and l.id = r.target_id
        left join public.apartments a on r.target_type = 'apartment' and a.id = r.target_id
        left join public.profiles t on r.target_type = 'user' and t.id = r.target_id
        where r.target_type = p_target and (p_status is null or r.status = p_status)
        order by r.created_at desc
        limit v_limit offset v_offset
      ) r
    ), '[]')
  );
end;
$$;

create function public.admin_category_stats()
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();

  return coalesce((
    select json_agg(row_to_json(c) order by c.sort_order) from (
      select c.slug, c.name, c.sort_order, c.is_paused,
             count(l.id) as total,
             count(l.id) filter (where l.status = 'active') as active,
             count(l.id) filter (where l.status = 'pending') as pending
      from public.categories c
      left join public.listings l on l.category = c.slug
      group by c.slug
    ) c
  ), '[]');
end;
$$;

revoke execute on function public.admin_list_members(public.user_role, public.account_status, text, integer, integer) from public, anon;
revoke execute on function public.admin_list_verifications(integer, integer) from public, anon;
revoke execute on function public.admin_list_reports(public.report_target, public.report_status, integer, integer) from public, anon;
revoke execute on function public.admin_category_stats() from public, anon;

grant execute on function public.admin_list_members(public.user_role, public.account_status, text, integer, integer) to authenticated;
grant execute on function public.admin_list_verifications(integer, integer) to authenticated;
grant execute on function public.admin_list_reports(public.report_target, public.report_status, integer, integer) to authenticated;
grant execute on function public.admin_category_stats() to authenticated;
