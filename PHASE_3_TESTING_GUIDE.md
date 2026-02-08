# 🧪 Phase 3: Testing & Verification Guide

**Status:** Ready for Testing  
**Date:** February 9, 2026  
**Services to Test:** All services with health checks  

---

## ✅ Quick Verification

```bash
cd /Users/Modassir/Desktop/The\ automation\ of\ king

# 1. Start services
docker-compose up -d
sleep 15

# 2. Test health endpoints
echo "=== API Health Checks ==="
curl -s http://localhost:3000/health | jq .
curl -s http://localhost:3000/health/live | jq .
curl -s http://localhost:3000/health/ready | jq .

# 3. Check container health
docker-compose ps

# 4. Verify all healthy
echo "Expected: All containers showing (healthy)"
```

---

## 🏥 Test 1: Full Health Check

**Purpose:** Verify comprehensive health status

```bash
curl -s http://localhost:3000/health | jq .
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-09T12:30:45.123Z",
  "uptime": 45.678,
  "durationMs": 123,
  "checks": {
    "database": {
      "status": "ok",
      "message": "Database connection successful",
      "durationMs": 45
    },
    "redis": {
      "status": "ok",
      "message": "Redis connection successful",
      "durationMs": 12
    },
    "memory": {...},
    "process": {...}
  }
}
```

**Success Criteria:**
- ✅ Overall status is "ok"
- ✅ Database status is "ok"
- ✅ Redis status is "ok"
- ✅ Timestamp is valid ISO format
- ✅ Uptime is positive number
- ✅ All checks completed

---

## 🏥 Test 2: Liveness Probe

**Purpose:** Verify app process is running

```bash
curl -s http://localhost:3000/health/live
```

**Expected Response:**
```json
{
  "status": "alive",
  "timestamp": "2024-02-09T12:30:45.123Z",
  "uptime": 45.678
}
```

**Success Criteria:**
- ✅ Returns 200 (OK)
- ✅ Status is "alive"
- ✅ Always returns quickly (no dependency checks)
- ✅ No dependency failures affect this

---

## 🏥 Test 3: Readiness Probe

**Purpose:** Verify app is ready to serve traffic

```bash
curl -s http://localhost:3000/health/ready
```

**Expected Response (when ready):**
```json
{
  "status": "ready",
  "timestamp": "2024-02-09T12:30:45.123Z"
}
```

**Expected Response (when NOT ready):**
```json
{
  "statusCode": 503,
  "message": "Service not ready",
  "error": "Service Unavailable"
}
```

**Success Criteria:**
- ✅ Returns 200 when database and Redis healthy
- ✅ Returns 503 if any dependency unhealthy
- ✅ Used by load balancers
- ✅ Prevents traffic to unhealthy services

---

## 🏥 Test 4: Database Health Check

**Purpose:** Verify database connectivity

```bash
# From full health check
curl -s http://localhost:3000/health | jq '.checks.database'
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Database connection successful",
  "durationMs": 45
}
```

**Success Criteria:**
- ✅ Status is "ok"
- ✅ Duration is recorded
- ✅ Error field absent if successful
- ✅ Returns error info if connection fails

---

## 🏥 Test 5: Redis Health Check

**Purpose:** Verify Redis connectivity

```bash
# From full health check
curl -s http://localhost:3000/health | jq '.checks.redis'
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Redis connection successful",
  "durationMs": 12
}
```

**Success Criteria:**
- ✅ Status is "ok"
- ✅ Redis responds to PING
- ✅ Duration is recorded
- ✅ Error field absent if successful

---

## 🐳 Test 6: Docker Health Check Status

**Purpose:** Verify Docker is tracking health

```bash
docker-compose ps
```

**Expected Output:**
```
NAME                    STATE              
aerostic-nginx          Up 2 minutes       
aerostic-frontend       Up 2 minutes       
aerostic-app-frontend   Up 2 minutes       
aerostic-admin          Up 2 minutes       
aerostic-api            Up 2 minutes (healthy)
aerostic-webhook        Up 2 minutes (healthy)
aerostic-message-worker Up 2 minutes (healthy)
aerostic-postgres       Up 2 minutes (healthy)
aerostic-redis          Up 2 minutes (healthy)
```

**Success Criteria:**
- ✅ All containers showing "Up"
- ✅ Services with health checks show "(healthy)"
- ✅ No containers showing "unhealthy"
- ✅ No containers showing "starting"

---

## 🏥 Test 7: Container Failure Recovery

**Purpose:** Verify Docker restarts failed containers

**Setup:**
```bash
# Check current container
docker-compose ps | grep aerostic-api
# Note: should be healthy
```

**Test:**
```bash
# Kill the API container (simulate failure)
docker kill aerostic-api

# Wait 5 seconds
sleep 5

# Check status
docker-compose ps | grep aerostic-api
# Expected: Container should be restarting/up again

# Check health
curl -s http://localhost:3000/health/live
# After a few seconds, should respond with 200
```

**Success Criteria:**
- ✅ Container restarts automatically
- ✅ Health checks resume
- ✅ No manual intervention needed
- ✅ Service recovers within 30 seconds

---

## 📊 Test 8: Memory and Process Info

**Purpose:** Verify metrics are available

```bash
curl -s http://localhost:3000/health | jq '.checks.memory'
curl -s http://localhost:3000/health | jq '.checks.process'
```

**Expected Response (memory):**
```json
{
  "rss": "85 MB",
  "heapTotal": "45 MB",
  "heapUsed": "32 MB",
  "external": "2 MB"
}
```

**Expected Response (process):**
```json
{
  "pid": 1234,
  "nodeVersion": "v20.10.0",
  "uptime": 45.678,
  "env": "development"
}
```

**Success Criteria:**
- ✅ Memory values are numbers
- ✅ Heap used < heap total
- ✅ PID is positive integer
- ✅ Environment is set correctly

---

## 🔄 Test 9: Webhook Worker Health

**Purpose:** Verify webhook worker health

```bash
curl -s http://localhost:3001/health | jq .
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "webhook-worker",
  "timestamp": "2024-02-09T12:30:45.123Z",
  "uptime": 45.678
}
```

**Success Criteria:**
- ✅ Returns 200
- ✅ Service name is correct
- ✅ Uptime is positive

---

## 🔄 Test 10: All Services Health Summary

**Purpose:** Check all services at once

```bash
echo "=== API Health ==="
curl -s http://localhost:3000/health/live | jq .status

echo "=== Webhook Worker Health ==="
curl -s http://localhost:3001/health | jq .status

echo "=== Database Health ==="
curl -s http://localhost:3000/health | jq '.checks.database.status'

echo "=== Redis Health ==="
curl -s http://localhost:3000/health | jq '.checks.redis.status'

echo "=== Container Health ==="
docker-compose ps | awk 'NR>1 {print $1, $(NF)}'
```

**Expected Output:**
```
=== API Health ===
"alive"

=== Webhook Worker Health ===
"ok"

=== Database Health ===
"ok"

=== Redis Health ===
"ok"

=== Container Health ===
aerostic-nginx (healthy)
aerostic-postgres (healthy)
aerostic-redis (healthy)
aerostic-api (healthy)
aerostic-webhook (healthy)
...
```

---

## 📊 Full Test Script

Save as `test-phase-3.sh`:

```bash
#!/bin/bash

echo "🧪 Phase 3 Health Check Test Suite"
echo "===================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local endpoint=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    response=$(curl -s -w "\n%{http_code}" $endpoint)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $http_code)"
        ((PASSED++))
    else
        echo -e "${RED}FAIL${NC} (Expected $expected_status, got $http_code)"
        echo "Response: $body"
        ((FAILED++))
    fi
}

echo "🏥 Health Check Tests"
test_endpoint "Full Health" "http://localhost:3000/health" "200"
test_endpoint "Liveness" "http://localhost:3000/health/live" "200"
test_endpoint "Readiness" "http://localhost:3000/health/ready" "200"
test_endpoint "Webhook Health" "http://localhost:3001/health" "200"

echo ""
echo "🐳 Docker Container Health"
docker-compose ps | grep -E "(healthy|unhealthy|starting)"

echo ""
echo "📊 Test Results"
echo "==============="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed${NC}"
    exit 1
fi
```

**Run the test:**
```bash
chmod +x test-phase-3.sh
./test-phase-3.sh
```

---

## 🐛 Troubleshooting

### Health check returns error
```bash
# Check service logs
docker-compose logs api | tail -50

# Verify database is running
docker-compose ps postgres

# Check Redis is running
docker-compose ps redis
```

### Database connection fails
```bash
# Test psql directly
docker-compose exec postgres psql -U aerostic -d aerostic -c "SELECT 1"

# Check DATABASE_URL
echo $DATABASE_URL
```

### Redis connection fails
```bash
# Test redis directly
docker-compose exec redis redis-cli ping

# Check REDIS_URL
echo $REDIS_URL
```

### Containers unhealthy
```bash
# Get detailed health status
docker inspect --format='{{.State.Health.Status}}' aerostic-api

# Force health check
docker-compose exec api curl http://localhost:3000/health/ready

# Check startup logs
docker-compose logs api | grep -i "error\|failed\|unable"
```

---

## ✅ When All Tests Pass

Congratulations! Phase 3 is complete and verified. The system now has:

✓ Comprehensive health monitoring  
✓ Production-ready security  
✓ Automatic failure detection  
✓ Full observability  

**Ready to proceed to Phase 4** (Polish & Final Testing)

---

**Phase 3 Testing: Ready to Execute**
