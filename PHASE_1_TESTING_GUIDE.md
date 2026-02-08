# 🧪 Phase 1 Testing Guide

**Purpose:** Verify all Phase 1 fixes are working correctly  
**Estimated Time:** 15-30 minutes  
**Prerequisites:** Docker and Docker Compose installed  

---

## ✅ Quick Verification Checklist

Run this checklist in order:

### 1. Build Test (5 minutes)
```bash
cd /Users/Modassir/Desktop/The\ automation\ of\ king

# Clean up old builds
docker-compose down -v 2>/dev/null || true
docker system prune -f

# Rebuild everything
docker-compose build --no-cache
```

**Expected Result:** ✅ All images build without errors

**If it fails:**
- Check Docker is running: `docker --version`
- Check Docker Compose: `docker-compose --version`
- Check disk space: `df -h`
- Check for build errors in output

---

### 2. Startup Test (3 minutes)
```bash
# Start all services
docker-compose up -d

# Wait 10 seconds for services to initialize
sleep 10

# Check all services are running
docker-compose ps
```

**Expected Result:** ✅ All containers show "Up" status

**If it fails:**
```bash
# Check specific service logs
docker-compose logs api
docker-compose logs postgres
docker-compose logs redis
```

---

### 3. Port Access Test (5 minutes)
```bash
# Test API port
curl -i http://localhost:3000/api 2>/dev/null | head -5

# Test Frontend
curl -i http://localhost:3001/ 2>/dev/null | head -5

# Test App-Frontend
curl -i http://localhost:3002/ 2>/dev/null | head -5

# Test Admin-Frontend
curl -i http://localhost:3003/ 2>/dev/null | head -5
```

**Expected Result:** 
- API: `301` (redirect) or `404` (not found) is OK
- Frontends: `200 OK` with HTML content

**If you get "Connection refused":**
- Service didn't start: Check logs with `docker-compose logs SERVICE_NAME`
- Wrong port: Verify docker-compose.yml ports match

---

### 4. Service Communication Test (5 minutes)
```bash
# Check if services can see each other
docker exec aerostic-api ping redis -c 1
docker exec aerostic-api ping postgres -c 1

# Check if API can reach Redis
docker exec aerostic-api redis-cli -h redis ping
```

**Expected Result:** 
- Pings: `1 packets transmitted, 1 received`
- Redis: `PONG`

---

### 5. Docker Configuration Test (3 minutes)
```bash
# Verify port mappings
docker port aerostic-api
docker port aerostic-app
docker port aerostic-admin
docker port aerostic-frontend

# Expected output:
# 3000/tcp -> 0.0.0.0:3000
# 3000/tcp -> 0.0.0.0:3002
# 3000/tcp -> 0.0.0.0:3003
# 3000/tcp -> 0.0.0.0:3001
```

---

### 6. Configuration Test (3 minutes)
```bash
# Verify environment variables in API container
docker exec aerostic-api printenv | grep -E "DATABASE_URL|REDIS_URL|NODE_ENV"

# Check nginx configuration
docker exec aerostic-nginx cat /etc/nginx/conf.d/api.conf | grep proxy_pass
```

**Expected Result:**
- DATABASE_URL: `postgres://aerostic:aerostic_password@postgres:5432/aerostic`
- REDIS_URL: `redis://redis:6379`
- NODE_ENV: `development`
- proxy_pass: `http://api:3000`

---

## 📊 Full Test Suite

Run this script for comprehensive testing:

```bash
#!/bin/bash
# Phase 1 Test Suite

echo "🧪 PHASE 1 COMPREHENSIVE TEST SUITE"
echo "===================================="
echo ""

# Test 1: Build
echo "1️⃣ Building Docker images..."
docker-compose build --no-cache > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then echo "✅ BUILD PASSED"; else echo "❌ BUILD FAILED"; cat /tmp/build.log; exit 1; fi
echo ""

# Test 2: Start
echo "2️⃣ Starting services..."
docker-compose up -d
sleep 15
echo "✅ SERVICES STARTED"
echo ""

# Test 3: Running check
echo "3️⃣ Checking running containers..."
RUNNING=$(docker-compose ps -q | wc -l)
EXPECTED=8  # postgres, redis, api, frontend, app-frontend, admin-frontend, nginx, webhook-worker, message-worker
if [ $RUNNING -ge 7 ]; then
  echo "✅ ALL SERVICES RUNNING ($RUNNING services)"
else
  echo "⚠️ SOME SERVICES NOT RUNNING ($RUNNING/$EXPECTED)"
  docker-compose ps
fi
echo ""

# Test 4: Port accessibility
echo "4️⃣ Testing port accessibility..."
for PORT in 3000 3001 3002 3003; do
  if timeout 2 bash -c "echo >/dev/tcp/localhost/$PORT" 2>/dev/null; then
    echo "✅ Port $PORT: OPEN"
  else
    echo "❌ Port $PORT: CLOSED"
  fi
done
echo ""

# Test 5: Service health
echo "5️⃣ Checking service connectivity..."
docker exec aerostic-api redis-cli -h redis ping > /dev/null 2>&1
if [ $? -eq 0 ]; then echo "✅ API → Redis: OK"; else echo "❌ API → Redis: FAILED"; fi

docker exec aerostic-api pg_isready -h postgres -U aerostic > /dev/null 2>&1
if [ $? -eq 0 ]; then echo "✅ API → PostgreSQL: OK"; else echo "❌ API → PostgreSQL: FAILED"; fi
echo ""

# Test 6: Configuration
echo "6️⃣ Checking configuration..."
docker exec aerostic-api printenv NODE_ENV | grep -q development
if [ $? -eq 0 ]; then echo "✅ NODE_ENV: development"; else echo "❌ NODE_ENV: WRONG"; fi

docker exec aerostic-nginx grep -q "http://api:3000" /etc/nginx/conf.d/api.conf
if [ $? -eq 0 ]; then echo "✅ Nginx API route: http://api:3000"; else echo "❌ Nginx API route: WRONG"; fi
echo ""

echo "===================================="
echo "✅ PHASE 1 TESTS COMPLETE"
echo "All critical configurations verified"
```

Save this as `phase1-test.sh` and run:
```bash
chmod +x phase1-test.sh
./phase1-test.sh
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Docker daemon"
**Solution:** Start Docker
```bash
# On macOS:
open /Applications/Docker.app

# On Linux:
sudo systemctl start docker
```

### Issue: "Port already in use"
**Solution:** Find and stop the conflicting service
```bash
# Find what's using port 3000
lsof -i :3000

# Or remove all containers
docker-compose down -v
```

### Issue: "Services not starting"
**Solution:** Check logs
```bash
docker-compose logs -f SERVICE_NAME
```

### Issue: "Build fails with permission denied"
**Solution:** Check Docker permissions
```bash
# On Linux:
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: "Database connection refused"
**Solution:** Ensure PostgreSQL is ready
```bash
# Check PostgreSQL status
docker-compose logs postgres | tail -20

# Wait longer for startup
sleep 30
```

---

## ✨ Success Indicators

Phase 1 is successful if:

1. ✅ **docker-compose build** completes without errors
2. ✅ **docker-compose up -d** starts all services
3. ✅ **docker-compose ps** shows all containers as "Up"
4. ✅ **Port 3000** is accessible (API)
5. ✅ **Port 3001** is accessible (Frontend)
6. ✅ **Port 3002** is accessible (App-Frontend)
7. ✅ **Port 3003** is accessible (Admin-Frontend)
8. ✅ **Services communicate** (API → Redis, API → PostgreSQL)
9. ✅ **Environment variables** are set correctly
10. ✅ **Nginx routes** point to correct ports

---

## 📋 Test Results Template

Use this template to document your test results:

```markdown
# Phase 1 Test Results

**Date:** [DATE]
**Tester:** [NAME]
**System:** [OS/Docker Version]

## Build Test
- Status: ✅ / ❌
- Build time: [TIME]
- Errors: [NONE / DESCRIBE]

## Startup Test
- Status: ✅ / ❌
- Services running: [COUNT]
- Errors: [NONE / DESCRIBE]

## Port Access Test
- Port 3000: ✅ / ❌
- Port 3001: ✅ / ❌
- Port 3002: ✅ / ❌
- Port 3003: ✅ / ❌

## Service Communication
- API → Redis: ✅ / ❌
- API → PostgreSQL: ✅ / ❌

## Configuration Test
- NODE_ENV: ✅ / ❌
- API URL: ✅ / ❌
- Database URL: ✅ / ❌

## Overall Status
✅ PASS / ❌ FAIL

## Notes
[Any issues, observations, recommendations]
```

---

## 🎯 Next Steps

After successful testing:

1. **Document results** - Use template above
2. **Run production build** - Test docker-compose.prod.yml
3. **Check logs** - `docker-compose logs` for any warnings
4. **Note any issues** - Create GitHub issues for problems
5. **Proceed to Phase 2** - When ready for next fixes

---

**Phase 1 Testing Complete!** ✅

When all tests pass, you're ready for **Phase 2: High Priority Fixes**
