# 001 · Dashboard del dueño — Tareas

_Checklist accionable derivada del `plan.md`. No se marca una tarea hasta verificarla._

## Base

- [ ] Inicializar Next.js 16, React 19, TypeScript estricto y Tailwind CSS 4.
- [ ] Configurar scripts de desarrollo, test, lint y build.
- [ ] Añadir PostgreSQL 18 a `compose.yaml` y documentar las variables de entorno sin versionar secretos.
- [ ] Configurar Prisma 7 y el cliente compartido.
- [ ] Modelar usuarios, socios, planes, membresías, asistencias y pagos con sus enums e índices.
- [ ] Crear y aplicar la migración inicial.

## Autenticación

- [ ] Configurar Auth.js con credenciales y roles `OWNER` y `TRAINER`.
- [ ] Crear la pantalla de login en español.
- [ ] Proteger `/dashboard` para sesiones `OWNER`.
- [ ] Probar redirección sin sesión y denegación para `TRAINER`.

## Datos

- [ ] Implementar límites temporales centralizados para hoy, mes actual y mes anterior.
- [ ] Implementar el agregado de ingresos y su comparación mensual.
- [ ] Implementar recuentos de socios por estado.
- [ ] Implementar recuentos de membresías por estado.
- [ ] Implementar entradas de hoy y socios actualmente dentro.
- [ ] Implementar distribución y porcentajes por plan.
- [ ] Devolver ceros y estados vacíos cuando no existan datos.

## Interfaz

- [ ] Crear las tarjetas de métricas de ingresos, socios, membresías y asistencia.
- [ ] Crear la visualización accesible de distribución por planes.
- [ ] Componer el dashboard como Server Component.
- [ ] Formatear importes y fechas en español.
- [ ] Validar el layout a 320 px, tablet y escritorio sin desplazamiento horizontal.
- [ ] Validar navegación por teclado, etiquetas y contraste/no dependencia exclusiva del color.

## Verificación

- [ ] Probar unidades de cálculo, incluidos cero datos y límites de día/mes.
- [ ] Probar agregados con datos reales de una base de test.
- [ ] Probar renderizado de todas las métricas y estados vacíos.
- [ ] Ejecutar `npm run test`.
- [ ] Ejecutar `npm run lint`.
- [ ] Ejecutar `npm run build`.
- [ ] Validar uno por uno los criterios de aceptación de `spec.md` y marcarlos solo si pasan.
- [ ] Ejecutar la revisión contra la spec y guardar el resultado en `review.md`.
- [ ] Mover la feature a "Hecho" en `../../constitution/roadmap.md` únicamente después de completar y revisar la implementación.
