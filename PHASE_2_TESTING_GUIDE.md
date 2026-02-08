# 🧪 Phase 2: Testing Guide

**Status:** Ready for Testing  
**Date:** February 9, 2026  
**Services to Test:** API, Webhook Worker, Message Worker, Admin Auth  

---

## ✅ Quick Verification Checklist

Run these commands before full testing:

```bash
cd /Users/Modassir/Desktop/The\ automation\ of\ king

# 1. Check Docker setup
docker-compose ps

# 2. Verify services are running
docker-compose up -d

# 3. Wait 10 seconds for services to start
sleep 10

# 4. Quick health checks
curl http://localhost:3000/health
curl http://localhost:3001/health
```

---

## 🏥 Phase 2A: Admin Authentication Testing

### Test 1: Initialize First Admin

**Purpose:** Verify the `/admin/auth/init` endpoint works for first-time setup

```bash
curl -X POST http://localhost:3000/api/admin/auth/init \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aerostic.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid",
  "email": "admin@aerostic.com",
  "role": "SUPER_ADMIN",
  "isActive": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "7d"
}
```

**Success Criteria:**
- ✅ Returns 201 (Created)
- ✅ Token is valid JWT
- ✅ Admin role is SUPER_ADMIN
- ✅ isActive is true

### Test 2: Prevent Second Initialization

**Purpose:** Verify initialization is blocked when admin exists

```bash
curl -X POST http://localhost:3000/api/admin/auth/init \
  -H "Content-Type: application/json" \
  -d '{
    "email": "another@aerostic.com",
    "password": "AnotherPassword123!"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 403,
  "message": "Admin already initialized. Use login instead.",
  "error": "Forbidden"
}
```

**Success Criteria:**
- ✅ Returns 403 (Forbidden)
- ✅ Clear error message

### Test 3: Admin Login

**Purpose:** Verify admin can login with correct credentials

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aerostic.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "7d",
  "user": {
    "id": "uuid",
    "email": "admin@aerostic.com",
    "role": "SUPER_ADMIN"
  }
}
```

**Success Criteria:**
- ✅ Returns 200 (OK)
- ✅ Token is returned
- ✅ User details are included
- ✅ Token works for subsequent requests

### Test 4: Invalid Login

**Purpose:** Verify login fails with wrong password

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aerostic.com",
    "password": "WrongPassword"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Success Criteria:**
- ✅ Returns 401 (Unauthorized)
- ✅ Does not leak that email exists
- ✅ Clear error message

### Test 5: Get Admin Profile

**Purpose:** Verify authenticated admin can access their profile

```bash
# First get a token (from Test 3)
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:3000/api/admin/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "id": "uuid",
  "email": "admin@aerostic.com",
  "role": "SUPER_ADMIN",
  "isActive": true
}
```

**Success Criteria:**
- ✅ Returns 200 (OK)
- ✅ Admin details are returned
- ✅ Works with valid token
- ✅ Returns 401 without token

---

## 🎯 Phase 2B: API Configuration Testing

### Test 6: Health Check Endpoint

**Purpose:** Verify API health check works

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-09T12:30:45.123Z",
  "uptime": 123.456
}
```

**Success Criteria:**
- ✅ Returns 200 (OK)
- ✅ Status is "ok"
- ✅ Uptime is a positive number
- ✅ Timestamp is valid ISO format

### Test 7: Request Logging

**Purpose:** Verify request logging middleware works

**Setup:**
```bash
# Start Docker Compose to see logs
docker-compose logs -f api
```

**Make a request:**
```bash
curl http://localhost:3000/health
```

**Check logs for:**
```
{
  "timestamp": "2024-02-09T12:30:45.123Z",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "method": "GET",
  "path": "/health",
  "status": 200,
  "durationMs": 5
}
```

**Success Criteria:**
- ✅ Log includes timestamp
- ✅ Log includes unique requestId
- ✅ Log includes method, path, status
- ✅ Log includes duration in ms

### Test 8: Rate Limiting - Login Endpoint

**Purpose:** Verify rate limiting blocks excessive login attempts

```bash
# Make 6 login attempts (limit is 5 per 15 min)
for i in {1..6}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@test.com",
      "password": "test"
    }'
  sleep 1
done
```

**Expected Behavior:**
- ✅ First 5 requests: 401 (invalid credentials - expected)
- ✅ 6th request: 429 (Too Many Requests - rate limited)

**Success Criteria:**
- ✅ Rate limiting is enforced
- ✅ Returns 429 status code
- ✅ Includes rate limit headers

### Test 9: CORS Configuration

**Purpose:** Verify CORS allows correct origins

```bash
# From allowed origin
curl -X GET http://localhost:3000/health \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET"

# From disallowed origin
curl -X GET http://localhost:3000/health \
  -H "Origin: http://untrusted.com" \
  -H "Access-Control-Request-Method: GET"
```

**Expected Behavior:**
- ✅ Allowed origin: CORS headers present
- ✅ Disallowed origin: CORS headers absent or error

---

## 💾 Phase 2C: Database Testing

### Test 10: Database Connection

**Purpose:** Verify database is accessible

```bash
# Check Docker Compose
docker-compose ps

# Should show postgres container running
```

**Success Criteria:**
- ✅ postgres container is "up"
- ✅ Port 5432 is accessible
- ✅ Connection string works

### Test 11: TypeORM Configuration

**Purpose:** Verify TypeORM loads correctly

```bash
# Check API startup logs
docker-compose logs api | grep -i "typeorm\|database\|migration"
```

**Look for:**
- ✅ No "synchronize not allowed" errors
- ✅ No "unable to connect" errors
- ✅ Migration run messages (if applicable)

---

## 🔄 Phase 2D: Worker Services Testing

### Test 12: Webhook Worker Health

**Purpose:** Verify webhook worker is running

```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "webhook-worker",
  "timestamp": "2024-02-09T12:30:45.123Z",
  "uptime": 123.456
}
```

**Success Criteria:**
- ✅ Returns 200
- ✅ Service name is "webhook-worker"
- ✅ Uptime is positive

### Test 13: Webhook Verification

**Purpose:** Verify webhook verification endpoint works

```bash
curl "http://localhost:3001/webhooks/meta?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test_challenge_string"
```

**Expected Response:**
```
test_challenge_string
```

**Success Criteria:**
- ✅ Returns 200
- ✅ Returns the challenge string (if token matches)
- ✅ Returns 403 if token doesn't match

### Test 14: Message Worker Startup

**Purpose:** Verify message worker starts without errors

```bash
docker-compose logs message-worker
```

**Look for:**
- ✅ "Message Worker started successfully" message
- ✅ No error stack traces
- ✅ Application context created

---

## 📊 Full Test Suite Script

Save as `test-phase-2.sh`:

```bash
#!/bin/bash

echo "🧪 Phase 2 Full Test Suite"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_code=$5

    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "$expected_code" ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $http_code)"
        ((PASSED++))
    else
        echo -e "${RED}FAIL${NC} (Expected $expected_code, got $http_code)"
        echo "Response: $body"
        ((FAILED++))
    fi
}

echo "📡 API Health Check"
test_endpoint "API Health" "GET" "http://localhost:3000/health" "" "200"

echo ""
echo "🔐 Admin Authentication"
test_endpoint "Initialize Admin" "POST" "http://localhost:3000/api/admin/auth/init" \
    '{"email":"admin@test.com","password":"TestPass123!"}' "201"

echo ""
echo "🔄 Webhook Worker"
test_endpoint "Webhook Health" "GET" "http://localhost:3001/health" "" "200"

echo ""
echo "📊 Test Results"
echo "================"
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

**Run the test suite:**
```bash
chmod +x test-phase-2.sh
./test-phase-2.sh
```

---

## 🐛 Troubleshooting

### API won't start
```bash
# Check logs
docker-compose logs api

# Common issues:
# - Port 3000 already in use
# - Database connection failed
# - JWT_SECRET not set
```

### Admin auth returns 500
```bash
# Check admin repository is injected
# Verify AdminUser entity exists
# Check database connection

docker-compose logs api | grep -i "admin\|error"
```

### Rate limiting not working
```bash
# Verify express-rate-limit is installed
npm list express-rate-limit

# Check middleware order in main.ts
# Rate limiting must come before routes
```

### Health check not responding
```bash
# Verify port is correct
curl http://localhost:3000/health

# Check API logs
docker-compose logs api | grep -i "health\|listening"
```

---

## 📝 Test Report Template

Record test results:

```
Phase 2 Test Results
Date: ___________
Tester: ___________

Admin Authentication:
  [ ] Test 1: Initialize Admin - PASS/FAIL
  [ ] Test 2: Prevent Second Init - PASS/FAIL
  [ ] Test 3: Admin Login - PASS/FAIL
  [ ] Test 4: Invalid Login - PASS/FAIL
  [ ] Test 5: Get Profile - PASS/FAIL

API Configuration:
  [ ] Test 6: Health Check - PASS/FAIL
  [ ] Test 7: Request Logging - PASS/FAIL
  [ ] Test 8: Rate Limiting - PASS/FAIL
  [ ] Test 9: CORS - PASS/FAIL

Database:
  [ ] Test 10: Connection - PASS/FAIL
  [ ] Test 11: TypeORM Config - PASS/FAIL

Workers:
  [ ] Test 12: Webhook Health - PASS/FAIL
  [ ] Test 13: Webhook Verify - PASS/FAIL
  [ ] Test 14: Message Worker - PASS/FAIL

Summary:
  Total Tests: 14
  Passed: ___
  Failed: ___
  Success Rate: ___%

Notes:
_______________________________________
_______________________________________
```

---

## ✅ When All Tests Pass

Congratulations! Phase 2 is complete and verified. You can now:

1. **Proceed to Phase 3** (Security & Stability fixes)
2. **Deploy to staging** for integration testing
3. **Prepare database migrations** for production

**Command to start Phase 3:**
```
Say: "Start Phase 3"
```

---

**Phase 2 Testing: Ready to Execute**
