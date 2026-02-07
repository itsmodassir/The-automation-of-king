# Aerostic SaaS Platform - System Blueprint

## 1. Project Structure

The project is a **monorepo** organized into microservices using Docker Compose.

```
The automation of king/
├── services/
│
│   ├── api/                         # NestJS Backend (Core Brain)
│   │   ├── src/
│   │   │   ├── auth/                # JWT, Guards, RBAC
│   │   │   ├── admin/               # Super admin + Admin roles
│   │   │   ├── tenants/             # Tenant lifecycle
│   │   │   ├── users/               # Workspace users (agents)
│   │   │   ├── whatsapp/            # Cloud API + Embedded Signup
│   │   │   ├── conversations/       # Inbox threads
│   │   │   ├── messages/            # Dispatcher (send-only)
│   │   │   ├── automation/          # Rules + AI triggers
│   │   │   ├── analytics/           # Usage & metrics
│   │   │   ├── billing/             # Plans, limits, invoices
│   │   │   ├── audit-logs/           # Compliance tracking
│   │   │   ├── common/               # Guards, decorators, utils
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   └── entities/
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── Dockerfile
│
│   ├── app-frontend/                # Tenant Dashboard (Next.js)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx       # Sidebar + Topbar
│   │   │   │   ├── page.tsx         # Overview
│   │   │   │   ├── inbox/
│   │   │   │   ├── contacts/
│   │   │   │   ├── automation/
│   │   │   │   ├── analytics/
│   │   │   │   ├── whatsapp/
│   │   │   │   ├── team/
│   │   │   │   ├── billing/
│   │   │   │   └── settings/
│   │   │   └── page.tsx             # Redirect / landing
│   │   ├── lib/                     # API clients, auth helpers
│   │   ├── components/
│   │   ├── middleware.ts            # Auth + tenant guard
│   │   └── Dockerfile
│
│   ├── admin-frontend/              # Admin Panel (Next.js)
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx         # Control Tower
│   │   │   │   ├── tenants/
│   │   │   │   ├── admins/
│   │   │   │   ├── meta-tokens/
│   │   │   │   ├── audit-logs/
│   │   │   │   └── quotas/
│   │   ├── lib/
│   │   ├── components/
│   │   ├── middleware.ts            # Admin RBAC
│   │   └── Dockerfile
│
│   ├── webhook-worker/              # Meta Webhooks
│   │   ├── src/
│   │   │   ├── meta-webhook.ts
│   │   │   ├── signature-verify.ts
│   │   │   └── dispatcher.ts
│   │   └── Dockerfile
│
│   ├── message-worker/              # Queue consumer
│   │   ├── src/
│   │   │   ├── send-message.ts
│   │   │   └── retry-handler.ts
│   │   └── Dockerfile
│
├── shared/                          # OPTIONAL (recommended)
│   ├── types/                       # DTOs, enums
│   ├── constants/                   # Roles, limits
│   └── utils/                       # Encryption, formatting
│
├── infra/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── sites-enabled/
│   │       ├── app.aerostic.com
│   │       ├── admin.aerostic.com
│   │       └── api.aerostic.com
│   ├── redis/
│   └── postgres/
│
├── docker-compose.yml               # Local dev
├── docker-compose.prod.yml          # Production
├── .env.example
└── README.md
```

## 2. Infrastructure & Tech Stack

-   **Backend**: NestJS (Node.js)
-   **Frontend**: Next.js 14 (App Router, Tailwind CSS)
-   **Database**: PostgreSQL 15 (TypeORM)
-   **Queue/Cache**: Redis 7 (BullMQ)
-   **Deployment**: Docker Compose on AWS EC2
-   **Reverse Proxy**: Nginx
-   **Workers**: Dedicated `webhook-worker` and `message-worker`

## 3. Database Schema (Core Entities)

### `Tenant` (Workspace)
-   `id`: UUID
-   `name`: String
-   `domain`: String (Internal slug)
-   `status`: 'active' | 'suspended'
-   `webhookUrl`: URL for receiving Meta updates

### `User`
-   `id`: UUID
-   `email`: String (Unique)
-   `password`: Hash (Bcrypt)
-   `role`: 'admin' | 'agent'
-   `tenantId`: FK -> Tenant

### `WhatsAppAccount`
-   `id`: UUID
-   `phoneNumberId`: String
-   `wabaId`: String
-   `accessToken`: String
-   `tenantId`: FK -> Tenant

## 4. Authentication Architecture

The system uses **JWT (JSON Web Tokens)** for stateless authentication.

### Flow
1.  **Login**: `POST /auth/login` -> Returns `access_token` (cookie/localStorage).
2.  **Register**: `POST /auth/register` -> Creates `Tenant` + `User` -> Returns `access_token`.
3.  **Middleware**:
    -   Next.js Middleware (`middleware.ts`) checks for `auth_token` cookie.
    -   Redirects unauthenticated users to `/login`.
    -   Redirects authenticated users away from `/login`.
4.  **Backend Guards**:
    -   `JwtAuthGuard`: Verifies token signature.
    -   `RolesGuard`: Enforces `'admin'` or `'agent'` permissions.

## 5. API Architecture (Core Modules)

### `AuthModule`
-   JWT Strategies, Guards.

### `AdminModule` (Super Admin)
-   Manage Tenants, View Logs, System Quotas.

### `WhatsappModule`
-   Onboarding (Embedded Signup), Token Management.

### `ConversationsModule`
-   Inbox logic, Thread management.

### `MessagesModule`
-   Dispatcher for outgoing messages (via `message-worker`).

### `AutomationModule`
-   Workflow rules and AI triggers.

### `WebhookWorker` (Microservice)
-   Handles high-volume Meta webhooks (signature verify -> redis queue).

## 6. Frontend Architecture

### User Dashboard (`app-frontend`)
-   **URL**: `app.aerostic.com`
-   **Key Pages**: Inbox, Contacts, Automation, WhatsApp, Settings.
-   **Tech**: Next.js App Router, Tailwind CSS.

### Admin Panel (`admin-frontend`)
-   **URL**: `admin.aerostic.com`
-   **Key Pages**: Tenants, Admins, Meta Tokens, Audit Logs.
-   **Tech**: Next.js App Router, Tailwind CSS.

## 7. Deployment Strategy

1.  **Containerization**: All services defined in `docker-compose.prod.yml`.
2.  **Infra**: Nginx (Reverse Proxy) + Certbot (SSL).
3.  **Data**: Postgres (Persistent Volume), Redis (Cache/Queue).
