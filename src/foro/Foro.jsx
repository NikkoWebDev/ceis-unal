import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, isUnalEmail } from '../lib/supabase';
import { Search, Plus, LogIn, LogOut, Flag, ShieldCheck, CheckCircle2, ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';

/* ================= Sesión ================= */

function useSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);
  return session;
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function remainingText(until) {
  const ms = new Date(until) - Date.now();
  if (ms <= 0) return 'expirada (se actualizará al recargar)';
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'menos de un minuto';
  if (mins < 60) return `${mins} minuto${mins === 1 ? '' : 's'}`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours} hora${hours === 1 ? '' : 's'}`;
  const days = Math.floor(hours / 24);
  return `${days} día${days === 1 ? '' : 's'}`;
}

function sanctionMessage(s) {
  if (!s) return '';
  const tipo = s.until ? 'temporal' : 'indefinida';
  const rest = s.until ? ` Tiempo restante: ${remainingText(s.until)} (hasta ${fmtDate(s.until)}).` : ' Sin fecha de fin: si crees que es un error, escribe a ceisunal@gmail.com.';
  return `Tu cuenta está sancionada (${tipo}). Motivo: ${s.reason}.${rest}`;
}

async function fetchDetail(id) {
  const [{ data: question }, { data: list }] = await Promise.all([
    supabase.from('questions').select('*, author:profiles!questions_author_id_fkey(nickname, full_name, avatar_url)').eq('id', id).single(),
    supabase.from('answers').select('*, author:profiles!answers_author_id_fkey(nickname, full_name, avatar_url)').eq('question_id', id).is('deleted_at', null).order('created_at', { ascending: true }),
  ]);
  return { question: question || null, list: list || [] };
}

async function fetchAdminData() {
  const [{ data: p }, { data: r }, { data: s }] = await Promise.all([
    supabase.from('profiles').select('id, nickname, full_name, avatar_url, role').order('nickname'),
    supabase.from('reports').select('id, target_type, target_id, reason, status, created_at, reporter:profiles(nickname, full_name, avatar_url)').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('sanctions').select('*').order('created_at', { ascending: false }).limit(20),
  ]);
  const reports = r || [];
  const qIds = [...new Set(reports.filter(x => x.target_type === 'question').map(x => x.target_id))];
  const aIds = [...new Set(reports.filter(x => x.target_type === 'answer').map(x => x.target_id))];
  const qMap = {};
  const aMap = {};
  const pqMap = {};
  if (qIds.length > 0) {
    const { data } = await supabase.from('questions').select('id, title').in('id', qIds);
    (data || []).forEach(q => { qMap[q.id] = q.title; });
  }
  if (aIds.length > 0) {
    const { data } = await supabase.from('answers').select('id, body, question_id').in('id', aIds);
    (data || []).forEach(a => { aMap[a.id] = a; });
    const parentIds = [...new Set(Object.values(aMap).map(a => a.question_id))];
    if (parentIds.length > 0) {
      const { data: parents } = await supabase.from('questions').select('id, title').in('id', parentIds);
      (parents || []).forEach(q => { pqMap[q.id] = q.title; });
    }
  }
  return { profiles: p || [], reports, sanctions: s || [], qMap, aMap, pqMap };
}

/* ================= Piezas ================= */

function AuthorLine({ nickname, fullName, avatarUrl, darkMode, size }) {
  const small = size === 'sm';
  return (
    <span className="flex items-center gap-2.5">
      {avatarUrl ? (
        <img src={avatarUrl} alt={`Foto de ${nickname || 'usuario'}`} loading="lazy" className={`${small ? 'w-6 h-6' : 'w-8 h-8'} rounded-full object-cover border border-[#907A67]/40 shrink-0`} />
      ) : (
        <span className={`${small ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full bg-gradient-to-br from-[#3B908D] to-[#82B475] text-white font-sans font-bold flex items-center justify-center shrink-0`}>
          {((nickname || '?').charAt(0) || '?').toUpperCase()}
        </span>
      )}
      <span className="flex flex-col leading-tight">
        <span className={`font-sans ${small ? 'text-[13px]' : 'text-sm'} font-semibold ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>
          {nickname || 'usuario'}
        </span>
        {fullName && (
          <span className={`font-sans ${small ? 'text-[10px]' : 'text-[11px]'} ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>{fullName}</span>
        )}
      </span>
    </span>
  );
}

const FORO_TAGS = ['Duda académica', 'Inscripciones y trámites', 'Bienestar', 'Debate', 'Sugerencia', 'Otro'];

const TAG_COLORS = {
  'Duda académica': '#3B908D',
  'Inscripciones y trámites': '#c08a2e',
  'Bienestar': '#82B475',
  'Debate': '#8F7CC0',
  'Sugerencia': '#5B8DB8',
  'Otro': '#907A67',
};

function TagChip({ tag }) {
  const color = TAG_COLORS[tag] || TAG_COLORS['Otro'];
  return (
    <span
      className="font-sans text-[11px] font-bold px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}80`, backgroundColor: `${color}1a` }}
    >
      {tag || 'Otro'}
    </span>
  );
}

function StatusChip({ status }) {
  const map = {
    open: { label: 'Abierta', cls: 'bg-[#82B475]/20 text-[#3f6b3a] border-[#82B475]/50' },
    answered: { label: 'Resuelta', cls: 'bg-[#3B908D]/15 text-[#3B908D] border-[#3B908D]/50' },
    closed: { label: 'Cerrada', cls: 'bg-black/5 text-[#907A67] border-[#907A67]/40' },
  };
  const s = map[status] || map.open;
  return (
    <span className={`font-sans text-[11px] font-bold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>
  );
}

export function ForoAuthButton() {
  const session = useSession();
  if (!isSupabaseConfigured) return null;

  const login = () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { queryParams: { hd: 'unal.edu.co' }, redirectTo: window.location.origin },
  });
  const logout = () => supabase.auth.signOut();

  const btnCls = 'btn-magnetic inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-[#3B908D] to-[#18514A] shadow-md cursor-pointer border-none';

  if (!session) {
    return (
      <button onClick={login} className={btnCls}>
        <LogIn size={16} /> Ingresar
      </button>
    );
  }
  return (
    <button onClick={logout} title={session.user.email} className={btnCls}>
      <LogOut size={16} /> Cerrar sesión
    </button>
  );
}

/* ================= Puerta de apodo ================= */

function NicknameGate({ userId, darkMode, onDone }) {
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    const clean = nick.trim();
    if (!/^[a-zA-Z0-9_.]{3,24}$/.test(clean)) {
      setError('Usa de 3 a 24 caracteres: letras, números, punto o guion bajo.');
      return;
    }
    setSaving(true);
    setError('');
    const { error } = await supabase.from('profiles').update({ nickname: clean }).eq('id', userId);
    setSaving(false);
    if (error) {
      setError(error.code === '23505' ? 'Ese apodo ya está en uso, elige otro.' : 'No se pudo guardar, intenta de nuevo.');
      return;
    }
    onDone();
  };

  return (
    <div className={`max-w-md mx-auto p-8 rounded-2xl border text-center ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-white border-[#907A67]/30'}`}>
      <h3 className={`font-sans text-xl font-bold mb-2 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Elige tu apodo</h3>
      <p className={`font-sans text-sm mb-5 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
        Se mostrará junto a tu nombre real en cada publicación. Así mantenemos un foro con identidad y responsabilidad.
      </p>
      <form onSubmit={save} className="flex flex-col gap-3">
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          placeholder="tu_apodo"
          maxLength={24}
          className={`font-sans text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#3B908D] ${
            darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-[#F6EEE8] border-[#907A67]/30 text-[#191114]'
          }`}
        />
        {error && <p className="font-sans text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="btn-magnetic font-sans text-sm font-semibold px-6 py-3 rounded-xl text-white bg-gradient-to-r from-[#3B908D] to-[#18514A] cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Continuar al foro'}
        </button>
      </form>
    </div>
  );
}

/* ================= Cambiar apodo ================= */

function NicknameEditor({ userId, current, darkMode, onDone }) {
  const [open, setOpen] = useState(false);
  const [nick, setNick] = useState(current || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    const clean = nick.trim();
    if (!/^[a-zA-Z0-9_.]{3,24}$/.test(clean)) {
      setError('Usa de 3 a 24 caracteres: letras, números, punto o guion bajo.');
      return;
    }
    setSaving(true);
    setError('');
    const { error } = await supabase.from('profiles').update({ nickname: clean }).eq('id', userId);
    setSaving(false);
    if (error) {
      setError(error.code === '23505' ? 'Ese apodo ya está en uso, elige otro.' : `No se pudo guardar: ${error.message}`);
      return;
    }
    setOpen(false);
    onDone();
  };

  if (!open) {
    return (
      <button
        onClick={() => { setNick(current || ''); setError(''); setOpen(true); }}
        className={`font-sans text-xs underline cursor-pointer bg-transparent border-none p-0 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}
      >
        Publicas como <strong>{current}</strong> · cambiar apodo
      </button>
    );
  }
  return (
    <form onSubmit={save} className="flex items-center gap-2 flex-wrap justify-center">
      <input
        value={nick}
        onChange={(e) => setNick(e.target.value)}
        maxLength={24}
        className={`font-sans text-sm px-3 py-2 rounded-xl border outline-none w-44 focus:border-[#3B908D] ${
          darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
        }`}
      />
      <button type="submit" disabled={saving} className="font-sans text-xs font-bold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0 disabled:opacity-50">
        {saving ? 'Guardando…' : 'Guardar'}
      </button>
      <button type="button" onClick={() => setOpen(false)} className={`font-sans text-xs underline cursor-pointer bg-transparent border-none p-0 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
        Cancelar
      </button>
      {error && <p className="font-sans text-xs text-red-500 w-full text-center">{error}</p>}
    </form>
  );
}

/* ================= Reportar ================= */

function ReportButton({ targetType, targetId, darkMode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    if (reason.trim().length < 5) {
      setError('Describe el motivo (mínimo 5 caracteres).');
      return;
    }
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Sesión no detectada. Recarga e ingresa de nuevo.');
      return;
    }
    const { error } = await supabase.from('reports').insert({
      target_type: targetType, target_id: targetId, reporter_id: user.id, reason: reason.trim(),
    });
    if (error) {
      setError(`No se pudo reportar: ${error.message}`);
      return;
    }
    setSent(true); setOpen(false);
  };

  if (sent) return <span className={`font-sans text-[11px] ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Reportado, gracias.</span>;
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} title="Reportar" className={`p-1.5 rounded-md cursor-pointer transition-colors ${darkMode ? 'text-[#aeb8a4] hover:text-red-400' : 'text-[#907A67] hover:text-red-600'}`}>
        <Flag size={14} />
      </button>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motivo del reporte"
        maxLength={200}
        className={`font-sans text-xs px-2 py-1.5 rounded-lg border outline-none w-44 ${
          darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
        }`}
      />
      <button onClick={send} className="font-sans text-xs font-bold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0">Enviar</button>
      <button onClick={() => setOpen(false)} className={`font-sans text-xs underline cursor-pointer bg-transparent border-none p-0 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Cancelar</button>
      {error && <span className="font-sans text-[11px] text-red-500">{error}</span>}
    </span>
  );
}

/* ================= Imágenes ================= */

const MAX_IMAGES = 3;
const MAX_IMAGE_MB = 5;

async function uploadForumImage(file, userId) {
  if (!file.type.startsWith('image/')) throw new Error('Solo se permiten archivos de imagen.');
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`Máximo ${MAX_IMAGE_MB} MB por imagen.`);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('foro-imagenes').upload(path, file);
  if (error) throw error;
  return supabase.storage.from('foro-imagenes').getPublicUrl(path).data.publicUrl;
}

function renderRichBody(text, darkMode) {
  const parts = String(text || '').split(/(!\[[^\]]*\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (m) {
      return (
        <img
          key={i}
          src={m[2]}
          alt={m[1] || 'imagen adjunta'}
          loading="lazy"
          className={`rounded-xl my-3 max-h-96 w-auto max-w-full border ${darkMode ? 'border-[#f0eee2]/20' : 'border-[#907A67]/30'}`}
        />
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function stripImages(text) {
  return String(text || '').replace(/!\[[^\]]*\]\([^)]+\)/g, '[imagen]');
}

function ImagePicker({ userId, images, setImages, darkMode }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (images.length >= MAX_IMAGES) {
      setError(`Máximo ${MAX_IMAGES} imágenes por publicación.`);
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadForumImage(file, userId);
      setImages([...images, url]);
    } catch (err) {
      setError(err.message || 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap">
        <label className={`inline-flex items-center gap-2 font-sans text-xs font-semibold px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
          darkMode ? 'border-[#f0eee2]/20 text-[#aeb8a4] hover:text-[#f0eee2]' : 'border-[#907A67]/30 text-[#907A67] hover:text-[#191114]'
        }`}>
          {uploading ? 'Subiendo…' : `Adjuntar imagen (${images.length}/${MAX_IMAGES})`}
          <input type="file" accept="image/*" className="hidden" onChange={pick} disabled={uploading} />
        </label>
        {images.map((url) => (
          <span key={url} className="relative inline-block">
            <img src={url} alt="adjunto" className="w-14 h-14 rounded-lg object-cover border border-[#907A67]/30" />
            <button
              type="button"
              onClick={() => setImages(images.filter(u => u !== url))}
              aria-label="Quitar imagen"
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-800 text-white text-[11px] font-bold leading-none cursor-pointer border-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {error && <p className="font-sans text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}

function AvatarUploader({ userId, currentUrl, nickname, onDone }) {
  const [saving, setSaving] = useState(false);

  const change = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadForumImage(file, userId);
      const { error } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId);
      if (error) throw error;
      onDone();
    } catch (err) {
      window.alert(`No se pudo cambiar la foto: ${err.message || 'error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <label className={`relative shrink-0 cursor-pointer ${saving ? 'opacity-50' : ''}`} title="Cambiar foto de perfil">
      {currentUrl ? (
        <img src={currentUrl} alt="Foto de perfil" className="w-10 h-10 rounded-full object-cover border border-[#907A67]/40" />
      ) : (
        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B908D] to-[#82B475] text-white font-sans font-bold flex items-center justify-center text-lg">
          {(nickname || '?').charAt(0).toUpperCase()}
        </span>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={change} disabled={saving} />
    </label>
  );
}

/* ================= Sección principal ================= */

export default function ForoSection({ darkMode }) {
  const session = useSession();
  const [profile, setProfile] = useState(null);
  const [profileChecked, setProfileChecked] = useState(null);
  const [mySanction, setMySanction] = useState(null);
  const [route, setRoute] = useState({ name: 'list' });
  const [tab, setTab] = useState('preguntas');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [listError, setListError] = useState('');
  const [tagFilter, setTagFilter] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('recientes');

  const myProfile = session && profile?.id === session.user.id ? profile : null;
  const email = session?.user?.email || '';
  const unal = isUnalEmail(email);
  const role = myProfile?.role || 'member';
  const canMod = role === 'moderator' || role === 'admin' || role === 'superadmin';
  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperadmin = role === 'superadmin';

  useEffect(() => {
    if (!supabase || !session) return;
    let on = true;
    supabase.from('profiles').select('*').eq('id', session.user.id).single()
      .then(({ data }) => { if (!on) return; setProfile(data); setProfileChecked(session.user.id); });
    supabase.from('sanctions').select('user_id, reason, until').eq('user_id', session.user.id)
      .or(`until.is.null,until.gt.${new Date().toISOString()}`)
      .order('until', { ascending: true, nullsFirst: false }).limit(1)
      .then(({ data }) => { if (on) setMySanction(data && data[0] ? data[0] : null); });
    return () => { on = false; };
  }, [session, refreshKey]);

  const activeSanction = session && mySanction?.user_id === session.user.id ? mySanction : null;

  const refresh = () => { setLoading(true); setRefreshKey(k => k + 1); };
  const onSearch = (v) => { setLoading(true); setSearch(v); };
  const openQuestion = (qid) => {
    if (!qid) return;
    setTab('preguntas');
    setRoute({ name: 'detail', id: qid });
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (!supabase) return;
    let q = supabase
      .from('questions')
      .select('id, title, body, tag, status, created_at, author_id, author:profiles!questions_author_id_fkey(nickname, full_name, avatar_url), answers!answers_question_id_fkey(count)')
      .is('deleted_at', null)
      .order('created_at', { ascending: sortOrder !== 'recientes' })
      .limit(30);
    if (tagFilter !== 'Todos') q = q.eq('tag', tagFilter);
    if (search.trim().length > 2) {
      const s = `%${search.trim()}%`;
      q = q.or(`title.ilike.${s},body.ilike.${s}`);
    }
    q.then(({ data, error }) => {
      setListError(error ? `No se pudieron cargar las preguntas: ${error.message}` : '');
      setQuestions(data || []); setLoading(false);
    });
  }, [search, refreshKey, tagFilter, sortOrder]);

  if (!isSupabaseConfigured) {
    return (
      <div className="py-16">
        <div className="max-w-[720px] mx-auto px-7">
          <div className={`p-8 rounded-2xl border text-center ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-white border-[#907A67]/30'}`}>
            <MessageSquare size={28} className="mx-auto mb-4 text-[#3B908D]" />
            <h2 className={`font-sans text-2xl font-bold mb-2 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Foro en construcción</h2>
            <p className={`font-sans text-sm ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
              Estamos conectando el inicio de sesión con Google y la base de datos. Vuelve pronto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 w-full">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="text-center mb-8">
          <p className={`font-sans text-[13.5px] font-semibold mb-3 tracking-wide uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>Comunidad</p>
          <h2 className={`font-sans text-3xl md:text-4xl font-bold tracking-tight ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Foro de preguntas</h2>
          <p className={`font-serif mt-3 max-w-[60ch] mx-auto ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
            Pregunta, responde y consulta: las dudas resueltas quedan como referencia para toda la comunidad. Solo cuentas @unal.edu.co pueden participar.
          </p>
        </div>

        {session && !unal && (
          <div className="max-w-md mx-auto p-8 rounded-2xl border text-center mb-8 bg-red-500/5 border-red-500/30">
            <p className={`font-sans text-sm mb-4 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>
              Ingresaste con <strong>{email}</strong>, pero este foro es exclusivo de cuentas <strong>@unal.edu.co</strong>.
            </p>
            <button onClick={() => supabase.auth.signOut()} className="font-sans text-sm font-semibold text-[#3B908D] underline cursor-pointer bg-transparent border-none">
              Cerrar sesión e intentar con otra cuenta
            </button>
          </div>
        )}

        {session && unal && myProfile && !myProfile.nickname && (
          <div className="mb-8">
            <NicknameGate userId={session.user.id} darkMode={darkMode} onDone={() => setRefreshKey(k => k + 1)} />
          </div>
        )}

        {session && unal && !myProfile && profileChecked !== session.user.id && (
          <p className={`font-sans text-sm text-center py-8 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
            Cargando tu perfil…
          </p>
        )}

        {session && unal && !myProfile && profileChecked === session.user.id && (
          <div className={`max-w-xl mx-auto p-8 rounded-2xl border text-center mb-8 ${darkMode ? 'bg-[#152218] border-[#c08a2e]/50' : 'bg-white border-[#c08a2e]/60'}`}>
            <h3 className={`font-sans text-lg font-bold mb-2 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Tu perfil no existe en la base de datos</h3>
            <p className={`font-sans text-sm mb-2 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
              El login funcionó, pero falta tu fila en la tabla <span className="font-mono">profiles</span>. Casi siempre es porque aún no ejecutas <span className="font-mono">supabase/schema.sql</span> en el SQL Editor.
            </p>
            <p className={`font-sans text-sm mb-5 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
              Si ya lo ejecutaste <em>después</em> de tu primer ingreso, borra tu usuario en Authentication → Users e ingresa de nuevo para que se cree el perfil.
            </p>
            <button onClick={refresh} className="font-sans text-sm font-semibold text-[#3B908D] underline cursor-pointer bg-transparent border-none">
              Reintentar
            </button>
          </div>
        )}

        {session && unal && myProfile?.nickname && (
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <AvatarUploader userId={session.user.id} currentUrl={myProfile.avatar_url} nickname={myProfile.nickname} onDone={() => setRefreshKey(k => k + 1)} />
            <NicknameEditor userId={session.user.id} current={myProfile.nickname} darkMode={darkMode} onDone={() => setRefreshKey(k => k + 1)} />
          </div>
        )}

        {session && unal && activeSanction && (
          <div className="max-w-2xl mx-auto mb-8 p-5 rounded-2xl border border-red-500/40 bg-red-500/5 text-center">
            <p className={`font-sans font-bold mb-1 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>
              Cuenta sancionada ({activeSanction.until ? 'temporal' : 'indefinida'})
            </p>
            <p className={`font-sans text-sm ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
              Motivo: {activeSanction.reason}.
              {activeSanction.until
                ? <> Tiempo restante: <strong>{remainingText(activeSanction.until)}</strong> (hasta {fmtDate(activeSanction.until)}).</>
                : <> Sin fecha de fin: si crees que es un error, escribe a ceisunal@gmail.com.</>}
            </p>
          </div>
        )}

        {(!session || !unal || (myProfile && myProfile.nickname)) && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 font-sans text-sm">
              <button
                onClick={() => setTab('preguntas')}
                className={`px-4 py-2 rounded-full border cursor-pointer font-semibold transition-colors ${
                  tab === 'preguntas'
                    ? 'bg-[#3B908D] text-white border-[#3B908D]'
                    : (darkMode ? 'border-[#f0eee2]/20 text-[#aeb8a4]' : 'border-[#907A67]/30 text-[#907A67]')
                }`}
              >
                Preguntas
              </button>
              {canMod && (
                <button
                  onClick={() => setTab('admin')}
                  className={`px-4 py-2 rounded-full border cursor-pointer font-semibold inline-flex items-center gap-1.5 transition-colors ${
                    tab === 'admin'
                      ? 'bg-[#3B908D] text-white border-[#3B908D]'
                      : (darkMode ? 'border-[#f0eee2]/20 text-[#aeb8a4]' : 'border-[#907A67]/30 text-[#907A67]')
                  }`}
                >
                  <ShieldCheck size={15} /> Moderación
                </button>
              )}
              {canMod && (
                <button
                  onClick={() => setTab('papelera')}
                  className={`px-4 py-2 rounded-full border cursor-pointer font-semibold inline-flex items-center gap-1.5 transition-colors ${
                    tab === 'papelera'
                      ? 'bg-[#3B908D] text-white border-[#3B908D]'
                      : (darkMode ? 'border-[#f0eee2]/20 text-[#aeb8a4]' : 'border-[#907A67]/30 text-[#907A67]')
                  }`}
                >
                  <Trash2 size={15} /> Papelera
                </button>
              )}
            </div>

            {tab === 'preguntas' && route.name === 'list' && (
              <QuestionList
                darkMode={darkMode} questions={questions} loading={loading} listError={listError}
                sanction={activeSanction}
                search={search} setSearch={onSearch}
                tagFilter={tagFilter} setTagFilter={(v) => { setLoading(true); setTagFilter(v); }}
                sortOrder={sortOrder} setSortOrder={(v) => { setLoading(true); setSortOrder(v); }}
                canAsk={Boolean(session && unal && myProfile?.nickname) && !activeSanction}
                userId={session?.user?.id}
                showNew={showNew} setShowNew={setShowNew}
                onOpen={(id) => setRoute({ name: 'detail', id })}
                onChanged={refresh}
              />
            )}
            {tab === 'preguntas' && route.name === 'detail' && (
              <QuestionDetail
                darkMode={darkMode} id={route.id}
                session={session} profile={myProfile} canMod={canMod} sanction={activeSanction}
                onBack={() => { setRoute({ name: 'list' }); refresh(); }}
              />
            )}
            {tab === 'admin' && canMod && (
              <AdminPanel darkMode={darkMode} isAdmin={isAdmin} isSuperadmin={isSuperadmin} currentUserId={session?.user?.id} onChanged={refresh} onOpenQuestion={openQuestion} />
            )}
            {tab === 'papelera' && canMod && (
              <PapeleraPanel darkMode={darkMode} isAdmin={isAdmin} onOpenQuestion={openQuestion} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ================= Lista ================= */

function QuestionList({ darkMode, questions, loading, listError, sanction, search, setSearch, tagFilter, setTagFilter, sortOrder, setSortOrder, canAsk, userId, showNew, setShowNew, onOpen, onChanged }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('Otro');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const publish = async (e) => {
    e.preventDefault();
    if (title.trim().length < 10 || body.trim().length < 20) {
      setError('Título mínimo 10 caracteres y detalle mínimo 20.');
      return;
    }
    if (!userId) {
      setError('Sesión no detectada. Recarga la página e ingresa de nuevo.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const fullBody = body.trim() + (images.length > 0 ? `\n\n${images.map(u => `![imagen](${u})`).join('\n')}` : '');
      const { error } = await supabase.from('questions').insert({ author_id: userId, title: title.trim(), body: fullBody, tag });
      if (error) throw error;
      setTitle(''); setBody(''); setTag('Otro'); setImages([]); setShowNew(false); onChanged();
    } catch (err) {
      setError(sanction ? sanctionMessage(sanction) : `No se pudo publicar: ${err.message || 'error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full font-sans text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#3B908D] ${
    darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
  }`;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busca por palabras clave: inscripción, prerrequisitos, SIA…"
            className={`${inputCls} pl-11`}
          />
        </div>
        {canAsk && (
          <button
            onClick={() => setShowNew(!showNew)}
            className="btn-magnetic inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold px-6 py-3 rounded-xl text-white bg-gradient-to-r from-[#3B908D] to-[#18514A] cursor-pointer border-none whitespace-nowrap"
          >
            <Plus size={16} /> Nueva pregunta
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6 font-sans text-sm">
        <label className={`inline-flex items-center gap-2 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
          Tema:
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl border outline-none cursor-pointer focus:border-[#3B908D] ${
              darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
            }`}
          >
            <option value="Todos">Todos</option>
            {FORO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className={`inline-flex items-center gap-2 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
          Orden:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={`px-3 py-2 rounded-xl border outline-none cursor-pointer focus:border-[#3B908D] ${
              darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
            }`}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguas">Más antiguas</option>
          </select>
        </label>
      </div>

      {showNew && canAsk && (
        <form onSubmit={publish} className={`p-6 rounded-2xl border mb-6 flex flex-col gap-3 ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-white border-[#907A67]/30'}`}>
          <div className="flex flex-col md:flex-row gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título claro de tu pregunta" maxLength={180} className={`${inputCls} flex-grow`} />
            <select value={tag} onChange={(e) => setTag(e.target.value)} title="Tema de la pregunta" className={`${inputCls} md:w-56`}>
              {FORO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe tu duda con detalle: qué intentaste, qué error viste, en qué semestre vas…" rows={5} maxLength={8000} className={`${inputCls} resize-y`} />
          {userId && <ImagePicker userId={userId} images={images} setImages={setImages} darkMode={darkMode} />}
          {error && <p className="font-sans text-xs text-red-500">{error}</p>}
          <div>
            <button type="submit" disabled={saving} className="btn-magnetic font-sans text-sm font-semibold px-6 py-2.5 rounded-xl text-white bg-gradient-to-r from-[#3B908D] to-[#82B475] cursor-pointer border-none disabled:opacity-50">
              {saving ? 'Publicando…' : 'Publicar pregunta'}
            </button>
          </div>
        </form>
      )}

      {loading && <p className={`font-sans text-sm text-center py-8 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Cargando preguntas…</p>}
      {!loading && listError && <p className="font-sans text-sm text-center py-4 text-red-500">{listError}</p>}
      {!loading && questions.length === 0 && (
        <p className={`font-sans text-sm text-center py-8 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
          Aún no hay preguntas{search.trim() ? ' con esa búsqueda' : ''}. ¡Sé la primera persona en preguntar!
        </p>
      )}
      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => onOpen(q.id)}
            className={`text-left p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 w-full ${
              darkMode ? 'bg-[#152218] border-[#f0eee2]/15 hover:border-[#3B908D]' : 'bg-white border-[#907A67]/30 hover:border-[#3B908D]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusChip status={q.status} />
              <TagChip tag={q.tag} />
              <span className={`font-sans text-xs inline-flex items-center gap-1 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
                <MessageSquare size={13} /> {(q.answers?.[0]?.count ?? 0)} respuestas · {fmtDate(q.created_at)}
              </span>
            </div>
            <h3 className={`font-sans text-lg font-bold leading-snug mb-1 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>{q.title}</h3>
            <p className={`font-serif text-sm line-clamp-2 mb-3 ${darkMode ? 'text-[#f0eee2]/70' : 'text-[#191114]/70'}`}>{stripImages(q.body)}</p>
            <AuthorLine nickname={q.author?.nickname} fullName={q.author?.full_name} avatarUrl={q.author?.avatar_url} darkMode={darkMode} size="sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= Detalle ================= */

function QuestionDetail({ darkMode, id, session, profile, canMod, sanction, onBack }) {
  const [q, setQ] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyError, setReplyError] = useState('');

  const canAsk = Boolean(session && isUnalEmail(session.user.email) && profile?.nickname) && !sanction;
  const isAuthor = session && q && session.user.id === q.author_id;

  const refresh = () => {
    fetchDetail(id).then(({ question, list }) => {
      setQ(question); setAnswers(list); setLoading(false);
    });
  };
  useEffect(() => {
    let on = true;
    fetchDetail(id).then(({ question, list }) => {
      if (!on) return;
      setQ(question); setAnswers(list); setLoading(false);
    });
    return () => { on = false; };
  }, [id]);

  const reply = async (e) => {
    e.preventDefault();
    if (body.trim().length < 2) return;
    if (!session?.user?.id) {
      setReplyError('Sesión no detectada. Recarga la página e ingresa de nuevo.');
      return;
    }
    setSaving(true);
    setReplyError('');
    try {
      const fullBody = body.trim() + (images.length > 0 ? `\n\n${images.map(u => `![imagen](${u})`).join('\n')}` : '');
      const { error } = await supabase.from('answers').insert({ question_id: id, author_id: session.user.id, body: fullBody });
      if (error) throw error;
      setBody(''); setImages([]); refresh();
    } catch (err) {
      setReplyError(sanction ? sanctionMessage(sanction) : `No se pudo publicar: ${err.message || 'error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const accept = async (answerId) => {
    await supabase.from('questions').update({ accepted_answer_id: answerId, status: 'answered' }).eq('id', id);
    refresh();
  };

  const toggleClose = async () => {
    await supabase.from('questions').update({ status: q.status === 'closed' ? 'open' : 'closed' }).eq('id', id);
    refresh();
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Mover este hilo a la papelera? El equipo de moderación podrá verlo y restaurarlo.')) return;
    const { error } = await supabase.from('questions')
      .update({ deleted_at: new Date().toISOString(), deleted_by: session.user.id })
      .eq('id', id);
    if (error) {
      window.alert(`No se pudo eliminar: ${error.message}`);
      return;
    }
    onBack();
  };

  const hideAnswer = async (answerId, hidden) => {
    if (!window.confirm(hidden ? '¿Ocultar esta respuesta?' : '¿Mostrar esta respuesta de nuevo?')) return;
    await supabase.from('answers').update({ hidden }).eq('id', answerId);
    refresh();
  };

  const deleteAnswer = async (answerId) => {
    if (!window.confirm('¿Mover esta respuesta a la papelera? El equipo de moderación podrá verla y restaurarla.')) return;
    const { error } = await supabase.from('answers')
      .update({ deleted_at: new Date().toISOString(), deleted_by: session.user.id })
      .eq('id', answerId);
    if (error) {
      window.alert(`No se pudo eliminar: ${error.message}`);
      return;
    }
    refresh();
  };

  if (loading) return <p className={`font-sans text-sm text-center py-8 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Cargando…</p>;
  if (!q) return <p className={`font-sans text-sm text-center py-8 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Pregunta no encontrada.</p>;

  const cardCls = `p-6 rounded-2xl border ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-white border-[#907A67]/30'}`;
  const accepted = answers.find(a => a.id === q.accepted_answer_id);

  return (
    <div>
      <button onClick={onBack} className={`inline-flex items-center gap-2 font-sans text-sm font-semibold mb-6 cursor-pointer bg-transparent border-none p-0 ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>
        <ArrowLeft size={16} /> Volver a preguntas
      </button>

      <div className={`${cardCls} mb-4`}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <StatusChip status={q.status} />
          <TagChip tag={q.tag} />
          <span className={`font-sans text-xs ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>{fmtDate(q.created_at)}</span>
          {canMod && (
            <button onClick={toggleClose} className="font-sans text-xs font-bold text-[#c08a2e] underline cursor-pointer bg-transparent border-none p-0 ml-auto">
              {q.status === 'closed' ? 'Reabrir' : 'Cerrar hilo'}
            </button>
          )}
          {(isAuthor || canMod) && (
            <button onClick={handleDelete} className={`font-sans text-xs font-bold text-red-500 underline cursor-pointer bg-transparent border-none p-0 ${canMod ? '' : 'ml-auto'}`}>
              Eliminar hilo
            </button>
          )}
        </div>
          <h2 className={`font-sans text-2xl font-bold mb-3 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>{q.title}</h2>
          <div className={`font-serif leading-relaxed mb-4 whitespace-pre-wrap ${darkMode ? 'text-[#f0eee2]/85' : 'text-[#191114]/85'}`}>{renderRichBody(q.body, darkMode)}</div>
        <div className="flex items-center justify-between">
          <AuthorLine nickname={q.author?.nickname} fullName={q.author?.full_name} avatarUrl={q.author?.avatar_url} darkMode={darkMode} />
          {session && <ReportButton targetType="question" targetId={q.id} darkMode={darkMode} />}
        </div>
      </div>

      {accepted && !accepted.hidden && !accepted.deleted_at && (
        <div className={`p-6 rounded-2xl border-2 border-[#82B475]/60 mb-4 ${darkMode ? 'bg-[#82B475]/10' : 'bg-[#82B475]/10'}`}>
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#3f6b3a] mb-2 inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Solución marcada
          </p>
          <div className={`font-serif leading-relaxed mb-3 whitespace-pre-wrap ${darkMode ? 'text-[#f0eee2]/90' : 'text-[#191114]/90'}`}>{renderRichBody(accepted.body, darkMode)}</div>
          <AuthorLine nickname={accepted.author?.nickname} fullName={accepted.author?.full_name} avatarUrl={accepted.author?.avatar_url} darkMode={darkMode} />
        </div>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {answers.filter(a => a.id !== q.accepted_answer_id).map((a) => (
          <div key={a.id} className={`${cardCls} ${a.hidden ? 'opacity-60' : ''}`}>
            {a.hidden && <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#c08a2e] mb-2">Oculta por moderación</p>}
            <div className={`font-serif leading-relaxed mb-3 whitespace-pre-wrap ${darkMode ? 'text-[#f0eee2]/85' : 'text-[#191114]/85'}`}>{renderRichBody(a.body, darkMode)}</div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <AuthorLine nickname={a.author?.nickname} fullName={a.author?.full_name} avatarUrl={a.author?.avatar_url} darkMode={darkMode} />
              <span className="flex items-center gap-3">
                {session && <ReportButton targetType="answer" targetId={a.id} darkMode={darkMode} />}
                {(isAuthor || canMod) && q.status !== 'closed' && !a.hidden && (
                  <button onClick={() => accept(a.id)} className="font-sans text-xs font-bold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0">
                    Marcar solución
                  </button>
                )}
                {canMod && (
                  <button onClick={() => hideAnswer(a.id, !a.hidden)} className="font-sans text-xs font-bold text-[#c08a2e] underline cursor-pointer bg-transparent border-none p-0">
                    {a.hidden ? 'Mostrar' : 'Ocultar'}
                  </button>
                )}
                {(session?.user?.id === a.author_id || canMod) && (
                  <button onClick={() => deleteAnswer(a.id)} className="font-sans text-xs font-bold text-red-500 underline cursor-pointer bg-transparent border-none p-0">
                    Eliminar
                  </button>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {q.deleted_at && (
        <p className={`font-sans text-sm text-center py-4 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Este hilo está en papelera (visible solo para el equipo).</p>
      )}
      {canAsk && q.status !== 'closed' && !q.deleted_at && (
        <form onSubmit={reply} className={`${cardCls} flex flex-col gap-3`}>
          <h3 className={`font-sans font-bold ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Tu respuesta</h3>
          <textarea
            value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={8000}
            placeholder="Comparte lo que sabes: pasos, enlaces, experiencia propia…"
            className={`w-full font-sans text-sm px-4 py-3 rounded-xl border outline-none resize-y focus:border-[#3B908D] ${
              darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-[#F6EEE8] border-[#907A67]/30 text-[#191114]'
            }`}
          />
          {session?.user?.id && <ImagePicker userId={session.user.id} images={images} setImages={setImages} darkMode={darkMode} />}
          {replyError && <p className="font-sans text-xs text-red-500">{replyError}</p>}
          <div>
            <button type="submit" disabled={saving} className="btn-magnetic font-sans text-sm font-semibold px-6 py-2.5 rounded-xl text-white bg-gradient-to-r from-[#3B908D] to-[#82B475] cursor-pointer border-none disabled:opacity-50">
              {saving ? 'Publicando…' : 'Publicar respuesta'}
            </button>
          </div>
        </form>
      )}
      {q.status === 'closed' && (
        <p className={`font-sans text-sm text-center py-4 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Este hilo está cerrado.</p>
      )}
    </div>
  );
}

/* ================= Moderación ================= */

function AdminPanel({ darkMode, isAdmin, isSuperadmin, currentUserId, onChanged, onOpenQuestion }) {
  const [profiles, setProfiles] = useState([]);
  const [reports, setReports] = useState([]);
  const [sanctions, setSanctions] = useState([]);
  const [qMap, setQMap] = useState({});
  const [aMap, setAMap] = useState({});
  const [pqMap, setPqMap] = useState({});
  const [sanUser, setSanUser] = useState('');
  const [sanReason, setSanReason] = useState('');
  const [sanDays, setSanDays] = useState('7');

  const applyAdminData = ({ profiles, reports, sanctions, qMap, aMap, pqMap }) => {
    setProfiles(profiles); setReports(reports); setSanctions(sanctions);
    setQMap(qMap); setAMap(aMap); setPqMap(pqMap);
  };
  const load = () => {
    fetchAdminData().then(applyAdminData);
  };
  useEffect(() => {
    let on = true;
    fetchAdminData().then((d) => { if (on) applyAdminData(d); });
    return () => { on = false; };
  }, []);

  const profOf = (id) => profiles.find(x => x.id === id);

  const resolveReport = async (id, status) => {
    await supabase.from('reports').update({ status }).eq('id', id);
    load(); onChanged();
  };

  const sanction = async (e) => {
    e.preventDefault();
    if (!sanUser || sanReason.trim().length < 5) return;
    const { data: { user } } = await supabase.auth.getUser();
    const until = sanDays === 'never' ? null : new Date(Date.now() + Number(sanDays) * 864e5).toISOString();
    await supabase.from('sanctions').insert({ user_id: sanUser, by_id: user.id, reason: sanReason.trim(), until });
    setSanUser(''); setSanReason(''); load(); onChanged();
  };

  const lift = async (id) => {
    if (!window.confirm('¿Levantar esta sanción?')) return;
    await supabase.from('sanctions').delete().eq('id', id);
    load(); onChanged();
  };

  const changeRole = async (id, role) => {
    const target = profiles.find(p => p.id === id);
    if (!isSuperadmin && (target?.role === 'admin' || target?.role === 'superadmin' || role === 'admin' || role === 'superadmin')) {
      window.alert('Solo la superadministradora puede dar o quitar el rol admin.');
      load();
      return;
    }
    if (isSuperadmin && id === currentUserId && role !== 'superadmin') {
      window.alert('No puedes quitarte tu propio rol de superadmin.');
      load();
      return;
    }
    if (!window.confirm(`¿Cambiar rol a "${role}"?`)) { load(); return; }
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) window.alert(`No se pudo cambiar el rol: ${error.message}`);
    load(); onChanged();
  };

  const cardCls = `p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-white border-[#907A67]/30'}`;
  const hCls = `font-sans font-bold text-lg mb-4 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`;
  const tCls = `font-sans text-sm ${darkMode ? 'text-[#f0eee2]/85' : 'text-[#191114]/85'}`;
  const inputCls = `font-sans text-sm px-3 py-2.5 rounded-xl border outline-none focus:border-[#3B908D] ${
    darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-[#F6EEE8] border-[#907A67]/30 text-[#191114]'
  }`;

  return (
    <div>
      <div className={cardCls}>
        <h3 className={hCls}>Reportes pendientes ({reports.length})</h3>
        {reports.length === 0 && <p className={tCls}>Sin reportes. Todo en orden.</p>}
        <div className="flex flex-col gap-3">
          {reports.map((r) => {
            const isQ = r.target_type === 'question';
            const targetQid = isQ ? r.target_id : aMap[r.target_id]?.question_id;
            const targetTitle = isQ ? qMap[r.target_id] : pqMap[aMap[r.target_id]?.question_id];
            return (
              <div key={r.id} className={`p-4 rounded-xl border ${darkMode ? 'border-[#f0eee2]/10' : 'border-[#907A67]/20'}`}>
                <p className={tCls}>
                  <strong>{isQ ? 'Hilo reportado:' : 'Respuesta reportada:'}</strong>{' '}
                  {targetQid ? (
                    <button onClick={() => onOpenQuestion(targetQid)} className="font-semibold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0">
                      {targetTitle ? `“${targetTitle}”` : 'Ver contenido'}
                    </button>
                  ) : (
                    <span className={`italic ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>contenido eliminado definitivamente</span>
                  )}
                </p>
                {!isQ && aMap[r.target_id] && (
                  <p className={`font-serif text-sm mt-1 line-clamp-2 ${darkMode ? 'text-[#f0eee2]/75' : 'text-[#191114]/75'}`}>
                    “{stripImages(aMap[r.target_id].body).slice(0, 160)}”
                  </p>
                )}
                <p className={tCls}><strong>Motivo:</strong> {r.reason}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`font-sans text-xs ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Reportado por</span>
                  <AuthorLine nickname={r.reporter?.nickname} fullName={r.reporter?.full_name} avatarUrl={r.reporter?.avatar_url} darkMode={darkMode} size="sm" />
                  <span className={`font-sans text-xs ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>· {fmtDate(r.created_at)}</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <button onClick={() => resolveReport(r.id, 'resolved')} className="font-sans text-xs font-bold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0">Resolver</button>
                  <button onClick={() => resolveReport(r.id, 'dismissed')} className={`font-sans text-xs underline cursor-pointer bg-transparent border-none p-0 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Descartar</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isAdmin && (
        <div className={cardCls}>
          <h3 className={hCls}>Sancionar (solo admins)</h3>
          <form onSubmit={sanction} className="flex flex-col md:flex-row gap-3 mb-4">
            <select value={sanUser} onChange={(e) => setSanUser(e.target.value)} className={`${inputCls} flex-grow`} required>
              <option value="">Selecciona usuario…</option>
              {profiles.filter(p => p.role !== 'admin').map(p => (
                <option key={p.id} value={p.id}>{p.nickname} · {p.full_name}</option>
              ))}
            </select>
            <input value={sanReason} onChange={(e) => setSanReason(e.target.value)} placeholder="Motivo de la sanción" maxLength={300} className={`${inputCls} flex-grow`} required />
            <select value={sanDays} onChange={(e) => setSanDays(e.target.value)} className={inputCls}>
              <option value="1">1 día</option>
              <option value="7">7 días</option>
              <option value="30">30 días</option>
              <option value="never">Indefinida</option>
            </select>
            <button type="submit" className="font-sans text-sm font-semibold px-5 py-2.5 rounded-xl text-white bg-red-800/80 hover:bg-red-800 cursor-pointer border-none whitespace-nowrap">
              Sancionar
            </button>
          </form>
          <div className="flex flex-col gap-2">
            {sanctions.map(s => {
              const u = profOf(s.user_id);
              return (
                <div key={s.id} className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="flex items-center gap-3 flex-wrap">
                    <AuthorLine nickname={u?.nickname || '(eliminado)'} fullName={u?.full_name} avatarUrl={u?.avatar_url} darkMode={darkMode} size="sm" />
                    <span className={tCls}>· {s.reason} · hasta {s.until ? fmtDate(s.until) : 'indefinido'}</span>
                  </span>
                  <button onClick={() => lift(s.id)} className="font-sans text-xs font-bold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0">Levantar</button>
                </div>
              );
            })}
            {sanctions.length === 0 && <p className={tCls}>Sin sanciones registradas.</p>}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className={cardCls}>
          <h3 className={hCls}>Roles (solo admins)</h3>
          <p className={`font-sans text-xs mb-4 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
            member publica y responde · moderator oculta, cierra hilos y resuelve reportes · admin suma sanciones y gestiona roles (sin tocar el rol admin) · superadmin lo gestiona todo. Promueve aquí a futuros moderadores (deben haber ingresado una vez).
          </p>
          <div className="flex flex-col gap-2">
            {profiles.map(p => {
              const locked = (!isSuperadmin && (p.role === 'admin' || p.role === 'superadmin')) || (isSuperadmin && p.id === currentUserId);
              return (
                <div key={p.id} className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="flex items-center gap-2 flex-wrap">
                    <AuthorLine nickname={p.nickname || '(sin apodo)'} fullName={p.full_name} avatarUrl={p.avatar_url} darkMode={darkMode} size="sm" />
                    {p.role === 'superadmin' && (
                      <span className="font-sans text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#c08a2e]/20 text-[#c08a2e]">superadmin</span>
                    )}
                  </span>
                  {locked ? (
                    <span className={`font-sans text-xs font-bold px-2.5 py-1.5 rounded-lg ${darkMode ? 'bg-white/5 text-[#aeb8a4]' : 'bg-black/5 text-[#907A67]'}`}>
                      {p.role}{p.id === currentUserId ? ' (tu rol, bloqueado)' : ' (protegido)'}
                    </span>
                  ) : (
                    <select value={p.role} onChange={(e) => changeRole(p.id, e.target.value)} className={inputCls}>
                      <option value="member">member</option>
                      <option value="moderator">moderator</option>
                      {isSuperadmin && <option value="admin">admin</option>}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Papelera ================= */

function PapeleraPanel({ darkMode, isAdmin, onOpenQuestion }) {
  const [qs, setQs] = useState([]);
  const [ans, setAns] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([
      supabase.from('questions')
        .select('id, title, body, deleted_at, author:profiles!questions_author_id_fkey(nickname, full_name, avatar_url), deleter:profiles!questions_deleted_by_fkey(nickname, full_name)')
        .not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
      supabase.from('answers')
        .select('id, body, deleted_at, question_id, author:profiles!answers_author_id_fkey(nickname, full_name, avatar_url), deleter:profiles!answers_deleted_by_fkey(nickname, full_name), question:questions!answers_question_id_fkey(id, title)')
        .not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
    ]).then(([{ data: q, error: qe }, { data: a, error: ae }]) => {
      const firstError = qe || ae;
      setError(firstError ? `No se pudo cargar la papelera: ${firstError.message}. ¿Ejecutaste la migración 04?` : '');
      setQs(q || []); setAns(a || []);
    });
  };
  useEffect(() => { load(); }, []);

  const restore = async (table, id) => {
    const { error } = await supabase.from(table).update({ deleted_at: null, deleted_by: null }).eq('id', id);
    if (error) window.alert(`No se pudo restaurar: ${error.message}`);
    else load();
  };

  const destroy = async (table, id, label) => {
    if (!window.confirm(`¿Eliminar DEFINITIVAMENTE este ${label}? Se pierde la evidencia y no se puede deshacer.`)) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) window.alert(`No se pudo eliminar: ${error.message}`);
    else load();
  };

  const cardCls = `p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-white border-[#907A67]/30'}`;
  const hCls = `font-sans font-bold text-lg mb-1 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`;
  const tCls = `font-sans text-sm ${darkMode ? 'text-[#f0eee2]/85' : 'text-[#191114]/85'}`;
  const subCls = `font-sans text-xs ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`;

  const itemCls = `p-4 rounded-xl border ${darkMode ? 'border-[#f0eee2]/10' : 'border-[#907A67]/20'}`;
  const linkCls = 'font-semibold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0';

  return (
    <div>
      {error && <p className="font-sans text-sm text-center py-4 text-red-500">{error}</p>}
      <div className={cardCls}>
        <h3 className={hCls}>Hilos en papelera ({qs.length})</h3>
        <p className={`${subCls} mb-4`}>Solo visible para el equipo. Sirve como evidencia para sanciones: restaurar devuelve el contenido, eliminar lo borra para siempre (solo admins).</p>
        {qs.length === 0 && <p className={tCls}>Papelera vacía.</p>}
        <div className="flex flex-col gap-3">
          {qs.map((q) => (
            <div key={q.id} className={itemCls}>
              <p className={tCls}><strong>“{q.title}”</strong></p>
              <p className={`font-serif text-sm mt-1 line-clamp-2 ${darkMode ? 'text-[#f0eee2]/70' : 'text-[#191114]/70'}`}>{stripImages(q.body).slice(0, 160)}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <AuthorLine nickname={q.author?.nickname} fullName={q.author?.full_name} avatarUrl={q.author?.avatar_url} darkMode={darkMode} size="sm" />
                <span className={subCls}>· eliminado por {q.deleter?.nickname || '?'} · {fmtDate(q.deleted_at)}</span>
              </div>
              <div className="flex gap-4 mt-2">
                <button onClick={() => onOpenQuestion(q.id)} className={`font-sans text-xs underline cursor-pointer bg-transparent border-none p-0 ${subCls}`}>Ver</button>
                <button onClick={() => restore('questions', q.id)} className="font-sans text-xs font-bold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0">Restaurar</button>
                {isAdmin && (
                  <button onClick={() => destroy('questions', q.id, 'hilo')} className="font-sans text-xs font-bold text-red-500 underline cursor-pointer bg-transparent border-none p-0">Eliminar definitivamente</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardCls}>
        <h3 className={hCls}>Respuestas en papelera ({ans.length})</h3>
        {ans.length === 0 && <p className={tCls}>Papelera vacía.</p>}
        <div className="flex flex-col gap-3">
          {ans.map((a) => (
            <div key={a.id} className={itemCls}>
              <p className={`font-serif text-sm line-clamp-2 ${darkMode ? 'text-[#f0eee2]/75' : 'text-[#191114]/75'}`}>“{stripImages(a.body).slice(0, 160)}”</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <AuthorLine nickname={a.author?.nickname} fullName={a.author?.full_name} avatarUrl={a.author?.avatar_url} darkMode={darkMode} size="sm" />
                <span className={subCls}>· en <button onClick={() => onOpenQuestion(a.question_id)} className={linkCls}>{a.question ? `“${a.question.title}”` : 'ver hilo'}</button> · eliminado por {a.deleter?.nickname || '?'} · {fmtDate(a.deleted_at)}</span>
              </div>
              <div className="flex gap-4 mt-2">
                <button onClick={() => restore('answers', a.id)} className="font-sans text-xs font-bold text-[#3B908D] underline cursor-pointer bg-transparent border-none p-0">Restaurar</button>
                {isAdmin && (
                  <button onClick={() => destroy('answers', a.id, 'respuesta')} className="font-sans text-xs font-bold text-red-500 underline cursor-pointer bg-transparent border-none p-0">Eliminar definitivamente</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
