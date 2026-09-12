# Roadmap

_Orden y estado de las features. Es la vista de "qué hay hecho, qué toca ahora y qué viene". Cada entrada apunta a su carpeta en `features/`._

## Hecho ✅

_Features completadas, en orden de implementación._

1. **001 · Dashboard del dueño** — panel de negocio con métricas reales de ingresos, socios, membresías, asistencia y distribución de planes (`features/001-fuerza-total-dashboard/`).
2. **002 · Gestión operativa** — CRUD de empleados, clientes, contratos, membresías, pagos y accesos diarios (`features/002-gestion-operativa/`).

## Siguiente 🔜

_Lo próximo a abordar. Idealmente una sola feature "en curso" a la vez._

1. **003 · Dashboard del entrenador** — panel operativo para socios asignados.

## Backlog / ideas 💡

_Sin comprometer ni ordenar del todo. Ideas que respetan la constitución._

- **Roles y permisos** — acceso con roles dueño (`OWNER`, acceso completo) y entrenador (`TRAINER`, acceso operativo limitado).

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código.
