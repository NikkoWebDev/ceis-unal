-- ============================================================
-- FORO CEIS · Migración 04: papelera + lecturas sin borrados
-- Ejecutar en SQL Editor (una vez), después de la 02 y la 03.
-- - deleted_at/deleted_by en questions y answers: el botón
--   "Eliminar" mueve a papelera (UPDATE). La papelera solo la
--   ve el equipo; solo admins borran definitivamente (DELETE).
-- - Las lecturas públicas excluyen la papelera.
-- ============================================================

alter table public.questions add column if not exists deleted_at timestamptz;
alter table public.questions add column if not exists deleted_by uuid references public.profiles(id) on delete set null;
alter table public.answers add column if not exists deleted_at timestamptz;
alter table public.answers add column if not exists deleted_by uuid references public.profiles(id) on delete set null;

-- Lectura pública: sin papelera. El equipo sí la ve.
drop policy if exists questions_select_all on public.questions;
create policy "questions_select_all" on public.questions for select
  using (deleted_at is null);

drop policy if exists questions_select_mods on public.questions;
create policy "questions_select_mods" on public.questions for select
  using (public.is_mod_or_admin());

drop policy if exists answers_select on public.answers;
create policy "answers_select" on public.answers for select
  using (
    ((hidden = false or author_id = auth.uid()) and deleted_at is null)
    or public.is_mod_or_admin()
  );

-- Borrado definitivo: solo admins. (El borrado "normal" ahora es
-- un UPDATE a papelera, cubierto por las políticas de update.)
drop policy if exists questions_delete_author on public.questions;
drop policy if exists questions_delete_mods on public.questions;
drop policy if exists questions_delete_admin on public.questions;
create policy "questions_delete_admin" on public.questions for delete
  using (public.is_admin());

drop policy if exists answers_delete_author on public.answers;
drop policy if exists answers_delete_mods on public.answers;
drop policy if exists answers_delete_admin on public.answers;
create policy "answers_delete_admin" on public.answers for delete
  using (public.is_admin());
