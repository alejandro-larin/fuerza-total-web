# Misión
_La razón de ser del proyecto. La referencia que decide si una feature "encaja" o no._

## Qué construimos

**Fuerza Total** es una plataforma web de gestión para gimnasios pequeños y medianos. Empezamos con un **dashboard del dueño/gerente**: un panel de negocio que responde a la pregunta "¿cómo va mi gimnasio hoy?" con métricas de ingresos, socios, asistencia y distribución de planes, sin depender de hojas de cálculo ni de preguntar al entrenador.

El producto se construye con desarrollo dirigido por especificación (SDD): primero se escribe la spec de producto, luego la spec técnica, luego el plan de tareas, y solo entonces se implementa. Ver `features/` y las skills en `.agents/skills/`.

1. **Dashboard del dueño** — panel con métricas de ingresos, socios, membresías y distribución de planes.
2. **Membresías y planes** — gestión de planes (ej. Clásico, Total, Personalizada, Clases) y de los socios que los contratan.
3. **Asistencia** — registro de entradas y salidas de los socios al gimnasio.
4. **Roles y permisos** — login con roles: dueño/gerente (acceso completo) y entrenador (acceso limitado a lo operativo).

## Para quién

- **Dueño / gerente del gimnasio** — persona principal: quiere ver la salud del negocio en un vistazo (ingresos, morosidad, socios activos, planes más vendidos) para decidir sin depender de reportes manuales.
- **Entrenador / staff** — usuario secundario: accede con rol limitado a lo operativo (ver sus socios asignados, registrar asistencia).
- **Clientes del gimnasio** — interesados indirectos: su asistencia y membresías son los datos que alimentan el dashboard, pero no usan la aplicación (todavía).

## Principios

- **Primero la spec, después el código.** Cada feature empieza por `spec.md` (producto), sigue con `plan.md` (tecnología) y `tasks.md` (tareas). El código se acopla a la spec, nunca al revés.
- **Datos reales, visualización honesta.** El dashboard se alimenta de una base Postgres real (vía Docker Compose en desarrollo). No se inventan métricas: lo que no se puede medir no se muestra.
- **Decisiones de negocio primero.** Los criterios de aceptación se escriben desde la vista del dueño (qué necesita saber para decidir), no desde la vista técnica.
- **Panel primero, automatización después.** El valor inicial es la visibilidad. Solo cuando la visibilidad funcione se plantea ahorro de trabajo (cobros automáticos, avisos de morosidad).
- **Roles explícitos.** Quién ve qué está definido por rol (dueño vs entrenador) y cada feature declara su rol objetivo desde la spec.

## Qué NO es

- **No es la app de los clientes.** Los socios no tienen login ni app móvil en el alcance actual.
- **No es un sistema de gestión de entrenamientos** (rutinas, series, macros) en el MVP. Eso pertenece al futuro dashboard del entrenador.
- **No es una hoja de cálculo online.** El dashboard informa; la gestión de datos se modela en la base (socios, membresías, asistencia, pagos) con estructura real.
- **No sustituye una pasarela de pago** en el MVP: los cobros se registran (manual o importados), pero no se procesan automáticamente.
