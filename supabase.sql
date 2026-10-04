-- Run once in Supabase: SQL Editor > New query > paste > Run
-- ligo-pending is PRIVATE (new uploads wait here for admin approval, read only by the Worker with the service key)
-- ligo-public is PUBLIC (approved photos are copied here and served by Supabase's CDN)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
 ('ligo-pending','ligo-pending',false,2000000,array['image/png','image/jpeg','image/webp']),
 ('ligo-public','ligo-public',true,2000000,array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;
