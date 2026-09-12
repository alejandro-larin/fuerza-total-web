# 002 · Gestión operativa — Plan

## Enfoque

Implementar un módulo protegido con Server Components y Server Actions. Cada sección usa Prisma para persistencia, Zod para validación y una tabla/formulario responsive compartidos. No se crea una API pública porque todas las operaciones pertenecen a la interfaz autenticada.

## Implementación

1. Extender Prisma con `Contract` y relaciones de empleados/clientes.
2. Crear una migración compatible con los datos existentes.
3. Crear validadores Zod y acciones `create`, `update` y `delete` con autorización `OWNER`.
4. Crear navegación administrativa compartida y rutas bajo `/gestion`.
5. Implementar formularios y listados para empleados, clientes, contratos, membresías, pagos y accesos.
6. Revalidar `/gestion` y `/dashboard` tras cada cambio.
7. Añadir pruebas de validación y operaciones críticas; verificar login, CRUD y responsive en navegador.

## Decisiones

- **Cliente = `Member`** — mantiene una única fuente para dashboard y gestión.
- **Empleado = `User`** — los empleados son las cuentas internas; la contraseña inicial se establece al crearlos.
- **Eliminaciones restringidas** — no se elimina un cliente o plan con datos financieros relacionados; se presenta un error legible.
- **Contratos separados de membresías** — el contrato representa el acuerdo comercial; la membresía representa el acceso activo a un plan.
- **Server Actions** — reducen superficie pública y validan autorización cerca de la mutación.

## Riesgos

- **Pérdida accidental de históricos** — restricciones referenciales y confirmación explícita al eliminar.
- **Contraseñas de empleados** — hash bcrypt; nunca se devuelve ni muestra el hash.
- **Fechas y dinero** — fechas normalizadas en servidor e importes `Decimal`.
