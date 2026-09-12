# 001 · Dashboard del dueño

**Estado:** implementado ✅

## Qué hace

Permite al dueño o gerente consultar en un único panel la situación actual del gimnasio: ingresos, socios, membresías, asistencia y distribución de socios por plan.

## Por qué

El dueño necesita tomar decisiones diarias sin consolidar hojas de cálculo ni solicitar reportes al personal. Esta es la primera entrega porque ofrece visibilidad del negocio y establece los datos que alimentarán las funciones posteriores.

## Rol objetivo

- **OWNER:** puede acceder al dashboard completo.
- **TRAINER:** no puede acceder; tendrá un dashboard operativo propio en la feature 002.

## Criterios de aceptación

- [x] Un usuario `OWNER` autenticado puede abrir `/dashboard` y ver el panel.
- [x] Un usuario no autenticado es redirigido al login.
- [x] Un usuario `TRAINER` no puede consultar el dashboard del dueño.
- [x] El panel muestra los ingresos registrados en el mes natural actual y los compara con el mes natural anterior.
- [x] El panel muestra el total de socios por estado: activos, inactivos y morosos.
- [x] El panel muestra el total de membresías activas, pausadas y canceladas.
- [x] El panel muestra las entradas registradas hoy y cuántos socios permanecen dentro, considerando dentro a quien tiene entrada pero no salida.
- [x] El panel muestra la distribución de socios por plan, con cantidad y porcentaje sobre el total con plan.
- [x] Todas las métricas se calculan desde PostgreSQL; no se muestran valores ficticios ni datos de demostración como si fueran reales.
- [x] Cuando no hay datos para una métrica, se muestra cero o un estado vacío explícito, sin provocar errores.
- [x] Los importes y fechas se presentan en español con formato consistente.
- [x] El panel es usable sin desplazamiento horizontal a partir de 320 px y en escritorio.
- [x] Las métricas principales tienen nombres accesibles y no dependen solo del color para comunicar su significado.

## Fuera de alcance

- Alta, edición o baja de socios, planes y membresías.
- Registro o procesamiento automático de pagos.
- Registro de entradas y salidas.
- Acceso de clientes del gimnasio.
- Rutinas, entrenamientos o métricas propias del entrenador.
- Selección de intervalos históricos personalizados; esta entrega se centra en hoy y el mes actual.
