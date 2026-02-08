# 🛠️ Aerostic System - Fix Implementation Plan

**Document Type:** Action Plan  
**Status:** Ready for Implementation  
**Priority-Based Approach:** Phase-wise fixes recommended  

---

## 🎯 Fix Strategy Overview

### Total Fixes Required: 28 Issues
### Estimated Timeline: 2-3 weeks (with dedicated team)
### Critical Path Issues: 12 (must fix before any testing)

---

## 📌 PHASE 1: CRITICAL FIXES (Must Do First - Blocks All Testing)

### Fix Group 1A: Docker & Port Configuration
**Issues:** #1, #2, #6  
**Estimated Time:** 2-3 hours  
**Impact:** Services will actually communicate

#### Problem Summary:
- Port 53614 (non-standard) causes API inaccessibility
- Nginx expects port 3001, API runs on 3000
- Multiple conflicting nginx configs for same endpoints

#### What to Fix:
1. **docker-compose.yml** - Change API port to 3000:3000 (not 53614)
2. **nginx/conf.d/api.conf** - Change proxy to http://api:3000 (not 3001)
3. **nginx/conf.d/webhook.conf** - Change proxy to http://api:3000
4. **docker-compose.yml** - Use standard ports for dev (8080, 8081, etc.)
5. **Environment variables** - Update NEXT_PUBLIC_API_URL to localhost:8080 or proper path

#### Files to Modify:
```
1. docker-compose.yml (ports section for api, app-frontend, admin-frontend)
2. nginx/conf.d/api.conf
3. nginx/conf.d/webhook.conf
4. docker-compose.yml (NEXT_PUBLIC_API_URL environment)
5. services/api/src/main.ts (verify port listening)
```

---

### Fix Group 1B: Dockerfile Workspace References
**Issues:** #3, #4  
**Estimated Time:** 30 minutes  
**Impact:** Worker containers will build successfully

#### Problem Summary:
- References non-existent `@aerostic/common` workspace
- Incorrect workspace path naming (services/ vs @aerostic/)
- Missing `--legacy-peer-deps` flag on workers

#### What to Fix:
1. **services/webhook-worker/Dockerfile**
   ```dockerfile
   # Change FROM this:
   RUN npm run build --workspace @aerostic/common
   RUN npm run build --workspace services/webhook-worker
   
   # Change TO this:
   RUN npm install --legacy-peer-deps
   RUN npm run build --workspace @aerostic/webhook-worker
   ```

2. **services/message-worker/Dockerfile**
   ```dockerfile
   # Change FROM this:
   RUN npm run build --workspace @aerostic/common
   RUN npm run build --workspace services/message-worker
   
   # Change TO this:
   RUN npm install --legacy-peer-deps
   RUN npm run build --workspace @aerostic/message-worker
   ```

#### Files to Modify:
```
1. services/webhook-worker/Dockerfile
2. services/message-worker/Dockerfile
3. Root package.json (verify workspace names match)
```

---

### Fix Group 1C: Nginx Config File Locations
**Issues:** #5  
**Estimated Time:** 45 minutes  
**Impact:** Docker volume mounts will find config files

#### Problem Summary:
- docker-compose.yml mounts `/infra/nginx/conf.d` (empty)
- Actual configs are in `/nginx/conf.d/`
- Blueprint expects `/infra/nginx/` structure

#### What to Fix:
**Option A (Recommended):** Align with current structure
```yaml
# docker-compose.yml change:
volumes:
  - ./nginx/conf.d:/etc/nginx/conf.d:ro  # Change from ./infra/nginx/conf.d
```

**Option B:** Follow Blueprint
```bash
# Move configs to match Blueprint
mv ./nginx/conf.d/* ./infra/nginx/conf.d/
# Update docker-compose.yml to use ./infra/nginx/conf.d
```

#### Files to Modify:
```
1. docker-compose.yml (volumes section for nginx)
2. docker-compose.prod.yml (if needed)
3. Either reorganize files or update mount paths
```

---

### Fix Group 1D: Missing Environment Variables
**Issues:** #9  
**Estimated Time:** 1 hour  
**Impact:** Services won't crash due to missing env vars

#### Problem Summary:
- Hardcoded credentials in docker-compose
- Incomplete .env file
- Missing required META variables

#### What to Fix:

1. **Create .env.example** with all required variables:
```env
# Application
NODE_ENV=development
PORT=3000

# Domains
APP_DOMAIN=app.localhost:3000
API_DOMAIN=api.localhost:3000
ADMIN_DOMAIN=admin.localhost:3000

# Database
POSTGRES_USER=aerostic
POSTGRES_PASSWORD=secure_password_change_me
POSTGRES_DB=aerostic_db
DATABASE_URL=postgres://aerostic:secure_password_change_me@postgres:5432/aerostic_db

# Redis
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=generate_a_very_long_random_string_at_least_32_chars
JWT_EXPIRATION=7d
AES_ENCRYPTION_KEY=your_32_character_encryption_key_xyz

# Meta/WhatsApp
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here
META_API_VERSION=v19.0

# Database
DB_SYNC=true  # Set to false in production

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me_in_production

# Security
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

2. **Remove hardcoded values from docker-compose.yml**:
```yaml
# CHANGE FROM:
environment:
  POSTGRES_USER: aerostic
  POSTGRES_PASSWORD: aerostic_password

# CHANGE TO:
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
env_file:
  - .env
```

3. **Update .env for dev**:
```env
# Generate secure JWT_SECRET:
# Command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Files to Modify:
```
1. Create .env.example
2. Update .env with real values
3. docker-compose.yml (remove hardcoded values)
4. docker-compose.prod.yml (add env_file references)
5. .gitignore (add .env if not already there)
```

---

### Fix Group 1E: Docker-Compose Inconsistencies
**Issues:** #13  
**Estimated Time:** 1.5 hours  
**Impact:** Production deployment will have all services

#### Problem Summary:
- Production docker-compose.prod.yml missing webhook-worker and message-worker
- Version mismatch (3.9 vs 3.8)
- Redis not properly configured in prod

#### What to Fix:

1. **Add missing services to docker-compose.prod.yml**:
   - webhook-worker service definition
   - message-worker service definition
   - Ensure same image/environment as docker-compose.yml

2. **Standardize docker-compose version** to 3.9

3. **Add Redis to production**:
```yaml
redis:
  image: redis:7-alpine
  restart: always
  volumes:
    - redis_data:/data
```

4. **Add volume definitions**:
```yaml
volumes:
  postgres_data:
  redis_data:
```

#### Files to Modify:
```
1. docker-compose.prod.yml (add workers, redis, standardize)
2. docker-compose.yml (verify consistency)
```

---

## 📌 PHASE 2: HIGH PRIORITY FIXES (Functional Issues)

### Fix Group 2A: Admin Authentication
**Issues:** #10, #12  
**Estimated Time:** 2 hours  
**Impact:** Admin authentication will work; initial admin can be created

#### Problem Summary:
- Admin guard compatibility unclear
- Hardcoded admin credentials in seed script
- No integration of seed script in deployment

#### What to Fix:

1. **Implement/improve AdminGuard** in `services/api/src/admin/guards/admin.guard.ts`:
```typescript
// Should verify:
// - JWT is valid
// - User.role is ADMIN or SUPER_ADMIN
// - Admin user exists and is active
```

2. **Fix seed script** to use new TypeORM DataSource:
```typescript
// Remove deprecated createConnection()
// Use DataSource pattern
// Add error handling
// Make password input dynamic (command line arg or prompt)
```

3. **Create admin initialization endpoint** for first-time setup:
```typescript
// POST /admin/init
// Only callable if no admins exist
// Creates first super admin
// Then requires authentication
```

4. **Integrate seeding into deployment**:
   - Add to DEPLOYMENT.md
   - Create initialization script
   - Document admin account creation process

#### Files to Modify/Create:
```
1. services/api/src/admin/guards/admin.guard.ts (create if missing)
2. services/api/scripts/seed-admin.ts (rewrite with DataSource)
3. services/api/src/admin/auth/admin-auth.controller.ts (add init endpoint)
4. DEPLOYMENT.md (add initialization instructions)
5. scripts/ (create init-admin.sh or similar)
```

---

### Fix Group 2B: API Configuration
**Issues:** #11, #25, #26  
**Estimated Time:** 1.5 hours  
**Impact:** API base path consistent across all services

#### Problem Summary:
- Global prefix set but inconsistent with frontend expectations
- No request/response logging
- No explicit port configuration

#### What to Fix:

1. **Verify API port listening** in services/api/src/main.ts:
```typescript
const port = parseInt(process.env.PORT || '3000', 10);
await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

2. **Add request logging middleware**:
```typescript
import { v4 as uuid } from 'uuid';

app.use((req, res, next) => {
    req.id = uuid();
    const start = Date.now();
    res.on('finish', () => {
        console.log({
            requestId: req.id,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: Date.now() - start + 'ms'
        });
    });
    next();
});
```

3. **Ensure global prefix is applied correctly**:
```typescript
// Should be ONE place setting global prefix
app.setGlobalPrefix('api');
```

4. **Document API base URL**:
   - Dev: http://localhost:3000/api
   - Prod: https://api.aerostic.com or https://aerostic.com/api

#### Files to Modify:
```
1. services/api/src/main.ts (add logging, verify port)
2. .env and .env.example (document API_PORT)
3. README.md (add API access instructions)
```

---

### Fix Group 2C: Database & Migrations
**Issues:** #7  
**Estimated Time:** 3-4 hours  
**Impact:** Safe database schema management

#### Problem Summary:
- No migration system implemented
- Auto-synchronize enabled in production (dangerous)
- No rollback mechanism

#### What to Fix:

1. **Generate TypeORM migrations** for current schema:
```bash
npm run migration:generate -- src/database/migrations/InitialSetup
```

2. **Create migration commands** in api/package.json:
```json
"migration:generate": "typeorm migration:generate",
"migration:run": "typeorm migration:run",
"migration:revert": "typeorm migration:revert"
```

3. **Update database configuration** in services/api/src/app.module.ts:
```typescript
TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: false,  // NEVER true in production
    migrationsRun: true,  // Auto-run migrations on startup
    migrations: ['src/database/migrations/*.ts'],
})
```

4. **Create initial migration** that sets up all tables

5. **Document migration process** in DEPLOYMENT.md

#### Files to Modify/Create:
```
1. services/api/src/database/ (create migrations folder structure)
2. services/api/src/database/migrations/TIMESTAMP_InitialSchema.ts (create)
3. services/api/src/app.module.ts (update TypeORM config)
4. services/api/package.json (add migration scripts)
5. DEPLOYMENT.md (add migration documentation)
```

---

### Fix Group 2D: Worker Services
**Issues:** #8, #19, #21  
**Estimated Time:** 3-4 hours  
**Impact:** Workers are fully functional with error handling

#### Problem Summary:
- Incomplete implementations
- No error handling
- Missing health checks
- WebSocket client missing in some frontends

#### What to Fix:

1. **Webhook-Worker Implementation**:
   - Ensure proper main.ts with bootstrap
   - Implement queue consumer
   - Add error handlers
   - Add logging
   - Health check endpoint

2. **Message-Worker Implementation**:
   - Create proper main.ts for NestJS
   - Implement message processor
   - Add retry logic
   - Dead letter queue handling
   - Health check endpoint

3. **Add WebSocket client** to services/admin-frontend and services/frontend:
```bash
npm install socket.io-client
```

4. **Add health endpoints** to both workers:
```typescript
@Get('/health')
health() {
    return { status: 'ok', uptime: process.uptime() };
}
```

#### Files to Modify/Create:
```
1. services/webhook-worker/src/main.ts (verify/create)
2. services/webhook-worker/src/webhook.service.ts (complete)
3. services/message-worker/src/main.ts (rewrite as NestJS)
4. services/message-worker/src/message.processor.ts (improve)
5. services/admin-frontend/package.json (add socket.io-client)
6. services/frontend/package.json (add socket.io-client)
7. Both workers (add health endpoints)
```

---

## 📌 PHASE 3: SECURITY & STABILITY

### Fix Group 3A: Security Issues
**Issues:** #22, #23, #24  
**Estimated Time:** 1.5-2 hours  
**Impact:** System is secure

#### Problem Summary:
- Debug module exposed in production
- Rate limiting too lenient
- CORS overly permissive
- Hardcoded IPs and .nip.io domains

#### What to Fix:

1. **Remove/Conditionally Load Debug Module**:
```typescript
const imports = [...baseImports];
if (process.env.NODE_ENV !== 'production') {
    imports.push(DebugModule);
}

@Module({
    imports,
    ...
})
```

2. **Improve Rate Limiting**:
```typescript
const createRateLimiter = (windowMs, max) => 
    rateLimit({ windowMs, max });

app.use('/auth/login', createRateLimiter(15 * 60 * 1000, 5));  // 5/15min
app.use('/auth/register', createRateLimiter(60 * 60 * 1000, 3)); // 3/hour
app.use('/api/', createRateLimiter(60 * 1000, 100));  // 100/min default
```

3. **Fix CORS Configuration**:
```typescript
const corsOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
];

if (process.env.NODE_ENV === 'production') {
    corsOrigins.push(
        `https://${process.env.APP_DOMAIN}`,
        `https://${process.env.API_DOMAIN}`,
        `https://${process.env.ADMIN_DOMAIN}`
    );
}

app.enableCors({
    origin: corsOrigins,
    credentials: true,
});
```

4. **Remove hardcoded IPs**:
   - Use environment variables
   - Remove .nip.io domains
   - Document IP whitelisting if needed

#### Files to Modify:
```
1. services/api/src/app.module.ts (debug module)
2. services/api/src/main.ts (rate limiting, CORS)
3. .env.example (add CORS whitelist vars)
```

---

### Fix Group 3B: Health Checks & Monitoring
**Issues:** #20  
**Estimated Time:** 2 hours  
**Impact:** Monitoring and auto-healing possible

#### Problem Summary:
- No health check endpoints
- No liveness/readiness probes
- No way to monitor service health

#### What to Fix:

1. **Create health check module**:
```typescript
// services/api/src/common/health/health.module.ts
// services/api/src/common/health/health.controller.ts

@Controller('health')
export class HealthController {
    @Get('/live')
    liveness() { return { status: 'alive' }; }
    
    @Get('/ready')
    async readiness() {
        // Check DB connection
        // Check Redis connection
        return { status: 'ready' };
    }
    
    @Get()
    async health() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date(),
            services: {
                database: await dbHealthCheck(),
                redis: await redisHealthCheck()
            }
        };
    }
}
```

2. **Add health checks to workers**

3. **Update docker-compose** with health checks:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

#### Files to Modify/Create:
```
1. services/api/src/common/health/ (create module & controller)
2. services/api/src/app.module.ts (import health module)
3. docker-compose.yml (add healthcheck sections)
4. docker-compose.prod.yml (add healthcheck sections)
5. Workers (add health endpoints)
```

---

### Fix Group 3C: Shared Module & Common Utilities
**Issues:** #16  
**Estimated Time:** 2-3 hours  
**Impact:** Code reuse; consistent interfaces across services

#### Problem Summary:
- Shared module exists but barely used
- Type definitions not centralized
- Constants duplicated across services
- No shared DTOs

#### What to Fix:

1. **Create shared type definitions** in shared/types/:
```typescript
// shared/types/index.ts
export interface IUser { ... }
export interface ITenant { ... }
export interface IMessage { ... }
export enum UserRole { ... }
export enum TenantStatus { ... }
```

2. **Create shared constants** in shared/constants/:
```typescript
export const ROLES = {
    ADMIN: 'admin',
    AGENT: 'agent',
    SUPER_ADMIN: 'super_admin'
} as const;

export const RATE_LIMITS = {
    DEFAULT: 100,
    AUTH: 5,
    MESSAGE: 50
} as const;
```

3. **Create shared DTOs**:
```typescript
// shared/dto/auth.dto.ts
export class LoginDto {
    email: string;
    password: string;
}

export class RegisterDto extends LoginDto {
    name: string;
    businessName: string;
}
```

4. **Build and export from root**:
```typescript
// shared/index.ts
export * from './types';
export * from './constants';
export * from './dto';
export * from './utils';
```

5. **Update all services** to import from @aerostic/common (shared)

#### Files to Modify/Create:
```
1. shared/types/index.ts (create comprehensive types)
2. shared/constants/index.ts (create constants)
3. shared/dto/ (create DTO classes)
4. shared/index.ts (export everything)
5. All services (update imports to use shared)
```

---

## 📌 PHASE 4: POLISH & DOCUMENTATION

### Fix Group 4A: Documentation
**Issues:** #14, #28  
**Estimated Time:** 2-3 hours  
**Impact:** Developers can understand and work with system

#### What to Fix:

1. **Create .env.example** (from Phase 1D)
2. **Update README.md**:
   - Add quick start guide
   - Add API documentation link
   - Add local development instructions
   - Add troubleshooting section

3. **Create/Update DEVELOPMENT.md**:
```markdown
# Development Guide

## Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

## Quick Start
1. Clone repository
2. Copy .env.example to .env
3. Run docker-compose up
4. Access services at...

## API Documentation
- Swagger UI: http://localhost:3000/api/docs
```

4. **Document deployment process** in DEPLOYMENT.md

5. **Create TROUBLESHOOTING.md**:
   - Common issues
   - Port conflicts
   - Database connection issues
   - Redis connection issues

6. **Document middleware** in services/app-frontend and admin-frontend

#### Files to Modify/Create:
```
1. README.md (comprehensive update)
2. DEVELOPMENT.md (create)
3. TROUBLESHOOTING.md (create)
4. DEPLOYMENT.md (update with new procedures)
5. .env.example (create from Phase 1D)
```

---

### Fix Group 4B: Frontend Middleware & Features
**Issues:** #14, #19  
**Estimated Time:** 2-3 hours  
**Impact:** Frontend properly handles auth and real-time updates

#### What to Fix:

1. **Verify/Update middleware.ts** in app-frontend:
   - Check JWT token validity
   - Redirect to login if invalid
   - Check tenant context

2. **Verify/Update middleware.ts** in admin-frontend:
   - Check admin JWT token
   - Verify admin role
   - Redirect to login if invalid

3. **Implement WebSocket connections** in app-frontend:
```typescript
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL || '/');

socket.on('conversation:new', (data) => {
    // Handle new conversation
});
```

4. **Add loading states and error handling** to all forms

#### Files to Modify:
```
1. services/app-frontend/middleware.ts (review & improve)
2. services/admin-frontend/middleware.ts (review & improve)
3. services/app-frontend/app/(dashboard)/page.tsx (add realtime)
4. services/app-frontend/components/*.tsx (add error boundaries)
```

---

### Fix Group 4C: Additional Improvements
**Issues:** #15, #27  
**Estimated Time:** 2-3 hours  
**Impact:** Better functionality and data security

#### What to Fix:

1. **Fix Audit Logs Controller** ([Issue #15]()):
   - Extract tenantId from JWT
   - Verify user has access to requested tenant
   - Add role-based filtering

2. **Improve Contacts Module**:
   - Add Update endpoint
   - Add Delete endpoint
   - Add pagination (limit/offset)
   - Add filtering and sorting
   - Add DTOs with validation

3. **Add missing endpoints**:
   - Bulk contact operations
   - Contact import/export
   - Contact deduplication

#### Files to Modify:
```
1. services/api/src/audit-logs/audit-logs.controller.ts
2. services/api/src/contacts/contacts.controller.ts
3. services/api/src/contacts/dto/
4. services/api/src/contacts/contacts.service.ts
```

---

## 📊 Fix Implementation Checklist

### Phase 1 - CRITICAL (Week 1)
- [ ] Fix docker-compose port conflicts
- [ ] Fix nginx configuration
- [ ] Fix Dockerfile workspace references
- [ ] Move/configure nginx files
- [ ] Set up environment variables properly
- [ ] Fix docker-compose consistency
- [ ] **Verification**: Services build and start without errors

### Phase 2 - HIGH PRIORITY (Week 2)
- [ ] Fix admin authentication
- [ ] Fix API configuration
- [ ] Implement database migrations
- [ ] Complete worker services
- [ ] **Verification**: All services communicate; workers process jobs

### Phase 3 - SECURITY (Week 2-3)
- [ ] Remove debug module from production
- [ ] Fix rate limiting
- [ ] Fix CORS configuration
- [ ] Implement health checks
- [ ] **Verification**: Security tests pass; monitoring works

### Phase 4 - POLISH (Week 3)
- [ ] Complete documentation
- [ ] Improve frontend
- [ ] Complete contact module
- [ ] Add missing endpoints
- [ ] **Verification**: All features work; documentation is complete

---

## 🔄 Testing After Each Phase

### Phase 1 Testing
```bash
docker-compose build
docker-compose up
curl http://localhost:3000/api/health
curl http://localhost:3000/api/docs  # Swagger
```

### Phase 2 Testing
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Test worker processing
# Send message and verify it's processed
```

### Phase 3 Testing
```bash
# Security testing
# Rate limit testing
# Health check testing
```

### Phase 4 Testing
```bash
# End-to-end tests
# Frontend tests
# Performance tests
```

---

## 📈 Estimated Effort Summary

| Phase | Issues | Hours | Priority |
|-------|--------|-------|----------|
| 1 - Critical | 5 major groups | 8-10 | MUST DO |
| 2 - High Priority | 4 major groups | 10-12 | MUST DO |
| 3 - Security | 3 major groups | 6-8 | SHOULD DO |
| 4 - Polish | 2 major groups | 8-10 | SHOULD DO |
| **TOTAL** | **28 issues** | **32-40** | **10-15 days** |

---

## 🎯 Success Criteria

### Phase 1 Complete
✓ All containers build without errors  
✓ docker-compose up starts all services  
✓ Services can communicate with each other  
✓ Nginx routes work for all endpoints  

### Phase 2 Complete
✓ Login/Register flows work  
✓ JWT tokens are issued and validated  
✓ Admin panel is accessible  
✓ Workers process jobs  
✓ Database migrations run successfully  

### Phase 3 Complete
✓ Debug endpoint not accessible in prod  
✓ Rate limiting works  
✓ Health check endpoints return status  
✓ CORS only allows configured origins  

### Phase 4 Complete
✓ All documentation is current  
✓ Developers can set up local environment  
✓ All CRUD operations work  
✓ Real-time features work (WebSocket)  

---

## ⚠️ High Risk Items (Need Extra Attention)

1. **Database Migration Implementation**
   - Risk: Data loss if not implemented correctly
   - Mitigation: Test with staging data first

2. **Admin Authentication**
   - Risk: Privilege escalation vulnerabilities
   - Mitigation: Security review before deployment

3. **Worker Services**
   - Risk: Silent failures if not monitored
   - Mitigation: Implement comprehensive logging

4. **Rate Limiting & CORS**
   - Risk: DoS attacks or unauthorized access
   - Mitigation: Thorough testing before production

---

## 📞 Next Steps

1. **Review this plan** with your team
2. **Assign owners** for each fix group
3. **Create PR templates** for each fix
4. **Set up testing environment**
5. **Begin Phase 1 fixes** (estimated 8-10 hours)
6. **Weekly sync meetings** to track progress

---

**Plan Created:** February 9, 2026  
**Ready for:** Immediate Implementation  
**Recommended Start:** This week  
**Expected Completion:** 2-3 weeks (depending on team size)
