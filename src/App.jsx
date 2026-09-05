import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function CEISLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <div className="min-h-screen bg-[#f0eee2] text-[#17231b] font-serif selection:bg-[#c08a2e] selection:text-[#0d160f] antialiased">

        {/* ---------- Header ---------- */}
        <header className="sticky top-0 z-50 bg-[#f0eee2]/90 backdrop-blur-md border-b border-[#17231b]/15">
          <div className="max-w-[1120px] mx-auto px-7 py-4 flex items-center justify-between">
            <a href="#inicio" className="flex items-center gap-3 font-bold text-[17px] text-[#17231b] font-sans">
              <svg viewBox="0 0 40 40" aria-hidden="true" className="w-8 h-8 shrink-0">
                <circle cx="20" cy="20" r="19" fill="none" stroke="#17231b" strokeWidth="1.4"/>
                <circle cx="20" cy="11" r="2.6" fill="#c08a2e"/>
                <circle cx="29" cy="24" r="2.2" fill="#17231b"/>
                <circle cx="11" cy="24" r="2.2" fill="#17231b"/>
                <path d="M20 13.4 L27.6 22.6 M20 13.4 L12.4 22.6 M12.4 24 L27.6 24" stroke="#17231b" strokeWidth="1.2" fill="none"/>
              </svg>
              <span className="flex flex-col leading-tight">
              <span className="text-base tracking-wide">CEIS</span>
              <span className="text-[11px] text-[#3a453b] font-serif italic font-normal">Ing. de Sistemas · UNAL</span>
            </span>
            </a>

            {/* Menú de Escritorio */}
            <nav className="hidden md:flex gap-7 font-sans">
              {['Quiénes somos', 'Misión y visión', 'El consejo', 'Comisiones', 'Participa', 'Contacto'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[14.5px] text-[#3a453b] hover:text-[#17231b] transition-colors relative group py-1">
                    {item}
                    <span className="absolute left-0 right-full bottom-0 h-px bg-[#8c6423] transition-all duration-250 group-hover:right-0"></span>
                  </a>
              ))}
            </nav>

            <div className="hidden md:block">
              <a href="#contacto" className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded border border-[#17231b]/15 text-[#17231b] hover:border-[#17231b] transition-colors whitespace-nowrap">
                Escríbenos
              </a>
            </div>

            {/* Botón Menú Móvil */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menú Móvil Desplegable */}
          {isMenuOpen && (
              <nav className="md:hidden absolute top-full left-0 right-0 bg-[#f0eee2] border-b border-[#17231b]/15 flex flex-col px-7 pb-4 font-sans">
                {['Quiénes somos', 'Misión y visión', 'El consejo', 'Comisiones', 'Participa', 'Contacto'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setIsMenuOpen(false)} className="py-3 border-t border-[#17231b]/15 text-[14.5px] text-[#3a453b]">
                      {item}
                    </a>
                ))}
              </nav>
          )}
        </header>

        <main>
          {/* ---------- Hero ---------- */}
          <section className="bg-[radial-gradient(ellipse_at_20%_-10%,#1c2c1f_0%,#0d160f_55%)] text-[#f0eee2] pt-22 overflow-hidden" id="inicio">
            <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
              <span className="inline-block font-sans text-[13px] text-[#cfd6c7] border border-[#f0eee2]/15 rounded-full px-3.5 py-1.5 mb-6">
                Facultad de Ingeniería, Universidad Nacional de Colombia
              </span>
                <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-[#f0eee2] max-w-[14ch]">
                  La voz organizada de Ingeniería de Sistemas
                </h1>
                <p className="font-serif text-lg text-[#c9d0c1] mt-5 max-w-[46ch] leading-relaxed">
                  El CEIS representa a las y los estudiantes del programa ante la Universidad, impulsa la vida académica del salón de clase hacia afuera, y convierte las inquietudes cotidianas en propuestas concretas.
                </p>
                <div className="flex flex-wrap gap-3.5 mt-9 font-sans">
                  <a href="#estructura" className="inline-flex items-center text-sm font-semibold px-5 py-2.5 rounded border border-[#c08a2e] bg-[#c08a2e] text-[#1c1400] hover:bg-[#d59c3f] hover:border-[#d59c3f] transition-colors">
                    Conoce al consejo
                  </a>
                  <a href="#mision-y-vision" className="inline-flex items-center text-sm font-semibold px-5 py-2.5 rounded border border-[#f0eee2]/15 text-[#f0eee2] hover:border-[#f0eee2] transition-colors">
                    Ver misión y visión
                  </a>
                </div>
              </div>

              <div className="relative order-first md:order-last max-w-[280px] md:max-w-full mx-auto md:mx-0 mb-4 md:mb-0">
                <svg viewBox="0 0 320 320" aria-hidden="true" className="w-full h-auto">
                  <g className="stroke-[#f0eee2]/35 stroke-1 fill-none">
                    <path d="M160 160 L160 60"/>
                    <path d="M160 160 L245 108"/>
                    <path d="M160 160 L245 212"/>
                    <path d="M160 160 L160 260"/>
                    <path d="M160 160 L75 212"/>
                    <path d="M160 160 L75 108"/>
                  </g>
                  <g className="stroke-[#f0eee2]/15">
                    <circle cx="160" cy="160" r="100" strokeDasharray="2 6" strokeWidth="1" fill="none"/>
                  </g>
                  <circle className="fill-[#c08a2e]" cx="160" cy="160" r="9" />
                  <circle className="fill-[#f0eee2]" cx="160" cy="60" r="6" />
                  <circle className="fill-[#f0eee2]" cx="245" cy="108" r="6" />
                  <circle className="fill-[#f0eee2]" cx="245" cy="212" r="6" />
                  <circle className="fill-[#f0eee2]" cx="160" cy="260" r="6" />
                  <circle className="fill-[#f0eee2]" cx="75" cy="212" r="6" />
                  <circle className="fill-[#f0eee2]" cx="75" cy="108" r="6" />
                </svg>
              </div>
            </div>

            <div className="border-t border-[#f0eee2]/15 mt-16 py-5">
              <div className="max-w-[1120px] mx-auto px-7 flex flex-wrap gap-10 text-[13.5px] text-[#aeb8a4] font-sans font-medium">
                <span>Programa curricular de Ingeniería de Sistemas y Computación</span>
                <span>Representación ante el Consejo de Facultad</span>
                <span>Asambleas estudiantiles abiertas cada semestre</span>
              </div>
            </div>
          </section>

          {/* ---------- Quiénes somos ---------- */}
          <section id="quiénes-somos" className="py-24">
            <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-[1fr_0.85fr] gap-16 md:gap-16 items-start">
              <div>
                <p className="font-sans text-[13.5px] text-[#55684f] font-semibold mb-3.5">Quiénes somos</p>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-[#17231b] mb-6">Un consejo hecho por y para estudiantes</h2>
                <p className="max-w-[62ch] text-[16.5px] mb-4 text-[#17231b] leading-relaxed">
                  El CEIS es la instancia de organización estudiantil del programa curricular de Ingeniería de Sistemas y Computación en la Universidad Nacional de Colombia. Nació de una idea sencilla: las decisiones que afectan a los estudiantes deben construirse con los estudiantes, no solo para ellos.
                </p>
                <p className="max-w-[62ch] text-[16.5px] text-[#17231b] leading-relaxed">
                  Funcionamos como puente entre el salón de clase y las instancias de decisión de la Facultad de Ingeniería: llevamos las inquietudes académicas, de bienestar y de convivencia a los espacios donde se toman decisiones, y devolvemos esa información a nuestros compañeros de forma clara y oportuna.
                </p>
              </div>
              <div className="md:border-l border-t md:border-t-0 border-[#17231b]/15 pt-6 md:pt-0 md:pl-7">
                <p className="italic text-[19px] leading-relaxed text-[#17231b]">
                  "Una universidad pública se construye también desde la organización de quienes la habitan todos los días."
                  <span className="block mt-3.5 font-sans text-[13px] text-[#3a453b] not-italic">Principio orientador del CEIS</span>
                </p>
              </div>
            </div>
          </section>

          {/* ---------- Misión / Visión ---------- */}
          <section id="misión-y-visión" className="bg-[#e6e2d0] py-24">
            <div className="max-w-[1120px] mx-auto px-7">
              <div className="mb-11">
                <p className="font-sans text-[13.5px] text-[#55684f] font-semibold mb-3.5">Rumbo del consejo</p>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-[#17231b]">Misión, visión y objetivos</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#17231b]/15 border border-[#17231b]/15">
                <div className="bg-[#e6e2d0] p-9 md:p-10">
                  <span className="inline-block w-[26px] h-[2px] bg-[#8c6423] mb-4"></span>
                  <h3 className="font-sans text-xl font-semibold mb-4 text-[#17231b]">Misión</h3>
                  <p className="text-[16px]">
                    Representar de manera legítima y activa a los estudiantes de Ingeniería de Sistemas y Computación, canalizando sus inquietudes académicas y de bienestar, y promoviendo su participación directa en las decisiones de la Facultad de Ingeniería y de la Universidad Nacional de Colombia.
                  </p>
                </div>
                <div className="bg-[#e6e2d0] p-9 md:p-10">
                  <span className="inline-block w-[26px] h-[2px] bg-[#8c6423] mb-4"></span>
                  <h3 className="font-sans text-xl font-semibold mb-4 text-[#17231b]">Visión</h3>
                  <p className="text-[16px]">
                    Ser reconocido como un consejo estudiantil cercano, propositivo y transparente: un referente de organización dentro de la Universidad y un espacio donde cualquier estudiante del programa encuentra respaldo, información y una vía real para incidir en su vida académica.
                  </p>
                </div>
              </div>

              <div className="mt-14">
                <h3 className="font-sans text-[15px] text-[#3a453b] font-semibold mb-5">Objetivos</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 m-0 p-0 list-none">
                  {[
                    'Canalizar y gestionar ante la Facultad las inquietudes académicas y administrativas del estudiantado.',
                    'Promover la participación estudiantil en los espacios de decisión del programa y la Facultad.',
                    'Fortalecer el sentido de comunidad dentro de Ingeniería de Sistemas y Computación.',
                    'Impulsar iniciativas de bienestar, investigación y extensión lideradas por estudiantes.',
                    'Mantener canales de comunicación abiertos y transparentes con los representados.',
                    'Acompañar a los representantes estudiantiles ante otras instancias de la Universidad.'
                  ].map((obj, i) => (
                      <li key={i} className="flex gap-3.5 py-4 border-t border-[#17231b]/15 text-[15.5px]">
                        <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#8c6423] mt-2.5"></div>
                        <span>{obj}</span>
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ---------- El Consejo (Estructura) ---------- */}
          <section id="el-consejo" className="py-24">
            <div className="max-w-[1120px] mx-auto px-7">
              <div className="mb-11">
                <p className="font-sans text-[13.5px] text-[#55684f] font-semibold mb-3.5">Composición</p>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-[#17231b]">El consejo</h2>
                <p className="max-w-[62ch] text-[16px] text-[#3a453b] mt-3.5">
                  Mesa directiva y representantes vigentes. Los nombres son un espacio de plantilla: reemplázalos por los integrantes elegidos en tu programa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-l border-[#17231b]/15">
                {[
                  { role: 'Presidencia', name: 'Nombre Apellido' },
                  { role: 'Vicepresidencia', name: 'Nombre Apellido' },
                  { role: 'Secretaría general', name: 'Nombre Apellido' },
                  { role: 'Planeación y finanzas', name: 'Nombre Apellido' },
                  { role: 'Comunicaciones', name: 'Nombre Apellido' },
                  { role: 'Bienestar y convivencia', name: 'Nombre Apellido' }
                ].map((member, i) => (
                    <div key={i} className="border-r border-b border-[#17231b]/15 p-7">
                      <p className="font-sans text-[12.5px] text-[#8c6423] font-semibold mb-2.5 tracking-wide">{member.role}</p>
                      <p className="font-sans text-lg font-semibold text-[#17231b]">{member.name}</p>
                      <span className="block mt-1.5 text-[12.5px] text-[#3a453b] italic">Semestre — correo</span>
                    </div>
                ))}
              </div>

              <div className="mt-14">
                <h3 className="font-sans text-[15px] text-[#3a453b] font-semibold mb-5">Representantes por semestre</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[1px] bg-[#17231b]/15 border border-[#17231b]/15">
                  {[
                    { sem: '1.º y 2.º semestre' },
                    { sem: '3.º y 4.º semestre' },
                    { sem: '5.º y 6.º semestre' },
                    { sem: '7.º y 8.º semestre' },
                    { sem: '9.º y 10.º semestre' }
                  ].map((rep, i) => (
                      <div key={i} className="bg-[#f0eee2] p-4 text-[14px]">
                        <span className="block font-sans text-[12px] text-[#55684f] font-medium mb-1.5">{rep.sem}</span>
                        Nombre Apellido
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------- Comisiones ---------- */}
          <section id="comisiones" className="bg-[#152218] text-[#f0eee2] py-24">
            <div className="max-w-[1120px] mx-auto px-7">
              <div className="mb-11">
                <p className="font-sans text-[13.5px] text-[#9db08f] font-semibold mb-3.5">Ejes de trabajo</p>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-[#f0eee2]">Comisiones del consejo</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#f0eee2]/15 border border-[#f0eee2]/15">
                {[
                  { title: 'Académica', desc: 'Vela por la calidad del plan de estudios, los syllabus y la relación con los docentes del programa.' },
                  { title: 'Bienestar y convivencia', desc: 'Acompaña situaciones de salud mental, apoyo entre pares y espacios de encuentro fuera del aula.' },
                  { title: 'Comunicaciones', desc: 'Mantiene informado al programa sobre la gestión del consejo a través de boletines y redes.' },
                  { title: 'Investigación y extensión', desc: 'Impulsa semilleros, proyectos y alianzas con egresados, empresas y la comunidad.' },
                  { title: 'Representación y gestión', desc: 'Articula la voz estudiantil ante el Consejo de Facultad, de Sede y demás instancias.' },
                  { title: 'Género y equidad', desc: 'Promueve un programa libre de discriminación, con protocolos claros y acompañamiento.' }
                ].map((comm, i) => (
                    <div key={i} className="bg-[#152218] p-8 md:p-9">
                      <h3 className="font-sans text-lg font-semibold text-[#f0eee2] mb-3">{comm.title}</h3>
                      <p className="text-[15px] text-[#c2c9b8] leading-relaxed">{comm.desc}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------- Participa ---------- */}
          <section id="participa" className="py-24">
            <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-16">
              <div>
                <p className="font-sans text-[13.5px] text-[#55684f] font-semibold mb-3.5">Súmate</p>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-[#17231b]">Cómo puedes participar</h2>
                <p className="max-w-[62ch] text-[16px] text-[#3a453b] mt-4.5 leading-relaxed">
                  No hace falta ser parte de la mesa directiva para aportar. El consejo funciona mejor entre más estudiantes se involucren, así sea desde una sola comisión.
                </p>
              </div>
              <ul className="m-0 p-0 list-none">
                {[
                  { num: '1', title: 'Asiste a una asamblea', desc: 'Las asambleas del programa son abiertas: allí se discuten los temas del semestre y cualquier estudiante puede tomar la palabra.' },
                  { num: '2', title: 'Súmate a una comisión', desc: 'Elige el eje de trabajo que más te interese —académico, bienestar, comunicaciones— y participa sin necesidad de ser electo.' },
                  { num: '3', title: 'Postúlate como representante', desc: 'Cada semestre se eligen representantes por curso y cargos de la mesa directiva. Las convocatorias se anuncian con anticipación.' }
                ].map((step, i) => (
                    <li key={i} className={`flex gap-5 py-5 border-t border-[#17231b]/15 ${i === 2 ? 'border-b' : ''}`}>
                      <span className="font-sans text-[14px] text-[#8c6423] font-semibold shrink-0 w-5">{step.num}</span>
                      <div>
                        <h4 className="text-[16.5px] font-semibold mb-1.5 text-[#17231b]">{step.title}</h4>
                        <p className="text-[15px] text-[#3a453b] leading-relaxed">{step.desc}</p>
                      </div>
                    </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ---------- Contacto ---------- */}
          <section id="contacto" className="bg-[#e6e2d0] py-24">
            <div className="max-w-[1120px] mx-auto px-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <p className="font-sans text-[13.5px] text-[#55684f] font-semibold mb-3.5">Hablemos</p>
                  <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-[#17231b]">Contacto</h2>
                  <ul className="mt-6 p-0 list-none">
                    {[
                      { label: 'Correo', value: 'ceis_bog@unal.edu.co', icon: <><path d="M3 6h18v12H3z"/><path d="M3 6l9 7 9-7"/></> },
                    { label: 'Instagram', value: '@ceis.unal', icon: <><rect x="4" y="2" width="16" height="20" rx="3"/><path d="M9 6h6M9 18h6"/></> },
                    { label: 'Ubicación', value: 'Facultad de Ingeniería, Ciudad Universitaria, Bogotá D.C.', icon: <><path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></> }
                      ].map((contact, i) => (
                      <li key={i} className={`flex items-center gap-3.5 py-3.5 border-t border-[#17231b]/15 ${i === 2 ? 'border-b' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0 text-[#55684f]">
                      {contact.icon}
                    </svg>
                    <div>
                      <span className="block font-sans text-[12px] text-[#3a453b]">{contact.label}</span>
                      <span className="text-[15.5px] text-[#17231b]">{contact.value}</span>
                    </div>
                  </li>
                  ))}
                </ul>
              </div>
              <div className="border border-[#17231b]/15 bg-[#f0eee2] p-7 flex flex-col justify-between h-full">
                <div>
                  <p className="font-sans text-[13.5px] text-[#55684f] font-semibold mb-2.5">Asambleas</p>
                  <p className="text-[14.5px] text-[#3a453b] leading-relaxed">
                    Las asambleas estudiantiles se convocan cada semestre y se avisan por los canales oficiales del consejo. Si tienes una inquietud puntual, también puedes escribirnos directamente.
                  </p>
                </div>
                <a href="mailto:ceis_bog@unal.edu.co" className="self-start mt-6 font-sans text-sm font-semibold px-5 py-2.5 rounded border border-[#17231b] bg-[#17231b] text-[#f0eee2] hover:bg-[#55684f] hover:border-[#55684f] transition-colors">
                  Escribir al consejo
                </a>
              </div>
            </div>
      </div>
</section>
</main>

{/* ---------- Footer ---------- */}
  <footer className="bg-[#0d160f] text-[#9aa693] pt-12 pb-9 text-[13.5px]">
    <div className="max-w-[1120px] mx-auto px-7 flex flex-wrap justify-between items-center gap-4">
      <span>CEIS · Consejo Estudiantil de Ingeniería de Sistemas — Universidad Nacional de Colombia</span>
      <div className="flex gap-6 font-sans">
        <a href="#inicio" className="hover:text-[#f0eee2] transition-colors">Inicio</a>
        <a href="#el-consejo" className="hover:text-[#f0eee2] transition-colors">El consejo</a>
        <a href="#contacto" className="hover:text-[#f0eee2] transition-colors">Contacto</a>
      </div>
    </div>
  </footer>
</div>
);
}