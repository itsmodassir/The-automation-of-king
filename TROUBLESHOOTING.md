# 🆘 Troubleshooting Guide - Aerostic Platform

Solutions to common issues and problems you might encounter while developing or deploying Aerostic.

---

## 🚀 Startup Issues

### Docker Services Won't Start

**Problem:** `docker-compose up` fails or services keep crashing

**Solutions:**
```bash
# 1. Check Docker is running
docker ps

# 2. Clean up and restart
docker-compose down -v
docker-compose up -d

# 3. Check logs
docker-compose logs

# 4. Free up ports (if port already in use)
lsof -i :3000    # Check port 3000
lsof -i :5432    # Check port 5432
lsof -i :6379    # Check port 6379

# 5. Reset Docker system
docker system prune -a
docker-compose up -d
```

### API Service Won't Start

**Problem:** API container exits immediately or shows restart loop

**Solutions:**
```bash
# Check API logs
docker logs aerostic-api

# Common issues:
# 1. Database not ready
#    → Wait 30 seconds and restart: docker-compose restart api

# 2. bcrypt compilation error
#    → Docker image needs rebuild
docker-compose down api
docker rmi theautomationofking-api
docker-compose up -d api

# 3. Port already in use
#    → Change PORT in .env and restart
nano .env
# Change PORT=3000 to PORT=3001
docker-compose down api
docker-compose up -d api
```

### Database Won't Connect

**Problem:** `connection refused` or `ECONNREFUSED`

**Solutions:**
```bash
# 1. Check PostgreSQL is running
docker ps | grep postgres

# 2. Check PostgreSQL logs
docker logs aerostic-postgres

# 3. Wait for database to be ready (first startup takes 30-60 seconds)
docker exec aerostic-postgres pg_isready -U aerostic

# 4. Verify DATABASE_URL in .env
DATABASE_URL=postgresql://aerostic:aerostic@postgres:5432/aerostic

# 5. Test connection manually
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "SELECT 1"

# 6. Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

### Redis Won't Connect

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solutions:**
```bash
# 1. Check Redis is running
docker ps | grep redis

# 2. Check Redis logs
docker logs aerostic-redis

# 3. Test Redis connection
docker exec aerostic-redis redis-cli PING

# 4. Verify REDIS_URL in .env
REDIS_URL=redis://redis:6379

# 5. Clear Redis cache
docker exec aerostic-redis redis-cli FLUSHDB

# 6. Restart Redis
docker-compose restart redis
```

---

## 📡 Health Check Issues

### Health Endpoints Return 404

**Problem:** Curl returns `"message": "Cannot GET /health"`

**Solutions:**
```bash
# 1. Verify API is running
docker ps | grep aerostic-api

# 2. Check API logs
docker logs aerostic-api | tail -20

# 3. Use correct path (includes /api prefix)
curl http://localhost:3000/api/health

# 4. Verify health module is imported
grep -r "HealthModule" services/api/src/

# 5. Check global prefix in main.ts
grep "setGlobalPrefix" services/api/src/main.ts
```

### Health Check Fails

**Problem:** Health endpoint returns error status

**Solutions:**
```bash
# Check full health status
curl http://localhost:3000/api/health | jq

# Check specific checks
curl http://localhost:3000/api/health | jq '.checks.database'
curl http://localhost:3000/api/health | jq '.checks.redis'

# If database fails:
docker logs aerostic-postgres

# If Redis fails:
docker logs aerostic-redis

# Restart the failing service
docker-compose restart postgres
docker-compose restart redis
```

### Readiness Probe Failing

**Problem:** Health ready endpoint returns 503

**Solutions:**
```bash
# This means dependencies aren't healthy
# Check each dependency
curl http://localhost:3000/api/health | jq '.checks'

# If database unhealthy:
docker exec aerostic-postgres pg_isready -U aerostic

# If Redis unhealthy:
docker exec aerostic-redis redis-cli PING

# Restart failing services
docker-compose restart postgres redis

# Wait 30 seconds then retry
sleep 30
curl http://localhost:3000/api/health/ready
```

---

## 🔐 Authentication Issues

### Admin Login Fails

**Problem:** Admin login returns invalid credentials error

**Solutions:**
```bash
# 1. Verify admin user exists
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "SELECT * FROM admin_user;"

# 2. Recreate admin user
npm run seed:admin --workspace @aerostic/api

# 3. Check admin credentials
# Email and password must match exactly (case-sensitive)

# 4. Check password is being hashed
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "SELECT email, password FROM admin_user;"

# 5. Check JWT secret in .env
grep JWT_SECRET .env

# If all else fails, reset admin user:
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "DELETE FROM admin_user;"
npm run seed:admin --workspace @aerostic/api
```

### User Registration Fails

**Problem:** Registration endpoint returns 400 Bad Request

**Solutions:**
```bash
# Check request format
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Common issues:
# 1. Email already exists
#    → Use different email

# 2. Password too weak
#    → Use stronger password (8+ chars recommended)

# 3. Missing required fields
#    → All fields: email, password, firstName, lastName

# 4. Database connection issue
#    → Check PostgreSQL: docker logs aerostic-postgres
```

### JWT Token Expired

**Problem:** API returns 401 Unauthorized

**Solutions:**
```bash
# Get new token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Use the new access_token in requests
curl -H "Authorization: Bearer <new_token>" \
  http://localhost:3000/api/users/me

# If token expired quickly:
# Check JWT_EXPIRATION in .env
grep JWT_EXPIRATION .env

# Default is 7 days. To extend:
# JWT_EXPIRATION=30d
```

---

## 🌐 Port Conflicts

### Port Already in Use

**Problem:** `bind: address already in use` error

**Solutions:**
```bash
# Find what's using the port
lsof -i :3000     # API
lsof -i :3001     # Frontend
lsof -i :3002     # App Dashboard
lsof -i :3003     # Admin Dashboard
lsof -i :5432     # PostgreSQL
lsof -i :6379     # Redis

# Kill the process
kill -9 <PID>

# Or change the port in .env
nano .env
# API_PORT=3000 → API_PORT=4000

# Restart services
docker-compose down
docker-compose up -d
```

### Docker Port Mapping Issue

**Problem:** Container running but port not accessible

**Solutions:**
```bash
# Check container port mapping
docker port aerostic-api

# Should show: 3000/tcp -> 0.0.0.0:3000

# If not mapped correctly:
# 1. Update docker-compose.yml ports section
# 2. Rebuild: docker-compose up -d --force-recreate

# Test connection
curl http://localhost:3000/api/health

# If still not working:
docker-compose down
docker-compose up -d
```

---

## 🗄️ Database Issues

### Database Connection Timeout

**Problem:** `connect ETIMEDOUT` or timeout errors

**Solutions:**
```bash
# 1. Check PostgreSQL is running
docker exec aerostic-postgres pg_isready -U aerostic

# 2. Check resource usage
docker stats aerostic-postgres

# 3. Increase connection timeout in .env
# Add or modify:
DATABASE_URL=postgresql://aerostic:aerostic@postgres:5432/aerostic?statement_timeout=30000

# 4. Check database size (might be slow)
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "\l+"

# 5. Restart database
docker-compose restart postgres

# 6. If database is corrupted, reset it:
docker-compose down -v
docker-compose up -d
```

### Migration Fails

**Problem:** TypeORM migration error or SQL error

**Solutions:**
```bash
# Check migration status
npm run migration:show --workspace @aerostic/api

# Revert last migration
npm run migration:revert --workspace @aerostic/api

# Run migrations manually
npm run migration:run --workspace @aerostic/api

# Check migration files
ls -la services/api/src/database/migrations/

# If migrations table is corrupted:
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "DROP TABLE IF EXISTS typeorm_migrations;"

# Then restart
npm run migration:run --workspace @aerostic/api
```

### Slow Queries

**Problem:** Database queries taking too long

**Solutions:**
```bash
# Enable query logging
# In .env, add:
# DB_LOGGING=true

# Check slow query logs
docker exec aerostic-postgres psql -U aerostic -d aerostic << EOF
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
EOF

# Identify missing indexes
# Check entity files for frequently queried columns

# Add indexes if needed
# In TypeORM entity: @Index()

# Rebuild and restart
npm run build
docker-compose down
docker-compose up -d
```

---

## 🔧 Build Issues

### Build Fails with TypeScript Error

**Problem:** `npm run build` fails with TS errors

**Solutions:**
```bash
# 1. Check the error message
npm run build 2>&1 | tail -50

# 2. Fix common issues:
# - Missing imports: Add the import statement
# - Type mismatch: Fix the type annotation
# - Unused variables: Remove or use (prefix with _)

# 3. Run TSC directly for better errors
npx tsc --noEmit

# 4. Check specific workspace
npm run build --workspace @aerostic/api

# 5. Clear cache and rebuild
rm -rf dist/ node_modules/
npm install --legacy-peer-deps
npm run build
```

### Build Fails with bcrypt Error

**Problem:** `bcrypt native binding error` during Docker build

**Solutions:**
```bash
# This happens in Docker (Alpine) when build tools are missing
# 1. Rebuild Docker image with build tools
docker-compose down api
docker rmi theautomationofking-api

# 2. Update Dockerfile to include build tools
# services/api/Dockerfile should have:
# RUN apk add --no-cache python3 make g++
# RUN npm rebuild bcrypt --build-from-source

# 3. Rebuild
docker-compose up -d api
```

### npm install Fails

**Problem:** `npm ERR!` during `npm install`

**Solutions:**
```bash
# 1. Use legacy peer deps flag
npm install --legacy-peer-deps

# 2. Clear npm cache
npm cache clean --force

# 3. Remove lockfile and reinstall
rm package-lock.json
npm install --legacy-peer-deps

# 4. Check Node version
node --version  # Should be 20+
npm --version   # Should be 9+

# 5. Check disk space
df -h

# 6. Try in Docker
docker-compose exec api npm install --legacy-peer-deps
```

---

## 🌐 Frontend Issues

### Frontend Shows Blank Page

**Problem:** App opens but shows no content

**Solutions:**
```bash
# 1. Check frontend logs
docker logs aerostic-app
docker logs aerostic-admin

# 2. Check browser console for errors
# Open: http://localhost:3002
# Press F12 → Console tab

# 3. Check API connection
# In browser DevTools → Network tab
# Look for API calls to http://localhost:3000/api

# 4. Verify NEXT_PUBLIC_API_URL
grep NEXT_PUBLIC_API_URL .env

# 5. Check if .env is loaded in container
docker exec aerostic-app env | grep NEXT_PUBLIC

# 6. Rebuild frontend
docker-compose down app
docker rmi theautomationofking-app-frontend
docker-compose up -d app
```

### API Calls Failing from Frontend

**Problem:** Browser shows CORS error or failed requests

**Solutions:**
```bash
# 1. Check CORS is enabled
# services/api/src/main.ts should have:
# app.enableCors({
#   origin: corsOrigins,
#   credentials: true
# });

# 2. Check API_DOMAIN in .env
grep API_DOMAIN .env

# 3. Check NEXT_PUBLIC_API_URL
grep NEXT_PUBLIC_API_URL .env

# 4. Test API directly
curl -H "Origin: http://localhost:3002" \
  http://localhost:3000/api/health

# 5. Check CORS headers in response
curl -I http://localhost:3000/api/health | grep -i access-control

# 6. Verify Nginx routing
grep -A 5 "location /api" nginx/conf.d/*.conf
```

### WebSocket Connection Fails

**Problem:** Real-time updates not working, WebSocket errors in console

**Solutions:**
```bash
# 1. Check if Socket.IO is installed
npm ls socket.io-client --workspace @aerostic/app-frontend

# 2. Verify WebSocket endpoint
# Should be: http://localhost:3000

# 3. Check API logs for Socket.IO errors
docker logs aerostic-api | grep -i socket

# 4. Test WebSocket connection
# In browser console:
# const socket = io('http://localhost:3000');
# socket.on('connect', () => console.log('Connected'));

# 5. Check Nginx WebSocket support
grep -A 5 "upgrade" nginx/conf.d/api.conf

# 6. Restart API with WebSocket support
docker-compose restart api
```

---

## 📊 Performance Issues

### API Slow to Respond

**Problem:** API requests taking >1 second

**Solutions:**
```bash
# 1. Check API logs for slow queries
docker logs aerostic-api | grep "durationMs"

# 2. Monitor resource usage
docker stats aerostic-api

# 3. Check if API is under load
docker exec aerostic-api top

# 4. Optimize slow database queries
docker exec aerostic-postgres psql -U aerostic -d aerostic << EOF
SELECT query, calls, mean_time 
FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC;
EOF

# 5. Add indexes if needed
# 6. Restart API after optimizations
docker-compose restart api
```

### High Memory Usage

**Problem:** Container memory limit exceeded or OOM killer

**Solutions:**
```bash
# 1. Check memory usage
docker stats

# 2. Identify memory leak
docker exec aerostic-api top -p 1

# 3. Check logs for memory issues
docker logs aerostic-api | grep -i memory

# 4. Increase Docker memory limit
# Update docker-compose.yml:
# services:
#   api:
#     deploy:
#       resources:
#         limits:
#           memory: 2G

# 5. Restart with more memory
docker-compose down
docker-compose up -d

# 6. Check Node.js heap
# In code: console.log(process.memoryUsage());
```

---

## 🐛 Debugging Tips

### Enable Debug Logging

```bash
# Set debug environment
export DEBUG=aerostic:*
npm run dev --workspace @aerostic/api

# Or in .env
DEBUG=aerostic:*
NODE_ENV=development
DB_LOGGING=true
```

### Inspect Container

```bash
# Get shell access
docker exec -it aerostic-api sh

# Or bash if available
docker exec -it aerostic-postgres bash

# Common diagnostic commands
ps aux           # Process list
netstat -tlnp    # Network sockets
cat /etc/hosts   # DNS resolution
```

### View Real-time Logs

```bash
# Follow logs
docker-compose logs -f api

# With grep filter
docker-compose logs -f api | grep ERROR

# With timestamps
docker-compose logs -f --timestamps api

# Last N lines
docker-compose logs --tail=100 api
```

---

## 🆘 Emergency Reset

### Complete System Reset (Warning: Deletes All Data)

```bash
# Stop everything
docker-compose down

# Remove all data
docker-compose down -v

# Remove images
docker rmi theautomationofking-api theautomationofking-app-frontend \
  theautomationofking-admin-frontend theautomationofking-webhook-worker \
  theautomationofking-message-worker theautomationofking-frontend

# Clean Docker system
docker system prune -a --volumes

# Start fresh
cp .env.example .env
docker-compose up -d

# Initialize admin
npm run seed:admin --workspace @aerostic/api
```

### Network Reset

```bash
# Remove network
docker network rm theautomationofking_default

# Recreate network
docker-compose up -d

# Verify
docker network ls
```

---

## 📞 Getting Help

If troubleshooting doesn't solve your issue:

1. **Check logs thoroughly**
   ```bash
   docker-compose logs --tail=100
   ```

2. **Search existing issues**
   - GitHub Issues

3. **Gather diagnostics**
   ```bash
   docker -v
   docker-compose --version
   uname -a
   ```

4. **Create issue with:**
   - Error message (full text)
   - Steps to reproduce
   - System info
   - Log output
   - `.env` (without secrets)

---

**Last Updated:** February 9, 2026  
**Version:** 1.0

---

## Quick Reference Commands

```bash
# Status
docker-compose ps
docker-compose logs

# Restart
docker-compose restart
docker-compose restart <service>

# Rebuild
docker-compose down -v
docker-compose up -d --build

# Database
docker exec aerostic-postgres psql -U aerostic -d aerostic
npm run migration:run --workspace @aerostic/api

# Admin
npm run seed:admin --workspace @aerostic/api

# Tests
docker-compose exec api npm test

# Reset
docker-compose down -v && docker-compose up -d
```
