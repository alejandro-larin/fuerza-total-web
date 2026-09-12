# Arquitectura y funcionamiento

Este documento describe la arquitectura implementada actualmente en Fuerza Total.

## Vista general

```mermaid
flowchart LR
    U[Dueño o gerente] -->|HTTPS / navegador| N[Next.js 16]

    subgraph Aplicación web
        N --> R[App Router]
        R --> A[Auth.js]
        R --> D[Dashboard]
        R --> G[Gestión operativa]
        A --> O[Autorización OWNER]
        D --> O
        G --> O
        G --> V[Zod + Server Actions]
        D --> M[Servicio de métricas]
    end

    A --> P[Prisma ORM]
    V --> P
    M --> P
    P --> DB[(PostgreSQL 18)]
```

La aplicación es un monolito modular de Next.js. La interfaz, las Server Actions, la autenticación y las consultas de negocio se despliegan juntas; PostgreSQL es el único servicio de persistencia.

## Capas

```mermaid
flowchart TB
    UI[Presentación<br/>app/ + components/] --> AUTH[Autenticación y autorización<br/>auth.ts + lib/auth/]
    UI --> ACTIONS[Casos de uso<br/>lib/management/ + lib/dashboard/]
    ACTIONS --> VALIDATION[Validación<br/>Zod]
    AUTH --> DATA[Acceso a datos<br/>lib/prisma.ts]
    VALIDATION --> DATA
    DATA --> CLIENT[Cliente Prisma generado]
    CLIENT --> POSTGRES[(PostgreSQL)]
```

| Capa | Responsabilidad |
| --- | --- |
| `app/` | Rutas, layouts, páginas y Server Actions del App Router. |
| `components/` | Componentes visuales reutilizables del dashboard y CRUD. |
| `lib/auth/` | Verificación de credenciales y autorización por rol. |
| `lib/management/` | Validación y mutaciones de gestión operativa. |
| `lib/dashboard/` | Rangos temporales, consultas y cálculo de métricas. |
| `lib/prisma.ts` | Instancia de Prisma conectada mediante `DATABASE_URL`. |
| `prisma/` | Esquema, migraciones y datos iniciales. |

## Despliegue

```mermaid
flowchart LR
    B[Navegador] -->|localhost:WEB_PORT<br/>o dominio público| W[Contenedor web<br/>Node 24 Alpine]

    subgraph Docker Compose
        W -->|db:5432| DB[(Contenedor PostgreSQL 18)]
        DB --> VOL[(postgres_data)]
    end

    ENV[Variables .env] --> W
    ENV --> DB
```

El puerto de PostgreSQL solo se publica en `127.0.0.1`. El puerto web también se limita a localhost en la configuración actual; un despliegue público requiere un proxy inverso o cambiar explícitamente el enlace de red.

### Arranque del contenedor web

```mermaid
sequenceDiagram
    participant C as Docker Compose
    participant DB as PostgreSQL
    participant E as docker-entrypoint.sh
    participant P as Prisma
    participant N as Next.js

    C->>DB: Inicia PostgreSQL
    C->>DB: Espera healthcheck
    C->>E: Inicia contenedor web
    E->>P: prisma migrate deploy
    P->>DB: Aplica migraciones pendientes
    E->>P: Ejecuta prisma/seed.ts
    P->>DB: Sincroniza dueño y planes iniciales
    E->>N: node server.js
    C->>N: Healthcheck GET /login
```

El seed usa `upsert`: recrear el servicio web actualiza el hash de contraseña del correo configurado en `SEED_OWNER_EMAIL` sin duplicar ese usuario.

## Autenticación y autorización

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Formulario login
    participant S as Server Action
    participant A as Auth.js
    participant P as Prisma
    participant DB as PostgreSQL

    U->>F: Introduce correo y contraseña
    F->>S: Envía FormData
    S->>A: signIn(credentials)
    A->>P: Busca correo normalizado
    P->>DB: SELECT User
    DB-->>P: Usuario + passwordHash + rol
    A->>A: bcrypt.compare
    alt Credenciales válidas
        A-->>S: Sesión JWT de 8 horas
        S-->>U: Redirección a /dashboard
    else Credenciales inválidas
        A-->>S: CredentialsSignin
        S-->>U: Credenciales inválidas
    else Error inesperado
        S-->>U: Mensaje genérico
    end
```

El JWT contiene el identificador y el rol. `requireOwner()` protege el dashboard, el layout de gestión y cada mutación:

```mermaid
flowchart TD
    Q[Petición protegida] --> S{¿Hay sesión?}
    S -- No --> L[Redirigir a /login]
    S -- Sí --> R{¿Rol OWNER?}
    R -- No --> X[Redirigir a /acceso-denegado]
    R -- Sí --> C[Ejecutar consulta o mutación]
```

## Gestión operativa

```mermaid
sequenceDiagram
    actor O as OWNER
    participant UI as Página de gestión
    participant SA as Server Action
    participant Z as Zod
    participant P as Prisma
    participant DB as PostgreSQL
    participant N as Caché Next.js

    O->>UI: Crea, edita o elimina
    UI->>SA: FormData
    SA->>SA: requireOwner()
    SA->>Z: Valida y normaliza
    alt Datos válidos
        Z-->>SA: Datos tipados
        SA->>P: create / update / delete
        P->>DB: Operación parametrizada
        DB-->>P: Resultado
        SA->>N: Revalida /gestion y /dashboard
        SA-->>UI: Mensaje de éxito
    else Datos inválidos
        Z-->>UI: Mensaje legible
    end
```

Las entidades gestionadas son empleados (`User`), clientes (`Member`), contratos, membresías, pagos y accesos. Las contraseñas se almacenan como hashes bcrypt; nunca se devuelve el hash a la interfaz.

## Dashboard

```mermaid
flowchart LR
    D[/dashboard/] --> O[requireOwner]
    O --> R[Rangos según GYM_TIME_ZONE]
    R --> Q[Consultas Prisma en paralelo]
    Q --> I[Ingresos del mes]
    Q --> S[Estados de clientes]
    Q --> M[Estados de membresías]
    Q --> A[Accesos de hoy]
    Q --> P[Distribución por plan]
    I --> C[Cálculos y porcentajes]
    S --> C
    M --> C
    A --> C
    P --> C
    C --> UI[Tarjetas, tablas y distribución]
```

Todas las métricas proceden de datos persistidos. Las consultas independientes se ejecutan en paralelo para reducir la latencia de renderizado.

## Modelo de datos

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        string passwordHash
        Role role
    }

    MEMBER {
        string id PK
        string name
        string email UK
        string phone
        MemberStatus status
        string planId FK
    }

    PLAN {
        string id PK
        string name UK
        decimal monthlyPrice
        PlanType type
    }

    CONTRACT {
        string id PK
        string memberId FK
        datetime startsAt
        datetime endsAt
        ContractStatus status
    }

    MEMBERSHIP {
        string id PK
        string memberId FK
        string planId FK
        datetime startsAt
        datetime endsAt
        MembershipStatus status
    }

    PAYMENT {
        string id PK
        string memberId FK
        decimal amount
        PaymentConcept concept
        PaymentMethod method
        datetime paidAt
    }

    CHECK_IN {
        string id PK
        string memberId FK
        datetime enteredAt
        datetime leftAt
    }

    PLAN o|--o{ MEMBER : "plan actual"
    MEMBER ||--o{ CONTRACT : tiene
    MEMBER ||--o{ MEMBERSHIP : tiene
    PLAN ||--o{ MEMBERSHIP : define
    MEMBER ||--o{ PAYMENT : realiza
    MEMBER ||--o{ CHECK_IN : registra
```

`User` representa empleados autenticables y no está relacionado todavía con clientes asignados. Ese vínculo pertenece al futuro dashboard del entrenador.

## Seguridad y configuración

- Los secretos solo se inyectan mediante variables de entorno; `.env` está ignorado por Git.
- `AUTH_URL` debe coincidir con la URL pública de producción.
- `AUTH_TRUST_HOST=true` permite operar detrás de Docker o un proxy inverso; el proxy debe sobrescribir encabezados del cliente y aceptar tráfico solo de infraestructura confiable.
- Las credenciales inválidas no revelan si existe el correo.
- Zod valida las entradas antes de acceder a Prisma.
- Prisma parametriza las operaciones SQL.
- Las restricciones de PostgreSQL impiden eliminar pagos, contratos o planes cuando la relación usa `Restrict`.

## Directorios principales

```text
app/                 Rutas y páginas Next.js
components/          Componentes de interfaz
lib/auth/            Autenticación y autorización
lib/dashboard/       Métricas gerenciales
lib/management/      Server Actions del CRUD
prisma/              Esquema, migraciones y seed
constitution/        Reglas estables del proyecto
features/            Especificaciones por funcionalidad
docs/                Documentación técnica
```
