# CEIS · Consejo Estudiantil de Ingeniería de Sistemas — UNAL

Landing page del CEIS (Universidad Nacional de Colombia, sede Bogotá): presentación del consejo,
**malla curricular interactiva** basada en el Acuerdo 11 de 2023 y **foro** con login de Google
restringido a cuentas `@unal.edu.co`.

## Stack

- React 19 + Vite 8 + Tailwind CSS 4 + lucide-react
- Supabase (Auth con Google + Postgres + Storage) para el foro
- Lint con `oxlint`, deploy en Vercel

## Funcionalidades

- **Inicio**: hero con parallax, quiénes somos, objetivo, pilares y contacto, con animaciones de scroll.
- **Malla curricular interactiva**: prerrequisitos y desbloqueos con líneas SVG, tipología por asignatura
  (componente, agrupación, obligatoria/optativa según el acuerdo), optativas equivalentes con
  subagrupación y créditos exigidos, y **modo planificador** (arrastrar materias entre semestres,
  nuevos semestres automáticos, créditos por semestre y alertas de prerrequisitos; se guarda en el navegador).
- **Foro**: lectura pública, preguntas/respuestas con solución marcada, imágenes adjuntas,
  apodos + nombre real, roles (member/moderator/admin/superadmin), reportes, sanciones,
  papelera con borrado definitivo y filtros por tema y fecha.

## Desarrollo local

```bash
npm install
cp .env.example .env   # completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

| Script          | Qué hace                    |
| --------------- | --------------------------- |
| `npm run dev`   | Servidor de desarrollo      |
| `npm run build` | Build de producción (`dist`) |
| `npm run preview` | Probar el build localmente |
| `npm run lint`  | Lint con oxlint             |

Sin las variables de Supabase la app funciona igual, pero el foro muestra un aviso de "en construcción".

## Backend del foro (Supabase)

1. Crea un proyecto gratis y activa **solo** el proveedor Google en Authentication → Providers.
2. En Google Cloud Console crea el cliente OAuth (tipo Interna si tu Workspace lo permite) con origen
   `http://localhost:5173` (+ tu dominio) y redirección `https://tu-proyecto.supabase.co/auth/v1/callback`.
3. En Authentication → URL Configuration: Site URL `http://localhost:5173` y Redirect URLs
   `http://localhost:5173/**` (+ `https://tu-dominio/**` en producción).
4. Ejecuta **en orden** en el SQL Editor: `supabase/schema.sql`, `migration_02.sql`,
   `migration_03.sql`, `migration_04.sql`, `migration_05.sql`, `migration_06.sql`.
5. La migración 03 nombra superadmin a `julsanchezc@unal.edu.co` tras su primer login.
   Más admins/moderadores se promueven desde la pestaña Moderación del foro.

## Estructura

```
src/
  App.jsx            # vistas home / malla / foro + malla curricular
  foro/Foro.jsx      # foro (lista, detalle, auth, moderación, papelera)
  lib/supabase.js    # cliente Supabase (nulo si no hay .env)
  index.css          # animaciones y utilidades
supabase/
  schema.sql         # tablas, RLS, roles y trigger de perfiles
  migration_02..06.sql  # borrados, superadmin, bucket, papelera, tags, RPCs
```

## Despliegue

- Vercel con `npx vercel --prod` (o push a git si conectas el repo).
- Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Environment Variables y redeploy.
- El `.env` nunca se commitea (está en `.gitignore`); el secreto de Google vive solo en Supabase.
