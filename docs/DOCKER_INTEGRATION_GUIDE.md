# Rally-connect: Complete Docker & Backend Integration Guide

## 🚀 Overview

This guide explains how to run the complete Rally-connect application (frontend + backend + database) using Docker Compose with zero conflicts against existing Docker projects.

## 📋 Prerequisites

- Docker & Docker Compose installed (`docker --version`)
- Node.js 20+ (for local development, optional for Docker)
- Approximately 2GB free disk space

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      rally-network                          │
│  (Internal Docker bridge network - isolates from others)   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │ rally-frontend   │  │ rally-backend  │  │ rally-db   │ │
│  │ (Vite dev)       │  │ (NestJS API)   │  │ (Postgres) │ │
│  │ :5173→4300       │  │ :4000→4800     │  │ :5432→55432│ │
│  └──────────────────┘  └────────────────┘  └────────────┘ │
│         ↕                     ↕                    ↑       │
│    HMR enabled          REST endpoints      Persisted data │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        ↑
        │
   Your Browser
   localhost:4300
```

## 🔌 Port Configuration

Your setup **will NOT conflict** with existing Docker projects:

| Service | Container | Host | Status | Notes |
|---------|-----------|------|--------|-------|
| Frontend | 5173 | **4300** | ✅ SAFE | Vite dev server (HMR enabled) |
| Backend | 4000 | **4800** | ✅ SAFE | NestJS API server |
| Database | 5432 | **55432** | ✅ SAFE | PostgreSQL |

### ✅ Verified Safe Against Existing Projects:
- wreckshop (uses 3001, 4002, 5176, 6380, 27020)
- bail-bonds-dashboard (uses 5173, 8080, 8025, 6379, 27018)
- whiteboard (uses 5050, 5174, 8081, 27019)
- internal-wiki (uses 3000)
- inmate_enrichment (uses 4000—different network)
- warrantdb-pipeline (uses 27017)

## 📁 Project Structure

```
Rally-connect/
├── docker-compose.yml         ← Orchestrates all services
├── Dockerfile.dev             ← Frontend dev container
├── .env.example               ← Environment template
├── .gitignore
├── src/                       ← React frontend
│   ├── services/
│   │   └── api.ts            ← API client
│   ├── App.tsx
│   └── main.tsx
├── backend/                   ← NestJS backend
│   ├── Dockerfile            ← Multi-stage build
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── modules/           ← API endpoints
│   │   └── common/prisma/
│   ├── prisma/
│   │   ├── schema.prisma      ← Database schema
│   │   └── seed.ts            ← Seed data
│   ├── package.json
│   ├── .env.development
│   ├── .env.staging
│   └── .env.production
└── docs/
    └── rally-backend-docker-spec.md
```

## 🚀 Quick Start (3 Steps)

### Step 1: Start All Services

```bash
cd /Users/ryanmorrow/Documents/Projects2025/Rally-connect

docker-compose up --build
```

This command:
- ✅ Builds frontend container (Vite dev server)
- ✅ Builds backend container (NestJS)
- ✅ Starts PostgreSQL container
- ✅ Creates rally-network bridge
- ✅ Runs database migrations
- ✅ Seeds sample data

**Expected output:**
```
✓ Database connected
🚀 Rally-connect API listening on port 4000
✓ Compiled successfully...
```

### Step 2: Wait for Services to Be Ready

First time takes 1-2 minutes. Subsequent starts are 10-20 seconds.

Services are healthy when:
- Backend shows: `🚀 Rally-connect API listening on port 4000`
- Frontend shows: `VITE v6.3.5 ready in 500 ms`
- Database shows: `database system is ready to accept connections`

### Step 3: Access the Application

```
Frontend:  http://localhost:4300
Backend:   http://localhost:4800
Health:    http://localhost:4800/health
API:       http://localhost:4800/api
Database:  http://localhost:55432 (from your machine)
```

## 📊 Verify Everything Works

### 1. Health Check

```bash
curl http://localhost:4800/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-21T12:00:00Z",
  "database": "connected"
}
```

### 2. Frontend Loads

Open browser: `http://localhost:4300`

Should show Rally-connect welcome screen.

### 3. API Endpoints

```bash
# Get all sports
curl http://localhost:4800/sports

# Get all leagues
curl http://localhost:4800/leagues

# Get all teams
curl http://localhost:4800/teams

# Get standings
curl http://localhost:4800/standings
```

## 🔧 Docker Compose Commands

### Start Services
```bash
# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Start specific service
docker-compose up rally-backend
```

### Stop Services
```bash
# Stop gracefully
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f rally-backend
docker-compose logs -f rally-frontend
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100
```

### Check Service Status
```bash
# List running containers
docker-compose ps

# Inspect service
docker-compose exec rally-backend sh

# Check health
docker-compose exec rally-backend curl http://localhost:4000/health
```

## 💻 Development Workflow

### Frontend Development (HMR Enabled)

Edit frontend files → Changes auto-reload in browser

```bash
# Watch mode (already running in docker-compose)
npm run dev
```

Files auto-reload: `src/**/*.tsx`, `index.html`

### Backend Development

Edit backend files → Container auto-reloads

```bash
# Backend is running with watch mode
# Just save files and server reloads
```

Files that trigger reload: `backend/src/**/*.ts`

### Database Changes

#### Add a Migration

```bash
# From project root
docker-compose exec rally-backend npx prisma migrate dev --name <migration_name>
```

Example:
```bash
docker-compose exec rally-backend npx prisma migrate dev --name add_user_email_index
```

#### View Database GUI

```bash
docker-compose exec rally-backend npm run prisma:studio
```

Opens at `http://localhost:5555`

#### Reset Database (Careful!)

```bash
docker-compose exec rally-backend npx prisma migrate reset
```

This will:
- Delete all data
- Re-run all migrations
- Re-seed sample data

## 🌍 Environment Variables

### Frontend (.env in src/)

```bash
# Already set by docker-compose
VITE_API_URL=http://rally-backend:4000  # Inside container
# or
VITE_API_URL=http://localhost:4800      # From browser
```

### Backend (backend/.env.development)

```
APP_PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://rallyos:rallyos_password@db:5432/rallyos
JWT_SECRET=dev_jwt_secret_change_in_production
CORS_ORIGIN=http://localhost:4300,http://rally-frontend:5173
LOG_LEVEL=debug
```

### Database (Implicit in docker-compose)

```
POSTGRES_DB=rallyos
POSTGRES_USER=rallyos
POSTGRES_PASSWORD=rallyos_password
```

## 🔐 Customization

### Change Ports

Edit `docker-compose.yml`:

```yaml
services:
  rally-frontend:
    ports:
      - "3300:5173"  # Changed from 4300 to 3300
```

Or set environment variable:

```bash
FRONTEND_PORT=3300 docker-compose up
```

### Change Database Password

Edit `backend/.env.development`:

```
DB_PASSWORD=your_new_password
```

Update `docker-compose.yml`:

```yaml
services:
  db:
    environment:
      - POSTGRES_PASSWORD=your_new_password
```

### Add More Environment Variables

Edit `backend/.env.development` and add to `docker-compose.yml`:

```yaml
rally-backend:
  env_file:
    - ./backend/.env.development
  environment:
    - MY_NEW_VAR=value
```

## 📊 Database Schema

Full schema in `backend/prisma/schema.prisma`:

### Core Models
- **User** - 20 test users seeded
- **Sport** - Pickleball, Tennis, Racquetball (3)
- **League** - Denver Pickleball Pro, Denver Tennis (2)
- **Division** - Premier, Intermediate, Beginner, Open (4)
- **Club** - Downtown Sports Complex, Westside Courts (2)
- **Team** - Smash & Bash, Court Kings, Intermediate Warriors (3)
- **Player** - 18 players with stats
- **Match** - Sample matches with results (2)
- **Standing** - Division standings
- **Achievement** - Gamification badges (3)

## 🔄 Seed Data

Sample data automatically inserted on first run:

```
✓ 3 Sports
✓ 2 Clubs
✓ 2 Leagues
✓ 4 Divisions
✓ 20 Users
✓ 2 Captains
✓ 3 Teams (with rosters)
✓ 18 Players (with stats)
✓ 2 Matches
✓ 3 Achievements
```

### Reseed Database

```bash
docker-compose exec rally-backend npm run prisma:seed
```

## 🚨 Troubleshooting

### Services Won't Start

**Error:** `bind: address already in use`

**Solution:** Kill process using the port:

```bash
# Find process on port
lsof -i :4300

# Kill it
kill -9 <PID>

# Or just change port in docker-compose
```

### Database Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
1. Ensure db container is running: `docker-compose ps`
2. Check database logs: `docker-compose logs db`
3. Restart database: `docker-compose restart db`

### Frontend Can't Connect to Backend

**Error:** `Failed to fetch http://localhost:4800/...`

**Solution:**
1. Verify backend is running: `curl http://localhost:4800/health`
2. Check frontend container has correct `VITE_API_URL`
3. Verify CORS is enabled in backend
4. Check firewall isn't blocking port 4800

### TypeScript Errors

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
# Rebuild everything
docker-compose down -v
docker-compose up --build
```

## 📈 Performance Monitoring

### Container Resource Usage

```bash
docker stats rally-frontend rally-backend db
```

Shows real-time CPU, memory, network usage.

### Backend Performance

```bash
# Query execution time
docker-compose logs rally-backend | grep "duration"
```

### Database Performance

```bash
# Connect to database
docker-compose exec db psql -U rallyos -d rallyos

# View slow queries
SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC;
```

## 🧪 Testing

### Backend Unit Tests

```bash
docker-compose exec rally-backend npm test
```

### Backend E2E Tests

```bash
docker-compose exec rally-backend npm run test:e2e
```

### API Integration Tests

```bash
# Use Postman, Insomnia, or curl
curl -X GET http://localhost:4800/teams \
  -H "Content-Type: application/json"
```

## 🚀 Deployment

### Build Production Image

```bash
docker build -t rally-backend:1.0.0 ./backend
```

### Production Docker Compose

See `docker-compose.yml` comments for production configuration.

### Deploy to Cloud

Supports any Docker hosting:
- AWS ECS / Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Heroku
- Self-hosted VPS with Docker

## 📚 API Documentation

### Available Endpoints

```
GET    /health                      Health check
GET    /sports                      All sports
GET    /leagues                     All leagues
GET    /leagues/:id                 League details
GET    /teams                       All teams
GET    /teams/:id                   Team details
GET    /players                     All players
GET    /players/:id                 Player details
GET    /matches                     All matches
GET    /matches/:id                 Match details
GET    /standings                   All standings
GET    /standings/division/:divisionId  Division standings
```

### Example API Call from Frontend

```typescript
import { apiService } from '@/services/api';

// Get all teams
const response = await apiService.getTeams();
if (response.data) {
  console.log(response.data);
}
```

## 🔗 Frontend Integration

API service already configured in `src/services/api.ts`:

```typescript
// All endpoints ready to use
apiService.getSports()
apiService.getLeagues()
apiService.getTeams()
apiService.getPlayers()
apiService.getMatches()
apiService.getStandings()
```

## 📖 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Backend README](./backend/README.md)
- [Frontend README](./README.md)

## ✅ Final Checklist

Before going live, ensure:

- [ ] All services start without errors
- [ ] Health endpoint returns `{ status: "ok" }`
- [ ] Frontend loads at `http://localhost:4300`
- [ ] API endpoints return data
- [ ] Database has sample data
- [ ] Environment variables set correctly
- [ ] No port conflicts with existing projects
- [ ] Docker network (rally-network) created
- [ ] Database volume created and persisting data
- [ ] Frontend can call backend API successfully

## 🎉 Success!

You're ready for development! 🚀

```bash
docker-compose up
# Then visit http://localhost:4300
```

---

**Questions?** Check the troubleshooting section or review the backend README.
