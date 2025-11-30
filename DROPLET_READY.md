# 🚀 Rally Connect - DigitalOcean Droplet Ready

**Status**: ✅ DROPLET CREATED
**Created**: November 29, 2025

---

## 🎯 Your Droplet IPs

```
Public IPv4:     138.197.31.8
Private IPv4:    10.108.0.2
Hostname:        rally-connect-prod
Region:          [Selected in DO Console]
```

---

## 🔑 SSH Connection

### Connect Now
```bash
ssh root@138.197.31.8
```

### Your SSH Key
```
Location: ~/.ssh/id_ed25519
Public Key: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGG53sdgg9J2v5UYioE2j3I1uyDVzuvE+iZI16sIUiHk ryan@vintaragroup.com
```

**Note**: If first connection asks about fingerprint, type `yes`

---

## 📋 Quick Setup Sequence

Copy and run these commands in order:

### 1. Connect & Update (5 min)
```bash
ssh root@142.93.177.98

# Update system
apt update && apt upgrade -y
apt install -y curl wget git vim nano
```

### 2. Create Deploy User (3 min)
```bash
# Create user
adduser --disabled-password --gecos "" deploy

# Add to sudoers
usermod -aG sudo deploy

# Copy SSH key
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

### 3. Secure SSH (2 min)
```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Change these lines:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes

# Restart
systemctl restart ssh

# Exit and reconnect as deploy
exit
ssh deploy@142.93.177.98
```

### 4. Install Docker (5 min)
```bash
# Remove old docker
sudo apt remove docker docker-engine docker.io containerd runc -y 2>/dev/null || true

# Install docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add deploy to docker group
sudo usermod -aG docker deploy

# Verify
docker --version
docker run hello-world
```

### 5. Install Docker Compose (2 min)
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version

# May need to log out and back in for group to take effect
exit
ssh deploy@142.93.177.98
```

### 6. Setup Nginx (5 min)
```bash
sudo apt install -y nginx certbot python3-certbot-nginx

sudo systemctl start nginx
sudo systemctl enable nginx

# Test
curl -I http://142.93.177.98
# Should return: HTTP/1.1 200 OK
```

### 7. Configure Nginx
```bash
# Create config
sudo nano /etc/nginx/sites-available/rally-connect

# Paste (replace YOUR_DOMAIN with your actual domain):
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

    location /api/ {
        proxy_pass http://rally_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

```bash
# Enable config
sudo ln -s /etc/nginx/sites-available/rally-connect /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Setup PostgreSQL (3 min)
```bash
sudo apt install -y postgresql postgresql-contrib

sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
sudo -u postgres psql --version
```

### 9. Create Database
```bash
sudo -u postgres psql

# Paste these SQL commands:
```

```sql
CREATE DATABASE rally_connect;
CREATE USER rally_user WITH PASSWORD 'YOUR_STRONG_PASSWORD';
ALTER ROLE rally_user SET client_encoding TO 'utf8';
ALTER ROLE rally_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE rally_user SET default_transaction_deferrable TO on;
ALTER ROLE rally_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE rally_connect TO rally_user;
\q
```

### 10. Clone Rally Connect (2 min)
```bash
cd /home/deploy
git clone https://github.com/YOUR_GITHUB_USERNAME/Rally-connect.git
cd Rally-connect
git checkout main
```

### 11. Setup Environment Files
```bash
# Frontend .env
nano /home/deploy/Rally-connect/.env
```

```
VITE_API_URL=https://YOUR_DOMAIN/api
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
NODE_ENV=production
```

```bash
# Backend .env
nano /home/deploy/Rally-connect/backend/.env
```

```
DATABASE_URL=postgresql://rally_user:YOUR_STRONG_PASSWORD@localhost:5432/rally_connect
NODE_ENV=production
PORT=5000
JWT_SECRET=YOUR_GENERATED_JWT_SECRET
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
```

```bash
# Generate JWT Secret (copy output):
openssl rand -base64 32
```

### 12. Setup Docker Compose .env
```bash
nano /home/deploy/Rally-connect/.env.docker
```

```
DOMAIN=YOUR_DOMAIN
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
DB_PASSWORD=YOUR_STRONG_PASSWORD
JWT_SECRET=YOUR_GENERATED_JWT_SECRET
NODE_ENV=production
```

### 13. Build & Start (10 min - first time takes longer)
```bash
cd /home/deploy/Rally-connect

# Build images
docker build -t rally-frontend:prod .
docker build -t rally-backend:prod ./backend

# Start containers
docker-compose --env-file .env.docker up -d

# Verify
docker ps

# Check logs
docker-compose logs -f
```

### 14. Setup SSL Certificate
```bash
# Replace YOUR_DOMAIN with your actual domain
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN

# When prompted:
# Email: your-email@example.com
# Agree to terms: y
# Share email: y
# Redirect HTTP to HTTPS: 2
```

### 15. Verify Deployment
```bash
# Test frontend
curl -I https://YOUR_DOMAIN
# Should return: HTTP/1.1 200 OK

# Check containers
docker ps

# View logs
docker-compose logs rally-frontend
docker-compose logs rally-backend
```

---

## 🎯 What You Need to Replace

| Placeholder | Example | Where to Get |
|-------------|---------|--------------|
| `YOUR_DOMAIN` | `rally.example.com` | Your domain name |
| `YOUR_GITHUB_USERNAME` | `ryanmorrow` | Your GitHub username |
| `YOUR_STRONG_PASSWORD` | Generate one | `openssl rand -base64 32` |
| `YOUR_GENERATED_JWT_SECRET` | Base64 string | Run `openssl rand -base64 32` |
| `YOUR_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase console |
| `YOUR_SUPABASE_KEY` | `eyJhbGc...` | Supabase console → API Settings |

---

## 💾 Backup Script

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

/usr/bin/pg_dump -U rally_user rally_connect | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
echo "Backup completed: $TIMESTAMP"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-postgres.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-postgres.sh
```

---

## 🛡️ Firewall Setup

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Verify
sudo ufw status
```

---

## 🔍 Quick Diagnostics

```bash
# Check all services
docker ps
sudo systemctl status nginx
sudo systemctl status postgresql

# View logs
docker-compose logs -f

# Monitor resources
docker stats

# Check disk
df -h

# Check memory
free -h

# Check system
htop
```

---

## 🆘 If Something Goes Wrong

```bash
# Restart containers
docker-compose restart

# Rebuild containers
docker-compose --env-file .env.docker build

# Fresh start
docker-compose --env-file .env.docker down -v
docker-compose --env-file .env.docker up -d

# Check logs
docker-compose logs rally-frontend
docker-compose logs rally-backend
docker-compose logs postgres
```

---

## 📞 Next Steps

1. **Point Domain to Droplet**
   - Go to your domain registrar
   - Set A record to: `142.93.177.98`
   - Wait 5-30 minutes for DNS propagation

2. **Get SSL Certificate**
   - Once domain points to droplet, run:
   ```bash
   sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
   ```

3. **Monitor First 24 Hours**
   - Check app at `https://YOUR_DOMAIN`
   - Monitor logs: `docker-compose logs -f`
   - Monitor resources: `docker stats`

4. **Setup Monitoring (Optional)**
   - Add Sentry for error tracking
   - Add DataDog or New Relic for performance
   - Set up alerts for high CPU/memory

---

## 🎉 You're Ready!

Your droplet is online and ready for Rally Connect!

**Public IP**: 142.93.177.98
**Private IP**: 10.108.0.2

**Next**: Follow the setup steps above, or let me know when you hit Step 1 and I can help with any issues.

---

*Rally Connect - DigitalOcean Production Deployment*
*Droplet Ready ✅*
