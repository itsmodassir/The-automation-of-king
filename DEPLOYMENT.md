# Aerostic AWS Deployment Guide

This guide describes how to deploy the Aerostic application to an AWS EC2 instance.

## Prerequisites

1.  **AWS Account**: Access to AWS Console.
2.  **Domain Name**: A domain (e.g., `aerostic.com`) pointing to your AWS instance IP.
    - `app.aerostic.com` -> EC2 IP (Create A Record)
    - `admin.aerostic.com` -> EC2 IP (Create A Record)
    - `api.aerostic.com` -> EC2 IP (Create A Record)

## Step 1: Launch EC2 Instance

1.  **OS**: Ubuntu Server 22.04 LTS (HVM), SSD Volume Type.
2.  **Instance Type**: `t3.medium` (2 vCPU, 4 GiB Memory) recommended for Node.js + Postgres.
3.  **Storage**: 20GB+ gp3.
4.  **Security Group**:
    - Allow SSH (Port 22) - RESTRICT TO YOUR IP.
    - Allow HTTP (Port 80) - 0.0.0.0/0
    - Allow HTTPS (Port 443) - 0.0.0.0/0

## Step 2: Install Docker & Docker Compose

SSH into your instance:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

Review instructions to install Docker Engine on Ubuntu:
```bash
# Update packages
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

# Add Docker's official GPG key:
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

## Step 3: Clone Repository

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
