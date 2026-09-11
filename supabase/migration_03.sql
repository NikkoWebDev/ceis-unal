-- ============================================================
-- FORO CEIS · Migración 03: superadmin + imágenes
-- Ejecutar en: Supabase Dashboard > SQL Editor (una vez).
-- 1) Nuevo rol superadmin (solo julsanchezc@unal.edu.co):
--    los admins gestionan moderadores y miembros, pero NO
--    pueden dar ni quitar el rol admin. Solo superadmin puede.
-- 2) Bucket público foro-imagenes para fotos de hilos y avatar.
-- ============================================================

-- ---------- 1. Rol superadmin ----------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('member', 'moderator', 'admin', 'superadmin'));

create or replace function public.is_superadmin()
returns boolean language sql stable as $$
  select (auth.jwt() ->> 'email') ilike 'julsanchezc@unal.edu.co';
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(public.my_role(), 'member') in ('admin', 'superadmin');
$$;

create or replace function public.is_mod_or_admin()
returns boolean language sql stable as $$
  select coalesce(public.my_role(), 'member') in ('moderator', 'admin', 'superadmin');
$$;

-- Admins: solo pueden tocar filas que NO son admin/superadmin,
-- y nunca pueden dejar a alguien como admin/superadmin.
drop policy if exists profiles_update_admin on public.profiles;
create policy "profiles_update_admin" on public.profiles for update
  using (
    public.is_admin()
    and role <> 'admin' and role <> 'superadmin'
  )
  with check (
    public.is_admin()
    and role <> 'admin' and role <> 'superadmin'
  );

-- Superadmin: todo, salvo quitarse su propio rol (evita lockout).
create policy "profiles_update_superadmin" on public.profiles for update
  using (public.is_superadmin())
  with check (
    public.is_superadmin()
    and (id <> auth.uid() or role = 'superadmin')
  );

-- Nombrar superadmin (idempotente: 0 filas si aún no ingresa)
update public.profiles set role = 'superadmin'
where id = (select id from auth.users where email = 'julsanchezc@unal.edu.co');

-- ---------- 2. Bucket de imágenes ----------
insert into storage.buckets (id, name, public)
values ('foro-imagenes', 'foro-imagenes', true)
on conflict (id) do nothing;

-- Lectura pública (fotos de hilos y avatares)
drop policy if exists "foro_img_public_read" on storage.objects;
create policy "foro_img_public_read" on storage.objects for select
  using (bucket_id = 'foro-imagenes');

-- Subir: solo @unal.edu.co, sin sanción, en su propia carpeta <uid>/...
drop policy if exists "foro_img_insert" on storage.objects;
create policy "foro_img_insert" on storage.objects for insert
  with check (
    bucket_id = 'foro-imagenes'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.email_domain_ok()
    and not public.has_active_sanction(auth.uid())
  );

-- Reemplazar/actualizar: solo las propias
drop policy if exists "foro_img_update_own" on storage.objects;
create policy "foro_img_update_own" on storage.objects for update
  using (
    bucket_id = 'foro-imagenes'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'foro-imagenes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Borrar: las propias, o cualquiera si es del equipo
drop policy if exists "foro_img_delete_own" on storage.objects;
create policy "foro_img_delete_own" on storage.objects for delete
  using (
    bucket_id = 'foro-imagenes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "foro_img_delete_mods" on storage.objects;
create policy "foro_img_delete_mods" on storage.objects for delete
  using (
    bucket_id = 'foro-imagenes'
    and public.is_mod_or_admin()
  );
