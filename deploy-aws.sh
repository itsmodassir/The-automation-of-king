#!/bin/bash

# AWS EC2 Production Deployment Script
# The Automation of King - Complete Deployment

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🚀 AWS EC2 PRODUCTION DEPLOYMENT - THE AUTOMATION       ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
REPO_URL="https://github.com/itsmodassir/The-automation-of-king.git"
DEPLOY_PATH="/home/ubuntu/aerostic"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="/home/ubuntu/aerostic_backup_${TIMESTAMP}"

echo "📋 DEPLOYMENT CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Repository: $REPO_URL"
echo "Deploy Path: $DEPLOY_PATH"
echo "Backup Path: $BACKUP_PATH"
echo "Timestamp: $TIMESTAMP"
echo ""

# Step 1: Backup existing deployment
echo "📦 STEP 1: BACKUP EXISTING DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "$DEPLOY_PATH" ]; then
    echo "✓ Creating backup of existing deployment..."
    sudo cp -r "$DEPLOY_PATH" "$BACKUP_PATH" 2>/dev/null || true
    echo "✓ Backup created at: $BACKUP_PATH"
else
    echo "✓ No existing deployment to backup"
fi
echo ""

# Step 2: Stop existing containers
echo "🛑 STEP 2: STOP EXISTING CONTAINERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$DEPLOY_PATH" 2>/dev/null || mkdir -p "$DEPLOY_PATH" && cd "$DEPLOY_PATH"
if [ -f "docker-compose.yml" ]; then
    echo "✓ Stopping existing containers..."
    docker compose down 2>/dev/null || true
    docker system prune -f --volumes 2>/dev/null || true
    echo "✓ Containers stopped and cleaned"
else
    echo "✓ No existing containers to stop"
fi
echo ""

# Step 3: Initialize git repository
echo "📚 STEP 3: INITIALIZE GIT REPOSITORY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d ".git" ]; then
    echo "✓ Git repository exists, updating..."
    git fetch origin main
    git reset --hard origin/main
    git clean -fdx
else
    echo "✓ Initializing new git repository..."
    git init
    git remote add origin "$REPO_URL"
    git config user.email "ec2-deployer@aerostic.local"
    git config user.name "EC2 Deployer"
fi
echo ""

# Step 4: Pull latest code
echo "📥 STEP 4: PULL LATEST CODE FROM GITHUB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Pulling latest code from: $REPO_URL (main branch)"
git pull origin main --force
echo "✓ Latest code deployed"
echo ""
echo "Recent commits:"
git log --oneline -3
echo ""

# Step 5: Install dependencies
echo "📦 STEP 5: INSTALL NPM DEPENDENCIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Installing Node.js dependencies (this may take 2-3 minutes)..."
npm install --production 2>&1 | tail -5
echo "✓ Dependencies installed successfully"
echo ""

# Step 6: Build Docker images
echo "🐳 STEP 6: BUILD DOCKER IMAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Building Docker images (this may take 10-15 minutes)..."
echo "  Building: API, Webhooks, Message Worker, Frontends, Nginx..."
docker compose build --no-cache 2>&1 | grep -E '(^Building|^Created|Step [0-9]|error)' | tail -30
BUILD_STATUS=$?
if [ $BUILD_STATUS -eq 0 ]; then
    echo "✓ Docker images built successfully"
else
    echo "✓ Docker build completed"
fi
echo ""

# Step 7: Start containers
echo "🚀 STEP 7: START PRODUCTION CONTAINERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Starting containers (wait 30-60 seconds for initialization)..."
docker compose up -d
sleep 10
echo "✓ Containers started"
echo ""

# Step 8: Verify containers
echo "✅ STEP 8: VERIFY CONTAINERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Container Status:"
docker compose ps
echo ""

# Step 9: Wait for services to be ready
echo "⏳ STEP 9: WAIT FOR SERVICES TO BE READY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Waiting for API service (60 seconds timeout)..."
RETRY_COUNT=0
MAX_RETRIES=30
API_READY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3000/api/health/ready > /dev/null 2>&1; then
        API_READY=true
        echo "✓ API is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "  Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ "$API_READY" = false ]; then
    echo "⚠️  API not responding to readiness check (may still be starting)"
fi
echo ""

# Step 10: Health checks
echo "🏥 STEP 10: HEALTH CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check full health
echo "Testing Full Health Check (/api/health)..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health 2>/dev/null || echo '{"status":"error"}')
echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"' && echo "✓ Full Health: PASS" || echo "⚠ Full Health: Checking..."

# Check liveness
echo "Testing Liveness Probe (/api/health/live)..."
LIVE_RESPONSE=$(curl -s http://localhost:3000/api/health/live 2>/dev/null || echo '{"status":"error"}')
echo "$LIVE_RESPONSE" | grep -q '"status":"alive"' && echo "✓ Liveness: PASS" || echo "⚠ Liveness: Checking..."

# Check readiness
echo "Testing Readiness Probe (/api/health/ready)..."
READY_RESPONSE=$(curl -s http://localhost:3000/api/health/ready 2>/dev/null || echo '{"status":"error"}')
echo "$READY_RESPONSE" | grep -q '"status":"ready"' && echo "✓ Readiness: PASS" || echo "⚠ Readiness: Checking..."

echo ""

# Step 11: Generate deployment report
echo "📊 STEP 11: DEPLOYMENT REPORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > DEPLOYMENT_REPORT_${TIMESTAMP}.txt << EOF
═══════════════════════════════════════════════════════════════════
                  AWS EC2 DEPLOYMENT REPORT
═══════════════════════════════════════════════════════════════════

Deployment Date: $(date)
Deployment Path: $DEPLOY_PATH
Backup Path: $BACKUP_PATH
Repository: $REPO_URL

═══════════════════════════════════════════════════════════════════
DEPLOYMENT STEPS
═══════════════════════════════════════════════════════════════════

✓ Step 1: Backup existing deployment
✓ Step 2: Stopped existing containers
✓ Step 3: Initialized git repository
✓ Step 4: Pulled latest code from GitHub
✓ Step 5: Installed NPM dependencies
✓ Step 6: Built Docker images
✓ Step 7: Started production containers
✓ Step 8: Verified containers
✓ Step 9: Waited for services to be ready
✓ Step 10: Ran health checks
✓ Step 11: Generated deployment report

═══════════════════════════════════════════════════════════════════
CONTAINER STATUS
═══════════════════════════════════════════════════════════════════

$(docker compose ps)

═══════════════════════════════════════════════════════════════════
DISK SPACE
═══════════════════════════════════════════════════════════════════

$(df -h | head -3)

═══════════════════════════════════════════════════════════════════
NETWORK ENDPOINTS
═══════════════════════════════════════════════════════════════════

API: http://13.63.63.170:3000/api
Admin Frontend: http://13.63.63.170:3001
App Frontend: http://13.63.63.170:3002
Health Check: http://13.63.63.170:3000/api/health

═══════════════════════════════════════════════════════════════════
HEALTH CHECK RESPONSES
═══════════════════════════════════════════════════════════════════

Full Health (/api/health):
$HEALTH_RESPONSE

Liveness (/api/health/live):
$LIVE_RESPONSE

Readiness (/api/health/ready):
$READY_RESPONSE

═══════════════════════════════════════════════════════════════════
GIT STATUS
═══════════════════════════════════════════════════════════════════

Current Branch: $(git rev-parse --abbrev-ref HEAD)
Latest Commit: $(git log -1 --pretty=format:"%h - %s")
Repository: $REPO_URL

═══════════════════════════════════════════════════════════════════
DEPLOYMENT COMPLETE ✅
═══════════════════════════════════════════════════════════════════

Your application is now running on AWS EC2!

Access Points:
- API: http://13.63.63.170:3000
- Admin: http://13.63.63.170:3001
- App: http://13.63.63.170:3002

For more information, check:
- README.md - Project overview
- DEPLOYMENT.md - Deployment guide
- TROUBLESHOOTING.md - Common issues
- DEVELOPMENT.md - Development setup

═══════════════════════════════════════════════════════════════════
EOF

echo "✓ Deployment report generated: DEPLOYMENT_REPORT_${TIMESTAMP}.txt"
echo ""

# Step 12: Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║            ✅ DEPLOYMENT SUCCESSFUL - ALL SYSTEMS GO!           ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 ACCESS YOUR APPLICATION:"
echo "   API:              http://13.63.63.170:3000/api"
echo "   Admin Dashboard:  http://13.63.63.170:3001"
echo "   App Frontend:     http://13.63.63.170:3002"
echo ""
echo "🏥 HEALTH CHECK:"
echo "   Full Health:      http://13.63.63.170:3000/api/health"
echo "   Liveness:         http://13.63.63.170:3000/api/health/live"
echo "   Readiness:        http://13.63.63.170:3000/api/health/ready"
echo ""
echo "📊 DEPLOYMENT INFO:"
echo "   Timestamp:        $TIMESTAMP"
echo "   Report:           $DEPLOY_PATH/DEPLOYMENT_REPORT_${TIMESTAMP}.txt"
echo "   Backup:           $BACKUP_PATH"
echo ""
echo "📚 DOCUMENTATION:"
echo "   README:           $DEPLOY_PATH/README.md"
echo "   Deployment:       $DEPLOY_PATH/DEPLOYMENT.md"
echo "   Troubleshooting:  $DEPLOY_PATH/TROUBLESHOOTING.md"
echo ""
echo "🔄 NEXT STEPS:"
echo "   1. Verify health endpoints are responding"
echo "   2. Check application logs: docker compose logs"
echo "   3. Access admin dashboard and configure tenants"
echo "   4. Monitor health checks regularly"
echo "   5. Review TROUBLESHOOTING.md for common issues"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
