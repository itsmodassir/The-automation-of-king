# 🚀 Production Deployment Guide - Aerostic Platform

Complete guide for deploying Aerostic to production environments including Docker Compose, Kubernetes, and cloud platforms.

---

## 📋 Table of Contents

1. [Production Checklist](#production-checklist)
2. [Docker Compose Deployment](#docker-compose-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [AWS EC2 Deployment](#aws-ec2-deployment)
5. [GCP Cloud Run Deployment](#gcp-cloud-run-deployment)
6. [Azure Container Instances](#azure-container-instances)
7. [Database Backup & Recovery](#database-backup--recovery)
8. [SSL/TLS Configuration](#ssltls-configuration)
9. [Monitoring & Logging](#monitoring--logging)
10. [Security Best Practices](#security-best-practices)

---

## ✅ Production Checklist

Before deploying to production, ensure:

- [ ] Environment variables configured
- [ ] Database backups configured
- [ ] SSL/TLS certificates obtained
- [ ] Domain DNS records pointing to server
- [ ] Firewall rules configured
- [ ] Database migrations tested
- [ ] Admin user created
- [ ] Health checks verified
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Disaster recovery plan
- [ ] Security audit completed

---

## 🐳 Docker Compose Deployment

### Prerequisites

- Ubuntu 20.04 LTS or higher
- 4GB RAM minimum (8GB recommended)
- 20GB disk space minimum
- Docker Engine 20.10+
- Docker Compose v2.0+

### Step 1: Server Setup

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose v2
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Clone and Setup

```bash
# Clone repository
git clone https://github.com/itsmodassir/The-automation-of-king.git
cd The-automation-of-king

# Setup production environment
cp .env.example .env.prod

# Edit production environment
nano .env.prod
```

### Step 3: Configure .env.prod

```env
# Node Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://aerostic:strong_password@postgres:5432/aerostic
DB_SYNC=false

# Redis
REDIS_URL=redis://redis:6379

# API Configuration
PORT=3000
API_DOMAIN=api.aerostic.com

# Frontend Domains
APP_DOMAIN=app.aerostic.com
ADMIN_DOMAIN=admin.aerostic.com

# JWT
JWT_SECRET=long-random-secret-key-min-32-chars
JWT_EXPIRATION=7d

# Logging
DB_LOGGING=false
LOG_LEVEL=info

# CORS
CORS_ORIGINS=https://app.aerostic.com,https://admin.aerostic.com

# WhatsApp Integration
META_API_VERSION=v18.0
META_BUSINESS_ACCOUNT_ID=your_account_id
META_ACCESS_TOKEN=your_access_token

# Backups
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * * # 2 AM daily
```

### Step 4: Update docker-compose.prod.yml

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: aerostic
      POSTGRES_PASSWORD: strong_password_here
      POSTGRES_DB: aerostic
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aerostic"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass your_redis_password
    volumes:
      - redisdata:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  api:
    image: theautomationofking-api:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://aerostic:strong_password@postgres:5432/aerostic
      - REDIS_URL=redis://:your_redis_password@redis:6379
      - JWT_SECRET=your-secret-key
      - API_DOMAIN=api.aerostic.com
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  nginx:
    image: nginx:1.25-alpine
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    restart: always

volumes:
  pgdata:
  redisdata:
```

### Step 5: SSL/TLS Configuration

```bash
# Using Let's Encrypt with Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Generate certificates
sudo certbot certonly --standalone \
  -d api.aerostic.com \
  -d app.aerostic.com \
  -d admin.aerostic.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 6: Deploy

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
docker-compose -f docker-compose.prod.yml ps

# Run database migrations
docker-compose -f docker-compose.prod.yml exec api npm run migration:run

# Create admin user
docker-compose -f docker-compose.prod.yml exec api npm run seed:admin

# Check health
curl https://api.aerostic.com/api/health
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.24+)
- kubectl configured
- Helm (optional but recommended)
- Persistent volumes available

### Create Namespace

```bash
kubectl create namespace aerostic
kubectl config set-context --current --namespace=aerostic
```

### Deploy with Helm Chart

```bash
# Add Aerostic Helm repo
helm repo add aerostic https://charts.aerostic.com
helm repo update

# Install
helm install aerostic aerostic/aerostic \
  --namespace aerostic \
  --values values-prod.yaml

# Or update existing
helm upgrade aerostic aerostic/aerostic \
  --namespace aerostic \
  --values values-prod.yaml
```

### Manual Kubernetes Deployment

```yaml
# postgres.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
data:
  password: YWVyb3N0aWM=  # base64 encoded

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: pgdata
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: pgdata
        persistentVolumeClaim:
          claimName: postgres-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### Deploy Services

```bash
# Apply configurations
kubectl apply -f namespace.yaml
kubectl apply -f postgres.yaml
kubectl apply -f redis.yaml
kubectl apply -f api.yaml
kubectl apply -f frontend.yaml

# Check status
kubectl get pods
kubectl get svc
kubectl get pvc

# View logs
kubectl logs deployment/api -f
```

### Configure Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aerostic-ingress
spec:
  tls:
  - hosts:
    - api.aerostic.com
    secretName: tls-secret
  rules:
  - host: api.aerostic.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 3000
```

---

## ☁️ AWS EC2 Deployment

### Step 1: Launch Instance

1. **AMI**: Ubuntu Server 22.04 LTS
2. **Instance Type**: t3.medium or larger
3. **Storage**: 30GB+ gp3
4. **Security Group**:
   - SSH (22): Your IP only
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0

### Step 2: Install and Deploy

```bash
# SSH into instance
ssh -i key.pem ubuntu@ec2-instance-ip

# Run deployment script
curl -fsSL https://releases.aerostic.com/install-prod.sh | bash

# Or manual steps
sudo apt-get update
sudo curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and setup
git clone https://github.com/itsmodassir/The-automation-of-king.git
cd The-automation-of-king
cp .env.example .env.prod

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Configure Route 53

```bash
# Create A records pointing to EC2 Elastic IP
# api.aerostic.com -> EC2 Elastic IP
# app.aerostic.com -> EC2 Elastic IP
# admin.aerostic.com -> EC2 Elastic IP
```

---

## 🔐 SSL/TLS Configuration

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificates
sudo certbot certonly --standalone \
  -d api.aerostic.com \
  -d app.aerostic.com \
  -d admin.aerostic.com \
  --non-interactive \
  --agree-tos \
  -m admin@aerostic.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify certificates
sudo certbot certificates
```

### Update Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.aerostic.com;

    ssl_certificate /etc/letsencrypt/live/api.aerostic.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.aerostic.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://api:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}
```

---

## 📊 Monitoring & Logging

### Prometheus Setup

```bash
# Deploy Prometheus
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

### ELK Stack for Logging

```bash
# Deploy ELK
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.0.0
docker run -d --name kibana -p 5601:5601 docker.elastic.co/kibana/kibana:8.0.0
```

### CloudWatch (AWS)

```bash
# Install CloudWatch agent
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure and start
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```

---

## 💾 Database Backup & Recovery

### PostgreSQL Backups

```bash
# Manual backup
docker exec aerostic-postgres pg_dump -U aerostic aerostic > backup.sql

# Scheduled backups
0 2 * * * /usr/local/bin/backup-db.sh

# Backup script (backup-db.sh)
#!/bin/bash
BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec aerostic-postgres pg_dump -U aerostic aerostic > $BACKUP_DIR/backup_$TIMESTAMP.sql
# Keep last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Restore from Backup

```bash
# Stop services
docker-compose stop api

# Restore database
cat backup.sql | docker exec -i aerostic-postgres psql -U aerostic -d aerostic

# Restart
docker-compose up -d api
```

### S3 Backup (AWS)

```bash
# Backup to S3
aws s3 cp backup.sql s3://aerostic-backups/postgres/backup_$(date +%Y%m%d).sql

# Configure automated backups
# AWS RDS instead of self-managed PostgreSQL
```

---

## 🔒 Security Best Practices

### Environment Variables
- Use secrets management (AWS Secrets Manager, Azure Key Vault)
- Never commit `.env` files
- Rotate JWT secrets regularly
- Use strong random passwords

### Database Security
- Use strong database passwords (20+ characters)
- Enable SSL for database connections
- Restrict database access to API only
- Regular backups with encryption
- Enable audit logging

### Network Security
- Use firewall rules (Security Groups, Network Policies)
- SSH access only from specific IPs
- Enable rate limiting
- Use WAF (Web Application Firewall)
- DDoS protection enabled

### Application Security
- Keep dependencies updated
- Run security audits
- Enable HTTPS only
- Implement CORS properly
- Use security headers

### Monitoring Security
- Monitor failed login attempts
- Alert on unusual database activity
- Log all admin actions
- Monitor resource usage
- Set up security scanning

---

## 🆘 Troubleshooting Deployment

### Health Check Failures

```bash
# Check service health
curl https://api.aerostic.com/api/health

# Check service logs
docker-compose logs api

# Check resource usage
docker stats
```

### Database Connection Issues

```bash
# Test connection
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "SELECT 1"

# Check connection string
echo $DATABASE_URL

# Restart database
docker-compose restart postgres
```

### Performance Issues

```bash
# Check system resources
free -h
df -h
top

# Check database queries
docker exec aerostic-postgres psql -U aerostic -d aerostic -c "SELECT * FROM pg_stat_statements LIMIT 10;"

# Optimize and restart
docker-compose restart api
```

---

## 📈 Post-Deployment

### Verification Checklist

- [ ] Health checks passing
- [ ] Admin dashboard accessible
- [ ] User registration working
- [ ] API documentation accessible
- [ ] WebSocket connections working
- [ ] Database backups running
- [ ] Monitoring alerts configured
- [ ] SSL certificates valid

### Monitoring Setup

```bash
# Set up alerting for:
# - High CPU usage (>80%)
# - Low disk space (<10%)
# - Database slow queries
# - API response time >1s
# - Failed health checks
```

### Maintenance Schedule

```
Daily:
  - Check health endpoints
  - Review error logs
  - Monitor resource usage

Weekly:
  - Review security logs
  - Test backup/restore
  - Update dependencies

Monthly:
  - Security audit
  - Performance review
  - Capacity planning
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Last Updated:** February 9, 2026  
**Version:** 1.0

Questions? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or contact support@aerostic.com

```bash
git clone <your-github-repo-url> aerostic
cd aerostic
```

## Step 4: Configure Environment

Create a `.env` file based on keys provided.

```bash
nano .env
```

**Fill in the Variables:**
```env
# General
DOMAIN_NAME=aerostic.com (or your domain)
NODE_ENV=production

# Database
POSTGRES_USER=aerostic
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=aerostic_db
DATABASE_URL=postgres://aerostic:secure_password_here@postgres:5432/aerostic_db

# Redis
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=generate_a_very_long_random_string

# Meta (WhatsApp)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_API_VERSION=v19.0
```

## Step 5: Deploy

Run the production stack in detached mode:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Wait a few minutes for the build to complete.

## Step 6: Post-Deployment Verification

1.  **Check Logs**: `docker compose -f docker-compose.prod.yml logs -f`
2.  **Visit App**: Go to `http://app.yourdomain.com/login`
3.  **Visit Admin**: Go to `http://admin.yourdomain.com/login`

## Step 7: SSL (HTTPS) with Certbot

To secure your site, you should obtain SSL certificates. You can use Certbot on the host machine or run a Certbot container.

**Example (Host Certbot):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.yourdomain.com -d admin.yourdomain.com -d api.yourdomain.com
```

*Note: You may need to modify the nginx/conf.d/default.conf to allow Certbot to verify ownership if running purely in Docker.*
