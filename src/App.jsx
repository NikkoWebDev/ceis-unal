import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { Send, MapPin, Sparkles, ArrowLeft, ArrowDown, Info, Moon, Sun, Eye, EyeOff, ExternalLink, Layers, GraduationCap, Lightbulb, Users, AlertTriangle, MessageSquare } from 'lucide-react';
import ForoSection, { ForoAuthButton } from './foro/Foro';

/* ================= HOOKS ================= */

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

function useScrollAnimation(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, visible]);
  return [ref, visible];
}

function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * speed);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);
  return offset;
}

function useHeroRotation() {
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = 600;
      const progress = Math.min(scrollY / heroHeight, 1);
      setRotation(progress * 12);
      setOpacity(1 - progress * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return { rotation, opacity };
}

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = 80;
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
}

/* ================= COMPONENTE PRINCIPAL ================= */

export default function CEISLandingPage() {
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('ceis-view');
      return saved === 'malla' || saved === 'foro' ? saved : 'home';
    } catch {
      return 'home';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ceis-view', currentView);
    } catch {
      /* almacenamiento no disponible: la vista no se conserva */
    }
  }, [currentView]);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('ceis-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ceis-theme', darkMode ? 'dark' : 'light');
    } catch {
      /* almacenamiento no disponible: se usa el tema por defecto */
    }
  }, [darkMode]);
  const scrollProgress = useScrollProgress();

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault();
    smoothScrollTo(id);
  }, []);

  return (
    <div className={`min-h-screen font-serif antialiased flex flex-col justify-between transition-colors duration-300 ${
      darkMode ? 'bg-[#0d160f] text-[#f0eee2] selection:bg-[#c08a2e] selection:text-[#0d160f]' : 'bg-[#F6EEE8] text-[#191114] selection:bg-[#82B475] selection:text-[#191114]'
    }`}>
      {/* ---------- HEADER FIJO ---------- */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode ? 'bg-[#0d160f]/90 border-[#f0eee2]/15' : 'bg-[#F6EEE8]/90 border-[#907A67]/20'
      }`}>
        <div className="max-w-[1120px] mx-auto px-7 py-4 flex items-center justify-between">
          <button
            onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex items-center gap-3 font-bold text-[17px] font-sans text-left bg-transparent border-none cursor-pointer p-0 transition-colors ${
              darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'
            }`}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#907A67]/40 shadow-sm">
              <img src="/logo.jpg" alt="Logo CEIS" className="w-full h-full object-cover" loading="eager" />
            </div>
            <span className="flex flex-col leading-tight">
              <span className="text-base tracking-wide font-sans">CEIS</span>
              <span className={`text-[11px] font-serif italic font-normal ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Ing. de Sistemas · UNAL</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7 font-sans text-sm font-medium">
            <button
              onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`transition-colors font-medium bg-transparent border-none cursor-pointer text-sm ${
                currentView === 'home'
                  ? (darkMode ? 'text-[#c08a2e] font-bold underline' : 'text-[#3B908D] font-bold underline')
                  : (darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]')
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => { setCurrentView('malla'); window.scrollTo({ top: 0 }); }}
              className={`transition-colors font-medium bg-transparent border-none cursor-pointer text-sm ${
                currentView === 'malla'
                  ? (darkMode ? 'text-[#c08a2e] font-bold underline' : 'text-[#3B908D] font-bold underline')
                  : (darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]')
              }`}
            >
              Malla Interactiva
            </button>
            <button
              onClick={() => { setCurrentView('foro'); window.scrollTo({ top: 0 }); }}
              className={`transition-colors font-medium bg-transparent border-none cursor-pointer text-sm ${
                currentView === 'foro'
                  ? (darkMode ? 'text-[#c08a2e] font-bold underline' : 'text-[#3B908D] font-bold underline')
                  : (darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]')
              }`}
            >
              Foro
            </button>
            <a href="#contacto" onClick={(e) => handleNavClick(e, 'contacto')} className={`transition-colors ${darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]'}`}>Contacto</a>
          </nav>

          <div className="flex items-center gap-4">
            <ForoAuthButton />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-300 ${
                darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2] hover:bg-[#1c2c1f]' : 'bg-[#E6E2D0] border-[#907A67]/30 text-[#191114] hover:bg-[#907A67]/20'
              }`}
              aria-label="Cambiar modo oscuro"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
        {/* Scroll Progress Bar */}
        <div className={`h-[3px] ${darkMode ? 'bg-[#152218]' : 'bg-[#E6E2D0]'}`}>
          <div
            className="scroll-progress-bar h-full bg-gradient-to-r from-[#3B908D] to-[#82B475]"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* ---------- CONTENIDO DINÁMICO ---------- */}
      <main className="flex-grow">
        {currentView === 'home' ? (
          <>
            <HeroSection
              onVerMalla={() => { setCurrentView('malla'); window.scrollTo({ top: 0 }); }}
              onVerForo={() => { setCurrentView('foro'); window.scrollTo({ top: 0 }); }}
            />
            <QuienesSomosSection darkMode={darkMode} />
            <ObjetivoSection darkMode={darkMode} />
            <PilaresSection darkMode={darkMode} />
          </>
        ) : currentView === 'malla' ? (
          <div className="py-12 w-full animate-fadeIn">
            <div className="max-w-[1400px] mx-auto px-7">
              <button
                onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`inline-flex items-center gap-2 text-sm font-sans fontnpm run build-semibold mb-8 bg-transparent border-none cursor-pointer p-0 transition-colors ${
                  darkMode ? 'text-[#82B475] hover:underline' : 'text-[#3B908D] hover:underline'
                }`}
              >
                <ArrowLeft size={16} /> Volver al inicio
              </button>
              <div className={`border p-6 md:p-10 rounded-3xl shadow-sm transition-colors duration-300 ${
                darkMode ? 'bg-[#152218] border-[#f0eee2]/15 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
              }`}>
                <div className={`flex flex-col md:flex-row justify-between items-center mb-10 border-b pb-6 gap-6 ${darkMode ? 'border-[#f0eee2]/15' : 'border-[#907A67]/20'}`}>
                  <div className="flex items-center gap-4">
                    <img src="/unal-logo.png" alt="Logo UNAL" className="h-16 w-auto object-contain" loading="lazy" />
                  </div>
                  <div className="text-center">
                    <h2 className={`font-sans text-2xl md:text-3xl font-bold ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Malla Curricular Interactiva</h2>
                    <p className={`font-serif mt-1 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Ingeniería de Sistemas y Computación - Sede Bogotá</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/logo.jpg" alt="Logo CEIS" className="h-14 w-14 rounded-full border border-[#907A67]/30 shadow-sm" loading="lazy" />
                  </div>
                </div>
                <MallaInteractiva darkMode={darkMode} />
              </div>
            </div>
          </div>
        ) : (
          <ForoSection darkMode={darkMode} />
        )}

        <ContactoSection />
      </main>
    </div>
  );
}

/* ================= SECCIÓN HERO ================= */

function HeroSection({ onVerMalla, onVerForo }) {
  const parallaxOffset = useParallax(0.25);
  const { rotation, opacity } = useHeroRotation();
  const [titleRef, titleVisible] = useScrollAnimation(0.1);
  const [subtitleRef, subtitleVisible] = useScrollAnimation(0.1);

  return (
    <section className="bg-gradient-to-br from-[#18514A] via-[#282F3A] to-[#191114] text-[#F6EEE8] pt-28 pb-20 relative overflow-hidden" id="inicio">
      {/* Parallax dot pattern */}
      <div
        className="absolute inset-0 opacity-10 hero-dot-pattern"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />
      <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center relative z-10">
        <div ref={titleRef} className={`animate-in-fade-up${titleVisible ? ' is-visible' : ''}`}>
          <span className="inline-flex items-center gap-2 font-sans text-[13px] text-[#82B475] border border-[#82B475]/30 rounded-full px-4 py-1.5 mb-6 bg-[#82B475]/10">
            <Sparkles size={14} /> Facultad de Ingeniería, Universidad Nacional de Colombia
          </span>
          <h1 className="font-sans text-4xl md:text-6xl font-bold tracking-tight text-[#F6EEE8] leading-tight">
            Consejo Estudiantil de Ingeniería de Sistemas
          </h1>
          <p className="font-serif text-lg text-[#F6EEE8]/80 mt-5 max-w-[48ch] leading-relaxed">
            Un espacio de construcción estudiantil — de estudiantes, por y para estudiantes — donde tejemos representación, soluciones y apoyo mutuo en Ingeniería de Sistemas.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 font-sans">
            <button
              onClick={onVerMalla}
              className="btn-magnetic inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl text-white bg-gradient-to-r from-[#3B908D] to-[#82B475] shadow-lg shadow-[#3B908D]/20 cursor-pointer border-none"
            >
              Ver Malla Curricular <GraduationCap size={16} />
            </button>
            <button
              onClick={onVerForo}
              className="btn-magnetic inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl border border-[#F6EEE8]/25 text-[#F6EEE8] hover:bg-[#F6EEE8]/10 transition-colors cursor-pointer"
            >
              Entrar al foro <MessageSquare size={16} />
            </button>
          </div>
        </div>

        <div
          ref={subtitleRef}
          className={`flex justify-center animate-in-scale${subtitleVisible ? ' is-visible' : ''}`}
          style={{ opacity }}
        >
          <div
            className="w-72 h-72 md:w-80 md:h-80 rounded-3xl p-3 bg-gradient-to-tr from-[#3B908D] to-[#82B475] shadow-2xl animate-pulse-glow"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="w-full h-full bg-[#191114] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 border border-[#F6EEE8]/10 shadow-inner">
              <img src="/logo.jpg" alt="Logo CEIS Completo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= SECCIÓN QUIÉNES SOMOS ================= */

function QuienesSomosSection({ darkMode }) {
  const [textRef, textVisible] = useScrollAnimation(0.15);
  const [quoteRef, quoteVisible] = useScrollAnimation(0.15);

  return (
    <section id="quienes-somos" className={`py-20 border-b transition-colors duration-300 ${darkMode ? 'border-[#f0eee2]/10' : 'border-[#907A67]/20'}`}>
      <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div ref={textRef} className={`animate-in-fade-left${textVisible ? ' is-visible' : ''}`}>
          <p className={`font-sans text-[13.5px] font-semibold mb-3 tracking-wide uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>Quiénes somos</p>
          <h2 className={`font-sans text-3xl font-bold tracking-tight mb-5 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Un espacio de construcción estudiantil</h2>
          <p className={`text-[17px] leading-relaxed mb-4 ${darkMode ? 'text-[#f0eee2]/80' : 'text-[#191114]/80'}`}>
            El CEIS es el espacio de construcción estudiantil del programa de Ingeniería de Sistemas y Computación de la Universidad Nacional de Colombia, sede Bogotá: una organización de estudiantes, por y para estudiantes.
          </p>
          <p className={`text-[17px] leading-relaxed ${darkMode ? 'text-[#f0eee2]/80' : 'text-[#191114]/80'}`}>
            Frente a las problemáticas y necesidades de la vida universitaria, nos organizamos y colaboramos activamente como comunidad para visibilizar los retos, proponer soluciones y articular los esfuerzos del estudiantado.
          </p>
        </div>
        <div ref={quoteRef} className={`${quoteVisible ? 'is-visible ' : ''}animate-in-fade-right p-8 rounded-2xl border shadow-sm relative transition-colors duration-300 ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-[#E6E2D0]/50 border-[#907A67]/20'}`}>
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#3B908D] flex items-center justify-center text-white font-bold">"</div>
          <p className={`font-serif italic text-lg leading-relaxed ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>
            Las soluciones a nuestros retos académicos y de bienestar surgen cuando nos organizamos y colaboramos activamente como comunidad.
          </p>
          <span className={`block mt-4 font-sans text-xs font-semibold tracking-wider uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>— Principio del Consejo</span>
        </div>
      </div>
    </section>
  );
}

/* ================= SECCIÓN OBJETIVO ================= */

function ObjetivoSection({ darkMode }) {
  const [ref, visible] = useScrollAnimation(0.15);

  return (
    <section id="objetivo" className={`py-20 border-b transition-colors duration-300 ${darkMode ? 'bg-[#152218]/40 border-[#f0eee2]/10' : 'bg-[#E6E2D0]/30 border-[#907A67]/25'}`}>
      <div className="max-w-[1120px] mx-auto px-7 text-center">
        <p className={`font-sans text-[13.5px] font-semibold mb-3 tracking-wide uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>Nuestra Brújula</p>
        <h2 className={`font-sans text-3xl md:text-4xl font-bold tracking-tight mb-8 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Objetivo Principal</h2>
        <div ref={ref} className={`${visible ? 'is-visible ' : ''}animate-in-scale max-w-3xl mx-auto p-8 md:p-12 rounded-2xl shadow-md relative border transition-colors duration-300 ${
          darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-[#F6EEE8] border-[#907A67]/30 text-[#191114]'
        }`}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-[#3B908D] to-[#82B475] flex items-center justify-center text-white shadow-md">
            <TargetIcon />
          </div>
          <p className="text-xl md:text-2xl font-serif leading-relaxed mt-2">
            "Proponer y ejecutar soluciones para atender las necesidades de los estudiantes de Ingeniería de Sistemas — y, cuando sea posible, apoyar a otras disciplinas — articulando esfuerzos con iniciativas estudiantiles, estamentos y la universidad."
          </p>
          <span className={`block mt-4 font-sans text-xs font-semibold tracking-wider uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>— Objetivo del Consejo</span>
        </div>
      </div>
    </section>
  );
}

/* ================= SECCIÓN QUÉ HACEMOS ================= */

function PilaresSection({ darkMode }) {
  const [headerRef, headerVisible] = useScrollAnimation(0.15);
  const pilares = [
    {
      icon: <Eye size={22} />,
      title: 'Visibilizar',
      text: 'Visibilizamos las problemáticas académicas, personales y de bienestar que surgen durante la carrera, para que ninguna voz se quede sin escuchar.',
    },
    {
      icon: <Lightbulb size={22} />,
      title: 'Proponer soluciones',
      text: 'Convertimos las necesidades en propuestas y acciones concretas: apoyo mutuo, iniciativas y soluciones construidas activamente en comunidad.',
    },
    {
      icon: <Users size={22} />,
      title: 'Articular esfuerzos',
      text: 'Articulamos esfuerzos con iniciativas estudiantiles, estamentos y la universidad para que las soluciones lleguen más lejos.',
    },
  ];

  return (
    <section id="que-hacemos" className={`py-20 border-b transition-colors duration-300 ${darkMode ? 'border-[#f0eee2]/10' : 'border-[#907A67]/20'}`}>
      <div className="max-w-[1120px] mx-auto px-7">
        <div ref={headerRef} className={`animate-in-fade-up text-center mb-16 md:mb-20${headerVisible ? ' is-visible' : ''}`}>
          <p className={`font-sans text-[13.5px] font-semibold mb-4 tracking-wide uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>Qué hacemos</p>
          <h2 className={`font-sans text-3xl md:text-4xl font-bold tracking-tight leading-snug max-w-[22ch] mx-auto ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Un espacio creado por y para estudiantes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pilares.map((pilar, i) => (
            <PilarCard key={pilar.title} {...pilar} index={i} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PilarCard({ icon, title, text, index, darkMode }) {
  const [ref, visible] = useScrollAnimation(0.15);
  return (
    <div
      ref={ref}
      className={`${visible ? 'is-visible ' : ''}animate-in-fade-up stagger-${index + 1} p-7 rounded-2xl border shadow-sm transition-colors duration-300 ${
        darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-[#E6E2D0]/50 border-[#907A67]/20'
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B908D] to-[#82B475] flex items-center justify-center text-white shadow-md mb-5">
        {icon}
      </div>
      <h3 className={`font-sans text-xl font-bold mb-3 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>{title}</h3>
      <p className={`text-[15.5px] leading-relaxed ${darkMode ? 'text-[#f0eee2]/75' : 'text-[#191114]/75'}`}>{text}</p>
    </div>
  );
}

/* ================= SECCIÓN CONTACTO ================= */

function ContactoSection() {
  const cards = [
    { icon: <Send size={20} />, label: 'Correo institucional', value: 'ceisunal@gmail.com', href: 'mailto:ceisunal@gmail.com', external: false },
    { icon: <InstagramIcon />, label: 'Instagram Oficial', value: '@ceis_unal', href: 'https://www.instagram.com/ceis_unal?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==', external: true },
    { icon: <WhatsAppIcon />, label: 'Comunidad WhatsApp', value: 'Unirme al grupo', href: 'https://chat.whatsapp.com/CoKtYbkvYjgLfLmVsHV1f8', external: true },
    { icon: <MapPin size={20} />, label: 'Ubicación (Sede Bogotá)', value: 'Edificio 453, oficina 228', href: 'https://maps.app.goo.gl/ouzzPmtctqLzsjXm9', external: true },
  ];

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-[#18514A] via-[#282F3A] to-[#191114] text-[#F6EEE8]">
      <div className="max-w-[1120px] mx-auto px-7">
        <SectionHeader label="Conéctate" title="Canales de Comunicación" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-sm">
          {cards.map((card, i) => (
            <ContactCard key={i} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ label, title }) {
  const [ref, visible] = useScrollAnimation(0.15);
  return (
    <div ref={ref} className={`animate-in-fade-up mb-10${visible ? ' is-visible' : ''}`}>
      <p className="font-sans text-[13.5px] text-[#82B475] font-semibold mb-3 tracking-wide uppercase">{label}</p>
      <h2 className="font-sans text-3xl font-bold">{title}</h2>
    </div>
  );
}

function ContactCard({ icon, label, value, href, external, index }) {
  const [ref, visible] = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={`${visible ? 'is-visible ' : ''}animate-in-fade-up stagger-${index + 1} contact-card-hover flex items-center gap-4 bg-[#191114]/50 p-5 rounded-xl border border-[#907A67]/20`}
    >
      <div className="w-12 h-12 rounded-lg bg-[#3B908D]/20 border border-[#3B908D]/40 flex items-center justify-center text-[#82B475] shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-xs text-[#907A67] block mb-1">{label}</span>
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-base text-[#F6EEE8] hover:text-[#82B475] hover:underline transition-colors"
        >
          {value}
        </a>
      </div>
    </div>
  );
}

/* ================= COMPONENTE: MALLA CURRICULAR ================= */

const MALLA_DATA = [
  {
    semester: 1,
    courses: [
      { id: '1000004', code: '1000004', name: 'Cálculo Diferencial', credits: 4, prereqs: ['NIV-MAT'] },
      { id: '2025975', code: '2025975', name: 'Introducción a la ingeniería de sistemas y computación', credits: 3, prereqs: [] },
      { id: '2015734', code: '2015734', name: 'Programación de Computadores', credits: 3, prereqs: [] },
      { id: '2016703', code: '2016703', name: 'Pensamiento Sistémico', credits: 3, prereqs: [] },
      { id: 'LIB-01', code: 'LIB', name: 'Libre Elección', credits: 2, prereqs: [] },
    ]
  },
  {
    semester: 2,
    courses: [
      { id: '1000019', code: '1000019', name: 'Fundamentos de Mecánica', credits: 4, prereqs: ['1000004'] },
      { id: '1000005', code: '1000005', name: 'Cálculo Integral', credits: 4, prereqs: ['1000004'] },
      { id: '1000003', code: '1000003', name: 'Álgebra Lineal', credits: 4, prereqs: ['1000004'] },
      { id: '2016375', code: '2016375', name: 'Programación Orientada a Objetos', credits: 3, prereqs: ['2015734'] },
    ]
  },
  {
    semester: 3,
    courses: [
      { id: '1000017', code: '1000017', name: 'Fundamentos de Electricidad y Magnetismo', credits: 4, prereqs: ['1000005','1000019'] },
      { id: '1000006', code: '1000006', name: 'Cálculo en Varias Variables', credits: 4, prereqs: ['1000005'] },
      { id: '2025963', code: '2025963', name: 'Matemáticas Discretas I', credits: 4, prereqs: ['1000003'] },
      { id: '2016353', code: '2016353', name: 'Bases de Datos', credits: 3, prereqs: ['2016375'] },
      { id: '2016698', code: '2016698', name: 'Elementos de Computadores', credits: 3, prereqs: ['2025975'] },
    ]
  },
  {
    semester: 4,
    courses: [
      { id: '1000013', code: '1000013', name: 'Probabilidad y Estadística Fundamental', credits: 3, prereqs: ['1000005'] },
      { id: '2015703', code: '2015703', name: 'Ingeniería Económica', credits: 3, prereqs: ['1000005'] },
      { id: '2025964', code: '2025964', name: 'Matemáticas Discretas II', credits: 4, prereqs: ['2025963'] },
      { id: '2016699', code: '2016699', name: 'Estructuras de datos', credits: 3, prereqs: ['2016375'] },
      { id: '2016697', code: '2016697', name: 'Arquitectura de Computadores', credits: 3, prereqs: ['2016698'] },
    ]
  },
  {
    semester: 5,
    courses: [
      { id: '2025970', code: '2025970', name: 'Modelos y simulación', credits: 3, prereqs: ['1000013','2016375','1000006','2025964'] },
      { id: '2015702', code: '2015702', name: 'Gerencia y Gestión de Proyectos', credits: 3, prereqs: ['2015703'] },
      { id: '2025967', code: '2025967', name: 'Redes de computadores', credits: 3, prereqs: ['1000017','2016699','2016697'] },
      { id: '2016701', code: '2016701', name: 'Ingeniería de Software I', credits: 3, prereqs: ['2016699','2016703','2016353'] },
      { id: '2015174', code: '2015174', name: 'Introducción a la Teoría de la Computación', credits: 4, prereqs: ['2025963'] },
    ]
  },
  {
    semester: 6,
    courses: [
      { id: '2025971', code: '2025971', name: 'Optimización', credits: 3, prereqs: ['2025970'] },
      { id: '2025982', code: '2025982', name: 'Sistemas de Información', credits: 3, prereqs: ['2015702','2016703','2016353'] },
      { id: '2015970', code: '2015970', name: 'Métodos Numéricos', credits: 3, prereqs: ['1000006'] },
      { id: '2016702', code: '2016702', name: 'Ingeniería de Software II', credits: 3, prereqs: ['2016701','2025967'] },
      { id: '2016696', code: '2016696', name: 'Algoritmos', credits: 3, prereqs: ['1000013','2025964','2016699'] },
      { id: '2016707', code: '2016707', name: 'Sistemas Operativos', credits: 3, prereqs: ['2016697'] },
    ]
  },
  {
    semester: 7,
    courses: [
      { id: '2025969', code: '2025969', name: 'Modelos Estocásticos y Simulación en Computación y Comunicaciones', credits: 3, prereqs: ['2025971'] },
      { id: '2025983', code: '2025983', name: 'Arquitectura de Infraestructura y Gobierno de TICs', credits: 3, prereqs: ['2025982','2016702'] },
      { id: '2025994', code: '2015994', name: 'Teoría de la Información y Sistemas de Comunicaciones', credits: 3, prereqs: ['1000013','2025967'] },
      { id: '2016716', code: '2016716', name: 'Arquitectura de Software', credits: 3, prereqs: ['2016702'] },
      { id: '2025995', code: '2025995', name: 'Introducción a los Sistemas Inteligentes', credits: 3, prereqs: ['2016696'] },
      { id: '2025966', code: '2025966', name: 'Lenguajes de Programación', credits: 3, prereqs: ['2015174','2016699'] },
    ]
  },
  {
    semester: 8,
    courses: [
      { id: '2024045', code: '2024045', name: 'Taller de Proyectos Interdisciplinarios (Req: 40 créditos disciplinares)', credits: 3, prereqs: [] },
      { id: '2016722', code: '2016722', name: 'Computación Paralela y Distribuida', credits: 3, prereqs: ['2016696'] },
      { id: '2025972', code: '2025972', name: 'Introducción a la Criptografía y a la Seguridad de la Información', credits: 3, prereqs: ['2016696'] },
      { id: '2025960', code: '2025960', name: 'Computación Visual', credits: 3, prereqs: ['2016696'] },
      { id: 'LIB-02', code: 'LIB', name: 'Libre Elección', credits: 3, prereqs: [] },
    ]
  },
  {
    semester: 9,
    courses: [
      { id: 'LIB-03', code: 'LIB', name: 'Libre Elección', credits: 4, prereqs: [] },
      { id: 'LIB-04', code: 'LIB', name: 'Libre Elección', credits: 4, prereqs: [] },
      { id: 'LIB-05', code: 'LIB', name: 'Libre Elección', credits: 4, prereqs: [] },
      { id: 'LIB-06', code: 'LIB', name: 'Libre Elección', credits: 4, prereqs: [] },
    ]
  },
  {
    semester: 10,
    courses: [
      { id: 'LIB-07', code: 'LIB', name: 'Libre Elección', credits: 4, prereqs: [] },
      { id: 'LIB-08', code: 'LIB', name: 'Libre Elección', credits: 4, prereqs: [] },
      { id: 'LIB-09', code: 'LIB', name: 'Libre Elección', credits: 4, prereqs: [] },
      { id: 'TRAB-GRADO', code: 'GRADO', name: 'Trabajo de Grado (Req: 60 créditos disciplinares)', credits: 6, prereqs: [] },
    ]
  }
];

/* ============ NIVELACIÓN (20 CR, no cuentan en los 165 del plan) ============
   4 CR Matemáticas Básicas (prerrequisito de Cálculo Diferencial) ·
   12 CR Inglés (4 niveles de 3 CR, en cadena) ·
   4 CR Lectoescritura (pocos la cursan; la mayoría la valida).
   Se muestran en la columna "Nivelación" (semestre 0). Ocúltalas si ya las validaste. */
const NIVELACION_COURSES = [
  { id: 'NIV-MAT', code: 'NIV', name: 'Matemáticas Básicas', credits: 4, prereqs: [] },
  { id: 'NIV-ING1', code: 'NIV', name: 'Inglés I', credits: 3, prereqs: [] },
  { id: 'NIV-ING2', code: 'NIV', name: 'Inglés II', credits: 3, prereqs: ['NIV-ING1'] },
  { id: 'NIV-ING3', code: 'NIV', name: 'Inglés III', credits: 3, prereqs: ['NIV-ING2'] },
  { id: 'NIV-ING4', code: 'NIV', name: 'Inglés IV', credits: 3, prereqs: ['NIV-ING3'] },
  { id: 'NIV-LEC', code: 'NIV', name: 'Lectoescritura', credits: 4, prereqs: [] },
];

/* ============ RESOLUCIÓN BASE DE LA MALLA ============ */
const RESOLUCION_URL = 'https://legal.unal.edu.co/rlunal/home/doc.jsp?d_i=106142';

/* ============ TIPOLOGÍA POR ASIGNATURA (Acuerdo 11 de 2023, Acta 36 del 7 de diciembre,
   Consejo de la Facultad de Ingeniería, Sede Bogotá) ============
   comp: B = Fundamentación · C = Formación disciplinar o profesional · L = Libre elección · T = Trabajo de grado
   tipo: OB = columna OBLIGATORIA "SI" · OP = columna OBLIGATORIA "NO" (optativa con opciones por subagrupación)
   sub/subCred: subagrupación a la que pertenece y créditos exigidos en ella */
const TIPOLOGIA = {
  '1000004': { comp: 'B', agrup: 'Matemáticas', sub: 'Cálculo Diferencial', subCred: 4, tipo: 'OP' },
  '2025975': { comp: 'C', agrup: 'Contexto Profesional e Interdisciplinario', tipo: 'OB' },
  '2015734': { comp: 'C', agrup: 'Métodos y Tecnologías de Software', sub: 'Programación de Computadores', subCred: 3, tipo: 'OP' },
  '2016703': { comp: 'C', agrup: 'Modelos, Sistemas, Optimización y Simulación', tipo: 'OB' },
  '1000019': { comp: 'B', agrup: 'Física', tipo: 'OB' },
  '1000005': { comp: 'B', agrup: 'Matemáticas', sub: 'Cálculo Integral', subCred: 4, tipo: 'OP' },
  '1000003': { comp: 'B', agrup: 'Matemáticas', sub: 'Álgebra Lineal', subCred: 4, tipo: 'OP' },
  '2016375': { comp: 'C', agrup: 'Métodos y Tecnologías de Software', tipo: 'OB' },
  '1000017': { comp: 'B', agrup: 'Física', tipo: 'OB' },
  '1000006': { comp: 'B', agrup: 'Matemáticas', sub: 'Cálculo en Varias Variables', subCred: 4, tipo: 'OP' },
  '2025963': { comp: 'B', agrup: 'Ciencias de la Computación', sub: 'Matemáticas Discretas I', subCred: 4, tipo: 'OP' },
  '2016353': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', sub: 'Bases de Datos', subCred: 3, tipo: 'OP' },
  '2016698': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', sub: 'Elementos de Computadores', subCred: 3, tipo: 'OP' },
  '1000013': { comp: 'B', agrup: 'Probabilidad y Estadística', tipo: 'OP' },
  '2015703': { comp: 'B', agrup: 'Ciencias Económicas y Administrativas', sub: 'Ingeniería Económica', subCred: 3, tipo: 'OP' },
  '2025964': { comp: 'B', agrup: 'Ciencias de la Computación', sub: 'Matemáticas Discretas II', subCred: 4, tipo: 'OP' },
  '2016699': { comp: 'C', agrup: 'Métodos y Tecnologías de Software', tipo: 'OB' },
  '2016697': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', tipo: 'OB' },
  '2025970': { comp: 'C', agrup: 'Modelos, Sistemas, Optimización y Simulación', sub: 'Modelos y Sistemas', subCred: 3, tipo: 'OP' },
  '2015702': { comp: 'B', agrup: 'Ciencias Económicas y Administrativas', sub: 'Gerencia y Gestión de Proyectos', subCred: 3, tipo: 'OP' },
  '2025967': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', tipo: 'OB' },
  '2016701': { comp: 'C', agrup: 'Métodos y Tecnologías de Software', tipo: 'OB' },
  '2015174': { comp: 'B', agrup: 'Ciencias de la Computación', tipo: 'OB' },
  '2025971': { comp: 'C', agrup: 'Modelos, Sistemas, Optimización y Simulación', sub: 'Optimización', subCred: 3, tipo: 'OP' },
  '2025982': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', sub: 'Sistemas de Información', subCred: 3, tipo: 'OP' },
  '2015970': { comp: 'B', agrup: 'Ciencias de la Computación', sub: 'Métodos Numéricos', subCred: 3, tipo: 'OP' },
  '2016702': { comp: 'C', agrup: 'Métodos y Tecnologías de Software', tipo: 'OB' },
  '2016696': { comp: 'B', agrup: 'Ciencias de la Computación', tipo: 'OB' },
  '2016707': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', tipo: 'OB' },
  '2025969': { comp: 'C', agrup: 'Modelos, Sistemas, Optimización y Simulación', tipo: 'OB' },
  '2025983': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', tipo: 'OB' },
  '2025994': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', sub: 'Información y Comunicaciones', subCred: 3, tipo: 'OP' },
  '2016716': { comp: 'C', agrup: 'Métodos y Tecnologías de Software', tipo: 'OB' },
  '2025995': { comp: 'C', agrup: 'Sistemas Inteligentes', tipo: 'OP' },
  '2025966': { comp: 'C', agrup: 'Métodos y Tecnologías de Software', sub: 'Lenguajes', subCred: 3, tipo: 'OP' },
  '2024045': { comp: 'C', agrup: 'Contexto Profesional e Interdisciplinario', sub: 'Taller Interdisciplinario de Proyectos de Creación y Gestión', subCred: 3, tipo: 'OP' },
  '2016722': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', tipo: 'OB' },
  '2025972': { comp: 'C', agrup: 'Infraestructura Computacional, de Comunicaciones y de Información', sub: 'Criptografía y Seguridad de la Información', subCred: 3, tipo: 'OP' },
  '2025960': { comp: 'C', agrup: 'Computación Aplicada', tipo: 'OP' },
};

const COMP_META = {
  B: { label: 'Fundamentación', color: '#5B8DB8' },
  C: { label: 'Formación profesional', color: '#3B908D' },
  L: { label: 'Libre elección', color: '#907A67' },
  T: { label: 'Trabajo de grado', color: '#c08a2e' },
  N: { label: 'Nivelación', color: '#9a9a9a' },
};

const TIPO_META = {
  OB: { label: 'Obligatoria' },
  OP: { label: 'Optativa' },
  L: { label: 'Libre elección' },
  TG: { label: 'Trabajo de grado' },
  NIV: { label: 'Nivelación' },
};

function getTipologia(course) {
  if (!course) return { comp: 'C', agrup: 'Plan de estudios', tipo: 'OB' };
  if (course.id === 'TRAB-GRADO') return { comp: 'T', agrup: 'Trabajo de grado', tipo: 'TG' };
  if (String(course.id || '').startsWith('NIV-')) return { comp: 'N', agrup: 'Nivelación (no cuenta en 165)', tipo: 'NIV' };
  if (course.custom || course.code === 'LIB' || course.id.startsWith('LIB') || course.code === 'ELEC') return { comp: 'L', agrup: 'Libre elección', tipo: 'L' };
  return TIPOLOGIA[course.id] || { comp: 'C', agrup: 'Plan de estudios', tipo: 'OB' };
}

/* ============ PLANIFICADOR: layout personalizado por semestre ============ */
function buildPlanSemesters(layout, extraCourses = [], hiddenIds = null) {
  const hidden = hiddenIds instanceof Set ? hiddenIds : new Set(Array.isArray(hiddenIds) ? hiddenIds : []);
  const cols = new Map();
  const all = [];
  NIVELACION_COURSES.forEach(c => {
    if (!hidden.has(c.id)) all.push({ course: c, home: 0 });
  });
  MALLA_DATA.forEach(sem => sem.courses.forEach(c => {
    if (!hidden.has(c.id)) all.push({ course: c, home: sem.semester });
  }));
  (extraCourses || []).forEach(c => {
    if (c && c.id && !hidden.has(c.id)) all.push({ course: c, home: 9 });
  });
  all.forEach(({ course, home }) => {
    const raw = layout[course.id];
    const target = Number.isInteger(raw) ? Math.min(Math.max(raw, 0), 20) : home;
    if (!cols.has(target)) cols.set(target, []);
    cols.get(target).push(course);
  });
  const max = Math.max(10, ...cols.keys());
  const out = [];
  for (let n = 0; n <= max; n++) {
    if (n === 0 && (cols.get(0) || []).length === 0) continue;
    out.push({ semester: n, courses: cols.get(n) || [] });
  }
  return out.filter(s => s.semester <= 10 || s.courses.length > 0);
}

function buildSemMap(semesters) {
  const m = {};
  semesters.forEach(sem => sem.courses.forEach(c => { m[c.id] = sem.semester; }));
  return m;
}

/* ============ LÍMITES ACUERDO 11 (Acuerdo 003A de 2022, Consejo Académico) ============
   165 créditos totales: Fundamentación 51 (15 OB + 36 OP) ·
   Disciplinar/Profesional 81 (39 OB + 42 OP, incluye Trabajo de Grado como OB) ·
   Libre Elección 33 (20 % del plan). */
const LIMITES_ACUERDO = {
  B: { total: 51, OB: 15, OP: 36 },
  C: { total: 81, OB: 39, OP: 42 },
  L: { total: 33 },
  TOTAL: 165,
};

// Clasificación para conteo de límites: las ELEC propias y LIB cuentan como L;
// Trabajo de Grado cuenta para el total disciplinar (81) pero no para los
// subtopes OB 39 / OP 42 — así la malla oficial (39 OB + 36 OP + 6 TG = 81) no marca exceso falso.
function classifyForLimits(course) {
  if (!course) return { comp: 'C', tipo: 'OB' };
  if (String(course.id || '').startsWith('NIV-')) return { comp: 'N', tipo: 'NIV' };
  if (course.custom || course.code === 'LIB' || String(course.id || '').startsWith('LIB')) return { comp: 'L', tipo: 'L' };
  if (course.id === 'TRAB-GRADO') return { comp: 'C', tipo: 'TG' };
  const tip = TIPOLOGIA[course.id];
  if (!tip) return { comp: 'C', tipo: 'OB' };
  if (tip.comp === 'L') return { comp: 'L', tipo: 'L' };
  if (tip.comp === 'T') return { comp: 'C', tipo: 'TG' };
  return { comp: tip.comp, tipo: tip.tipo === 'OP' ? 'OP' : 'OB' };
}

function computeComponentTotals(courses) {
  const totals = { B: { total: 0, OB: 0, OP: 0 }, C: { total: 0, OB: 0, OP: 0, TG: 0 }, L: { total: 0 }, total: 0 };
  (courses || []).forEach(c => {
    const cr = c.credits || 0;
    const { comp, tipo } = classifyForLimits(c);
    if (comp === 'N') return; // nivelación: 20 CR aparte, no cuentan en los 165
    totals.total += cr;
    if (comp === 'L') totals.L.total += cr;
    else if (comp === 'B' || comp === 'C') {
      totals[comp].total += cr;
      if (tipo === 'OP') totals[comp].OP += cr;
      else if (tipo === 'OB') totals[comp].OB += cr;
      else if (tipo === 'TG' && comp === 'C') totals[comp].TG += cr;
    }
  });
  return totals;
}

/* ============ DIAGNÓSTICO DEL PLAN (prerrequisitos, carga, horarios) ============
   Responde al feedback docente: corregir prerrequisitos en modo planificación,
   advertir sobrecarga y detectar cruces de horario según la oferta del SIA. */
const CARGA_MAX_RECOMENDADA = 20;
const CARGA_ALTA_DESDE = 19;
const CARGA_BAJA_HASTA = 12;
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function timeToMin(t) {
  if (typeof t === 'number') return t;
  const m = String(t || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]); const mm = Number(m[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  return h * 60 + mm;
}

function minToTime(min) {
  const h = Math.floor(min / 60); const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function analyzePlan(semesters, semMap, byId, schedules = {}) {
  const prereqErrors = [];
  const perSem = {};
  const invalidIds = new Set();
  semesters.forEach(sem => {
    const credits = sem.courses.reduce((a, c) => a + (c.credits || 0), 0);
    perSem[sem.semester] = { credits, count: sem.courses.length };
  });
  semesters.forEach(sem => sem.courses.forEach(course => {
    (course.prereqs || []).forEach(pid => {
      const semP = semMap[pid];
      const semC = semMap[course.id];
      if (semP === undefined) return; // prerrequisito fuera del plan visible: se ignora
      if (semP === 0 && semC === 0) return; // ambos en Nivelación (bandeja por ubicar): no se juzga orden
      if (semP >= semC) {
        const pre = byId[pid];
        prereqErrors.push({
          course, prereq: pre || { id: pid, code: pid, name: pid },
          semCourse: semC, semPrereq: semP, same: semP === semC,
        });
        invalidIds.add(course.id);
        invalidIds.add(pid);
      }
    });
  }));
  // Carga por semestre (se excluye semestre 0 de nivelación: va aparte)
  const cargaAlta = [];
  const cargaExcesiva = [];
  const cargaBaja = [];
  const vacios = [];
  const lastNonEmpty = Math.max(0, ...semesters.filter(s => s.semester > 0 && s.courses.length > 0).map(s => s.semester));
  semesters.forEach(sem => {
    if (sem.semester === 0) return;
    const { credits, count } = perSem[sem.semester];
    if (count === 0 && sem.semester < lastNonEmpty) vacios.push(sem.semester);
    else if (credits > CARGA_MAX_RECOMENDADA) cargaExcesiva.push({ sem: sem.semester, credits });
    else if (credits >= CARGA_ALTA_DESDE) cargaAlta.push({ sem: sem.semester, credits });
    else if (count > 0 && credits <= CARGA_BAJA_HASTA && sem.semester <= 8) cargaBaja.push({ sem: sem.semester, credits });
  });
  // Cruces de horario dentro del mismo semestre
  const cruces = [];
  semesters.forEach(sem => {
    const list = sem.courses.filter(c => (schedules[c.id] || []).length > 0);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]; const b = list[j];
        (schedules[a.id] || []).forEach(sa => {
          (schedules[b.id] || []).forEach(sb => {
            if (sa.day !== sb.day) return;
            if (sa.start < sb.end && sb.start < sa.end) {
              cruces.push({
                sem: sem.semester, a, b, day: sa.day,
                overlapStart: Math.max(sa.start, sb.start),
                overlapEnd: Math.min(sa.end, sb.end),
              });
            }
          });
        });
      }
    }
  });
  // Créditos por componente (Acuerdo 11 / Acuerdo 003A de 2022)
  const allCourses = semesters.flatMap(s => s.courses);
  const compTotals = computeComponentTotals(allCourses);
  const compExcess = [];
  if (compTotals.B.total > LIMITES_ACUERDO.B.total) compExcess.push({ comp: 'B', kind: 'total', actual: compTotals.B.total, max: LIMITES_ACUERDO.B.total, label: `Fundamentación: ${compTotals.B.total}/${LIMITES_ACUERDO.B.total} CR (OB ${compTotals.B.OB}/${LIMITES_ACUERDO.B.OB} · OP ${compTotals.B.OP}/${LIMITES_ACUERDO.B.OP})` });
  if (compTotals.B.OB > LIMITES_ACUERDO.B.OB) compExcess.push({ comp: 'B', kind: 'OB', actual: compTotals.B.OB, max: LIMITES_ACUERDO.B.OB, label: `Fundamentación obligatoria: ${compTotals.B.OB}/${LIMITES_ACUERDO.B.OB} CR` });
  if (compTotals.B.OP > LIMITES_ACUERDO.B.OP) compExcess.push({ comp: 'B', kind: 'OP', actual: compTotals.B.OP, max: LIMITES_ACUERDO.B.OP, label: `Fundamentación optativa: ${compTotals.B.OP}/${LIMITES_ACUERDO.B.OP} CR` });
  if (compTotals.C.total > LIMITES_ACUERDO.C.total) compExcess.push({ comp: 'C', kind: 'total', actual: compTotals.C.total, max: LIMITES_ACUERDO.C.total, label: `Disciplinar/Profesional: ${compTotals.C.total}/${LIMITES_ACUERDO.C.total} CR (OB ${compTotals.C.OB}/${LIMITES_ACUERDO.C.OB} · OP ${compTotals.C.OP}/${LIMITES_ACUERDO.C.OP} · TG ${compTotals.C.TG || 0})` });
  if (compTotals.C.OB > LIMITES_ACUERDO.C.OB) compExcess.push({ comp: 'C', kind: 'OB', actual: compTotals.C.OB, max: LIMITES_ACUERDO.C.OB, label: `Disciplinar obligatoria: ${compTotals.C.OB}/${LIMITES_ACUERDO.C.OB} CR` });
  if (compTotals.C.OP > LIMITES_ACUERDO.C.OP) compExcess.push({ comp: 'C', kind: 'OP', actual: compTotals.C.OP, max: LIMITES_ACUERDO.C.OP, label: `Disciplinar optativa: ${compTotals.C.OP}/${LIMITES_ACUERDO.C.OP} CR` });
  if (compTotals.L.total > LIMITES_ACUERDO.L.total) compExcess.push({ comp: 'L', kind: 'total', actual: compTotals.L.total, max: LIMITES_ACUERDO.L.total, label: `Libre elección: ${compTotals.L.total}/${LIMITES_ACUERDO.L.total} CR — quita plantillas LIB o baja créditos de tus ELEC` });
  if (compTotals.total > LIMITES_ACUERDO.TOTAL) compExcess.push({ comp: 'T', kind: 'total', actual: compTotals.total, max: LIMITES_ACUERDO.TOTAL, label: `Total plan: ${compTotals.total}/${LIMITES_ACUERDO.TOTAL} CR` });
  // Nivelación (20 CR aparte, no cuentan en 165): pendientes vs validadas (ocultas)
  const nivVisible = allCourses.filter(c => String(c.id || '').startsWith('NIV-'));
  const nivCredits = nivVisible.reduce((a, c) => a + (c.credits || 0), 0);
  const nivPending = nivVisible.map(c => c.id);
  const nivSummary = { total: 20, pending: nivCredits, pendingIds: nivPending, done: 20 - nivCredits };
  return { prereqErrors, perSem, invalidIds, cargaAlta, cargaExcesiva, cargaBaja, vacios, cruces, compTotals, compExcess, nivSummary,
    hasIssues: prereqErrors.length > 0 || cargaExcesiva.length > 0 || cruces.length > 0 || compExcess.length > 0 };
}

/* ============ OPTATIVAS EQUIVALENTES (Acuerdo 11 de 2023) ============
   Asignaturas de la misma subagrupación que el plan permite cursar en lugar de
   la asignatura de la ruta estándar, hasta completar los créditos exigidos. */
const OPTATIVAS_DATA = {
  '1000004': [
    { code: '2016377', name: 'Cálculo Diferencial en una Variable', credits: 4, dept: 'Matemáticas', req: 'Matemáticas Básicas' },
  ],
  '1000005': [
    { code: '2015556', name: 'Cálculo integral en una variable', credits: 4, dept: 'Matemáticas', req: 'Cálculo Diferencial o Cálculo Diferencial en una Variable' },
  ],
  '1000006': [
    { code: '2015162', name: 'Cálculo Vectorial', credits: 4, dept: 'Matemáticas', req: 'Cálculo Integral o Cálculo integral en una variable' },
  ],
  '1000003': [
    { code: '2015555', name: 'Álgebra Lineal Básica', credits: 4, dept: 'Matemáticas', req: 'Cálculo Diferencial o Cálculo Diferencial en una Variable' },
  ],
  '1000013': [
    { code: '2027877', name: 'Probabilidad Fundamental', credits: 4, dept: 'Probabilidad y Estadística', req: 'Cálculo Integral o Cálculo integral en una variable' },
    { code: '2015178', name: 'Probabilidad', credits: 4, dept: 'Probabilidad y Estadística', req: 'Cálculo Integral o Cálculo integral en una variable' },
  ],
  '2025963': [
    { code: '2015168', name: 'Fundamentos de Matemáticas', credits: 4, dept: 'Ciencias de la Computación', req: 'Álgebra Lineal o Álgebra Lineal Básica' },
  ],
  '2025964': [
    { code: '2015181', name: 'Sistemas numéricos', credits: 4, dept: 'Ciencias de la Computación', req: 'Matemáticas Discretas I o Fundamentos de Matemáticas' },
  ],
  '2015970': [
    { code: '2019072', name: 'Análisis Numérico I', credits: 4, dept: 'Ciencias de la Computación', req: 'Cálculo en Varias Variables o Cálculo Vectorial' },
  ],
  '2015703': [
    { code: '2025986', name: 'Ingeniería Económica y Análisis de Riesgo', credits: 3, dept: 'Ciencias Económicas y Administrativas', req: 'Cálculo Integral o en una variable y Probabilidad (o equivalentes)' },
    { code: '2016047', name: 'Modelos Económicos Computacionales', credits: 3, dept: 'Ciencias Económicas y Administrativas', req: 'Cálculo Integral o Cálculo integral en una variable' },
  ],
  '2015702': [
    { code: '2016028', name: 'Diseño, Gestión y Evaluación de Proyectos', credits: 4, dept: 'Ciencias Económicas y Administrativas', req: 'Ingeniería Económica o sus equivalentes' },
  ],
  '2015734': [
    { code: '2026573', name: 'Introducción a las ciencias de la computación y a la programación', credits: 3, dept: 'Métodos y Tecnologías de Software', req: 'Sin prerrequisitos' },
  ],
  '2025966': [
    { code: '2027642', name: 'Compiladores', credits: 3, dept: 'Métodos y Tecnologías de Software', req: 'Estructuras de Datos e Introducción a la Teoría de la Computación' },
    { code: '2027628', name: 'Teoría de Lenguajes Formales', credits: 3, dept: 'Métodos y Tecnologías de Software', req: 'Estructuras de Datos e Introducción a la Teoría de la Computación' },
  ],
  '2016698': [
    { code: '2016498', name: 'Electrónica Digital I', credits: 4, dept: 'Infraestructura Computacional', req: 'Electrónica Análoga I' },
  ],
  '2016353': [
    { code: '2027641', name: 'Análisis de bases de datos', credits: 3, dept: 'Infraestructura Computacional', req: 'Programación Orientada a Objetos' },
  ],
  '2025994': [
    { code: '2016492', name: 'Comunicaciones', credits: 3, dept: 'Infraestructura Computacional', req: 'Líneas y Antenas' },
  ],
  '2025982': [
    { code: '2016053', name: 'Sistemas de Información Gerencial', credits: 4, dept: 'Infraestructura Computacional', req: 'Bases de Datos, Gerencia y Pensamiento Sistémico (o equivalentes)' },
  ],
  '2025972': [
    { code: '2027311', name: 'Introducción a la criptografía y a la teoría de información', credits: 4, dept: 'Infraestructura Computacional', req: 'Algoritmos' },
    { code: '2027313', name: 'Teoría de la codificación', credits: 4, dept: 'Infraestructura Computacional', req: 'Algoritmos' },
    { code: '2027310', name: 'Criptografía', credits: 3, dept: 'Infraestructura Computacional', req: 'Algoritmos' },
  ],
  '2025960': [
    { code: '2016788', name: 'Tecnología Digital', credits: 3, dept: 'Computación Aplicada', req: 'Arquitectura de computadores' },
    { code: '2016753', name: 'Microcontroladores', credits: 3, dept: 'Computación Aplicada', req: 'Arquitectura de computadores' },
    { code: '2016080', name: 'Aplicaciones gráficas tridimensionales', credits: 3, dept: 'Computación Aplicada', req: 'Algoritmos' },
    { code: '2025196', name: 'Introducción a la biología computacional', credits: 4, dept: 'Computación Aplicada', req: 'Algoritmos' },
    { code: '2026548', name: 'Introducción al Análisis Combinatorio', credits: 4, dept: 'Computación Aplicada', req: 'Algoritmos' },
    { code: '2028837', name: 'Matemáticas del aprendizaje de máquinas', credits: 4, dept: 'Computación Aplicada', req: 'Algoritmos' },
    { code: '2027309', name: 'Análisis forense digital', credits: 4, dept: 'Computación Aplicada', req: 'Algoritmos' },
    { code: '2029297', name: 'Introducción a la Computación de Alto Rendimiento', credits: 4, dept: 'Computación Aplicada', req: 'Algoritmos' },
    { code: '2016770', name: 'Robótica', credits: 3, dept: 'Computación Aplicada', req: 'Fund. Electricidad y Magnetismo, Arquitectura de computadores y Algoritmos' },
  ],
  '2025995': [
    { code: '2016748', name: 'Inteligencia artificial', credits: 3, dept: 'Sistemas Inteligentes', req: 'Algoritmos' },
    { code: '2023251', name: 'Inteligencia artificial y minirobots', credits: 3, dept: 'Sistemas Inteligentes', req: 'Algoritmos' },
    { code: '2027631', name: 'Introducción a la inteligencia artificial', credits: 3, dept: 'Sistemas Inteligentes', req: 'Algoritmos' },
    { code: '2028837', name: 'Matemáticas del aprendizaje de máquinas', credits: 4, dept: 'Sistemas Inteligentes', req: 'Algoritmos' },
    { code: '2017290', name: 'Técnicas de Inteligencia Artificial', credits: 3, dept: 'Sistemas Inteligentes', req: 'Algoritmos' },
  ],
  '2025970': [
    { code: '2019082', name: 'Modelos matemáticos I', credits: 4, dept: 'Modelos, Sistemas, Optimización y Simulación', req: 'POO, Cálculo en Varias Variables o Vectorial, Mat. Discretas II o Sistemas numéricos y Probabilidad (o equivalentes)' },
    { code: '2017293', name: 'Modelación matemática', credits: 3, dept: 'Modelos, Sistemas, Optimización y Simulación', req: 'POO, Cálculo en Varias Variables o Vectorial, Mat. Discretas II o Sistemas numéricos y Probabilidad (o equivalentes)' },
  ],
  '2025971': [
    { code: '2015173', name: 'Introducción a la Optimización', credits: 4, dept: 'Modelos, Sistemas, Optimización y Simulación', req: 'Modelos y Simulación o Modelos Matemáticos I o Modelación matemática' },
  ],
  '2024045': [
    { code: '2016615', name: 'Taller de Invención y Creatividad', credits: 3, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2017275', name: 'Proyecto aplicado de ingeniería', credits: 4, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2016093', name: 'Taller de énfasis en animación y narrativas audiovisuales I', credits: 3, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2016091', name: 'Taller de énfasis en multimedia e imagen digital I', credits: 3, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2026551', name: 'Creación y Gestión de Empresas', credits: 3, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2016007', name: 'Fundamentos de Administración', credits: 4, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2016600', name: 'Gestión Tecnológica', credits: 3, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2016599', name: 'Gestión de la Ciencia, la Tecnología y la Innovación', credits: 3, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2016741', name: 'Finanzas', credits: 3, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
    { code: '2016037', name: 'Finanzas Avanzadas', credits: 4, dept: 'Contexto Profesional e Interdisciplinario', req: '40 créditos disciplinares y Gerencia (o equivalente)' },
  ],
  'TRAB-GRADO': [
    { code: '2025974', name: 'Trabajo de Grado - Trabajo Investigativo', credits: 6, dept: 'Trabajo de Grado', req: '60 créditos del componente disciplinar' },
    { code: '2025973', name: 'Trabajo de Grado - Práctica de Extensión', credits: 6, dept: 'Trabajo de Grado', req: '60 créditos del componente disciplinar' },
    { code: '2016843', name: 'Trabajo de Grado - Asignaturas de Posgrado', credits: 6, dept: 'Trabajo de Grado', req: '60 créditos del componente disciplinar' },
  ],
};

function MallaInteractiva({ darkMode }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showOptativas, setShowOptativas] = useState(true);
  const [planner, setPlanner] = useState(false);
  const [dropSem, setDropSem] = useState(null);
  const [showDiag, setShowDiag] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [customLayout, setCustomLayout] = useState(() => {
    try {
      const raw = localStorage.getItem('ceis-plan-v1');
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  });
  // Electivas personalizadas (libre elección: Explora, Astronomía para todos, etc.)
  const [customCourses, setCustomCourses] = useState(() => {
    try {
      const raw = localStorage.getItem('ceis-custom-courses-v1');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(c => c && c.id && c.name) : [];
    } catch {
      return [];
    }
  });
  // Libre Elección de plantilla ocultas (LIB-01..LIB-09): estorban al poner ELEC propias
  const [hiddenIds, setHiddenIds] = useState(() => {
    try {
      const raw = localStorage.getItem('ceis-hidden-v1');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  // Horarios por materia para revisar cruces según oferta del SIA: {courseId: [{day, start, end}]}
  const [schedules, setSchedules] = useState(() => {
    try {
      const raw = localStorage.getItem('ceis-schedules-v1');
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ceis-plan-v1', JSON.stringify(customLayout));
    } catch {
      /* sin almacenamiento: el plan solo vive en memoria */
    }
  }, [customLayout]);
  useEffect(() => {
    try {
      localStorage.setItem('ceis-custom-courses-v1', JSON.stringify(customCourses));
    } catch { /* sin almacenamiento */ }
  }, [customCourses]);
  useEffect(() => {
    try {
      localStorage.setItem('ceis-hidden-v1', JSON.stringify(hiddenIds));
    } catch { /* sin almacenamiento */ }
  }, [hiddenIds]);
  useEffect(() => {
    try {
      localStorage.setItem('ceis-schedules-v1', JSON.stringify(schedules));
    } catch { /* sin almacenamiento */ }
  }, [schedules]);
  const [lines, setLines] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: '100%', height: '100%' });
  const containerRef = useRef(null);
  const courseRefs = useRef({});

  const getSelectedCourse = () => {
    if (!selectedId) return null;
    const foundCustom = customCourses.find(c => c.id === selectedId);
    if (foundCustom) return foundCustom;
    const foundNiv = NIVELACION_COURSES.find(c => c.id === selectedId);
    if (foundNiv) return foundNiv;
    for (const sem of MALLA_DATA) {
      const course = sem.courses.find(c => c.id === selectedId);
      if (course) return course;
    }
    return null;
  };

  const selectedCourse = getSelectedCourse();

  const toggleCourse = (id) => setSelectedId(prev => (prev === id ? null : id));

  const hiddenSet = new Set(hiddenIds);
  const officialSemesters = [
    { semester: 0, courses: NIVELACION_COURSES.filter(c => !hiddenSet.has(c.id)) },
    ...MALLA_DATA.map(sem => ({ ...sem, courses: sem.courses.filter(c => !hiddenSet.has(c.id)) })),
  ].filter(s => s.semester === 0 ? s.courses.length > 0 : true);
  const semesters = planner ? buildPlanSemesters(customLayout, customCourses, hiddenIds) : officialSemesters;
  const semMap = planner ? buildSemMap(semesters) : null;
  const maxSem = semesters.length > 0 ? semesters[semesters.length - 1].semester : 10;
  const byId = {};
  semesters.forEach(sem => sem.courses.forEach(c => { byId[c.id] = c; }));
  const diag = planner && semMap ? analyzePlan(semesters, semMap, byId, schedules) : null;
  const libTemplate = MALLA_DATA.flatMap(sem => sem.courses
    .filter(c => String(c.id).startsWith('LIB'))
    .map(c => ({ ...c, home: sem.semester, hidden: hiddenSet.has(c.id) })));
  const nivTemplate = NIVELACION_COURSES.map(c => ({ ...c, home: 0, hidden: hiddenSet.has(c.id) }));

  const moveCourse = (id, target) => {
    if (!id || !Number.isInteger(target) || target < 0) return;
    setCustomLayout(prev => ({ ...prev, [id]: Math.min(target, 20) }));
    setDropSem(null);
  };

  const addCustomCourse = ({ name, credits, semester }) => {
    const clean = String(name || '').trim();
    const cr = Math.min(Math.max(Number(credits) || 2, 1), 6);
    const sem = Math.min(Math.max(Number(semester) || 9, 1), 20);
    if (!clean) return;
    const id = `CUSTOM-${Date.now().toString(36)}`;
    const course = { id, code: 'ELEC', name: clean, credits: cr, prereqs: [], custom: true };
    setCustomCourses(prev => [...prev, course]);
    setCustomLayout(prev => ({ ...prev, [id]: sem }));
  };

  const removeCustomCourse = (id) => {
    setCustomCourses(prev => prev.filter(c => c.id !== id));
    setCustomLayout(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSchedules(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selectedId === id) setSelectedId(null);
  };

  const hideCourse = (id) => {
    if (!id) return;
    setHiddenIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    setSchedules(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selectedId === id) setSelectedId(null);
  };

  const restoreCourse = (id) => {
    setHiddenIds(prev => prev.filter(x => x !== id));
  };

  const restoreAllLib = () => setHiddenIds([]);

  const addSlot = (courseId, day, startStr, endStr) => {
    const start = timeToMin(startStr); const end = timeToMin(endStr);
    if (!DIAS_SEMANA.includes(day) || start === null || end === null || end <= start) return false;
    setSchedules(prev => ({ ...prev, [courseId]: [...(prev[courseId] || []), { day, start, end }] }));
    return true;
  };

  const removeSlot = (courseId, idx) => {
    setSchedules(prev => ({ ...prev, [courseId]: (prev[courseId] || []).filter((_, i) => i !== idx) }));
  };

  const resetPlan = () => {
    setCustomLayout({});
    setHiddenIds([]);
    setCustomCourses([]);
    setSchedules(prev => {
      const next = {};
      Object.entries(prev || {}).forEach(([cid, slots]) => {
        if (!String(cid).startsWith('CUSTOM-')) next[cid] = slots;
      });
      return next;
    });
    setSelectedId(null);
    try {
      localStorage.removeItem('ceis-plan-v1');
      localStorage.removeItem('ceis-hidden-v1');
      localStorage.removeItem('ceis-custom-courses-v1');
    } catch {
      /* sin almacenamiento */
    }
  };
  const selectedTip = selectedCourse ? getTipologia(selectedCourse) : null;
  const recordedOpts = selectedId ? (OPTATIVAS_DATA[selectedId] || []) : [];
  const unlockCount = selectedId
    ? [...NIVELACION_COURSES, ...MALLA_DATA.flatMap(s => s.courses), ...customCourses].filter(c => (c.prereqs || []).includes(selectedId)).length
    : 0;

  useLayoutEffect(() => {
    const drawLines = () => {
      if (!containerRef.current) return;

      setSvgSize({
        width: containerRef.current.scrollWidth,
        height: containerRef.current.scrollHeight
      });

      if (!selectedId) {
        setLines([]);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const selectedEl = courseRefs.current[selectedId];
      if (!selectedEl) return;

      const selectedRect = selectedEl.getBoundingClientRect();
      const newLines = [];
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;

      selectedCourse.prereqs.forEach(prereqId => {
        const prereqEl = courseRefs.current[prereqId];
        if (prereqEl) {
          const pRect = prereqEl.getBoundingClientRect();
          newLines.push({
            x1: (pRect.right - containerRect.left) + scrollLeft,
            y1: (pRect.top + pRect.height / 2 - containerRect.top) + scrollTop,
            x2: (selectedRect.left - containerRect.left) + scrollLeft,
            y2: (selectedRect.top + selectedRect.height / 2 - containerRect.top) + scrollTop,
            color: '#82B475'
          });
        }
      });

      MALLA_DATA.forEach(sem => sem.courses.forEach(c => {
        if ((c.prereqs || []).includes(selectedId)) {
          const unlockEl = courseRefs.current[c.id];
          if (unlockEl) {
            const uRect = unlockEl.getBoundingClientRect();
            newLines.push({
              x1: (selectedRect.right - containerRect.left) + scrollLeft,
              y1: (selectedRect.top + selectedRect.height / 2 - containerRect.top) + scrollTop,
              x2: (uRect.left - containerRect.left) + scrollLeft,
              y2: (uRect.top + uRect.height / 2 - containerRect.top) + scrollTop,
              color: '#c08a2e'
            });
          }
        }
      }));
      [...NIVELACION_COURSES, ...customCourses].forEach(c => {
        if ((c.prereqs || []).includes(selectedId)) {
          const unlockEl = courseRefs.current[c.id];
          if (unlockEl) {
            const uRect = unlockEl.getBoundingClientRect();
            newLines.push({
              x1: (selectedRect.right - containerRect.left) + scrollLeft,
              y1: (selectedRect.top + selectedRect.height / 2 - containerRect.top) + scrollTop,
              x2: (uRect.left - containerRect.left) + scrollLeft,
              y2: (uRect.top + uRect.height / 2 - containerRect.top) + scrollTop,
              color: '#c08a2e'
            });
          }
        }
      });

      setLines(newLines);
    };

    drawLines();
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [selectedId, selectedCourse]);

  const getCourseStatus = (course) => {
    if (!selectedCourse) return 'default';
    if (course.id === selectedCourse.id) return 'selected';
    if (selectedCourse.prereqs.includes(course.id)) return 'prereq';
    if (course.prereqs.includes(selectedCourse.id)) return 'unlocks';
    return 'dimmed';
  };

  const statusStyles = {
    selected: 'bg-[#3B908D] text-white border-[#18514A] shadow-md scale-105 z-20 relative ring-4 ring-[#3B908D]/30',
    prereq: 'bg-[#82B475] text-[#191114] border-[#55684f] shadow-sm z-10 relative ring-2 ring-[#82B475]/50',
    unlocks: 'bg-[#c08a2e] text-white border-[#8c6423] shadow-sm z-10 relative ring-2 ring-[#c08a2e]/50',
    default: darkMode
      ? 'bg-[#1c2c1f] text-[#f0eee2] border-[#f0eee2]/20 hover:border-[#3B908D] z-10 relative'
      : 'bg-[#F6EEE8] text-[#191114] border-[#907A67]/40 hover:border-[#3B908D] z-10 relative',
    dimmed: darkMode
      ? 'bg-[#1c2c1f]/30 text-[#f0eee2]/30 border-[#f0eee2]/10 grayscale-[50%] z-10 relative'
      : 'bg-[#F6EEE8]/30 text-[#191114]/30 border-[#907A67]/20 grayscale-[50%] z-10 relative'
  };

  return (
    <div>
      <div className={`flex flex-wrap justify-center gap-6 mb-10 font-sans text-sm py-3 rounded-xl border ${
        darkMode ? 'bg-[#1c2c1f] border-[#f0eee2]/15 text-[#f0eee2]' : 'bg-[#E6E2D0]/30 border-[#907A67]/20 text-[#191114]'
      }`}>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#3B908D]"></span> Materia Seleccionada</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#82B475]"></span> Prerrequisito (Debes ver)</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#c08a2e]"></span> Desbloquea (Podrás ver)</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#8F7CC0]"></span> Optativa equivalente</div>
        <button
          onClick={() => setShowOptativas(!showOptativas)}
          role="switch"
          aria-checked={showOptativas}
          title="Mostrar u ocultar las asignaturas optativas equivalentes"
          className={`ml-2 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-300 ${
            showOptativas
              ? 'bg-[#8F7CC0]/15 border-[#8F7CC0]/60 text-[#8F7CC0]'
              : (darkMode ? 'border-[#f0eee2]/20 text-[#aeb8a4] hover:border-[#8F7CC0]/50' : 'border-[#907A67]/30 text-[#907A67] hover:border-[#8F7CC0]/50')
          }`}
        >
          {showOptativas ? <Eye size={14} /> : <EyeOff size={14} />}
          Optativas {showOptativas ? 'visibles' : 'ocultas'}
        </button>
        <button
          onClick={() => { setPlanner(!planner); setSelectedId(null); }}
          title="Arrastrar materias entre semestres para simular tu plan"
          className={`ml-2 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-300 ${
            planner
              ? 'bg-[#3B908D]/20 border-[#3B908D] text-[#3B908D]'
              : (darkMode ? 'border-[#f0eee2]/20 text-[#aeb8a4] hover:border-[#3B908D]' : 'border-[#907A67]/30 text-[#907A67] hover:border-[#3B908D]')
          }`}
        >
          {planner ? 'Ver malla oficial' : 'Planificar mi malla'}
        </button>
        {selectedId && (
          <button onClick={() => setSelectedId(null)} className="ml-4 text-xs font-semibold text-[#82B475] underline bg-transparent border-none cursor-pointer">
            Limpiar selección
          </button>
        )}
      </div>

      <div className={`flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8 font-sans text-xs py-2.5 px-4 rounded-xl border ${
        darkMode ? 'bg-[#1c2c1f]/60 border-[#f0eee2]/10 text-[#f0eee2]/90' : 'bg-[#E6E2D0]/40 border-[#907A67]/15 text-[#191114]/90'
      }`}>
        <span className="font-semibold inline-flex items-center gap-1.5 opacity-80"><Layers size={13} /> Tipología:</span>
        {Object.entries(COMP_META).map(([key, meta]) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }}></span>
            <span className="font-bold">{key}</span> {meta.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8F7CC0]"></span>
          Punto violeta = optativa (columna OBLIGATORIA "NO" del acuerdo)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="font-bold px-1 rounded-sm bg-[#8F7CC0]/20 text-[#8F7CC0]">+N EQ</span>
          Baja para ver sus equivalencias <ArrowDown size={13} className="text-[#8F7CC0]" />
        </span>
      </div>

      {planner && (
        <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 font-sans text-sm py-3 px-4 rounded-xl border ${
          darkMode ? 'bg-[#3B908D]/10 border-[#3B908D]/40 text-[#f0eee2]' : 'bg-[#3B908D]/10 border-[#3B908D]/40 text-[#191114]'
        }`}>
          <span>
            Modo planificación: <strong>arrastra</strong> las materias entre semestres o a la columna “+ Nuevo” para simular tu plan. Se guarda en este navegador.
            Ahora el plan <strong>sí corrige prerrequisitos</strong>: mira el panel de validación abajo.
          </span>
          <span className="flex items-center gap-3 flex-wrap">
            <span className="text-xs opacity-80">{Object.keys(customLayout).length} movidas · {customCourses.length} electivas propias{hiddenIds.length > 0 ? ` · ${hiddenIds.length} LIB ocultas` : ''}</span>
            <button onClick={() => setShowDiag(v => !v)} className="text-xs font-bold underline bg-transparent border-none cursor-pointer p-0 text-[#3B908D]">
              {showDiag ? 'Ocultar validación' : 'Ver validación'}
            </button>
            <button onClick={() => setShowSchedule(v => !v)} className="text-xs font-bold underline bg-transparent border-none cursor-pointer p-0 text-[#3B908D]">
              {showSchedule ? 'Ocultar horarios' : 'Revisar horarios SIA'}
            </button>
            <button onClick={resetPlan} className="text-xs font-bold text-[#c08a2e] underline bg-transparent border-none cursor-pointer p-0">
              Restablecer oficial
            </button>
          </span>
        </div>
      )}

      {planner && showDiag && diag && (
        <PlanDiagnostics darkMode={darkMode} diag={diag} />
      )}

      {planner && (
        <NivelacionManager
          darkMode={darkMode}
          nivTemplate={nivTemplate}
          onHide={hideCourse}
          onRestore={restoreCourse}
          onRestoreAll={restoreAllLib}
        />
      )}

      {planner && (
        <ElectiveManager
          darkMode={darkMode}
          customCourses={customCourses}
          onAdd={addCustomCourse}
          onRemove={removeCustomCourse}
          maxSem={maxSem}
          libTemplate={libTemplate}
          onHideLib={hideCourse}
          onRestore={restoreCourse}
          onRestoreAll={restoreAllLib}
        />
      )}

      {planner && showSchedule && (
        <ScheduleChecker
          darkMode={darkMode}
          semesters={semesters}
          schedules={schedules}
          diag={diag}
          onAddSlot={addSlot}
          onRemoveSlot={removeSlot}
        />
      )}

      <div className="overflow-x-auto pb-12 relative" ref={containerRef}>
        {selectedId && (
          <svg className="absolute top-0 left-0 pointer-events-none" style={{ width: `${svgSize.width}px`, height: `${svgSize.height}px`, zIndex: 0 }}>
            {lines.map((line, i) => {
              const curveTension = 50;
              const d = `M ${line.x1} ${line.y1} C ${line.x1 + curveTension} ${line.y1}, ${line.x2 - curveTension} ${line.y2}, ${line.x2} ${line.y2}`;
              return (
                <path
                  key={i}
                  d={d}
                  stroke={line.color}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8 6"
                  className="animate-dash-flow opacity-80"
                />
              );
            })}
          </svg>
        )}

        <div className="flex gap-8 min-w-max px-4 pt-4">
          {semesters.map((semester, semIdx) => (
            <MallaSemestre
              key={semester.semester}
              semester={semester}
              semIdx={semIdx}
              darkMode={darkMode}
              showOptativas={showOptativas}
              onSelectCourse={toggleCourse}
              getCourseStatus={getCourseStatus}
              statusStyles={statusStyles}
              courseRefs={courseRefs}
              planner={planner}
              semMap={semMap}
              dropActive={planner && dropSem === semester.semester}
              onDropSemester={moveCourse}
              onOverSemester={setDropSem}
              invalidIds={diag?.invalidIds}
              perSemCredits={diag?.perSem?.[semester.semester]?.credits}
              schedules={schedules}
              onRemoveCustom={removeCustomCourse}
              onHideCourse={hideCourse}
            />
          ))}
          {planner && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDropSem(maxSem + 1); }}
              onDragLeave={() => setDropSem(cur => (cur === maxSem + 1 ? null : cur))}
              onDrop={(e) => { e.preventDefault(); moveCourse(e.dataTransfer.getData('text/plain'), maxSem + 1); }}
              className={`w-56 shrink-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 py-10 font-sans transition-colors ${
                dropSem === maxSem + 1
                  ? 'border-[#3B908D] bg-[#3B908D]/15 text-[#3B908D]'
                  : (darkMode ? 'border-[#f0eee2]/20 text-[#aeb8a4]' : 'border-[#907A67]/30 text-[#907A67]')
              }`}
            >
              <span className="text-3xl leading-none font-bold">+</span>
              <span className="text-sm font-semibold">Suelta aquí</span>
              <span className="text-xs font-normal">Crea el Semestre {maxSem + 1}</span>
            </div>
          )}
        </div>
      </div>

      {selectedCourse && selectedTip && !planner && (
        <MallaDetalleCurso
          course={selectedCourse}
          tip={selectedTip}
          opts={recordedOpts}
          showOptativas={showOptativas}
          unlockCount={unlockCount}
          darkMode={darkMode}
          onEnableOptativas={() => setShowOptativas(true)}
        />
      )}

      <div className="text-center mt-4 max-w-3xl mx-auto">
        <p className={`text-xs font-sans flex items-center justify-center gap-1.5 flex-wrap ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
          <Info size={14} className="shrink-0" />
          <span>
            Malla elaborada a partir del Acuerdo 11 de 2023 del Consejo de la Facultad de Ingeniería (Sede Bogotá, Acta 36 del 7 de diciembre), que define el plan de estudios y deroga los Acuerdos 026 de 2014 y 006 de 2023.
            La oferta, los requisitos y las equivalencias pueden variar: verifica siempre en el SIA.{' '}
            <a
              href={RESOLUCION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 font-semibold hover:text-[#3B908D] transition-colors inline-flex items-center gap-1"
            >
              Ver Acuerdo 11 de 2023 <ExternalLink size={12} />
            </a>
            {' '}Herramienta hecha por estudiantes, para estudiantes.
          </span>
        </p>
      </div>
    </div>
  );
}

/* ============ VALIDACIÓN DEL PLAN: prerrequisitos, carga, componentes y sugerencias ============ */
function PlanDiagnostics({ darkMode, diag }) {
  const box = `mb-4 rounded-2xl border p-5 font-sans text-sm transition-colors duration-300 ${
    darkMode ? 'bg-[#1c2c1f] border-[#f0eee2]/15 text-[#f0eee2]' : 'bg-white border-[#907A67]/25 text-[#191114]'
  }`;
  const muted = darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]';
  const compExcess = diag.compExcess || [];
  const compTotals = diag.compTotals;
  const bar = (actual, max) => {
    const pct = max > 0 ? Math.min(100, Math.round((actual / max) * 100)) : 0;
    const over = actual > max;
    return (
      <span className="inline-block w-24 h-2 rounded-full bg-black/10 overflow-hidden align-middle" title={`${actual}/${max} CR`}>
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: over ? '#e5484d' : '#3B908D' }} />
      </span>
    );
  };
  const compRow = (label, actual, max, detail) => {
    const over = actual > max;
    return (
      <li className="flex flex-wrap items-center gap-2">
        <span className={over ? 'font-bold text-red-500' : ''}>{label}: <strong>{actual}/{max} CR</strong>{over ? ' · ¡sobrepasa el máximo!' : ''}</span>
        {bar(actual, max)}
        {detail && <span className={muted}>{detail}</span>}
      </li>
    );
  };
  const niv = diag.nivSummary || { pending: 0, done: 20 };
  const nivLine = (
    <li className="flex flex-wrap items-center gap-2">
      <span>Nivelación (aparte, no cuenta en 165): <strong>{niv.pending}/20 CR pendientes</strong>{niv.pending === 0 ? ' · ¡validada!' : ''}</span>
      {bar(20 - niv.pending, 20)}
      <span className={muted}>{niv.pending === 0 ? 'nada pendiente' : `${niv.done}/20 validados`}</span>
    </li>
  );
  const totalErrors = diag.prereqErrors.length + diag.cargaExcesiva.length + diag.cruces.length + compExcess.length;
  const totalWarns = diag.cargaAlta.length + diag.vacios.length;
  if (totalErrors === 0 && totalWarns === 0 && diag.cargaBaja.length === 0) {
    return (
      <div className={`${box} border-[#82B475]/60`}>
        <p className="font-bold inline-flex items-center gap-2 text-[#3f6b3a]">
          <GraduationCap size={16} /> Plan válido por ahora: sin violaciones de prerrequisitos ni sobrecarga.
        </p>
        <div className="mt-3 rounded-xl border border-[#3B908D]/30 bg-[#3B908D]/5 p-3">
          <p className="font-bold text-[13px] mb-1">📊 Créditos por componente (Acuerdo 11 · Acuerdo 003A de 2022: 165 CR)</p>
          <ul className="m-0 pl-5 text-[13px] flex flex-col gap-1">
            {compRow('Fundamentación', compTotals.B.total, LIMITES_ACUERDO.B.total, `(OB ${compTotals.B.OB}/${LIMITES_ACUERDO.B.OB} · OP ${compTotals.B.OP}/${LIMITES_ACUERDO.B.OP})`)}
            {compRow('Disciplinar/Profesional', compTotals.C.total, LIMITES_ACUERDO.C.total, `(OB ${compTotals.C.OB}/${LIMITES_ACUERDO.C.OB} · OP ${compTotals.C.OP}/${LIMITES_ACUERDO.C.OP} · TG ${compTotals.C.TG || 0})`)}
            {compRow('Libre elección', compTotals.L.total, LIMITES_ACUERDO.L.total, '')}
            {compRow('Total plan', compTotals.total, LIMITES_ACUERDO.TOTAL, '')}
            {nivLine}
          </ul>
        </div>
        <p className={`text-xs mt-2 ${muted}`}>Recuerda verificar la oferta real en el SIA: un plan válido en papel puede cruzarse si dos materias solo abren un grupo.</p>
      </div>
    );
  }
  return (
    <div className={box}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <AlertTriangle size={16} className={totalErrors > 0 ? 'text-red-500' : 'text-[#c08a2e]'} />
        <h3 className="font-bold text-[15px] m-0">Validación de tu plan {totalErrors > 0 ? `· ${totalErrors} error(es)` : '· solo sugerencias'}</h3>
        <span className={`text-xs ${muted}`}>Se actualiza cada vez que arrastras una materia. Topes Acuerdo 11: B 51 (15 OB+36 OP) · C 81 (39 OB+42 OP, TG aparte) · L 33 · Total 165.</span>
      </div>
      <div className="mb-3 rounded-xl border border-[#3B908D]/30 bg-[#3B908D]/5 p-3">
        <p className="font-bold text-[13px] mb-1">📊 Créditos por componente (se marca en rojo lo que sobrepasa el máximo):</p>
        <ul className="m-0 pl-5 text-[13px] flex flex-col gap-1">
          {compRow('Fundamentación', compTotals.B.total, LIMITES_ACUERDO.B.total, `(OB ${compTotals.B.OB}/${LIMITES_ACUERDO.B.OB} · OP ${compTotals.B.OP}/${LIMITES_ACUERDO.B.OP})`)}
          {compRow('Disciplinar/Profesional', compTotals.C.total, LIMITES_ACUERDO.C.total, `(OB ${compTotals.C.OB}/${LIMITES_ACUERDO.C.OB} · OP ${compTotals.C.OP}/${LIMITES_ACUERDO.C.OP} · TG ${compTotals.C.TG || 0})`)}
          {compRow('Libre elección', compTotals.L.total, LIMITES_ACUERDO.L.total, '')}
          {compRow('Total plan', compTotals.total, LIMITES_ACUERDO.TOTAL, '')}
          {nivLine}
        </ul>
      </div>
      {compExcess.length > 0 && (
        <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/5 p-3">
          <p className="font-bold text-[13px] mb-1 text-red-500">🚫 Exceso de créditos Acuerdo 11 ({compExcess.length}):</p>
          <ul className="m-0 pl-5 text-[13px] flex flex-col gap-1">
            {compExcess.map((e, i) => (
              <li key={i}><strong>{e.label}</strong> — quita materias/ELEC de ese componente o baja créditos para volver al tope.</li>
            ))}
          </ul>
        </div>
      )}
      {diag.prereqErrors.length > 0 && (
        <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/5 p-3">
          <p className="font-bold text-[13px] mb-2 text-red-500">⛔ Prerrequisitos violados ({diag.prereqErrors.length}) — el SIA no te dejará inscribir así:</p>
          <ul className="m-0 pl-5 flex flex-col gap-1.5 text-[13px] leading-snug">
            {diag.prereqErrors.slice(0, 12).map((e, i) => (
              <li key={i}>
                <strong>{e.course.name}</strong> (Sem {e.semCourse}) requiere <strong>{e.prereq.name}</strong> (Sem {e.semPrereq})
                {e.same ? ' — no pueden ir en el mismo semestre' : ' — el requisito quedó después'}.
                <span className={muted}> Mueve {e.prereq.code} a un semestre anterior o {e.course.code} a uno posterior.</span>
              </li>
            ))}
          </ul>
          {diag.prereqErrors.length > 12 && <p className={`text-xs mt-1 ${muted}`}>…y {diag.prereqErrors.length - 12} más.</p>}
        </div>
      )}
      {diag.cargaExcesiva.length > 0 && (
        <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/5 p-3">
          <p className="font-bold text-[13px] mb-1 text-red-500">🔥 Sobrecarga excesiva (más de {CARGA_MAX_RECOMENDADA} créditos):</p>
          <ul className="m-0 pl-5 text-[13px]">
            {diag.cargaExcesiva.map(c => <li key={c.sem}>Semestre {c.sem}: <strong>{c.credits} CR</strong> — reparte materias; ni el SIA ni tu salud lo recomiendan.</li>)}
          </ul>
        </div>
      )}
      {diag.cruces.length > 0 && (
        <div className="mb-3 rounded-xl border border-[#c08a2e]/60 bg-[#c08a2e]/10 p-3">
          <p className="font-bold text-[13px] mb-1 text-[#8c6423]">🕒 Cruces de horario detectados ({diag.cruces.length}):</p>
          <ul className="m-0 pl-5 text-[13px]">
            {diag.cruces.slice(0, 8).map((c, i) => (
              <li key={i}>Sem {c.sem}: <strong>{c.a.name}</strong> choca con <strong>{c.b.name}</strong> el {c.day} {minToTime(c.overlapStart)}–{minToTime(c.overlapEnd)}.</li>
            ))}
          </ul>
        </div>
      )}
      {(diag.cargaAlta.length > 0 || diag.vacios.length > 0) && (
        <div className="mb-3 rounded-xl border border-[#c08a2e]/50 bg-[#c08a2e]/5 p-3">
          <p className="font-bold text-[13px] mb-1">⚠️ Advertencias de carga:</p>
          <ul className="m-0 pl-5 text-[13px] flex flex-col gap-1">
            {diag.cargaAlta.map(c => <li key={c.sem}>Semestre {c.sem}: <strong>{c.credits} CR (carga alta)</strong> — viable pero pesado; evita juntarlo con trabajo o con materias que desbloquean mucho.</li>)}
            {diag.vacios.map(s => <li key={s}>Semestre {s} vacío con semestres llenos después — revisa si arrastraste todo sin querer (como en la captura del profe: 57 CR en Sem 1 y 0 en Sem 2-3).</li>)}
          </ul>
        </div>
      )}
      {diag.cargaBaja.length > 0 && (
        <div className="rounded-xl border border-[#3B908D]/40 bg-[#3B908D]/5 p-3">
          <p className="font-bold text-[13px] mb-1 inline-flex items-center gap-1.5"><Lightbulb size={14} /> Sugerencias:</p>
          <ul className="m-0 pl-5 text-[13px] flex flex-col gap-1">
            {diag.cargaBaja.map(c => <li key={c.sem}>Semestre {c.sem}: solo {c.credits} CR — buen hueco para adelantar una electiva u optativa liviana.</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ============ NIVELACIÓN (20 CR aparte) ============ */
function NivelacionManager({ darkMode, nivTemplate = [], onHide, onRestore, onRestoreAll }) {
  const muted = darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]';
  const visible = (nivTemplate || []).filter(n => !n.hidden);
  const hidden = (nivTemplate || []).filter(n => n.hidden);
  const pendingCr = visible.reduce((a, c) => a + (c.credits || 0), 0);
  return (
    <div className={`mb-4 rounded-2xl border p-5 font-sans text-sm ${
      darkMode ? 'bg-[#1c2c1f] border-[#f0eee2]/15 text-[#f0eee2]' : 'bg-white border-[#907A67]/25 text-[#191114]'
    }`}>
      <h3 className="font-bold text-[15px] m-0 mb-1">📐 Nivelación: 20 CR aparte (no cuentan en los 165)</h3>
      <p className={`text-xs mt-0 mb-3 ${muted}`}>
        4 CR Matemáticas Básicas (prerrequisito de Cálculo Diferencial) · 12 CR Inglés I–IV (3 CR c/u, en cadena) · 4 CR Lectoescritura (casi nadie la cursa: se suele validar).
        Si ya las validaste o te eximieron, <strong>ocúltalas</strong> para que no estorben; el validador las descuenta del pendiente.
        Pendientes ahora: <strong>{pendingCr}/20 CR</strong>.
        {hidden.length > 0 && (
          <button onClick={onRestoreAll} className="ml-2 font-bold text-[#3B908D] underline bg-transparent border-none cursor-pointer p-0 text-xs">
            Restaurar todas
          </button>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {visible.map(c => (
          <span key={c.id} className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border ${darkMode ? 'border-[#f0eee2]/20' : 'border-[#907A67]/30'}`}>
            <strong>NIV · {c.credits} CR</strong> {c.name}
            <button onClick={() => onHide?.(c.id)} title="Ya la validé: ocultar" className="bg-transparent border-none cursor-pointer text-[#3B908D] font-bold p-0 text-xs underline">validé ✓</button>
          </span>
        ))}
        {hidden.map(c => (
          <span key={c.id} className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border opacity-70 ${darkMode ? 'border-[#f0eee2]/15' : 'border-[#907A67]/25'}`}>
            <strong>{c.name}</strong> validada
            <button onClick={() => onRestore?.(c.id)} className="bg-transparent border-none cursor-pointer text-[#3B908D] font-bold p-0 text-xs underline">restaurar</button>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============ ELECTIVAS PERSONALIZADAS (libre elección) ============ */
function ElectiveManager({ darkMode, customCourses, onAdd, onRemove, maxSem, libTemplate = [], onHideLib, onRestore, onRestoreAll }) {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(2);
  const [semester, setSemester] = useState(9);
  const inputCls = `font-sans text-sm px-3 py-2 rounded-xl border outline-none focus:border-[#3B908D] ${
    darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
  }`;
  const muted = darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]';
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, credits, semester });
    setName('');
  };
  const visibleLib = (libTemplate || []).filter(l => !l.hidden);
  const hiddenLib = (libTemplate || []).filter(l => l.hidden);
  const libCredits = visibleLib.reduce((a, c) => a + (c.credits || 0), 0);
  return (
    <div className={`mb-4 rounded-2xl border p-5 font-sans text-sm ${
      darkMode ? 'bg-[#1c2c1f] border-[#f0eee2]/15 text-[#f0eee2]' : 'bg-white border-[#907A67]/25 text-[#191114]'
    }`}>
      <h3 className="font-bold text-[15px] m-0 mb-1">➕ Mis electivas / libre elección</h3>
      <p className={`text-xs mt-0 mb-3 ${muted}`}>
        Agrega las que te gustaría ver: Explora UNAL, Astronomía para todos, Cátedra, deportes, etc. Quedan marcadas como ELEC y las puedes arrastrar entre semestres o borrar.
        La plantilla trae 9 Libre Elección (33 CR). Si estorban o quieres otros créditos, <strong>bórralas aquí o desde la tarjeta</strong> y reemplázalas con las tuyas; el validador avisa si te pasas de 33 CR.
      </p>
      <form onSubmit={submit} className="flex flex-wrap gap-2 items-end">
        <label className="flex flex-col gap-1 grow min-w-[200px]">
          <span className="text-xs font-semibold">Nombre de la electiva</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Astronomía para todos" maxLength={80} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold">Créditos</span>
          <select value={credits} onChange={e => setCredits(e.target.value)} className={inputCls}>
            {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold">Semestre</span>
          <select value={semester} onChange={e => setSemester(e.target.value)} className={inputCls}>
            {Array.from({ length: Math.max(maxSem, 10) }, (_, i) => i + 1).map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </label>
        <button type="submit" className="font-sans text-sm font-semibold px-4 py-2 rounded-xl text-white bg-gradient-to-r from-[#3B908D] to-[#82B475] cursor-pointer border-none">
          Agregar
        </button>
      </form>
      {customCourses.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {customCourses.map(c => (
            <span key={c.id} className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border ${darkMode ? 'border-[#f0eee2]/20' : 'border-[#907A67]/30'}`}>
              <strong>ELEC · {c.credits} CR</strong> {c.name}
              <button onClick={() => onRemove(c.id)} title="Borrar mi electiva" className="bg-transparent border-none cursor-pointer text-red-500 font-bold p-0 text-sm leading-none">× borrar</button>
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-dashed border-[#907A67]/30">
        <p className="text-xs font-bold m-0 mb-2">
          Plantilla oficial LIB ({visibleLib.length} visibles · {libCredits} CR){hiddenLib.length > 0 && ` · ${hiddenLib.length} ocultas`}
          {hiddenLib.length > 0 && (
            <button onClick={onRestoreAll} className="ml-2 font-bold text-[#3B908D] underline bg-transparent border-none cursor-pointer p-0 text-xs">
              Restaurar todas
            </button>
          )}
        </p>
        {visibleLib.length === 0 && <p className={`text-xs m-0 ${muted}`}>Ocultaste toda la plantilla LIB. Tu conteo de Libre Elección ahora depende solo de tus ELEC.</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {visibleLib.map(c => (
            <span key={c.id} className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border ${darkMode ? 'border-[#f0eee2]/20' : 'border-[#907A67]/30'}`}>
              <strong>LIB · {c.credits} CR</strong> Sem {c.home} ({c.id})
              <button onClick={() => onHideLib?.(c.id)} title={`Borrar ${c.id} de tu plan`} className="bg-transparent border-none cursor-pointer text-red-500 font-bold p-0 text-xs underline">borrar</button>
            </span>
          ))}
        </div>
        {hiddenLib.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {hiddenLib.map(c => (
              <span key={c.id} className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border opacity-70 ${darkMode ? 'border-[#f0eee2]/15' : 'border-[#907A67]/25'}`}>
                <strong>{c.id} · {c.credits} CR</strong> oculta
                <button onClick={() => onRestore?.(c.id)} className="bg-transparent border-none cursor-pointer text-[#3B908D] font-bold p-0 text-xs underline">restaurar</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ REVISOR DE OFERTA Y CRUCES (SIA) ============ */
function ScheduleChecker({ darkMode, semesters, schedules, diag, onAddSlot, onRemoveSlot }) {
  const [semSel, setSemSel] = useState(() => semesters.find(s => s.courses.length > 0)?.semester || 1);
  const [forms, setForms] = useState({});
  const sem = semesters.find(s => s.semester === semSel) || semesters[0];
  const muted = darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]';
  const setForm = (cid, patch) => setForms(prev => ({ ...prev, [cid]: { day: 'Lun', start: '08:00', end: '10:00', ...(prev[cid] || {}), ...patch } }));
  const crucesSem = (diag?.cruces || []).filter(c => c.sem === semSel);
  return (
    <div className={`mb-8 rounded-2xl border p-5 font-sans text-sm ${
      darkMode ? 'bg-[#1c2c1f] border-[#f0eee2]/15 text-[#f0eee2]' : 'bg-white border-[#907A67]/25 text-[#191114]'
    }`}>
      <h3 className="font-bold text-[15px] m-0 mb-1">🕒 Revisar oferta y cruces de horario</h3>
      <p className={`text-xs mt-0 mb-3 ${muted}`}>
        El SIA a veces abre <strong>un solo grupo</strong> por materia y dos materias se cruzan. Copia aquí los horarios de la oferta vigente (Buscador de cursos / SIA) y te avisamos si tu plan es imposible.
        Esto no reemplaza verificar en el SIA antes de inscribir.
      </p>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="text-xs font-semibold">Semestre a revisar:</span>
        <select value={semSel} onChange={e => setSemSel(Number(e.target.value))}
          className={`text-sm px-3 py-2 rounded-xl border outline-none cursor-pointer ${darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'}`}>
          {semesters.filter(s => s.courses.length > 0).map(s => <option key={s.semester} value={s.semester}>{s.semester === 0 ? 'Nivelación' : `Sem ${s.semester}`} · {s.courses.length} mats</option>)}
        </select>
        {crucesSem.length > 0
          ? <span className="text-xs font-bold text-red-500">⛔ {crucesSem.length} cruce(s) en este semestre</span>
          : <span className="text-xs text-[#3f6b3a]">✓ Sin cruces registrados en este semestre</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(sem?.courses || []).map(c => {
          const slots = schedules[c.id] || [];
          const f = forms[c.id] || { day: 'Lun', start: '08:00', end: '10:00' };
          return (
            <div key={c.id} className={`rounded-xl border p-3 ${darkMode ? 'border-[#f0eee2]/15' : 'border-[#907A67]/25'}`}>
              <p className="font-bold text-[13px] m-0">{c.code} · {c.name}</p>
              {slots.length === 0 && <p className={`text-xs m-0 mt-1 ${muted}`}>Sin horario registrado (no se revisa).</p>}
              {slots.map((s, i) => (
                <p key={i} className="text-xs m-0 mt-1 flex items-center gap-2">
                  <span>{s.day} {minToTime(s.start)}–{minToTime(s.end)}</span>
                  <button onClick={() => onRemoveSlot(c.id, i)} className="bg-transparent border-none cursor-pointer text-red-500 text-xs underline p-0">quitar</button>
                </p>
              ))}
              <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                <select value={f.day} onChange={e => setForm(c.id, { day: e.target.value })}
                  className={`text-xs px-2 py-1.5 rounded-lg border outline-none ${darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20' : 'bg-white border-[#907A67]/30'}`}>
                  {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="time" value={f.start} onChange={e => setForm(c.id, { start: e.target.value })}
                  className={`text-xs px-2 py-1.5 rounded-lg border outline-none ${darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20' : 'bg-white border-[#907A67]/30'}`} />
                <input type="time" value={f.end} onChange={e => setForm(c.id, { end: e.target.value })}
                  className={`text-xs px-2 py-1.5 rounded-lg border outline-none ${darkMode ? 'bg-[#0d160f] border-[#f0eee2]/20' : 'bg-white border-[#907A67]/30'}`} />
                <button
                  onClick={() => { if (!onAddSlot(c.id, f.day, f.start, f.end)) window.alert('Revisa el día y las horas (fin debe ser mayor que inicio).'); }}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#3B908D] text-white border-none cursor-pointer">
                  + franja
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MallaDetalleCurso({ course, tip, opts, showOptativas, unlockCount, darkMode, onEnableOptativas }) {
  const compMeta = COMP_META[tip.comp];
  return (
    <div className={`mb-8 rounded-2xl border p-5 md:p-6 transition-colors duration-300 ${
      darkMode ? 'bg-[#1c2c1f] border-[#f0eee2]/15' : 'bg-[#E6E2D0]/40 border-[#907A67]/25'
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={`font-mono text-[11px] tracking-wider mb-1 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
            {course.code} · {course.credits} créditos
          </p>
          <h3 className={`font-sans font-bold text-lg leading-tight ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>
            {course.name}
          </h3>
          <p className={`font-sans text-xs mt-1.5 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
            {course.prereqs.length} prerrequisito(s) · Desbloquea {unlockCount} asignatura(s)
          </p>
        </div>
        <div className="flex flex-wrap gap-2 font-sans text-[11px] font-semibold">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: compMeta.color }}
            title={`Componente: ${compMeta.label}`}
          >
            {tip.comp} · {compMeta.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              tip.tipo === 'OP'
                ? 'bg-[#8F7CC0]/15 border-[#8F7CC0]/60 text-[#8F7CC0]'
                : (darkMode ? 'border-[#f0eee2]/25 text-[#f0eee2]' : 'border-[#907A67]/40 text-[#191114]')
            }`}
            title={`Carácter: ${TIPO_META[tip.tipo].label}`}
          >
            {TIPO_META[tip.tipo].label}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full font-normal ${
              darkMode ? 'bg-white/5 text-[#f0eee2]/80' : 'bg-black/5 text-[#191114]/80'
            }`}
            title="Agrupación del plan de estudios"
          >
            {tip.agrup}
          </span>
          {tip.sub && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full font-normal ${
                darkMode ? 'bg-white/5 text-[#f0eee2]/80' : 'bg-black/5 text-[#191114]/80'
              }`}
              title={`Subagrupación con opciones: exige ${tip.subCred} créditos`}
            >
              Subagrupación: {tip.sub} · exige {tip.subCred} cr
            </span>
          )}
        </div>
      </div>

      {showOptativas && opts.length > 0 && (
        <div className="mt-5">
          <p className={`font-sans text-xs font-semibold mb-3 uppercase tracking-wider ${darkMode ? 'text-[#b9a8e8]' : 'text-[#6d5ba8]'}`}>
            Optativas equivalentes ({opts.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {opts.map((opt, i) => (
              <div
                key={i}
                className="rounded-xl p-4 border border-[#8F7CC0]/40 bg-gradient-to-br from-[#8F7CC0]/20 to-[#3B908D]/15 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-[10.5px] tracking-wider font-bold text-[#8F7CC0]">{opt.code}</span>
                  <span className="font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#8F7CC0]/20 text-[#8F7CC0]">
                    {opt.credits} CR
                  </span>
                </div>
                <h4 className={`font-sans font-semibold text-sm leading-tight ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>
                  {opt.name}
                </h4>
                <p className={`font-sans text-[11px] mt-1 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
                  {opt.dept}
                </p>
                {opt.req && (
                  <p className={`font-sans text-[11px] mt-1 italic ${darkMode ? 'text-[#f0eee2]/70' : 'text-[#191114]/70'}`}>
                    Prerreq: {opt.req}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className={`font-sans text-[11px] mt-3 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
            Equivalencias tomadas del Acuerdo 11 de 2023{tip.sub ? ` (subagrupación ${tip.sub}, exige ${tip.subCred} créditos)` : ''}.
            Ojo con las diferencias de créditos y prerrequisitos: confirma la oferta vigente en el SIA antes de inscribir.
          </p>
        </div>
      )}

      {showOptativas && opts.length === 0 && tip.tipo !== 'L' && tip.tipo !== 'TG' && tip.tipo !== 'NIV' && (
        <p className={`font-sans text-xs mt-4 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
          No tenemos equivalencias registradas para esta asignatura. Al ser un plan con opciones, consulta las subagrupaciones vigentes en el SIA.
        </p>
      )}

      {!showOptativas && OPTATIVAS_DATA[course.id]?.length > 0 && (
        <p className={`font-sans text-xs mt-4 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
          Esta asignatura tiene optativas equivalentes.{' '}
          <button onClick={onEnableOptativas} className="font-semibold text-[#8F7CC0] underline bg-transparent border-none cursor-pointer p-0">
            Activa la vista de optativas
          </button>{' '}
          para verlas.
        </p>
      )}
    </div>
  );
}

function MallaSemestre({ semester, semIdx, darkMode, showOptativas, onSelectCourse, getCourseStatus, statusStyles, courseRefs, planner, semMap, dropActive, onDropSemester, onOverSemester, invalidIds, perSemCredits, schedules, onRemoveCustom, onHideCourse }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || planner) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('is-visible'), semIdx * 80);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [semIdx, planner]);

  const semesterCredits = semester.courses.reduce((acc, c) => acc + c.credits, 0);
  const isNiv = semester.semester === 0;
  const creditBad = planner && !isNiv && semesterCredits > CARGA_MAX_RECOMENDADA;
  const creditHigh = planner && !isNiv && !creditBad && semesterCredits >= CARGA_ALTA_DESDE;

  return (
    <div
      ref={ref}
      onDragOver={planner ? (e) => { e.preventDefault(); onOverSemester(semester.semester); } : undefined}
      onDragLeave={planner ? () => onOverSemester(cur => (cur === semester.semester ? null : cur)) : undefined}
      onDrop={planner ? (e) => { e.preventDefault(); onDropSemester(e.dataTransfer.getData('text/plain'), semester.semester); } : undefined}
      className={`malla-semester w-56 shrink-0 flex flex-col gap-5 rounded-xl transition-colors duration-200 ${planner ? 'is-visible' : ''} ${
        planner && dropActive ? 'bg-[#3B908D]/15 ring-2 ring-[#3B908D]/60' : ''
      }${isNiv ? ' ring-1 ring-dashed ring-[#9a9a9a]/50' : ''}`}
    >
      <div className={`text-center font-sans font-bold py-2 rounded-lg border z-10 relative ${
        darkMode ? 'text-[#82B475] bg-[#1c2c1f] border-[#f0eee2]/20' : 'text-[#18514A] bg-[#82B475]/20 border-[#82B475]/40'
      }`}>
        {isNiv ? 'Nivelación' : `Semestre ${semester.semester}`}
      </div>
      {(planner || true) && (
        <div className={`text-center font-sans text-xs font-semibold -mt-3 flex items-center justify-center gap-1 ${
          creditBad ? 'text-red-500' : creditHigh ? 'text-[#c08a2e]' : (darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]')
        }`} title={isNiv ? 'Nivelación: 20 CR aparte, no cuentan en los 165' : creditBad ? `Sobrecarga: más de ${CARGA_MAX_RECOMENDADA} créditos` : creditHigh ? 'Carga alta' : 'Créditos del semestre'}>
          {creditBad && <AlertTriangle size={12} />}{creditHigh && !creditBad && <AlertTriangle size={12} />}
          {semesterCredits} CR{isNiv ? ' · aparte' : creditBad ? ' · ¡excesivo!' : creditHigh ? ' · alta' : ''}
        </div>
      )}

      {semester.courses.map((course) => {
        const status = getCourseStatus(course);
        const style = statusStyles[status];
        const tip = getTipologia(course);
        const compColor = (COMP_META[tip.comp] || COMP_META.C).color;
        const isOpt = tip.tipo === 'OP';
        const here = planner && semMap ? (semMap[course.id] ?? semester.semester) : semester.semester;
        const latePrereqs = planner && semMap
          ? course.prereqs.filter(pid => semMap[pid] !== undefined && semMap[pid] >= here && !(semMap[pid] === 0 && here === 0))
          : [];
        const isInvalid = planner && invalidIds?.has(course.id);
        const isCustom = Boolean(course.custom);
        const isLib = !isCustom && String(course.id || '').startsWith('LIB');
        const isNivCourse = String(course.id || '').startsWith('NIV-');
        const slotCount = (schedules?.[course.id] || []).length;

        return (
          <div key={course.id} className="relative">
          <button
            ref={el => courseRefs.current[course.id] = el}
            draggable={planner}
            onDragStart={planner ? (e) => { e.dataTransfer.setData('text/plain', course.id); e.dataTransfer.effectAllowed = 'move'; } : undefined}
            onClick={() => { if (!planner) onSelectCourse(course.id); }}
            title={`${course.name} · Componente: ${(COMP_META[tip.comp] || COMP_META.C).label} · ${TIPO_META[tip.tipo].label} · ${tip.agrup}`}
            className={`text-left p-3 rounded-xl border transition-all duration-300 block w-full ${planner ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${style}${
              showOptativas && OPTATIVAS_DATA[course.id]?.length > 0 ? ' ring-2 ring-[#8F7CC0]/60' : ''
            }${isInvalid ? ' ring-2 ring-red-500 border-red-500' : ''}`}
          >
            <div className="flex justify-between items-center mb-1.5 opacity-90">
              <span className="font-mono text-[10.5px] tracking-wider">{isCustom ? 'ELEC' : isNivCourse ? 'NIV' : course.code}</span>
              <span className={`font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                {course.credits} CR
              </span>
            </div>
            <h4 className="font-sans font-semibold text-sm leading-tight m-0">{course.name}</h4>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isCustom ? '#c08a2e' : isNivCourse ? '#9a9a9a' : isOpt ? '#8F7CC0' : compColor }}></span>
              <span className="font-sans text-[9.5px] font-semibold tracking-wide uppercase opacity-75">
                {isCustom ? 'ELEC · Libre elección' : isNivCourse ? 'NIV · Nivelación' : isOpt ? 'OPT' : tip.comp} · {isCustom ? 'Mi electiva' : TIPO_META[tip.tipo].label}
              </span>
              {OPTATIVAS_DATA[course.id]?.length > 0 && showOptativas && (
                <span
                  title="Esta materia tiene equivalencias: selecciónala y baja para verlas"
                  className="font-sans text-[9px] font-bold px-1 rounded-sm bg-[#8F7CC0]/20 text-[#8F7CC0] ml-auto"
                >
                  +{OPTATIVAS_DATA[course.id].length} EQ
                </span>
              )}
              {slotCount > 0 && planner && (
                <span title={`${slotCount} franja(s) de horario registradas`} className="font-sans text-[9px] font-bold px-1 rounded-sm bg-[#3B908D]/15 text-[#3B908D] ml-auto">
                  🕒 {slotCount}
                </span>
              )}
            </div>
            {latePrereqs.length > 0 && (
              <span
                className="mt-1.5 inline-flex items-center gap-1 font-sans text-[9.5px] font-bold text-red-500"
                title={`Requisito en semestre igual o posterior: ${latePrereqs.join(', ')} — el SIA no permite inscribir así`}
              >
                <AlertTriangle size={11} /> ⛔ Prerrequisito violado
              </span>
            )}
            {isCustom && planner && (
              <span className="mt-1.5 block font-sans text-[9.5px] text-[#907A67]">
                Electiva propia · arrástrala o{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onRemoveCustom?.(course.id); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onRemoveCustom?.(course.id); } }}
                  className="underline font-bold text-red-500 cursor-pointer"
                >
                  borrar
                </span>
              </span>
            )}
            {isLib && planner && (
              <span className="mt-1.5 block font-sans text-[9.5px] text-[#907A67]">
                Plantilla {course.id} · {course.credits} CR ·{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onHideCourse?.(course.id); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onHideCourse?.(course.id); } }}
                  className="underline font-bold text-red-500 cursor-pointer"
                  title="Borrar esta Libre Elección de tu plan para poner una propia con otros créditos"
                >
                  borrar
                </span>
              </span>
            )}
            {isNivCourse && planner && (
              <span className="mt-1.5 block font-sans text-[9.5px] text-[#907A67]">
                Nivelación · no cuenta en 165 ·{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onHideCourse?.(course.id); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onHideCourse?.(course.id); } }}
                  className="underline font-bold text-[#3B908D] cursor-pointer"
                  title="Ya la validé: ocultar de mi plan"
                >
                  validé ✓
                </span>
              </span>
            )}
          </button>
          </div>
        );
      })}
    </div>
  );
}

/* ================= ICONOS ================= */

function TargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
