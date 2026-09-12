# Fuerza Total

Plataforma web para gestionar un gimnasio: dashboard gerencial, empleados, clientes, contratos, membresías, pagos y accesos diarios.

## Requisitos

- Docker y Docker Compose, o Node.js 24 + PostgreSQL 18.
- Un secreto de Auth.js generado con `openssl rand -base64 32`.

## Producción con Docker Compose

1. Crea la configuración local:

   ```bash
   cp .env.example .env
   ```

2. Sustituye en `.env` los valores de `POSTGRES_PASSWORD`, `AUTH_SECRET`, `SEED_OWNER_EMAIL` y `SEED_OWNER_PASSWORD`. La contraseña del dueño debe tener entre 12 y 128 caracteres.

3. Para un dominio real, configura su URL pública:

   ```env
   AUTH_URL=https://gimnasio.example.com
   AUTH_TRUST_HOST=true
   ```

4. Construye y arranca la aplicación:

   ```bash
   docker compose up -d --build
   ```

5. Abre `http://localhost:3000` o el valor configurado en `AUTH_URL`.

El contenedor web espera a que PostgreSQL esté disponible, aplica las migraciones y sincroniza el usuario dueño desde `SEED_OWNER_EMAIL` y `SEED_OWNER_PASSWORD` antes de iniciar Next.js. Cambiar esas variables requiere recrear el servicio web:

```bash
docker compose up -d --build --force-recreate web
```

Comandos operativos:

```bash
docker compose ps
docker compose logs -f web
docker compose down
```

`docker compose down` conserva la base de datos. Para borrar también todos los datos locales, usa `docker compose down -v` únicamente si realmente quieres reiniciarlos.

## Desarrollo local

```bash
docker compose up -d db
npm ci
npm run db:generate
npm run db:seed
npm run dev
```

En desarrollo, `DATABASE_URL` debe usar el host y puerto publicados, por defecto `localhost:5432`. Dentro de Compose, el servicio web usa automáticamente `db:5432`.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL. |
| `POSTGRES_PORT` | Puerto local de PostgreSQL. |
| `WEB_PORT` | Puerto local de la aplicación. |
| `DATABASE_URL` | Conexión usada por comandos ejecutados desde el host. |
| `AUTH_SECRET` | Firma y cifrado de sesiones de Auth.js. |
| `AUTH_URL` | URL pública canónica de la aplicación. |
| `AUTH_TRUST_HOST` | Permite a Auth.js confiar en el host del despliegue/proxy. |
| `GYM_TIME_ZONE` | Zona horaria de métricas y formularios. |
| `GYM_CURRENCY` | Moneda ISO mostrada por la aplicación. |
| `SEED_OWNER_EMAIL` | Correo inicial del dueño. |
| `SEED_OWNER_PASSWORD` | Contraseña inicial del dueño, mínimo 12 caracteres. |

No publiques `.env`; solo `.env.example` pertenece al repositorio.

## Validación

```bash
npm run test
npm run lint
npm run build
```

## Especificaciones

El proyecto sigue desarrollo dirigido por especificaciones. Las reglas estables están en `constitution/` y cada feature documenta comportamiento, plan, tareas y revisión en `features/NNN-nombre-feature/`.
