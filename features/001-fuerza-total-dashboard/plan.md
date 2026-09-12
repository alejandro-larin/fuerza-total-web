# 001 · Dashboard del dueño — Plan

_Cómo se implementa lo descrito en `spec.md`. Debe respetar la `constitution/`._

## Enfoque

Construir el dashboard como una ruta protegida del App Router. Un módulo de servidor consultará PostgreSQL mediante Prisma y devolverá un modelo de métricas tipado; la página renderizará ese modelo con componentes de dominio y componentes UI existentes. Los cálculos se mantendrán en el servidor para no exponer datos innecesarios ni duplicar reglas de negocio en el cliente.

## Implementación

1. Inicializar la aplicación con Next.js 16, TypeScript estricto y Tailwind CSS 4 si todavía no existe la base del proyecto.
2. Definir en `prisma/schema.prisma` los modelos y enums de `Member`, `Plan`, `Membership`, `CheckIn`, `Payment` y usuario/rol conforme a `constitution/tech-stack.md`.
3. Configurar el cliente reutilizable de Prisma en `lib/prisma.ts`, la conexión por variable de entorno y PostgreSQL 18 en `compose.yaml`.
4. Configurar Auth.js en `lib/auth.ts` y las rutas de autenticación, guardando el rol `OWNER` o `TRAINER` en la sesión.
5. Proteger `/dashboard` en el servidor: redirigir sesiones ausentes al login y rechazar cualquier rol distinto de `OWNER`.
6. Implementar `lib/dashboard/get-dashboard-metrics.ts` con consultas agregadas para ingresos, socios, membresías, asistencia y distribución por plan.
7. Calcular los límites de día y mes de forma explícita y consistente para evitar mezclar periodos; comparar el mes actual con el inmediatamente anterior.
8. Crear `components/dashboard/` para tarjetas de resumen, comparación de ingresos, estados de socios y membresías, asistencia y distribución de planes.
9. Componer `app/dashboard/page.tsx` como Server Component y añadir estados vacíos honestos para conjuntos sin datos.
10. Añadir el layout responsive y etiquetas accesibles con Tailwind y los componentes shadcn/ui definidos en la constitución.
11. Añadir pruebas unitarias co-localizadas para límites temporales y porcentajes, pruebas de integración del agregador y pruebas de renderizado/autorización del dashboard.
12. Ejecutar migraciones y validar `npm run test`, `npm run lint` y `npm run build`.

## Definición de métricas

- **Ingresos del mes:** suma de `Payment.importe` cuya `fecha` cae en el mes natural actual; la comparación usa el mes natural anterior completo.
- **Socios por estado:** recuento de `Member` agrupado por `estado`.
- **Membresías por estado:** recuento de `Membership` agrupado por `estado`.
- **Entradas de hoy:** cantidad de `CheckIn` con `entradaAt` dentro del día actual.
- **Ahora dentro:** registros de hoy con `salidaAt` nulo.
- **Distribución por plan:** socios asociados a cada `Plan`; el porcentaje usa como denominador el total de socios con plan y muestra un estado vacío cuando es cero.

## Decisiones

- **Server Components y consultas de servidor** — reducen JavaScript en cliente y mantienen las reglas y datos sensibles fuera del navegador; no se crea una API pública sin necesidad.
- **Consultas agregadas en Prisma** — la base realiza sumas y recuentos; no se cargan registros completos para calcular métricas en memoria.
- **Dinero con `Decimal` en persistencia** — evita errores de coma flotante; el formateo ocurre solo en presentación.
- **Periodos naturales explícitos** — hoy y los meses se calculan usando una zona horaria configurada para el gimnasio, no la zona implícita del proceso.
- **Autorización en la ruta y en la capa de datos** — la UI oculta accesos, pero el servidor aplica el límite real del rol.
- **Sin dependencias adicionales** — se usan exclusivamente las tecnologías aprobadas por la constitución.

## Riesgos

- **Zona horaria incorrecta** — centralizar el cálculo de límites y probar cambios de día y mes.
- **Doble conteo por relaciones históricas** — contar socios y membresías según la entidad y estado definidos, y cubrir múltiples membresías en pruebas.
- **Consultas lentas al crecer los datos** — indexar fechas, estados y claves foráneas utilizadas por los agregados; revisar los planes de consulta si el volumen aumenta.
- **Datos parciales o vacíos** — devolver ceros y colecciones vacías tipadas, sin fabricar valores.
- **Escalada de privilegios** — probar acceso sin sesión y con rol `TRAINER`, además del acceso permitido a `OWNER`.
