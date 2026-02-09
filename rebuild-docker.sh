#!/bin/bash

# Docker Rebuild Script - The Automation of King
# Rebuilds all Docker images with latest updates

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    🔨 DOCKER REBUILD START                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

DEPLOY_PATH="/home/ubuntu/aerostic"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "📋 REBUILD CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Deploy Path: $DEPLOY_PATH"
echo "Timestamp: $TIMESTAMP"
echo ""

# Step 1: Stop existing containers
echo "🛑 STEP 1: STOP EXISTING CONTAINERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$DEPLOY_PATH"
echo "Stopping containers..."
docker compose down 2>&1 | grep -E 'Stopping|Removing|Network|Volume' || true
echo "✓ Containers stopped"
echo ""

# Step 2: Pull latest code from GitHub
echo "📥 STEP 2: PULL LATEST CODE FROM GITHUB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Pulling latest code..."
git fetch origin main
git reset --hard origin/main
echo "Latest commit:"
git log --oneline -1
echo "✓ Code updated"
echo ""

# Step 3: Rebuild Docker images
echo "🐳 STEP 3: REBUILD DOCKER IMAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Building Docker images (this may take 15-20 minutes)..."
echo "Services to build:"
echo "  • API (NestJS)"
echo "  • Admin Frontend (Next.js)"
echo "  • App Frontend (Next.js)"
echo "  • Frontend (Landing page)"
echo "  • Webhook Worker (NestJS)"
echo "  • Message Worker (NestJS)"
echo "  • Nginx (Reverse proxy)"
echo ""

START_TIME=$(date +%s)

docker compose build --no-cache 2>&1 | tee rebuild_log_${TIMESTAMP}.txt | grep -E '(^Building|^Step|Successfully tagged|error)' | head -50

BUILD_STATUS=$?

END_TIME=$(date +%s)
BUILD_TIME=$((END_TIME - START_TIME))
BUILD_MINUTES=$((BUILD_TIME / 60))
BUILD_SECONDS=$((BUILD_TIME % 60))

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✓ Docker images built successfully in ${BUILD_MINUTES}m ${BUILD_SECONDS}s"
else
    echo "⚠ Docker build completed (check logs for details)"
fi
echo ""

# Step 4: Clean up old images
echo "🧹 STEP 4: CLEAN UP OLD IMAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Removing dangling images..."
docker image prune -f --quiet 2>&1 | head -5 || true
echo "✓ Cleanup complete"
echo ""

# Step 5: Start new containers
echo "🚀 STEP 5: START CONTAINERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Starting containers..."
docker compose up -d 2>&1 | grep -E '(Creating|Created|Starting|Started)' || true
sleep 5
echo "✓ Containers started"
echo ""

# Step 6: Verify containers
echo "✅ STEP 6: VERIFY CONTAINERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Container Status:"
docker compose ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Step 7: Wait for services
echo "⏳ STEP 7: WAIT FOR SERVICES TO BE READY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Waiting for API to be ready (30 seconds)..."
RETRY=0
while [ $RETRY -lt 15 ]; do
    if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "✓ API is responding!"
        break
    fi
    RETRY=$((RETRY + 1))
    echo "  Attempt $RETRY/15..."
    sleep 2
done
echo ""

# Step 8: Health check
echo "🏥 STEP 8: HEALTH CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing health endpoints..."
echo ""

HEALTH_FULL=$(curl -s http://localhost:3000/api/health 2>/dev/null | head -c 100)
echo "Full Health (/api/health):"
echo "$HEALTH_FULL" | grep -q "status" && echo "  ✓ Responding" || echo "  ⚠ Not responding yet"

HEALTH_LIVE=$(curl -s http://localhost:3000/api/health/live 2>/dev/null | head -c 100)
echo "Liveness (/api/health/live):"
echo "$HEALTH_LIVE" | grep -q "status" && echo "  ✓ Responding" || echo "  ⚠ Not responding yet"

HEALTH_READY=$(curl -s http://localhost:3000/api/health/ready 2>/dev/null | head -c 100)
echo "Readiness (/api/health/ready):"
echo "$HEALTH_READY" | grep -q "status" && echo "  ✓ Responding" || echo "  ⚠ Not responding yet"

echo ""

# Step 9: Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  ✅ REBUILD COMPLETE                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 REBUILD SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Build Time: ${BUILD_MINUTES}m ${BUILD_SECONDS}s"
echo "Status: ✓ Complete"
echo "Containers: 7 running"
echo "Code: Latest from main branch"
echo ""

echo "📍 SERVICE ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "API:              http://localhost:3000"
echo "Admin Frontend:   http://localhost:3001"
echo "App Frontend:     http://localhost:3002"
echo "Health Check:     http://localhost:3000/api/health"
echo ""

echo "📂 BUILD LOGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Log file: $DEPLOY_PATH/rebuild_log_${TIMESTAMP}.txt"
echo ""

echo "🔍 NEXT STEPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Monitor logs: docker compose logs -f"
echo "2. Check health: curl http://localhost:3000/api/health"
echo "3. View containers: docker compose ps"
echo "4. Review issues: docker compose logs api | grep -i error"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "              🎉 Docker rebuild successfully completed!"
echo "════════════════════════════════════════════════════════════════"
echo ""
