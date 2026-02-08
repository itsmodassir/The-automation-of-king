# 🛠️ Development Guide - Aerostic Platform

Complete guide for local development, debugging, and extending the Aerostic platform.

---

## 📋 Prerequisites

### Required Software
- **Docker Desktop** (or Docker + Docker Compose)
- **Node.js 20+** (with npm)
- **Git**
- **VS Code** (recommended IDE)

### Recommended Tools
- **Postman** or **Insomnia** (API testing)
- **DBeaver** or **pgAdmin** (database management)
- **redis-cli** (Redis management)
- **Docker Desktop** Dashboard

---

## 🚀 Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/itsmodassir/The-automation-of-king.git
cd The-automation-of-king
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your local settings:
```env
# Database
DATABASE_URL=postgresql://aerostic:aerostic@postgres:5432/aerostic
DB_SYNC=true

# Redis
REDIS_URL=redis://redis:6379

# API
PORT=3000
API_DOMAIN=localhost

# JWT
JWT_SECRET=dev-super-secret-key-change-in-production
JWT_EXPIRATION=7d

# Node
NODE_ENV=development
```

### 3. Start Docker Services

```bash
# Start all services
docker-compose up -d

# Wait for services to be healthy (30-60 seconds)
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
docker-compose logs -f postgres
```

### 4. Verify Services

```bash
# Check API health
curl http://localhost:3000/api/health

# Check database
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "\dt"

# Check Redis
docker exec aerostic-redis redis-cli PING
```

---

## 👤 Admin Setup

### First Time: Initialize Super Admin

```bash
# Create super admin account
npm run seed:admin --workspace @aerostic/api

# Follow the interactive prompts to set:
# - Admin username
# - Admin email
# - Admin password
```

### Login to Admin Dashboard

```
URL: http://localhost:3003/login
Username: [as set above]
Email: [as set above]  
Password: [as set above]
```

---

## 📚 Project Structure

```
services/
├── api/                    # Main backend API
│   ├── src/
│   │   ├── admin/         # Admin management
│   │   ├── auth/          # JWT authentication
│   │   ├── users/         # User management
│   │   ├── tenants/       # Multi-tenancy
│   │   ├── messages/      # Message handling
│   │   ├── contacts/      # Contact management
│   │   ├── conversations/ # Conversation tracking
│   │   ├── webhooks/      # Webhook processing
│   │   ├── whatsapp/      # WhatsApp integration
│   │   ├── automation/    # Automation engine
│   │   ├── analytics/     # Analytics & reporting
│   │   ├── billing/       # Billing & subscriptions
│   │   ├── audit-logs/    # Audit logging
│   │   ├── common/        # Shared utilities
│   │   │   ├── health/   # Health checks
│   │   │   ├── redis/    # Redis integration
│   │   │   └── ...
│   │   ├── main.ts        # Entry point
│   │   └── app.module.ts  # Root module
│   └── package.json
│
├── app-frontend/           # User dashboard
│   ├── app/
│   │   ├── (auth)/        # Auth pages
│   │   ├── (dashboard)/   # Dashboard pages
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── admin-frontend/         # Admin panel
│   ├── app/
│   │   ├── login/
│   │   ├── (dashboard)/
│   │   └── layout.tsx
│   ├── components/
│   └── package.json
│
├── webhook-worker/        # WhatsApp webhook processor
│   ├── src/
│   │   ├── main.ts
│   │   └── webhook.service.ts
│   └── package.json
│
└── message-worker/        # Message queue consumer
    ├── src/
    │   ├── worker.ts
    │   └── send.processor.ts
    └── package.json
```

---

## 🔄 Common Development Tasks

### Running Services Locally (Without Docker)

If you prefer local development without Docker:

```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis in Docker only
docker run -d --name dev-postgres -e POSTGRES_USER=aerostic -e POSTGRES_PASSWORD=aerostic -p 5432:5432 postgres:15-alpine
docker run -d --name dev-redis -p 6379:6379 redis:7-alpine

# Run API
npm run start:dev --workspace @aerostic/api

# Run frontends
npm run dev --workspace @aerostic/app-frontend
npm run dev --workspace @aerostic/admin-frontend

# Run workers
npm run start:dev --workspace @aerostic/webhook-worker
npm run start:dev --workspace @aerostic/message-worker
```

### Building for Production

```bash
# Build all services
npm run build

# Build specific service
npm run build --workspace @aerostic/api
npm run build --workspace @aerostic/app-frontend
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace @aerostic/api

# Run tests with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

### Database Management

#### Using psql Directly

```bash
# Connect to database
docker exec -it aerostic-postgres psql -U aerostic -d aerostic

# List tables
\dt

# Query users
SELECT * FROM "user";

# View schema
\d "user"

# Exit
\q
```

#### Using TypeORM CLI

```bash
# Run migrations
npm run migration:run --workspace @aerostic/api

# Generate migration from entities
npm run migration:generate -- src/database/migrations/CreateUserTable

# Revert last migration
npm run migration:revert --workspace @aerostic/api

# Show migration status
npm run migration:show --workspace @aerostic/api
```

---

## 🐛 Debugging

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch API",
      "program": "${workspaceFolder}/dist/services/api/src/main.js",
      "preLaunchTask": "build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 api

# With timestamps
docker-compose logs -f --timestamps api

# Filter by pattern
docker-compose logs api | grep "ERROR"
```

### Database Inspection

```bash
# PostgreSQL
docker exec -it aerostic-postgres psql -U aerostic -d aerostic

# Redis
docker exec -it aerostic-redis redis-cli

# View all keys in Redis
redis> KEYS *

# Get specific key
redis> GET key_name

# View Redis memory stats
redis> INFO memory
```

### API Testing

```bash
# Health check
curl http://localhost:3000/api/health | jq

# Liveness probe
curl http://localhost:3000/api/health/live | jq

# Readiness probe
curl http://localhost:3000/api/health/ready | jq

# Using Postman/Insomnia
# Import: http://localhost:3000/api/docs (Swagger UI)
```

---

## 🔑 API Authentication

### Getting a User Token

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response includes JWT token
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}

# Use token in requests
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3000/api/users/me
```

### Admin Token

```bash
# Admin login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Use token for admin endpoints
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:3000/api/admin/tenants
```

---

## 🔧 Useful npm Commands

```bash
# View all available commands
npm run

# Workspaces
npm ls           # Show workspace structure
npm list -g      # Show global packages

# Install dependencies
npm install
npm install --legacy-peer-deps   # If conflicts exist
npm install --save package-name
npm install --save-dev @types/package-name

# Database
npm run migration:generate -- src/database/migrations/MigrationName
npm run migration:run
npm run migration:revert
npm run seed:admin

# Building
npm run build
npm run build --workspace @aerostic/api

# Development
npm run dev
npm run start:dev --workspace @aerostic/api

# Testing
npm test
npm test --coverage

# Linting & Formatting
npm run lint
npm run format
```

---

## 🌐 API Endpoints Reference

### Health Checks
- `GET /api/health` - Full system health
- `GET /api/health/live` - Liveness probe
- `GET /api/health/ready` - Readiness probe

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Current user

### Admin
- `POST /api/admin/auth/init` - Initialize admin
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/analytics/overview` - Dashboard
- `GET /api/admin/tenants` - List tenants
- `GET /api/admin/audit-logs` - View logs

### User Data
- `GET /api/users/me` - Current user profile
- `GET /api/contacts` - List contacts
- `GET /api/conversations` - List conversations
- `POST /api/messages/send` - Send message

### WhatsApp
- `GET /api/whatsapp/accounts` - List accounts
- `POST /api/webhooks/whatsapp` - Webhook endpoint

See [http://localhost:3000/api/docs](http://localhost:3000/api/docs) for complete API documentation.

---

## 🚀 Performance Tips

### Development
- Use `npm run dev` for auto-reload
- Keep separate terminals for each service
- Monitor memory with `docker stats`
- Clear logs: `docker-compose logs --tail=0`

### Database
- Add indexes for frequently queried columns
- Use pagination (limit/offset)
- Monitor slow queries in logs

### Frontend
- Use React DevTools browser extension
- Profile with Chrome DevTools
- Check Network tab for API calls
- Monitor console for errors

---

## 📝 Code Standards

### TypeScript
- Use strict mode
- Add type annotations
- Use interfaces for objects
- Avoid `any` type

### NestJS
- Follow modular structure
- Use dependency injection
- Add decorators properly
- Implement interfaces

### Next.js
- Use app router conventions
- Implement error boundaries
- Use metadata for SEO
- Optimize images

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/feature-name
```

---

## 🆘 Common Issues

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for:
- Docker connection issues
- Database errors
- Port conflicts
- Build failures
- Runtime errors

---

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)

---

## 🤝 Getting Help

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review error logs with `docker-compose logs`
3. Check GitHub Issues
4. Ask in discussions
5. Contact: dev@aerostic.com

---

**Happy Developing!** 🚀

Last Updated: February 9, 2026
