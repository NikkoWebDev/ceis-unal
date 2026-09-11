-- ============================================================
-- FORO CEIS · Esquema Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor (una vez).
-- Requiere: solo el proveedor Google activo en Authentication.
-- Admin inicial: julsanchezc@unal.edu.co (ver PASO FINAL abajo).
-- ============================================================

-- ---------- Tablas ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 10 and 180),
  body text not null check (char_length(body) between 20 and 8000),
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  accepted_answer_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 8000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.questions
  add constraint fk_accepted_answer
  foreign key (accepted_answer_id) references public.answers(id) on delete set null;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('question', 'answer')),
  target_id uuid not null,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 5 and 500),
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.sanctions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  by_id uuid not null references public.profiles(id),
  reason text not null,
  until timestamptz, -- null = indefinida
  created_at timestamptz not null default now()
);

-- ---------- Funciones auxiliares (bypassean RLS) ----------
create or replace function public.email_domain_ok()
returns boolean language sql stable as $$
  select (auth.jwt() ->> 'email') ilike '%@unal.edu.co';
$$;

create or replace function public.my_role()
returns text language sql stable as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_mod_or_admin()
returns boolean language sql stable as $$
  select coalesce(public.my_role(), 'member') in ('moderator', 'admin');
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(public.my_role(), 'member') = 'admin';
$$;

create or replace function public.has_active_sanction(uid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.sanctions
    where user_id = uid and (until is null or until > now())
  );
$$;

-- Perfil automático al primer login (toma el nombre real de Google)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.reports enable row level security;
alter table public.sanctions enable row level security;

-- profiles: lectura publica (sin email: el email vive solo en auth.users)
create policy "profiles_select_all" on public.profiles for select using (true);
-- el miembro edita su nickname/avatar pero NO su rol ni su nombre real
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
    and full_name = (select full_name from public.profiles where id = auth.uid())
  );
create policy "profiles_update_admin" on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());

-- questions: lectura publica
create policy "questions_select_all" on public.questions for select using (true);
create policy "questions_insert_domain" on public.questions for insert
  with check (
    author_id = auth.uid()
    and public.email_domain_ok()
    and not public.has_active_sanction(auth.uid())
  );
create policy "questions_update_author" on public.questions for update
  using (author_id = auth.uid() and status <> 'closed')
  with check (author_id = auth.uid() and status <> 'closed');
create policy "questions_update_mods" on public.questions for update
  using (public.is_mod_or_admin()) with check (public.is_mod_or_admin());
create policy "questions_delete_admin" on public.questions for delete
  using (public.is_admin());

-- answers: lectura publica salvo ocultas (visibles para autor y equipo)
create policy "answers_select" on public.answers for select
  using (hidden = false or author_id = auth.uid() or public.is_mod_or_admin());
create policy "answers_insert_domain" on public.answers for insert
  with check (
    author_id = auth.uid()
    and public.email_domain_ok()
    and not public.has_active_sanction(auth.uid())
  );
create policy "answers_update_author" on public.answers for update
  using (author_id = auth.uid() and hidden = false)
  with check (author_id = auth.uid() and hidden = false);
create policy "answers_update_mods" on public.answers for update
  using (public.is_mod_or_admin()) with check (public.is_mod_or_admin());

-- reports
create policy "reports_insert_domain" on public.reports for insert
  with check (reporter_id = auth.uid() and public.email_domain_ok());
create policy "reports_select" on public.reports for select
  using (reporter_id = auth.uid() or public.is_mod_or_admin());
create policy "reports_update_mods" on public.reports for update
  using (public.is_mod_or_admin()) with check (public.is_mod_or_admin());

-- sanctions: solo el equipo las ve y solo admins las imponen
create policy "sanctions_select" on public.sanctions for select
  using (user_id = auth.uid() or public.is_mod_or_admin());
create policy "sanctions_admin_all" on public.sanctions for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- PASO FINAL: ya no se hace aquí. Ejecuta supabase/migration_02.sql
-- y supabase/migration_03.sql; esta última nombra superadmin a
-- julsanchezc@unal.edu.co automáticamente tras su primer login.
-- Los siguientes admins/moderadores se promueven desde el panel
-- (deben loguearse una vez).
-- ============================================================
