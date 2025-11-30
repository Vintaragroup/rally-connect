# 🚀 DigitalOcean Droplet Configuration - Rally Connect

**Status**: Production Deployment Guide
**Created**: November 29, 2025
**Target**: Ubuntu 22.04 LTS

---

## 📋 Pre-Deployment Checklist

Before you start, you should have:
- [ ] DigitalOcean account created
- [ ] Billing configured
- [ ] SSH key pair generated (or create new one in DO console)
- [ ] Domain name pointing to DigitalOcean nameservers (optional, can do after)
- [ ] Code ready in git (commit: 3824be8)

---

## 🔧 Step 1: Create Droplet in DigitalOcean Console

### Droplet Configuration
1. Click **Create** → **Droplets**
2. **Choose Image**: Ubuntu 22.04 x64
3. **Choose Size**: 
   - **Recommended**: $6/month (1 vCPU, 512MB RAM) for MVP
   - **Better**: $12/month (2 vCPU, 2GB RAM) for production
   - **Best**: $24/month (2 vCPU, 4GB RAM) for peak traffic
4. **Choose Region**: Select closest to your users
5. **Authentication**: Select your SSH key (or create new)
6. **Finalize**:
   - Hostname: `rally-connect-prod`
   - VPC: Default
   - Monitoring: Enable
   - Click **Create Droplet**

**Wait 2-3 minutes for droplet to initialize**

---

## 🔐 Step 2: Initial Server Security

### Connect to Droplet
```bash
# Get IP from DigitalOcean console
ssh root@YOUR_DROPLET_IP

# If prompted about fingerprint, type 'yes'
```

### Update System
```bash
apt update && apt upgrade -y
apt install -y curl wget git vim nano
```

### Create Non-Root User
```bash
# Create user
adduser --disabled-password --gecos "" deploy

# Add to sudoers
usermod -aG sudo deploy

# Copy SSH key
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

### Configure SSH
```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Find and change these lines:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes

# Restart SSH
systemctl restart ssh

# Exit and reconnect as deploy user
exit
ssh deploy@YOUR_DROPLET_IP
```

---

## 📦 Step 3: Install Docker & Docker Compose

### Install Docker
```bash
sudo apt remove docker docker-engine docker.io containerd runc -y 2>/dev/null || true

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add deploy user to docker group
sudo usermod -aG docker deploy

# Verify installation
docker --version
docker run hello-world
```

### Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

**Note**: You may need to log out and back in for docker group changes to take effect

---

## 🌐 Step 4: Install & Configure Nginx Reverse Proxy

### Install Nginx
```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
```

### Create Nginx Config
```bash
# Create config file
sudo nano /etc/nginx/sites-available/rally-connect

# Paste this (replace YOUR_DOMAIN with your actual domain):
```

```nginx
upstream rally_backend {
    server localhost:5000;
}

upstream rally_frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name YOUR_DOMAIN www.YOUR_DOMAIN;

    # Frontend
    location / {
        proxy_pass http://rally_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Backend
    location /api/ {
        proxy_pass http://rally_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

### Enable Config
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/rally-connect /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## 🔒 Step 5: Setup SSL Certificate (Let's Encrypt)

### Generate Certificate
```bash
# Replace with your actual domain
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN

# When prompted:
# - Enter email: your-email@example.com
# - Agree to terms: y
# - Share email: y (or n)
# - Redirect HTTP to HTTPS: 2
```

### Auto-Renewal
```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Check auto-renewal service
sudo systemctl status certbot.timer

# Enable if not active
sudo systemctl enable certbot.timer
```

---

## 💾 Step 6: Setup Database (PostgreSQL)

### Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib

# Start and enable
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
sudo -u postgres psql --version
```

### Create Database & User
```bash
# Connect as postgres user
sudo -u postgres psql

# Run these SQL commands:
```

```sql
-- Create database
CREATE DATABASE rally_connect;

-- Create user
CREATE USER rally_user WITH PASSWORD 'YOUR_STRONG_PASSWORD';

-- Grant privileges
ALTER ROLE rally_user SET client_encoding TO 'utf8';
ALTER ROLE rally_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE rally_user SET default_transaction_deferrable TO on;
ALTER ROLE rally_user CREATEDB;

GRANT ALL PRIVILEGES ON DATABASE rally_connect TO rally_user;

-- Exit
\q
```

### Backup PostgreSQL
```bash
# Create backup directory
sudo mkdir -p /var/backups/postgresql
sudo chown postgres:postgres /var/backups/postgresql

# Create backup script
sudo nano /usr/local/bin/backup-postgres.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="rally_connect"

/usr/bin/pg_dump -U rally_user $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-postgres.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add line: 0 2 * * * /usr/local/bin/backup-postgres.sh
```

---

## 🐳 Step 7: Clone & Setup Rally Connect

### Clone Repository
```bash
cd /home/deploy
git clone https://github.com/YOUR_USERNAME/Rally-connect.git
cd Rally-connect

# Switch to production branch (if exists)
git checkout main
```

### Create Environment Files

#### Frontend (.env)
```bash
# Create file
nano /home/deploy/Rally-connect/.env

# Add:
```

```
VITE_API_URL=https://YOUR_DOMAIN/api
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
NODE_ENV=production
```

#### Backend (.env)
```bash
# Create file
nano /home/deploy/Rally-connect/backend/.env

# Add:
```

```
DATABASE_URL=postgresql://rally_user:YOUR_STRONG_PASSWORD@localhost:5432/rally_connect
NODE_ENV=production
PORT=5000
JWT_SECRET=YOUR_GENERATED_JWT_SECRET
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

---

## 🐳 Step 8: Create Docker Compose for Production

### Production Docker Compose
```bash
# Edit docker-compose.yml
nano /home/deploy/Rally-connect/docker-compose.yml

# Use this configuration:
```

```yaml
version: '3.8'

services:
  rally-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:5173"
    environment:
      - VITE_API_URL=https://${DOMAIN}/api
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - NODE_ENV=production
    restart: always
    networks:
      - rally-network

  rally-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://rally_user:${DB_PASSWORD}@host.docker.internal:5432/rally_connect
      - NODE_ENV=production
      - PORT=5000
      - JWT_SECRET=${JWT_SECRET}
      - SUPABASE_URL=${VITE_SUPABASE_URL}
      - SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: always
    depends_on:
      - postgres
    networks:
      - rally-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=rally_connect
      - POSTGRES_USER=rally_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    networks:
      - rally-network

volumes:
  postgres_data:

networks:
  rally-network:
    driver: bridge
```

### Create .env for Docker Compose
```bash
# Create .env file
nano /home/deploy/Rally-connect/.env.docker

# Add:
DOMAIN=YOUR_DOMAIN
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
DB_PASSWORD=YOUR_STRONG_PASSWORD
JWT_SECRET=YOUR_GENERATED_JWT_SECRET
NODE_ENV=production
```

---

## 🚀 Step 9: Build & Start Containers

### Build Images
```bash
cd /home/deploy/Rally-connect

# Build frontend
docker build -t rally-frontend:prod .

# Build backend
docker build -t rally-backend:prod ./backend
```

### Start Services
```bash
# Using docker-compose with environment file
docker-compose --env-file .env.docker up -d

# Verify containers running
docker ps

# Check logs
docker-compose logs -f
```

---

## 📊 Step 10: Setup Monitoring & Logging

### Install Monitoring Tools
```bash
# Install htop for monitoring
sudo apt install -y htop

# Install logrotate for log management
sudo apt install -y logrotate
```

### Create Log Rotation Config
```bash
# Create config
sudo nano /etc/logrotate.d/rally-connect

# Add:
```

```
/var/log/rally-connect/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
    sharedscripts
}
```

### Monitor with Sentry (Optional)
```bash
# Add to backend .env
SENTRY_DSN=YOUR_SENTRY_DSN

# Add to frontend .env
VITE_SENTRY_DSN=YOUR_SENTRY_DSN
```

---

## 🔄 Step 11: Setup Auto-Deployment (GitHub Actions)

### Create Deployment Script
```bash
# Create script
sudo nano /usr/local/bin/deploy-rally.sh

# Add:
```

```bash
#!/bin/bash
set -e

REPO_DIR="/home/deploy/Rally-connect"
cd $REPO_DIR

# Pull latest code
git pull origin main

# Rebuild containers
docker-compose --env-file .env.docker build

# Restart services
docker-compose --env-file .env.docker down
docker-compose --env-file .env.docker up -d

# Run migrations (if needed)
docker-compose exec -T rally-backend npm run migrate

echo "Deployment completed at $(date)"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/deploy-rally.sh
```

### Add SSH Key for Deployments
```bash
# Generate deployment key
ssh-keygen -t ed25519 -f /home/deploy/.ssh/deploy_key -N ""

# Add to GitHub repo → Settings → Deploy keys

# Add to sudoers for passwordless deployment
sudo nano /etc/sudoers.d/deploy-rally

# Add line:
deploy ALL=(ALL) NOPASSWD: /usr/local/bin/deploy-rally.sh
```

---

## 🛡️ Step 12: Firewall Configuration

### Setup UFW Firewall
```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Block everything else by default
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Verify
sudo ufw status
```

---

## 📈 Step 13: Performance Tuning

### Configure Nginx Limits
```bash
# Edit nginx config
sudo nano /etc/nginx/nginx.conf

# Add under http block:
worker_connections 4096;
keepalive_timeout 65;

# Client upload limit
client_max_body_size 100M;
```

### Configure System Limits
```bash
# Edit limits
sudo nano /etc/security/limits.conf

# Add:
* soft nofile 65535
* hard nofile 65535
* soft nproc 65535
* hard nproc 65535
```

### Enable Swap (if needed)
```bash
# Check current
free -h

# Add 2GB swap if not enough
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## ✅ Step 14: Verify Deployment

### Test Endpoints
```bash
# Test frontend
curl -I https://YOUR_DOMAIN

# Should return: HTTP/1.1 200 OK

# Test API
curl -I https://YOUR_DOMAIN/api/health

# Should return: HTTP/1.1 200 OK
```

### Check Container Health
```bash
# View running containers
docker ps

# Check logs
docker-compose logs rally-frontend
docker-compose logs rally-backend
docker-compose logs postgres

# Monitor resource usage
docker stats
```

### Verify SSL Certificate
```bash
# Check certificate expiry
sudo certbot certificates

# Should show your domain with expiry date ~90 days away
```

---

## 🔧 Step 15: Maintenance & Backups

### Daily Checks
```bash
# Check system resources
free -h
df -h
htop

# Check container status
docker ps

# Check Nginx
sudo systemctl status nginx

# Check PostgreSQL
sudo -u postgres psql -c "SELECT version();"
```

### Weekly Backups
```bash
# Manual database backup
sudo /usr/local/bin/backup-postgres.sh

# Verify backup exists
ls -lh /var/backups/postgresql/

# Consider uploading to DigitalOcean Spaces (S3-compatible)
# Or backing up to another server
```

### Monthly Maintenance
```bash
# Update all packages
sudo apt update && sudo apt upgrade -y

# Clean up old Docker images
docker image prune -a

# Rebuild containers with latest base images
cd /home/deploy/Rally-connect
docker-compose --env-file .env.docker build --pull
docker-compose --env-file .env.docker up -d
```

---

## 📞 Troubleshooting

### Containers won't start
```bash
# Check logs
docker-compose logs

# Rebuild
docker-compose --env-file .env.docker build

# Start fresh
docker-compose --env-file .env.docker down -v
docker-compose --env-file .env.docker up -d
```

### Database connection errors
```bash
# Test connection
sudo -u postgres psql -d rally_connect

# Check environment variables
cat /home/deploy/Rally-connect/.env.docker

# Verify PostgreSQL is running
sudo systemctl status postgresql
```

### SSL certificate issues
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

### Out of disk space
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Check log sizes
du -sh /var/log/*

# Rotate logs
sudo logrotate -f /etc/logrotate.conf
```

---

## 🎉 Deployment Complete!

### Next Steps
1. ✅ Monitor first 24 hours closely
2. ✅ Test all user flows
3. ✅ Set up monitoring alerts
4. ✅ Configure database backups
5. ✅ Plan scaling strategy

### Quick Commands Reference
```bash
# Check status
docker ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Start services
docker-compose up -d

# Update code
cd /home/deploy/Rally-connect && git pull && docker-compose up -d --build
```

### Contact Support
- DigitalOcean Support: https://www.digitalocean.com/support
- Rally Connect Issues: GitHub Issues
- Database Issues: PostgreSQL Docs

---

**Rally Connect - DigitalOcean Production Deployment ✅**

*Last Updated: November 29, 2025*
*Commit: 3824be8*
