# Aerostic SaaS Platform

**Aerostic** is a modern, scalable SaaS platform designed for automating business communications via WhatsApp. It features a multi-tenant architecture with a dedicated Tenant Dashboard for users and a comprehensive Admin Panel for platform management.

## 🚀 Quick Start (2 Minutes)

```bash
# 1. Clone and setup
git clone https://github.com/itsmodassir/The-automation-of-king.git
cd The-automation-of-king

# 2. Configure environment
cp .env.example .env

# 3. Start services
docker-compose up -d

# 4. Access applications
API:              http://localhost:3000/api/docs
App Dashboard:    http://localhost:3002
Admin Dashboard:  http://localhost:3003
Landing Page:     http://localhost:3001
```

## 📊 System Architecture

### Tech Stack

- **Backend**: NestJS 10 (TypeScript)
  - Microservices with shared utilities
  - TypeORM database ORM
  - JWT authentication
  - Rate limiting & security hardening

- **Frontend**: Next.js 14 (App Router)
  - Tailwind CSS styling
  - Socket.IO for real-time updates
  - Responsive design
  - Dark mode support

- **Infrastructure**
  - PostgreSQL 15 (relational database)
  - Redis 7 (caching & message queues)
  - Nginx 1.25 (reverse proxy)
  - Docker & Docker Compose

### Services

```
monorepo/
├── services/
│   ├── api/                  # Main backend API (port 3000)
│   │   ├── admin/           # Admin management
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── tenants/         # Multi-tenancy
│   │   ├── messages/        # Message handling
│   │   ├── contacts/        # Contact management
│   │   ├── conversations/   # Conversation tracking
│   │   ├── webhooks/        # Webhook processing
│   │   ├── whatsapp/        # WhatsApp integration
│   │   ├── automation/      # Automation rules
│   │   ├── analytics/       # Analytics & reporting
│   │   ├── billing/         # Billing & payments
│   │   └── audit-logs/      # Audit trail
│   │
│   ├── app-frontend/        # User Dashboard (port 3002)
│   │   ├── (auth)/         # Login/signup
│   │   └── (dashboard)/    # User interface
│   │
│   ├── admin-frontend/      # Admin Panel (port 3003)
│   │   ├── (dashboard)/    # Admin views
│   │   └── login/          # Admin login
│   │
│   ├── webhook-worker/      # Meta webhook processor (port 3001)
│   │   └── Process WhatsApp webhooks
│   │
│   └── message-worker/      # Message queue processor (port 3002)
│       └── Send queued messages
│
├── shared/                  # Shared utilities & types
├── infra/                   # Infrastructure configs
├── nginx/                   # Nginx reverse proxy configs
├── docker-compose.yml       # Development setup
└── docker-compose.prod.yml  # Production setup
```

## 🛠️ Getting Started

### Prerequisites

- **Docker & Docker Compose** (latest version)
- **Node.js 20+** (for local development without Docker)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/itsmodassir/The-automation-of-king.git
   cd The-automation-of-king
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start all services**:
   ```bash
   docker-compose up -d
   ```

4. **Verify services are running**:
   ```bash
   docker-compose ps
   ```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| API | http://localhost:3000 | Backend API |
| API Docs | http://localhost:3000/api/docs | Swagger documentation |
| Health Check | http://localhost:3000/api/health | System health status |
| Landing Page | http://localhost:3001 | Public website |
| App Dashboard | http://localhost:3002 | User dashboard |
| Admin Panel | http://localhost:3003 | Admin interface |
| Nginx | http://localhost | Reverse proxy |

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Local development setup and debugging
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[BLUEPRINT.md](./BLUEPRINT.md)** - Architecture and design specifications

## 🏥 Health Checks

The API provides three health check endpoints:

```bash
# Full health status (database, Redis, memory, process)
curl http://localhost:3000/api/health

# Liveness probe (for Kubernetes/Docker)
curl http://localhost:3000/api/health/live

# Readiness probe (for load balancers)
curl http://localhost:3000/api/health/ready
```

## 🔐 Authentication

### Admin Authentication

1. **Initial Setup** (first time only):
   ```bash
   npm run seed:admin --workspace @aerostic/api
   ```

2. **Login**:
   - URL: http://localhost:3003/login
   - Default: superadmin / default_password
   - **Important**: Change password after first login

### User Authentication

- Users register via http://localhost:3002
- Email verification required
- JWT token-based authentication
- Session management with refresh tokens

## 🚀 API Documentation

Full API documentation is available at:
```
http://localhost:3000/api/docs
```

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

**Admin**
- `POST /api/admin/auth/init` - Initialize admin account
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/analytics/overview` - Admin dashboard
- `GET /api/admin/tenants` - List all tenants
- `GET /api/admin/audit-logs` - View audit logs

**User Data**
- `GET /api/users/me` - Current user
- `GET /api/contacts` - List contacts
- `GET /api/conversations` - List conversations
- `POST /api/messages/send` - Send message

**WhatsApp**
- `GET /api/whatsapp/accounts` - List accounts
- `POST /api/webhooks/whatsapp` - Webhook endpoint

## 🔧 Development

### Working with Services

```bash
# Run specific service
npm run dev --workspace @aerostic/api

# Build specific service
npm run build --workspace @aerostic/api

# Run database migrations
npm run migration:generate -- src/database/migrations/InitialSchema
npm run migration:run

# Seed admin user
npm run seed:admin --workspace @aerostic/api
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Remove volumes and restart fresh
docker-compose down -v
docker-compose up -d
```

## 🧪 Testing

```bash
# Run tests for all services
npm test

# Run tests for specific service
npm test --workspace @aerostic/api

# Run with coverage
npm test -- --coverage
```

## 📊 Database Management

### PostgreSQL

```bash
# Access database
docker exec -it aerostic-postgres psql -U aerostic -d aerostic

# Common queries
\dt                    # List tables
\du                    # List users
SELECT * FROM "user"; # Query users
```

### Redis

```bash
# Access Redis CLI
docker exec -it aerostic-redis redis-cli

# Common commands
INFO                # Server info
KEYS *             # List all keys
FLUSHDB            # Clear database
```

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for solutions to common issues:

- Container startup problems
- Database connection errors
- Port conflicts
- Build failures
- WebSocket connection issues

## 🚀 Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md):

- Docker Compose production setup
- Kubernetes deployment
- Cloud platform deployment (AWS, GCP, Azure)
- SSL/TLS configuration
- Database backup strategies

## 📈 Project Status

**Completion:** 28/28 Issues Resolved (100%)

| Phase | Status | Issues | Focus |
|-------|--------|--------|-------|
| Phase 1 | ✅ Complete | 12/12 | Critical Infrastructure |
| Phase 2 | ✅ Complete | 10/10 | Authentication & Logging |
| Phase 3 | ✅ Complete | 6/6 | Security & Health Monitoring |
| Phase 4 | ✅ Complete | 6/6 | Polish & Documentation |

## 📝 Environment Variables

See [.env.example](./.env.example) for all required variables:

```bash
# Database
DATABASE_URL=postgresql://aerostic:aerostic@postgres:5432/aerostic
DB_SYNC=true

# Redis
REDIS_URL=redis://redis:6379

# API
API_DOMAIN=api.aerostic.local
PORT=3000

# Admin
ADMIN_DOMAIN=admin.aerostic.local

# App
APP_DOMAIN=app.aerostic.local

# WhatsApp
META_API_VERSION=v18.0
META_BUSINESS_ACCOUNT_ID=your_business_account_id
META_ACCESS_TOKEN=your_access_token

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# Node
NODE_ENV=development
```

## 🤝 Contributing

1. Create a feature branch
2. Make changes following the architecture patterns
3. Test thoroughly
4. Submit pull request
5. Code review and merge

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For issues and questions:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review [DEVELOPMENT.md](./DEVELOPMENT.md)
3. Check GitHub Issues
4. Contact: support@aerostic.com

---

**Aerostic Platform v1.0**  
Built with ❤️ for scalable WhatsApp automation  
Last Updated: February 9, 2026
    *Update `.env` with your database credentials, Meta App ID, and other secrets.*

3.  **Start Services**:
    ```bash
    docker compose up -d --build
    ```

4.  **Access the Applications**:
    -   **User Dashboard**: [http://localhost:5362](http://localhost:5362)
    -   **Admin Panel**: [http://localhost:53613](http://localhost:53613)
    -   **API**: [http://localhost:53614](http://localhost:53614)

## 🚢 Deployment

For production deployment instructions on AWS (EC2), please refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📄 License

This project is licensed under the MIT License.
