import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Users, BookOpen, Layers, Send, MapPin, ChevronRight, Sparkles, ArrowLeft, Info} from 'lucide-react';

export default function CEISLandingPage() {
  const [currentView, setCurrentView] = useState('home');
  const [activeTab, setActiveTab] = useState('comissions');

  return (
      <div className="min-h-screen bg-[#F6EEE8] text-[#191114] font-serif selection:bg-[#82B475] selection:text-[#191114] antialiased flex flex-col justify-between">

        {/* ---------- HEADER FIJO ---------- */}
        <header className="sticky top-0 z-50 bg-[#F6EEE8]/90 backdrop-blur-md border-b border-[#907A67]/20">
          <div className="max-w-[1120px] mx-auto px-7 py-4 flex items-center justify-between">
            <button
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-3 font-bold text-[17px] text-[#191114] font-sans text-left bg-transparent border-none cursor-pointer p-0"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#907A67]/40 shadow-sm">
                <img src="/logo.jpg" alt="Logo CEIS" className="w-full h-full object-cover" />
              </div>
              <span className="flex flex-col leading-tight">
              <span className="text-base tracking-wide font-sans">CEIS</span>
              <span className="text-[11px] text-[#907A67] font-serif italic font-normal">Ing. de Sistemas · UNAL</span>
            </span>
            </button>

            <nav className="hidden md:flex items-center gap-7 font-sans text-sm font-medium">
              {currentView === 'home' && (
                  <>
                    <a href="#quienes-somos" className="text-[#907A67] hover:text-[#191114] transition-colors">Quiénes somos</a>
                    <a href="#objetivo" className="text-[#907A67] hover:text-[#191114] transition-colors">Nuestro Objetivo</a>
                    <a href="#espacio-interactivo" className="text-[#907A67] hover:text-[#191114] transition-colors">Comisiones y Consejo</a>
                  </>
              )}

              <button
                  onClick={() => setCurrentView('malla')}
                  className={`transition-colors font-medium bg-transparent border-none cursor-pointer text-sm ${currentView === 'malla' ? 'text-[#3B908D] font-bold underline' : 'text-[#907A67] hover:text-[#191114]'}`}
              >
                Malla Interactiva
              </button>
              <a href="#contacto" className="text-[#907A67] hover:text-[#191114] transition-colors">Contacto</a>
            </nav>

            <a
                href="#contacto"
                className="font-sans text-sm font-semibold px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-[#3B908D] to-[#18514A] hover:opacity-95 shadow-md transition-all duration-300"
            >
              Escríbenos
            </a>
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
                <section id="quienes-somos" className="py-20 border-b border-[#907A67]/20">
                  <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <p className="font-sans text-[13.5px] text-[#3B908D] font-semibold mb-3 tracking-wide uppercase">Quiénes somos</p>
                      <h2 className="font-sans text-3xl font-bold tracking-tight text-[#191114] mb-5">Un espacio de construcción estudiantil</h2>
                      <p className="text-[17px] text-[#191114]/80 leading-relaxed mb-4">
                        El CEIS es la instancia de organización estudiantil del programa curricular de Ingeniería de Sistemas y Computación en la Universidad Nacional de Colombia.
                      </p>
                      <p className="text-[17px] text-[#191114]/80 leading-relaxed">
                        Actuamos como un puente dinámico entre las necesidades del estudiantado y la dirección de la facultad, impulsando iniciativas autogestionadas y colaborativas.
                      </p>
                    </div>
                    <div className="bg-[#E6E2D0]/50 p-8 rounded-2xl border border-[#907A67]/20 shadow-sm relative">
                      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#3B908D] flex items-center justify-center text-white font-bold">“</div>
                      <p className="font-serif italic text-lg text-[#191114] leading-relaxed">
                        Las soluciones a nuestros retos académicos y de bienestar surgen cuando nos organizamos y colaboramos activamente como comunidad.
                      </p>
                      <span className="block mt-4 font-sans text-xs font-semibold text-[#3B908D] tracking-wider uppercase">— Principio del Consejo</span>
                    </div>
                  </div>
                </section>

                {/* Nuestro Objetivo */}
                <section id="objetivo" className="py-20 bg-[#E6E2D0]/30 border-b border-[#907A67]/25">
                  <div className="max-w-[1120px] mx-auto px-7 text-center">
                    <p className="font-sans text-[13.5px] text-[#3B908D] font-semibold mb-3 tracking-wide uppercase">Nuestra Brújula</p>
                    <h2 className="font-sans text-3xl md:text-4xl font-bold tracking-tight text-[#191114] mb-8">Objetivo Principal</h2>

                    <div className="max-w-3xl mx-auto bg-[#F6EEE8] border border-[#907A67]/30 p-8 md:p-12 rounded-2xl shadow-md relative">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-[#3B908D] to-[#82B475] flex items-center justify-center text-white shadow-md">
                        <TargetIcon />
                      </div>
                      <p className="text-xl md:text-2xl font-serif text-[#191114] leading-relaxed mt-2">
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
                      className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-[#3B908D] hover:underline mb-8 bg-transparent border-none cursor-pointer p-0"
                  >
                    <ArrowLeft size={16} /> Volver al inicio
                  </button>

                  <div className="bg-white border border-[#907A67]/30 p-6 md:p-10 rounded-3xl shadow-sm">

                    {/* Cabecera con Logos Institutionales */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-[#907A67]/20 pb-6 gap-6">
                      <div className="flex items-center gap-4">
                        <img src="/unal-logo.png" alt="Logo UNAL" className="h-16 w-auto object-contain" />
                      </div>
                      <div className="text-center">
                        <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#191114]">Malla Curricular Interactiva</h2>
                        <p className="font-serif text-[#907A67] mt-1">Ingeniería de Sistemas y Computación - Sede Bogotá</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <img src="/logo.jpg" alt="Logo CEIS" className="h-14 w-14 rounded-full border border-[#907A67]/30 shadow-sm" />
                      </div>
                    </div>

                    <MallaInteractiva />

                  </div>
                </div>
              </div>
          )}

          {/* ---------- CONTACTO (Actualizado con IG y Maps) ---------- */}
          <section id="contacto" className="py-20 bg-[#282F3A] text-[#F6EEE8]">
            <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-sans text-[13.5px] text-[#82B475] font-semibold mb-3 tracking-wide uppercase">Conéctate</p>
                <h2 className="font-sans text-3xl font-bold mb-6">Canales de Comunicación</h2>
                <ul className="space-y-5 font-sans text-sm">

                  {/* Correo */}
                  <li className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#3B908D]/20 border border-[#3B908D]/40 flex items-center justify-center text-[#82B475] shrink-0">
                      <Send size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-[#907A67] block mb-1">Correo institucional</span>
                      <a href="mailto:ceisunal@gmail.com" className="text-base text-[#F6EEE8] hover:text-[#82B475] hover:underline transition-colors">
                        ceisunal@gmail.com
                      </a>
                    </div>
                  </li>

                  {/* Instagram */}
                  <li className="flex items-center gap-4">
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
                  </li>

                  {/* Ubicación Google Maps */}
                  <li className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#3B908D]/20 border border-[#3B908D]/40 flex items-center justify-center text-[#82B475] shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-[#907A67] block mb-1">Ubicación (Sede Bogotá)</span>
                      <a href="https://maps.app.goo.gl/ouzzPmtctqLzsjXm9" target="_blank" rel="noopener noreferrer" className="text-base text-[#F6EEE8] hover:text-[#82B475] hover:underline transition-colors">
                        Edificio 453, oficina 228
                      </a>
                    </div>
                  </li>

                </ul>
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
      { id: '1000003', code: '1000003', name: 'Álgebra Lineal', credits: 4, prereqs: [] },
      { id: '2015734', code: '2015734', name: 'Programación de Computadores', credits: 3, prereqs: [] },
      { id: '2015970', code: '2015970', name: 'Introducción a la Ing. de Sistemas', credits: 3, prereqs: [] },
    ]
  },
  {
    semester: 2,
    courses: [
      { id: '1000005', code: '1000005', name: 'Cálculo Integral', credits: 4, prereqs: ['1000004'] },
      { id: '1000019', code: '1000019', name: 'Física Mecánica', credits: 4, prereqs: ['1000004'] },
      { id: '2016375', code: '2016375', name: 'Program. Orientada a Objetos', credits: 3, prereqs: ['2015734'] },
      { id: '2015188', code: '2015188', name: 'Matemáticas Discretas I', credits: 3, prereqs: ['1000003', '2015734'] },
    ]
  },
  {
    semester: 3,
    courses: [
      { id: '1000006', code: '1000006', name: 'Cálculo en Varias Variables', credits: 4, prereqs: ['1000005', '1000003'] },
      { id: '1000017', code: '1000017', name: 'Física Electromagnetismo', credits: 4, prereqs: ['1000019', '1000005'] },
      { id: '2016335', code: '2016335', name: 'Estructuras de Datos', credits: 3, prereqs: ['2016375'] },
      { id: '2015189', code: '2015189', name: 'Matemáticas Discretas II', credits: 3, prereqs: ['2015188'] },
    ]
  },
  {
    semester: 4,
    courses: [
      { id: '1000020', code: '1000020', name: 'Ecuaciones Diferenciales', credits: 4, prereqs: ['1000006', '1000003'] },
      { id: '2015715', code: '2015715', name: 'Probabilidad y Estadística', credits: 3, prereqs: ['1000005'] },
      { id: '2016342', code: '2016342', name: 'Fundamentos de Bases de Datos', credits: 3, prereqs: ['2016335'] },
      { id: '2016262', code: '2016262', name: 'Arquitectura de Computadores', credits: 3, prereqs: [] },
    ]
  }
];

function MallaInteractiva() {
  const [selectedId, setSelectedId] = useState(null);
  const [lines, setLines] = useState([]);
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

  // Función para calcular y dibujar las líneas conectoras SVG
  useLayoutEffect(() => {
    const drawLines = () => {
      if (!selectedId || !containerRef.current) {
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

      // Líneas de Prerrequisitos (Entrantes) -> Color Verde Musgo
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

      // Líneas de Desbloqueos (Salientes) -> Color Oro/Naranja
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
    // Redibujar si la ventana cambia de tamaño
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
    default: 'bg-[#F6EEE8] text-[#191114] border-[#907A67]/40 hover:border-[#3B908D] z-10 relative',
    dimmed: 'bg-[#F6EEE8]/30 text-[#191114]/30 border-[#907A67]/20 grayscale-[50%] z-10 relative'
  };

  return (
      <div>
        {/* Leyenda interactiva */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 font-sans text-sm bg-[#E6E2D0]/30 py-3 rounded-xl border border-[#907A67]/20">
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#3B908D]"></span> Materia Seleccionada</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#82B475]"></span> Prerrequisito (Debes ver)</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#c08a2e]"></span> Desbloquea (Podrás ver)</div>
          {selectedId && (
              <button onClick={() => setSelectedId(null)} className="ml-4 text-xs font-semibold text-[#18514A] underline bg-transparent border-none cursor-pointer">
                Limpiar selección
              </button>
          )}
        </div>

        {/* Contenedor relativo de la malla donde se dibujan las líneas */}
        <div className="overflow-x-auto pb-12 relative" ref={containerRef}>

          {/* Lienzo SVG para las líneas conectoras estilo Archify */}
          {selectedId && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ minWidth: '100%', minHeight: '100%', zIndex: 0 }}>
                {lines.map((line, i) => {
                  // Curva de Bezier para suavizar la línea de conexión (flowchart style)
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

          {/* Rejilla de semestres */}
          <div className="flex gap-8 min-w-max px-4 pt-4">
            {MALLA_DATA.map((semester) => (
                <div key={semester.semester} className="w-56 shrink-0 flex flex-col gap-5">
                  <div className="text-center font-sans font-bold text-[#18514A] bg-[#82B475]/20 py-2 rounded-lg border border-[#82B475]/40 z-10 relative">
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
                            <span className="font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-black/10">
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

        {/* Definición de la animación de las líneas punteadas en CSS */}
        <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>

        <div className="text-center mt-4">
          <p className="text-xs text-[#907A67] font-sans flex items-center justify-center gap-1">
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