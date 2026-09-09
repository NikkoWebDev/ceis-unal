import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Users, BookOpen, Layers, Send, MapPin, ChevronRight, Sparkles, ArrowLeft, Info, Moon, Sun } from 'lucide-react';

export default function CEISLandingPage() {
  const [currentView, setCurrentView] = useState('home');
  const [activeTab, setActiveTab] = useState('comissions');
  const [darkMode, setDarkMode] = useState(false);

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
                onClick={() => setCurrentView('home')}
                className={`flex items-center gap-3 font-bold text-[17px] font-sans text-left bg-transparent border-none cursor-pointer p-0 transition-colors ${
                    darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'
                }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#907A67]/40 shadow-sm">
                <img src="/logo.jpg" alt="Logo CEIS" className="w-full h-full object-cover" />
              </div>
              <span className="flex flex-col leading-tight">
              <span className="text-base tracking-wide font-sans">CEIS</span>
              <span className={`text-[11px] font-serif italic font-normal ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Ing. de Sistemas · UNAL</span>
            </span>
            </button>

            <nav className="hidden md:flex items-center gap-7 font-sans text-sm font-medium">
              {currentView === 'home' && (
                  <>
                    <a href="#quienes-somos" className={`transition-colors ${darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]'}`}>Quiénes somos</a>
                    <a href="#objetivo" className={`transition-colors ${darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]'}`}>Nuestro Objetivo</a>
                    <a href="#espacio-interactivo" className={`transition-colors ${darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]'}`}>Comisiones y Consejo</a>
                  </>
              )}

              <button
                  onClick={() => setCurrentView('malla')}
                  className={`transition-colors font-medium bg-transparent border-none cursor-pointer text-sm ${
                      currentView === 'malla'
                          ? (darkMode ? 'text-[#c08a2e] font-bold underline' : 'text-[#3B908D] font-bold underline')
                          : (darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]')
                  }`}
              >
                Malla Interactiva
              </button>
              <a href="#contacto" className={`transition-colors ${darkMode ? 'text-[#aeb8a4] hover:text-[#f0eee2]' : 'text-[#907A67] hover:text-[#191114]'}`}>Contacto</a>
            </nav>

            <div className="flex items-center gap-4">
              {/* Botón de Modo Oscuro / Claro */}
              <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2] hover:bg-[#1c2c1f]' : 'bg-[#E6E2D0] border-[#907A67]/30 text-[#191114] hover:bg-[#907A67]/20'
                  }`}
                  aria-label="Cambiar modo oscuro"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <a
                  href="#contacto"
                  className="font-sans text-sm font-semibold px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-[#3B908D] to-[#18514A] hover:opacity-95 shadow-md transition-all duration-300"
              >
                Escríbenos
              </a>
            </div>
          </div>
        </header>

        {/* ---------- CONTENIDO DINÁMICO ---------- */}
        <main className="flex-grow">
          {currentView === 'home' ? (
              /* ================= VISTA PRINCIPAL (HOME) ================= */
              <>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-[#18514A] via-[#282F3A] to-[#191114] text-[#F6EEE8] pt-28 pb-20 relative overflow-hidden" id="inicio">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#82B475_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center relative z-10">
                    <div>
                  <span className="inline-flex items-center gap-2 font-sans text-[13px] text-[#82B475] border border-[#82B475]/30 rounded-full px-4 py-1.5 mb-6 bg-[#82B475]/10">
                    <Sparkles size={14} /> Facultad de Ingeniería, Universidad Nacional de Colombia
                  </span>
                      <h1 className="font-sans text-4xl md:text-6xl font-bold tracking-tight text-[#F6EEE8] leading-tight">
                        Consejo Estudiantil de Sistemas
                      </h1>
                      <p className="font-serif text-lg text-[#F6EEE8]/80 mt-5 max-w-[48ch] leading-relaxed">
                        La voz organizada de nuestra comunidad. Espacio de representación, desarrollo de soluciones y apoyo mutuo entre estudiantes de ingeniería de Sistemas.
                      </p>
                      <div className="flex flex-wrap gap-4 mt-8 font-sans">
                        <a
                            href="#espacio-interactivo"
                            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl text-white bg-gradient-to-r from-[#3B908D] to-[#82B475] shadow-lg shadow-[#3B908D]/20 transition-all duration-300"
                        >
                          Explorar secciones <ChevronRight size={16} />
                        </a>
                        <button
                            onClick={() => setCurrentView('malla')}
                            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl border border-[#F6EEE8]/20 text-[#F6EEE8] hover:bg-[#F6EEE8]/10 transition-colors cursor-pointer"
                        >
                          Ver Malla Curricular
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl p-3 bg-gradient-to-tr from-[#3B908D] to-[#82B475] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="w-full h-full bg-[#191114] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 border border-[#F6EEE8]/10 shadow-inner">
                          <img src="/logo.jpg" alt="Logo CEIS Completo" className="w-full h-full object-cover rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Quiénes somos */}
                <section id="quienes-somos" className={`py-20 border-b transition-colors duration-300 ${darkMode ? 'border-[#f0eee2]/10' : 'border-[#907A67]/20'}`}>
                  <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <p className={`font-sans text-[13.5px] font-semibold mb-3 tracking-wide uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>Quiénes somos</p>
                      <h2 className={`font-sans text-3xl font-bold tracking-tight mb-5 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Un espacio de construcción estudiantil</h2>
                      <p className={`text-[17px] leading-relaxed mb-4 ${darkMode ? 'text-[#f0eee2]/80' : 'text-[#191114]/80'}`}>
                        El CEIS es la instancia de organización estudiantil del programa curricular de Ingeniería de Sistemas y Computación en la Universidad Nacional de Colombia.
                      </p>
                      <p className={`text-[17px] leading-relaxed ${darkMode ? 'text-[#f0eee2]/80' : 'text-[#191114]/80'}`}>
                        Actuamos como un puente dinámico entre las necesidades del estudiantado y la dirección de la facultad, impulsando iniciativas autogestionadas y colaborativas.
                      </p>
                    </div>
                    <div className={`p-8 rounded-2xl border shadow-sm relative transition-colors duration-300 ${darkMode ? 'bg-[#152218] border-[#f0eee2]/15' : 'bg-[#E6E2D0]/50 border-[#907A67]/20'}`}>
                      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#3B908D] flex items-center justify-center text-white font-bold">“</div>
                      <p className={`font-serif italic text-lg leading-relaxed ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>
                        Las soluciones a nuestros retos académicos y de bienestar surgen cuando nos organizamos y colaboramos activamente como comunidad.
                      </p>
                      <span className={`block mt-4 font-sans text-xs font-semibold tracking-wider uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>— Principio del Consejo</span>
                    </div>
                  </div>
                </section>

                {/* Nuestro Objetivo */}
                <section id="objetivo" className={`py-20 border-b transition-colors duration-300 ${darkMode ? 'bg-[#152218]/40 border-[#f0eee2]/10' : 'bg-[#E6E2D0]/30 border-[#907A67]/25'}`}>
                  <div className="max-w-[1120px] mx-auto px-7 text-center">
                    <p className={`font-sans text-[13.5px] font-semibold mb-3 tracking-wide uppercase ${darkMode ? 'text-[#82B475]' : 'text-[#3B908D]'}`}>Nuestra Brújula</p>
                    <h2 className={`font-sans text-3xl md:text-4xl font-bold tracking-tight mb-8 ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Objetivo Principal</h2>

                    <div className={`max-w-3xl mx-auto p-8 md:p-12 rounded-2xl shadow-md relative border transition-colors duration-300 ${
                        darkMode ? 'bg-[#152218] border-[#f0eee2]/20 text-[#f0eee2]' : 'bg-[#F6EEE8] border-[#907A67]/30 text-[#191114]'
                    }`}>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-[#3B908D] to-[#82B475] flex items-center justify-center text-white shadow-md">
                        <TargetIcon />
                      </div>
                      <p className="text-xl md:text-2xl font-serif leading-relaxed mt-2">
                        "Plantear y desarrollar soluciones o acciones para las necesidades de los estudiantes de Ingeniería de Sistemas dentro de nuestro alcance como estudiantes y apoyándonos de otros estamentos e iniciativas de estudiantes y de la universidad."
                      </p>
                    </div>
                  </div>
                </section>
              </>
          ) : (
              /* ================= SUBPÁGINA: MALLA CURRICULAR INTERACTIVA ================= */
              <div className="py-12 w-full animate-fadeIn">
                <div className="max-w-[1400px] mx-auto px-7">
                  <button
                      onClick={() => setCurrentView('home')}
                      className={`inline-flex items-center gap-2 text-sm font-sans font-semibold mb-8 bg-transparent border-none cursor-pointer p-0 transition-colors ${
                          darkMode ? 'text-[#82B475] hover:underline' : 'text-[#3B908D] hover:underline'
                      }`}
                  >
                    <ArrowLeft size={16} /> Volver al inicio
                  </button>

                  <div className={`border p-6 md:p-10 rounded-3xl shadow-sm transition-colors duration-300 ${
                      darkMode ? 'bg-[#152218] border-[#f0eee2]/15 text-[#f0eee2]' : 'bg-white border-[#907A67]/30 text-[#191114]'
                  }`}>

                    {/* Cabecera con Logos Institutionales */}
                    <div className={`flex flex-col md:flex-row justify-between items-center mb-10 border-b pb-6 gap-6 ${darkMode ? 'border-[#f0eee2]/15' : 'border-[#907A67]/20'}`}>
                      <div className="flex items-center gap-4">
                        <img src="/unal-logo.png" alt="Logo UNAL" className="h-16 w-auto object-contain" />
                      </div>
                      <div className="text-center">
                        <h2 className={`font-sans text-2xl md:text-3xl font-bold ${darkMode ? 'text-[#f0eee2]' : 'text-[#191114]'}`}>Malla Curricular Interactiva</h2>
                        <p className={`font-serif mt-1 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>Ingeniería de Sistemas y Computación - Sede Bogotá</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <img src="/logo.jpg" alt="Logo CEIS" className="h-14 w-14 rounded-full border border-[#907A67]/30 shadow-sm" />
                      </div>
                    </div>

                    <MallaInteractiva darkMode={darkMode} />

                  </div>
                </div>
              </div>
          )}

          {/* ---------- CONTACTO (Con el mismo fondo del Hero: gradiente oscuro) ---------- */}
          <section id="contacto" className="py-20 bg-gradient-to-br from-[#18514A] via-[#282F3A] to-[#191114] text-[#F6EEE8]">
            <div className="max-w-[1120px] mx-auto px-7">
              <div className="mb-10">
                <p className="font-sans text-[13.5px] text-[#82B475] font-semibold mb-3 tracking-wide uppercase">Conéctate</p>
                <h2 className="font-sans text-3xl font-bold">Canales de Comunicación</h2>
              </div>

              {/* Cuadrícula de 2 columnas (2 y 2 elementos) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-sm">

                {/* 1. Correo */}
                <div className="flex items-center gap-4 bg-[#191114]/50 p-5 rounded-xl border border-[#907A67]/20">
                  <div className="w-12 h-12 rounded-lg bg-[#3B908D]/20 border border-[#3B908D]/40 flex items-center justify-center text-[#82B475] shrink-0">
                    <Send size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-[#907A67] block mb-1">Correo institucional</span>
                    <a href="mailto:ceisunal@gmail.com" className="text-base text-[#F6EEE8] hover:text-[#82B475] hover:underline transition-colors">
                      ceisunal@gmail.com
                    </a>
                  </div>
                </div>

                {/* 2. Instagram */}
                <div className="flex items-center gap-4 bg-[#191114]/50 p-5 rounded-xl border border-[#907A67]/20">
                  <div className="w-12 h-12 rounded-lg bg-[#3B908D]/20 border border-[#3B908D]/40 flex items-center justify-center text-[#82B475] shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-[#907A67] block mb-1">Instagram Oficial</span>
                    <a href="https://www.instagram.com/ceis_unal?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-base text-[#F6EEE8] hover:text-[#82B475] hover:underline transition-colors">
                      @ceis_unal
                    </a>
                  </div>
                </div>

                {/* 3. WhatsApp */}
                <div className="flex items-center gap-4 bg-[#191114]/50 p-5 rounded-xl border border-[#907A67]/20">
                  <div className="w-12 h-12 rounded-lg bg-[#3B908D]/20 border border-[#3B908D]/40 flex items-center justify-center text-[#82B475] shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-[#907A67] block mb-1">Comunidad WhatsApp</span>
                    <a href="https://chat.whatsapp.com/CoKtYbkvYjgLfLmVsHV1f8" target="_blank" rel="noopener noreferrer" className="text-base text-[#F6EEE8] hover:text-[#82B475] hover:underline transition-colors">
                      Unirme al grupo
                    </a>
                  </div>
                </div>

                {/* 4. Ubicación */}
                <div className="flex items-center gap-4 bg-[#191114]/50 p-5 rounded-xl border border-[#907A67]/20">
                  <div className="w-12 h-12 rounded-lg bg-[#3B908D]/20 border border-[#3B908D]/40 flex items-center justify-center text-[#82B475] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-[#907A67] block mb-1">Ubicación (Sede Bogotá)</span>
                    <a href="https://maps.app.goo.gl/ouzzPmtctqLzsjXm9" target="_blank" rel="noopener noreferrer" className="text-base text-[#F6EEE8] hover:text-[#82B475] hover:underline transition-colors">
                      Edificio 453, oficina 228
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </main>
      </div>
  );
}

/* ================= COMPONENTE: MALLA CURRICULAR INTERACTIVA CON LÍNEAS SVG ================= */

const MALLA_DATA = [
  {
    semester: 1,
    courses: [
      { id: '1000004', code: '1000004', name: 'Cálculo Diferencial', credits: 4, prereqs: [] },
      { id: '2025975', code: '2025975', name: 'Introducción a la ingeniería de sistemas y computación', credits: 3, prereqs: [] },
      { id: '2015734', code: '2015734', name: 'Programación de Computadores', credits: 3, prereqs: [] },
      { id: '2016703', code: '2016703', name: 'Pensamiento Sistémico', credits: 3, prereqs: [] },
      { id: 'LIB-01', code: 'LIB', name: 'Libre Elección', credits: 2, prereqs: [] },
    ]
  },
  {
    semester: 2,
    courses: [
      { id: '1000019', code: '1000019', name: 'Fundamentos de Mécanica', credits: 4, prereqs: ['1000004'] },
      { id: '1000005', code: '1000005', name: 'Cálculo Integral', credits: 4, prereqs: ['1000004'] },
      { id: '1000003', code: '1000003', name: 'Álgebra Lineal', credits: 4, prereqs: ['1000004'] },
      { id: '2016375', code: '2016375', name: 'Programación Orientada a Objetos', credits: 3, prereqs: ['2015734'] },
    ]
  },
  {
    semester: 3,
    courses: [
      { id: '1000017', code: '1000017', name: 'Fundamentos de Electricidad y Magnetismo', credits: 4, prereqs: ['1000005'] },
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
      { id: '2015174', code: '2015174', name: 'Introducción a la Teória de la Computación', credits: 4, prereqs: ['2025963'] },
    ]
  },
  {
    semester: 6,
    courses: [
      { id: '2025971', code: '2025971', name: 'Optimización', credits: 3, prereqs: ['2025970'] },
      { id: '2025982', code: '2025982', name: 'Sistemas de Información', credits: 3, prereqs: ['2015702','2016703','2016353'] },
      { id: '2015970', code: '2015970', name: 'Métodos Numéricos', credits: 3, prereqs: ['1000006'] },
      { id: '2016702', code: '2016702', name: 'Ingeniería de Software II', credits: 3, prereqs: ['2016701'] },
      { id: '2016696', code: '2016696', name: 'Algorítmos', credits: 3, prereqs: ['1000013','2025964','2016699'] },
      { id: '2016707', code: '2016707', name: 'Sistemas Operativos', credits: 3, prereqs: ['2016697'] },
    ]
  },
  {
    semester: 7,
    courses: [
      { id: '2025969', code: '2025969', name: 'Modelos Estocastícos y Simulación en Computación y Comunicaciones', credits: 3, prereqs: ['2025971'] },
      { id: '2025983', code: '2025983', name: 'Arquitectura de Infraestructura y Gobierno de TICs', credits: 3, prereqs: ['2025982','2016702'] },
      { id: '2025994', code: '2015994', name: 'Teoría de la Infromación y Sistemas de Comunicaciones', credits: 3, prereqs: ['1000013','2025967'] },
      { id: '2016716', code: '2016716', name: 'Arquitectura de Software', credits: 3, prereqs: ['2016702'] },
      { id: '2025995', code: '2025995', name: 'Introducción a los Sistemas Inteligentes', credits: 3, prereqs: ['2016696'] },
      { id: '2025966', code: '2025966', name: 'Lenguajes de Programación', credits: 3, prereqs: ['2015174','2016699'] },
    ]
  },
  {
    semester: 8,
    courses: [
      { id: 'TALLER', code: 'TALLER', name: 'Taller de Proyectos Interdiciplinarios (Req: 40 créditos disciplinares)', credits: 3, prereqs: [] },
      { id: '2025968', code: '2025968', name: 'Computación Paralela y Distríbuida', credits: 3, prereqs: ['2016696'] },
      { id: '2025972', code: '2025972', name: 'Introducción a la Criptografia y a la Seguridad de la Información', credits: 3, prereqs: ['2016696'] },
      { id: '2025960', code: '2016960', name: 'Computación Visual', credits: 3, prereqs: ['2016696'] },
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

function MallaInteractiva({ darkMode }) {
  const [selectedId, setSelectedId] = useState(null);
  const [lines, setLines] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: '100%', height: '100%' });
  const containerRef = useRef(null);
  const courseRefs = useRef({});

  const getSelectedCourse = () => {
    if (!selectedId) return null;
    for (const sem of MALLA_DATA) {
      const course = sem.courses.find(c => c.id === selectedId);
      if (course) return course;
    }
    return null;
  };

  const selectedCourse = getSelectedCourse();

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
        if (c.prereqs.includes(selectedId)) {
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
          {selectedId && (
              <button onClick={() => setSelectedId(null)} className="ml-4 text-xs font-semibold text-[#82B475] underline bg-transparent border-none cursor-pointer">
                Limpiar selección
              </button>
          )}
        </div>

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
                          strokeDasharray="5 5"
                          className="animate-[dash_1s_linear_infinite] opacity-80"
                          style={{ strokeDashoffset: 0 }}
                      />
                  );
                })}
              </svg>
          )}

          <div className="flex gap-8 min-w-max px-4 pt-4">
            {MALLA_DATA.map((semester) => (
                <div key={semester.semester} className="w-56 shrink-0 flex flex-col gap-5">
                  <div className={`text-center font-sans font-bold py-2 rounded-lg border z-10 relative ${
                      darkMode ? 'text-[#82B475] bg-[#1c2c1f] border-[#f0eee2]/20' : 'text-[#18514A] bg-[#82B475]/20 border-[#82B475]/40'
                  }`}>
                    Semestre {semester.semester}
                  </div>

                  {semester.courses.map((course) => {
                    const status = getCourseStatus(course);
                    const style = statusStyles[status];

                    return (
                        <button
                            key={course.id}
                            ref={el => courseRefs.current[course.id] = el}
                            onClick={() => setSelectedId(course.id)}
                            className={`text-left p-3 rounded-xl border transition-all duration-300 cursor-pointer block w-full ${style}`}
                        >
                          <div className="flex justify-between items-center mb-1.5 opacity-90">
                            <span className="font-mono text-[10.5px] tracking-wider">{course.code}</span>
                            <span className={`font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                        {course.credits} CR
                      </span>
                          </div>
                          <h4 className="font-sans font-semibold text-sm leading-tight m-0">{course.name}</h4>
                        </button>
                    );
                  })}
                </div>
            ))}
          </div>
        </div>

        <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>

        <div className="text-center mt-4">
          <p className={`text-xs font-sans flex items-center justify-center gap-1 ${darkMode ? 'text-[#aeb8a4]' : 'text-[#907A67]'}`}>
            <Info size={14} /> Los datos de la malla curricular mostrada pueden variar. Herramienta construida por estudiantes para estudiantes.
          </p>
        </div>
      </div>
  );
}

function TargetIcon() {
  return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
  );
}