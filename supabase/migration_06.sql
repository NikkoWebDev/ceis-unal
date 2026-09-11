-- ============================================================
-- FORO CEIS · Migración 06: papelera vía RPC
-- Ejecutar en SQL Editor (una vez).
-- Motivo: el UPDATE directo a papelera fallaba con RLS aun con
-- las políticas correctas. Estas funciones validan las reglas
-- en código (autor o equipo) y ejecutan como dueñas de la tabla.
-- ============================================================

create or replace function public.trash_question(qid uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_author uuid;
  v_me uuid := auth.uid();
begin
  if v_me is null then
    raise exception 'Sesión no válida o expirada. Ingresa de nuevo.';
  end if;
  select author_id into v_author
    from public.questions where id = qid;
  if not found then
    raise exception 'Hilo no encontrado.';
  end if;
  if v_author <> v_me and not public.is_mod_or_admin() then
    raise exception 'Solo el autor o el equipo puede mover este hilo a papelera.';
  end if;
  update public.questions
    set deleted_at = now(), deleted_by = v_me
    where id = qid;
end;
$$;

create or replace function public.trash_answer(aid uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_author uuid;
  v_me uuid := auth.uid();
begin
  if v_me is null then
    raise exception 'Sesión no válida o expirada. Ingresa de nuevo.';
  end if;
  select author_id into v_author
    from public.answers where id = aid;
  if not found then
    raise exception 'Respuesta no encontrada.';
  end if;
  if v_author <> v_me and not public.is_mod_or_admin() then
    raise exception 'Solo el autor o el equipo puede mover esta respuesta a papelera.';
  end if;
  update public.answers
    set deleted_at = now(), deleted_by = v_me
    where id = aid;
end;
$$;

create or replace function public.restore_item(tbl text, rid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Sesión no válida o expirada. Ingresa de nuevo.';
  end if;
  if not public.is_mod_or_admin() then
    raise exception 'Solo el equipo puede restaurar contenido.';
  end if;
  if tbl = 'questions' then
    update public.questions
      set deleted_at = null, deleted_by = null where id = rid;
  elsif tbl = 'answers' then
    update public.answers
      set deleted_at = null, deleted_by = null where id = rid;
  else
    raise exception 'Tabla no válida.';
  end if;
end;
$$;

revoke all on function public.trash_question(uuid) from public, anon;
grant execute on function public.trash_question(uuid) to authenticated;
revoke all on function public.trash_answer(uuid) from public, anon;
grant execute on function public.trash_answer(uuid) to authenticated;
revoke all on function public.restore_item(text, uuid) from public, anon;
grant execute on function public.restore_item(text, uuid) to authenticated;
