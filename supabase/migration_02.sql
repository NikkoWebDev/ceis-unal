-- ============================================================
-- FORO CEIS · Migración 02: borrado propio + moderación
-- Ejecutar en: Supabase Dashboard > SQL Editor (una vez).
-- El cambio de apodo NO necesita SQL: la política
-- profiles_update_own ya lo permite (rol y nombre real
-- siguen bloqueados para el propio usuario).
-- ============================================================

-- Hilos: el autor borra el suyo, el equipo borra cualquiera
drop policy if exists questions_delete_admin on public.questions;

create policy "questions_delete_author" on public.questions for delete
  using (author_id = auth.uid());

create policy "questions_delete_mods" on public.questions for delete
  using (public.is_mod_or_admin());

-- Respuestas: el autor borra la suya, el equipo borra cualquiera
create policy "answers_delete_author" on public.answers for delete
  using (author_id = auth.uid());

create policy "answers_delete_mods" on public.answers for delete
  using (public.is_mod_or_admin());
