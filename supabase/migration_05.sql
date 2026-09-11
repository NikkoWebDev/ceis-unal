-- ============================================================
-- FORO CEIS · Migración 05: tema (tag) en preguntas
-- Ejecutar en SQL Editor (una vez).
-- Las preguntas llevan un tema fijo para filtrar y ordenar
-- la base de conocimiento (sin categorías por ahora).
-- ============================================================

alter table public.questions add column if not exists tag text not null default 'Otro';
