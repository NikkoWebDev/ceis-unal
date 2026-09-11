// Datos extraidos del plan de estudios oficial (SIA) - Ing. de Sistemas y Computacion, UNAL Bogota
// Estructura: semestres -> cursos con prereqs; meta -> componente/agrupacion/tipo; equivalencias -> opciones por asignatura

export interface Curso { id: string; code: string; name: string; credits: number; prereqs: string[] }
export interface Semestre { semester: number; courses: Curso[] }
export interface MetaCurso { comp: 'B' | 'C' | 'L' | 'T'; agrup: string; sub?: string; subCred?: number; tipo: 'OB' | 'OP' | 'L' | 'TG' }
export interface EquivOption { code: string; name: string; credits: number; dept: string; req: string }

export const semestres: Semestre[] = [
  {
    semester: 1,
    courses: [
      {
        id: "1000004",
        code: "1000004",
        name: "Cálculo Diferencial",
        credits: 4,
        prereqs: []
      },
      {
        id: "2025975",
        code: "2025975",
        name: "Introducción a la ingeniería de sistemas y computación",
        credits: 3,
        prereqs: []
      },
      {
        id: "2015734",
        code: "2015734",
        name: "Programación de Computadores",
        credits: 3,
        prereqs: []
      },
      {
        id: "2016703",
        code: "2016703",
        name: "Pensamiento Sistémico",
        credits: 3,
        prereqs: []
      },
      {
        id: "LIB-01",
        code: "LIB",
        name: "Libre Elección",
        credits: 2,
        prereqs: []
      }
    ]
  },
  {
    semester: 2,
    courses: [
      {
        id: "1000019",
        code: "1000019",
        name: "Fundamentos de Mecánica",
        credits: 4,
        prereqs: [
          "1000004"
        ]
      },
      {
        id: "1000005",
        code: "1000005",
        name: "Cálculo Integral",
        credits: 4,
        prereqs: [
          "1000004"
        ]
      },
      {
        id: "1000003",
        code: "1000003",
        name: "Álgebra Lineal",
        credits: 4,
        prereqs: [
          "1000004"
        ]
      },
      {
        id: "2016375",
        code: "2016375",
        name: "Programación Orientada a Objetos",
        credits: 3,
        prereqs: [
          "2015734"
        ]
      }
    ]
  },
  {
    semester: 3,
    courses: [
      {
        id: "1000017",
        code: "1000017",
        name: "Fundamentos de Electricidad y Magnetismo",
        credits: 4,
        prereqs: [
          "1000005",
          "1000019"
        ]
      },
      {
        id: "1000006",
        code: "1000006",
        name: "Cálculo en Varias Variables",
        credits: 4,
        prereqs: [
          "1000005"
        ]
      },
      {
        id: "2025963",
        code: "2025963",
        name: "Matemáticas Discretas I",
        credits: 4,
        prereqs: [
          "1000003"
        ]
      },
      {
        id: "2016353",
        code: "2016353",
        name: "Bases de Datos",
        credits: 3,
        prereqs: [
          "2016375"
        ]
      },
      {
        id: "2016698",
        code: "2016698",
        name: "Elementos de Computadores",
        credits: 3,
        prereqs: [
          "2025975"
        ]
      }
    ]
  },
  {
    semester: 4,
    courses: [
      {
        id: "1000013",
        code: "1000013",
        name: "Probabilidad y Estadística Fundamental",
        credits: 3,
        prereqs: [
          "1000005"
        ]
      },
      {
        id: "2015703",
        code: "2015703",
        name: "Ingeniería Económica",
        credits: 3,
        prereqs: [
          "1000005"
        ]
      },
      {
        id: "2025964",
        code: "2025964",
        name: "Matemáticas Discretas II",
        credits: 4,
        prereqs: [
          "2025963"
        ]
      },
      {
        id: "2016699",
        code: "2016699",
        name: "Estructuras de datos",
        credits: 3,
        prereqs: [
          "2016375"
        ]
      },
      {
        id: "2016697",
        code: "2016697",
        name: "Arquitectura de Computadores",
        credits: 3,
        prereqs: [
          "2016698"
        ]
      }
    ]
  },
  {
    semester: 5,
    courses: [
      {
        id: "2025970",
        code: "2025970",
        name: "Modelos y simulación",
        credits: 3,
        prereqs: [
          "1000013",
          "2016375",
          "1000006",
          "2025964"
        ]
      },
      {
        id: "2015702",
        code: "2015702",
        name: "Gerencia y Gestión de Proyectos",
        credits: 3,
        prereqs: [
          "2015703"
        ]
      },
      {
        id: "2025967",
        code: "2025967",
        name: "Redes de computadores",
        credits: 3,
        prereqs: [
          "1000017",
          "2016699",
          "2016697"
        ]
      },
      {
        id: "2016701",
        code: "2016701",
        name: "Ingeniería de Software I",
        credits: 3,
        prereqs: [
          "2016699",
          "2016703",
          "2016353"
        ]
      },
      {
        id: "2015174",
        code: "2015174",
        name: "Introducción a la Teoría de la Computación",
        credits: 4,
        prereqs: [
          "2025963"
        ]
      }
    ]
  },
  {
    semester: 6,
    courses: [
      {
        id: "2025971",
        code: "2025971",
        name: "Optimización",
        credits: 3,
        prereqs: [
          "2025970"
        ]
      },
      {
        id: "2025982",
        code: "2025982",
        name: "Sistemas de Información",
        credits: 3,
        prereqs: [
          "2015702",
          "2016703",
          "2016353"
        ]
      },
      {
        id: "2015970",
        code: "2015970",
        name: "Métodos Numéricos",
        credits: 3,
        prereqs: [
          "1000006"
        ]
      },
      {
        id: "2016702",
        code: "2016702",
        name: "Ingeniería de Software II",
        credits: 3,
        prereqs: [
          "2016701",
          "2025967"
        ]
      },
      {
        id: "2016696",
        code: "2016696",
        name: "Algoritmos",
        credits: 3,
        prereqs: [
          "1000013",
          "2025964",
          "2016699"
        ]
      },
      {
        id: "2016707",
        code: "2016707",
        name: "Sistemas Operativos",
        credits: 3,
        prereqs: [
          "2016697"
        ]
      }
    ]
  },
  {
    semester: 7,
    courses: [
      {
        id: "2025969",
        code: "2025969",
        name: "Modelos Estocásticos y Simulación en Computación y Comunicaciones",
        credits: 3,
        prereqs: [
          "2025971"
        ]
      },
      {
        id: "2025983",
        code: "2025983",
        name: "Arquitectura de Infraestructura y Gobierno de TICs",
        credits: 3,
        prereqs: [
          "2025982",
          "2016702"
        ]
      },
      {
        id: "2025994",
        code: "2015994",
        name: "Teoría de la Información y Sistemas de Comunicaciones",
        credits: 3,
        prereqs: [
          "1000013",
          "2025967"
        ]
      },
      {
        id: "2016716",
        code: "2016716",
        name: "Arquitectura de Software",
        credits: 3,
        prereqs: [
          "2016702"
        ]
      },
      {
        id: "2025995",
        code: "2025995",
        name: "Introducción a los Sistemas Inteligentes",
        credits: 3,
        prereqs: [
          "2016696"
        ]
      },
      {
        id: "2025966",
        code: "2025966",
        name: "Lenguajes de Programación",
        credits: 3,
        prereqs: [
          "2015174",
          "2016699"
        ]
      }
    ]
  },
  {
    semester: 8,
    courses: [
      {
        id: "2024045",
        code: "2024045",
        name: "Taller de Proyectos Interdisciplinarios (Req: 40 créditos disciplinares)",
        credits: 3,
        prereqs: []
      },
      {
        id: "2016722",
        code: "2016722",
        name: "Computación Paralela y Distribuida",
        credits: 3,
        prereqs: [
          "2016696"
        ]
      },
      {
        id: "2025972",
        code: "2025972",
        name: "Introducción a la Criptografía y a la Seguridad de la Información",
        credits: 3,
        prereqs: [
          "2016696"
        ]
      },
      {
        id: "2025960",
        code: "2025960",
        name: "Computación Visual",
        credits: 3,
        prereqs: [
          "2016696"
        ]
      },
      {
        id: "LIB-02",
        code: "LIB",
        name: "Libre Elección",
        credits: 3,
        prereqs: []
      }
    ]
  },
  {
    semester: 9,
    courses: [
      {
        id: "LIB-03",
        code: "LIB",
        name: "Libre Elección",
        credits: 4,
        prereqs: []
      },
      {
        id: "LIB-04",
        code: "LIB",
        name: "Libre Elección",
        credits: 4,
        prereqs: []
      },
      {
        id: "LIB-05",
        code: "LIB",
        name: "Libre Elección",
        credits: 4,
        prereqs: []
      },
      {
        id: "LIB-06",
        code: "LIB",
        name: "Libre Elección",
        credits: 4,
        prereqs: []
      }
    ]
  },
  {
    semester: 10,
    courses: [
      {
        id: "LIB-07",
        code: "LIB",
        name: "Libre Elección",
        credits: 4,
        prereqs: []
      },
      {
        id: "LIB-08",
        code: "LIB",
        name: "Libre Elección",
        credits: 4,
        prereqs: []
      },
      {
        id: "LIB-09",
        code: "LIB",
        name: "Libre Elección",
        credits: 4,
        prereqs: []
      },
      {
        id: "TRAB-GRADO",
        code: "GRADO",
        name: "Trabajo de Grado (Req: 60 créditos disciplinares)",
        credits: 6,
        prereqs: []
      }
    ]
  }
];

export const metaCursos: Record<string, MetaCurso> = {
  "1000003": {
    comp: "B",
    agrup: "Matemáticas",
    sub: "Álgebra Lineal",
    subCred: 4,
    tipo: "OP"
  },
  "1000004": {
    comp: "B",
    agrup: "Matemáticas",
    sub: "Cálculo Diferencial",
    subCred: 4,
    tipo: "OP"
  },
  "1000005": {
    comp: "B",
    agrup: "Matemáticas",
    sub: "Cálculo Integral",
    subCred: 4,
    tipo: "OP"
  },
  "1000006": {
    comp: "B",
    agrup: "Matemáticas",
    sub: "Cálculo en Varias Variables",
    subCred: 4,
    tipo: "OP"
  },
  "1000013": {
    comp: "B",
    agrup: "Probabilidad y Estadística",
    tipo: "OP"
  },
  "1000017": {
    comp: "B",
    agrup: "Física",
    tipo: "OB"
  },
  "1000019": {
    comp: "B",
    agrup: "Física",
    tipo: "OB"
  },
  "2015174": {
    comp: "B",
    agrup: "Ciencias de la Computación",
    tipo: "OB"
  },
  "2015702": {
    comp: "B",
    agrup: "Ciencias Económicas y Administrativas",
    sub: "Gerencia y Gestión de Proyectos",
    subCred: 3,
    tipo: "OP"
  },
  "2015703": {
    comp: "B",
    agrup: "Ciencias Económicas y Administrativas",
    sub: "Ingeniería Económica",
    subCred: 3,
    tipo: "OP"
  },
  "2015734": {
    comp: "C",
    agrup: "Métodos y Tecnologías de Software",
    sub: "Programación de Computadores",
    subCred: 3,
    tipo: "OP"
  },
  "2015970": {
    comp: "B",
    agrup: "Ciencias de la Computación",
    sub: "Métodos Numéricos",
    subCred: 3,
    tipo: "OP"
  },
  "2016353": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    sub: "Bases de Datos",
    subCred: 3,
    tipo: "OP"
  },
  "2016375": {
    comp: "C",
    agrup: "Métodos y Tecnologías de Software",
    tipo: "OB"
  },
  "2016696": {
    comp: "B",
    agrup: "Ciencias de la Computación",
    tipo: "OB"
  },
  "2016697": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    tipo: "OB"
  },
  "2016698": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    sub: "Elementos de Computadores",
    subCred: 3,
    tipo: "OP"
  },
  "2016699": {
    comp: "C",
    agrup: "Métodos y Tecnologías de Software",
    tipo: "OB"
  },
  "2016701": {
    comp: "C",
    agrup: "Métodos y Tecnologías de Software",
    tipo: "OB"
  },
  "2016702": {
    comp: "C",
    agrup: "Métodos y Tecnologías de Software",
    tipo: "OB"
  },
  "2016703": {
    comp: "C",
    agrup: "Modelos, Sistemas, Optimización y Simulación",
    tipo: "OB"
  },
  "2016707": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    tipo: "OB"
  },
  "2016716": {
    comp: "C",
    agrup: "Métodos y Tecnologías de Software",
    tipo: "OB"
  },
  "2016722": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    tipo: "OB"
  },
  "2024045": {
    comp: "C",
    agrup: "Contexto Profesional e Interdisciplinario",
    sub: "Taller Interdisciplinario de Proyectos de Creación y Gestión",
    subCred: 3,
    tipo: "OP"
  },
  "2025960": {
    comp: "C",
    agrup: "Computación Aplicada",
    tipo: "OP"
  },
  "2025963": {
    comp: "B",
    agrup: "Ciencias de la Computación",
    sub: "Matemáticas Discretas I",
    subCred: 4,
    tipo: "OP"
  },
  "2025964": {
    comp: "B",
    agrup: "Ciencias de la Computación",
    sub: "Matemáticas Discretas II",
    subCred: 4,
    tipo: "OP"
  },
  "2025966": {
    comp: "C",
    agrup: "Métodos y Tecnologías de Software",
    sub: "Lenguajes",
    subCred: 3,
    tipo: "OP"
  },
  "2025967": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    tipo: "OB"
  },
  "2025969": {
    comp: "C",
    agrup: "Modelos, Sistemas, Optimización y Simulación",
    tipo: "OB"
  },
  "2025970": {
    comp: "C",
    agrup: "Modelos, Sistemas, Optimización y Simulación",
    sub: "Modelos y Sistemas",
    subCred: 3,
    tipo: "OP"
  },
  "2025971": {
    comp: "C",
    agrup: "Modelos, Sistemas, Optimización y Simulación",
    sub: "Optimización",
    subCred: 3,
    tipo: "OP"
  },
  "2025972": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    sub: "Criptografía y Seguridad de la Información",
    subCred: 3,
    tipo: "OP"
  },
  "2025975": {
    comp: "C",
    agrup: "Contexto Profesional e Interdisciplinario",
    tipo: "OB"
  },
  "2025982": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    sub: "Sistemas de Información",
    subCred: 3,
    tipo: "OP"
  },
  "2025983": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    tipo: "OB"
  },
  "2025994": {
    comp: "C",
    agrup: "Infraestructura Computacional, de Comunicaciones y de Información",
    sub: "Información y Comunicaciones",
    subCred: 3,
    tipo: "OP"
  },
  "2025995": {
    comp: "C",
    agrup: "Sistemas Inteligentes",
    tipo: "OP"
  }
};

export const equivalencias: Record<string, EquivOption[]> = {
  "1000003": [
    {
      code: "2015555",
      name: "Álgebra Lineal Básica",
      credits: 4,
      dept: "Matemáticas",
      req: "Cálculo Diferencial o Cálculo Diferencial en una Variable"
    }
  ],
  "1000004": [
    {
      code: "2016377",
      name: "Cálculo Diferencial en una Variable",
      credits: 4,
      dept: "Matemáticas",
      req: "Matemáticas Básicas"
    }
  ],
  "1000005": [
    {
      code: "2015556",
      name: "Cálculo integral en una variable",
      credits: 4,
      dept: "Matemáticas",
      req: "Cálculo Diferencial o Cálculo Diferencial en una Variable"
    }
  ],
  "1000006": [
    {
      code: "2015162",
      name: "Cálculo Vectorial",
      credits: 4,
      dept: "Matemáticas",
      req: "Cálculo Integral o Cálculo integral en una variable"
    }
  ],
  "1000013": [
    {
      code: "2027877",
      name: "Probabilidad Fundamental",
      credits: 4,
      dept: "Probabilidad y Estadística",
      req: "Cálculo Integral o Cálculo integral en una variable"
    },
    {
      code: "2015178",
      name: "Probabilidad",
      credits: 4,
      dept: "Probabilidad y Estadística",
      req: "Cálculo Integral o Cálculo integral en una variable"
    }
  ],
  "2015702": [
    {
      code: "2016028",
      name: "Diseño, Gestión y Evaluación de Proyectos",
      credits: 4,
      dept: "Ciencias Económicas y Administrativas",
      req: "Ingeniería Económica o sus equivalentes"
    }
  ],
  "2015703": [
    {
      code: "2025986",
      name: "Ingeniería Económica y Análisis de Riesgo",
      credits: 3,
      dept: "Ciencias Económicas y Administrativas",
      req: "Cálculo Integral o en una variable y Probabilidad (o equivalentes)"
    },
    {
      code: "2016047",
      name: "Modelos Económicos Computacionales",
      credits: 3,
      dept: "Ciencias Económicas y Administrativas",
      req: "Cálculo Integral o Cálculo integral en una variable"
    }
  ],
  "2015734": [
    {
      code: "2026573",
      name: "Introducción a las ciencias de la computación y a la programación",
      credits: 3,
      dept: "Métodos y Tecnologías de Software",
      req: "Sin prerrequisitos"
    }
  ],
  "2015970": [
    {
      code: "2019072",
      name: "Análisis Numérico I",
      credits: 4,
      dept: "Ciencias de la Computación",
      req: "Cálculo en Varias Variables o Cálculo Vectorial"
    }
  ],
  "2016353": [
    {
      code: "2027641",
      name: "Análisis de bases de datos",
      credits: 3,
      dept: "Infraestructura Computacional",
      req: "Programación Orientada a Objetos"
    }
  ],
  "2016698": [
    {
      code: "2016498",
      name: "Electrónica Digital I",
      credits: 4,
      dept: "Infraestructura Computacional",
      req: "Electrónica Análoga I"
    }
  ],
  "2024045": [
    {
      code: "2016615",
      name: "Taller de Invención y Creatividad",
      credits: 3,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2017275",
      name: "Proyecto aplicado de ingeniería",
      credits: 4,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2016093",
      name: "Taller de énfasis en animación y narrativas audiovisuales I",
      credits: 3,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2016091",
      name: "Taller de énfasis en multimedia e imagen digital I",
      credits: 3,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2026551",
      name: "Creación y Gestión de Empresas",
      credits: 3,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2016007",
      name: "Fundamentos de Administración",
      credits: 4,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2016600",
      name: "Gestión Tecnológica",
      credits: 3,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2016599",
      name: "Gestión de la Ciencia, la Tecnología y la Innovación",
      credits: 3,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2016741",
      name: "Finanzas",
      credits: 3,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    },
    {
      code: "2016037",
      name: "Finanzas Avanzadas",
      credits: 4,
      dept: "Contexto Profesional e Interdisciplinario",
      req: "40 créditos disciplinares y Gerencia (o equivalente)"
    }
  ],
  "2025960": [
    {
      code: "2016788",
      name: "Tecnología Digital",
      credits: 3,
      dept: "Computación Aplicada",
      req: "Arquitectura de computadores"
    },
    {
      code: "2016753",
      name: "Microcontroladores",
      credits: 3,
      dept: "Computación Aplicada",
      req: "Arquitectura de computadores"
    },
    {
      code: "2016080",
      name: "Aplicaciones gráficas tridimensionales",
      credits: 3,
      dept: "Computación Aplicada",
      req: "Algoritmos"
    },
    {
      code: "2025196",
      name: "Introducción a la biología computacional",
      credits: 4,
      dept: "Computación Aplicada",
      req: "Algoritmos"
    },
    {
      code: "2026548",
      name: "Introducción al Análisis Combinatorio",
      credits: 4,
      dept: "Computación Aplicada",
      req: "Algoritmos"
    },
    {
      code: "2028837",
      name: "Matemáticas del aprendizaje de máquinas",
      credits: 4,
      dept: "Computación Aplicada",
      req: "Algoritmos"
    },
    {
      code: "2027309",
      name: "Análisis forense digital",
      credits: 4,
      dept: "Computación Aplicada",
      req: "Algoritmos"
    },
    {
      code: "2029297",
      name: "Introducción a la Computación de Alto Rendimiento",
      credits: 4,
      dept: "Computación Aplicada",
      req: "Algoritmos"
    },
    {
      code: "2016770",
      name: "Robótica",
      credits: 3,
      dept: "Computación Aplicada",
      req: "Fund. Electricidad y Magnetismo, Arquitectura de computadores y Algoritmos"
    }
  ],
  "2025963": [
    {
      code: "2015168",
      name: "Fundamentos de Matemáticas",
      credits: 4,
      dept: "Ciencias de la Computación",
      req: "Álgebra Lineal o Álgebra Lineal Básica"
    }
  ],
  "2025964": [
    {
      code: "2015181",
      name: "Sistemas numéricos",
      credits: 4,
      dept: "Ciencias de la Computación",
      req: "Matemáticas Discretas I o Fundamentos de Matemáticas"
    }
  ],
  "2025966": [
    {
      code: "2027642",
      name: "Compiladores",
      credits: 3,
      dept: "Métodos y Tecnologías de Software",
      req: "Estructuras de Datos e Introducción a la Teoría de la Computación"
    },
    {
      code: "2027628",
      name: "Teoría de Lenguajes Formales",
      credits: 3,
      dept: "Métodos y Tecnologías de Software",
      req: "Estructuras de Datos e Introducción a la Teoría de la Computación"
    }
  ],
  "2025970": [
    {
      code: "2019082",
      name: "Modelos matemáticos I",
      credits: 4,
      dept: "Modelos, Sistemas, Optimización y Simulación",
      req: "POO, Cálculo en Varias Variables o Vectorial, Mat. Discretas II o Sistemas numéricos y Probabilidad (o equivalentes)"
    },
    {
      code: "2017293",
      name: "Modelación matemática",
      credits: 3,
      dept: "Modelos, Sistemas, Optimización y Simulación",
      req: "POO, Cálculo en Varias Variables o Vectorial, Mat. Discretas II o Sistemas numéricos y Probabilidad (o equivalentes)"
    }
  ],
  "2025971": [
    {
      code: "2015173",
      name: "Introducción a la Optimización",
      credits: 4,
      dept: "Modelos, Sistemas, Optimización y Simulación",
      req: "Modelos y Simulación o Modelos Matemáticos I o Modelación matemática"
    }
  ],
  "2025972": [
    {
      code: "2027311",
      name: "Introducción a la criptografía y a la teoría de información",
      credits: 4,
      dept: "Infraestructura Computacional",
      req: "Algoritmos"
    },
    {
      code: "2027313",
      name: "Teoría de la codificación",
      credits: 4,
      dept: "Infraestructura Computacional",
      req: "Algoritmos"
    },
    {
      code: "2027310",
      name: "Criptografía",
      credits: 3,
      dept: "Infraestructura Computacional",
      req: "Algoritmos"
    }
  ],
  "2025982": [
    {
      code: "2016053",
      name: "Sistemas de Información Gerencial",
      credits: 4,
      dept: "Infraestructura Computacional",
      req: "Bases de Datos, Gerencia y Pensamiento Sistémico (o equivalentes)"
    }
  ],
  "2025994": [
    {
      code: "2016492",
      name: "Comunicaciones",
      credits: 3,
      dept: "Infraestructura Computacional",
      req: "Líneas y Antenas"
    }
  ],
  "2025995": [
    {
      code: "2016748",
      name: "Inteligencia artificial",
      credits: 3,
      dept: "Sistemas Inteligentes",
      req: "Algoritmos"
    },
    {
      code: "2023251",
      name: "Inteligencia artificial y minirobots",
      credits: 3,
      dept: "Sistemas Inteligentes",
      req: "Algoritmos"
    },
    {
      code: "2027631",
      name: "Introducción a la inteligencia artificial",
      credits: 3,
      dept: "Sistemas Inteligentes",
      req: "Algoritmos"
    },
    {
      code: "2028837",
      name: "Matemáticas del aprendizaje de máquinas",
      credits: 4,
      dept: "Sistemas Inteligentes",
      req: "Algoritmos"
    },
    {
      code: "2017290",
      name: "Técnicas de Inteligencia Artificial",
      credits: 3,
      dept: "Sistemas Inteligentes",
      req: "Algoritmos"
    }
  ],
  "TRAB-GRADO": [
    {
      code: "2025974",
      name: "Trabajo de Grado - Trabajo Investigativo",
      credits: 6,
      dept: "Trabajo de Grado",
      req: "60 créditos del componente disciplinar"
    },
    {
      code: "2025973",
      name: "Trabajo de Grado - Práctica de Extensión",
      credits: 6,
      dept: "Trabajo de Grado",
      req: "60 créditos del componente disciplinar"
    },
    {
      code: "2016843",
      name: "Trabajo de Grado - Asignaturas de Posgrado",
      credits: 6,
      dept: "Trabajo de Grado",
      req: "60 créditos del componente disciplinar"
    }
  ]
};

export const componentes = { B: { label: 'Fundamentacion', color: '#5B8DB8' }, C: { label: 'Formacion profesional', color: '#3B908D' }, L: { label: 'Libre eleccion', color: '#907A67' }, T: { label: 'Trabajo de grado', color: '#c08a2e' } } as const;

export const tipos = { OB: 'Obligatoria', OP: 'Optativa', L: 'Libre eleccion', TG: 'Trabajo de grado' } as const;

export const REGLAMENTO_URL = 'https://legal.unal.edu.co/rlunal/home/doc.jsp?d_i=106142';
