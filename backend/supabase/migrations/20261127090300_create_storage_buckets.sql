-- Photo storage. Every file sits under a folder named after its owner
-- ({user id}/...), and people may only write into their own folder.
--
-- Public buckets serve item, apartment and profile photos straight from the
-- CDN. ID cards, selfies and item-check photos are private: only the owner and
-- admins can open them, and they're removed once a decision is made.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('listing-photos', 'listing-photos', true, 2097152, array['image/webp', 'image/jpeg', 'image/png']),
  ('apartment-photos', 'apartment-photos', true, 2097152, array['image/webp', 'image/jpeg', 'image/png']),
  ('avatars', 'avatars', true, 1048576, array['image/webp', 'image/jpeg', 'image/png']),
  ('verifications', 'verifications', false, 3145728, array['image/webp', 'image/jpeg', 'image/png']),
  ('listing-checks', 'listing-checks', false, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create function private.owns_storage_path(p_name text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select (storage.foldername(p_name))[1] = (select auth.uid())::text;
$$;

create policy "Members upload into their own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('listing-photos', 'apartment-photos', 'avatars', 'verifications', 'listing-checks')
    and private.owns_storage_path(name)
    and not exists (select 1 from public.profiles where id = (select auth.uid()) and status = 'banned')
  );

create policy "Members replace their own files" on storage.objects
  for update to authenticated
  using (private.owns_storage_path(name))
  with check (private.owns_storage_path(name));

create policy "Members delete their own files" on storage.objects
  for delete to authenticated
  using (private.owns_storage_path(name) or private.is_admin());

create policy "Owners and admins read private files" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('verifications', 'listing-checks')
    and (private.owns_storage_path(name) or private.is_admin())
  );

create policy "Anyone can list public photos" on storage.objects
  for select
  using (bucket_id in ('listing-photos', 'apartment-photos', 'avatars'));
