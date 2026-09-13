# 002 · Gestión operativa

**Estado:** implementado ✅

## Qué hace

Permite a gerencia crear, consultar, editar y eliminar empleados, clientes, contratos, membresías, pagos y accesos diarios desde un módulo administrativo único.

## Reglas de acceso

- `OWNER` puede gestionar todas las entidades.
- `TRAINER` no puede acceder al módulo administrativo.

## Criterios de aceptación

- [x] Gerencia puede listar, crear, editar y eliminar empleados con nombre, correo y rol.
- [x] Gerencia puede listar, crear, editar y eliminar clientes con contacto, estado y plan actual.
- [x] Gerencia puede listar, crear, editar y eliminar contratos asociados a un cliente, con fechas, estado y notas.
- [x] Gerencia puede listar, crear, editar y eliminar membresías asociadas a cliente y plan.
- [x] Gerencia puede listar, crear, editar y eliminar pagos con importe, concepto, método y fecha.
- [x] Gerencia puede listar, crear, editar y eliminar accesos diarios con entrada y salida opcional.
- [x] Todos los formularios validan datos en servidor con errores legibles en español.
- [x] Las relaciones inexistentes o eliminaciones restringidas no producen errores internos.
- [x] Los cambios actualizan inmediatamente los listados y las métricas del dashboard.
- [x] El módulo funciona desde 320 px sin desplazamiento horizontal de página.
- [x] Los formularios y acciones son accesibles por teclado y tienen etiquetas explícitas.
- [x] Clientes registran DUI, contacto telefónico de emergencia y notas médicas en PDF.
- [x] Empleados registran DUI y notas médicas en PDF.
- [x] Los documentos médicos son privados, admiten solo PDF de hasta 5 MB y requieren rol `OWNER` para consultarlos.
- [x] La interfaz presenta importes en dólares estadounidenses.

## Fuera de alcance

- Procesamiento automático de cobros.
- Firma digital de contratos o almacenamiento de documentos distintos a notas médicas.
- Registro o autoservicio para clientes.
- Horarios, nóminas y asignación de entrenadores.
