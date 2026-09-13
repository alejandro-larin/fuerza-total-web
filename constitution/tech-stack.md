# Tech stack y convenciones

_Cómo está construido el proyecto y las reglas que todo el código debe respetar. Es la referencia técnica que ningún plan de feature debería contradecir._

## Tecnologías

_Versiones comprobadas contra el registro npm y la documentación oficial (septiembre 2026). Al contratar dependencias, pinchar estas versiones; actualizar aquí al subirlas._

- **Lenguaje:** TypeScript estricto (`strict: true`; sin `any` silencioso).
- **Framework / runtime:** Next.js 16 (App Router) + React 19, Node 24 LTS (Next.js 16 requiere Node ≥ 20.9).
- **Base de datos:** PostgreSQL 18 con **Prisma ORM 7** (v8 en RC). En desarrollo corre en Docker Compose (`docker compose up -d db`).
- **UI:** Tailwind CSS 4.3 + **shadcn/ui** (Radix) — componentes: Card, Table, Badge, Tabs, Sidebar, Avatar. Moneda operativa predeterminada: USD.
- **Auth y roles:** Auth.js v5 (`next-auth@5`, en beta) con credenciales; sesiones con roles `OWNER` (dueño/gerente) y `TRAINER` (entrenador).
- **Validación:** zod 4 en el borde (forms y payloads de API).
- **Tests:** Vitest 5 + React Testing Library. Archivos co-locados: `foo.ts` + `foo.test.ts`.
- **Despliegue:** imagen multi-stage de Node 24 Alpine con salida standalone de Next.js, PostgreSQL 18 y orquestación mediante Docker Compose.

## Archivos / módulos clave

_Mapa breve de dónde vive cada cosa. Solo lo que un recién llegado necesita para orientarse._

- `app/` — rutas de la aplicación (App Router de Next.js), incluye la página del dashboard (`app/dashboard/`).
- `app/(auth)/` — páginas de login/registro.
- `components/` — componentes React; UI base en `components/ui/` (shadcn) y de dominio en `components/dashboard/`.
- `lib/` — utilidades compartidas y configuración (Prisma client, auth, helpers de métricas).
- `prisma/schema.prisma` — modelo de datos (socios, membresías, planes, asistencia, pagos).
- `constitution/` — misión, tech stack y roadmap (esta constitución).
- `features/` — un directorio por feature con `spec.md`, `plan.md` y `tasks.md`.
- `.agents/skills/` — skills de SDD (write-product-spec, write-tech-spec, implement-specs, check-impl-against-spec…).

## Comandos

- `npm run dev` — arranca el entorno local (Next.js).
- `docker compose up -d db` — levanta PostgreSQL local.
- `npx prisma migrate dev` — aplica y crea migraciones.
- `npm run test` — ejecuta los tests (Vitest).
- `npm run lint` — revisa estilo (ESLint + Prettier).
- `npm run build` — compila para producción.
- `docker compose up -d --build` — construye y arranca web + PostgreSQL; aplica migraciones y sincroniza el usuario dueño.
- `docker compose down` — detiene los servicios sin borrar el volumen de PostgreSQL.

## Modelo de datos / dominio

_Las entidades o estructuras centrales y sus campos/reglas. Documenta solo lo no obvio: invariantes, mecánicas especiales, qué campo controla qué. Omite esta sección si no aplica._

- **Member (socio)** — persona con membresía activa: `id`, `nombre`, `email`, `telefono`, `planId`, `fechaIngreso`, `estado` (`activo|inactivo|moroso`).
- **Plan** — planes del gimnasio: `id`, `nombre`, `precioMensual`, `tipo` (`clasico|total|personalizada|clases`). Es la entidad que alimenta la "distribución de planes".
- **Membership (membresía)** — relación socio↔plan: `id`, `memberId`, `planId`, `inicio`, `fin`, `estado` (`activa|pausada|cancelada`).
- **CheckIn (asistencia)** — registro de entrada/salida: `id`, `memberId`, `entradaAt`, `salidaAt`. Fuente de las métricas de asistencia.
- **Payment (pago)** — cobro registrado: `id`, `memberId`, `importe`, `concepto` (`cuota|plan`), `fecha`, `metodo` (`efectivo|tarjeta|transferencia`). Fuente de ingresos. No procesa pagos reales en MVP.
- **Documentos médicos** — PDF privado de hasta 5 MB asociado a empleado o cliente; el archivo vive en almacenamiento privado y PostgreSQL conserva solo su referencia opaca.

## Convenciones

_Reglas de estilo y patrones a seguir._

- **Nombres:** `camelCase` para variables y funciones; `PascalCase` para componentes y tipos.
- **Tests co-locados:** `foo.ts` + `foo.test.ts`.
- **Idioma del contenido visible:** español (UI y métricas en `es`).
- **Errores:** zod en el borde; respuestas de error con mensaje legible en español.
- **Datos honestos:** el dashboard muestra solo métricas que se pueden calcular desde la BD real; no se inventan números para llenar huecos.
- **Validación de data:** reglas de negocio (p. ej. rol dueño ve todo, entrenador solo lo operativo) se validan contra la spec en `plan.md`/`tasks.md` con la skill `check-impl-against-spec`.

## Límites duros

_Lo que NUNCA se debe hacer._

- **No** añadir dependencias nuevas sin avisar y justificar.
- **No** subir `.env*` al repositorio (`.gitignore`).
- **No** escribir código antes de que exista `spec.md` + `plan.md` + `tasks.md` de la feature (regla SDD).
- **No** procesar cobros automáticos en el MVP: los pagos se registran, no se cobran vía pasarela.
- **No** ampliar el alcance del dashboard a clientes o entrenamientos (rutinas/series) sin feature propia.
