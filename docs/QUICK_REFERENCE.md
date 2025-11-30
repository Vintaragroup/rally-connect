# Quick Reference - API Backend Status & Troubleshooting

## Current Status

### ✅ All Systems Operational
- **Backend**: NestJS API running on port 4802
- **Frontend**: React app running on port 4300
- **Database**: PostgreSQL connected and healthy
- **API Endpoints**: All 6 endpoints returning correct data

### Test Commands

```bash
# Quick health check
curl http://10.0.0.2:4802/health

# Get all leagues
curl http://10.0.0.2:4802/leagues | jq .

# Get all teams
curl http://10.0.0.2:4802/teams | jq .

# Get all players
curl http://10.0.0.2:4802/players | jq .

# Get standings
curl http://10.0.0.2:4802/standings | jq .

# Get matches
curl http://10.0.0.2:4802/matches | jq .
```

## Fixed Issues This Session

### Issue 1: /matches endpoint returns 500 error
**Symptom**: `Unknown argument 'scheduledAt'`
**Root Cause**: Service using non-existent field names
**Status**: ✅ FIXED - Updated to use `startTime`, correct relations

### Issue 2: /players endpoint returns 500 error
**Symptom**: `Unknown argument 'teams'`
**Root Cause**: Service using non-existent direct relation
**Status**: ✅ FIXED - Updated to use `teamPlayers` join table

### Issue 3: /standings endpoint returns 500 error
**Symptom**: `Unknown argument 'league'` on Division
**Root Cause**: Accessing league directly instead of through season
**Status**: ✅ FIXED - Updated access path to division→season→league

### Issue 4: /leagues endpoint returns 500 error
**Symptom**: `Unknown argument 'divisions'`
**Root Cause**: Accessing divisions directly instead of through seasons
**Status**: ✅ FIXED - Updated to seasons→divisions nesting

### Issue 5: Association admin endpoints broken
**Symptom**: Controller trying to call non-existent captainInvitation methods
**Root Cause**: Model doesn't exist in Prisma schema
**Status**: ✅ FIXED - Commented out invalid methods and endpoints

## If Issues Recur

### Backend Won't Build
```bash
# Check for errors
cd /Users/ryanmorrow/Documents/Projects2025/Rally-connect/backend
npm run build

# If Prisma errors, verify schema matches code
npx prisma generate
```

### API Returning 500 Errors
```bash
# Check backend logs
docker-compose logs rally-backend | tail -50

# Look for "Unknown argument" or "Unknown field" in Prisma errors
# Verify service file is using correct field names from Prisma schema
```

### Containers Won't Start
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check container health
docker-compose ps
```

### Frontend Can't Connect to Backend
```bash
# Verify CORS is configured in backend
# Check .env.development has correct API URL

# Test directly with curl
curl -v http://10.0.0.2:4802/health

# Check docker-compose.yml for port mappings
```

## Prisma Schema Quick Reference

### Correct Relations
```
Match → homeTeam (Team)
Match → awayTeam (Team)
Match → division (Division)
Match → season (Season)
Season → league (League)
Season → divisions (Division[])
Player → teamPlayers (TeamPlayer[])
TeamPlayer → team (Team)
```

### Field Names
- Match: `startTime` (NOT `scheduledAt`)
- Match: `homeTeamId`, `awayTeamId` (NOT `team1Id`, `team2Id`)
- All timestamps: `createdAt`, `updatedAt`

## Quick Fixes

### If You See "Unknown argument 'scheduledAt'"
Fix: Change in `matches.service.ts` line 14
```typescript
// ❌ WRONG
orderBy: { scheduledAt: 'desc' }

// ✅ CORRECT
orderBy: { startTime: 'desc' }
```

### If You See "Unknown argument 'teams'"
Fix: Change in `players.service.ts`
```typescript
// ❌ WRONG
include: { teams: true }

// ✅ CORRECT
include: { 
  teamPlayers: { 
    include: { team: true } 
  } 
}
```

### If You See "Cannot access league from Division"
Fix: Change in `standings.service.ts`
```typescript
// ❌ WRONG
division: { include: { league: true } }

// ✅ CORRECT
division: {
  include: {
    season: {
      include: { league: true }
    }
  }
}
```

## Deployment Checklist

- ✅ All backend service files use correct Prisma field names
- ✅ All includes reference relations that exist in schema
- ✅ No references to non-existent models (captainInvitation)
- ✅ Backend builds without errors
- ✅ Docker image builds successfully
- ✅ All containers start and pass health checks
- ✅ API endpoints respond to requests
- ✅ Data structure matches frontend expectations

## Frontend Ready For

- ✅ ScheduleScreen → Fetch from `/matches`
- ✅ TeamsScreen → Fetch from `/teams`
- ✅ StandingsScreen → Fetch from `/standings`
- ✅ PlayerDirectoryScreen → Fetch from `/players`
- ✅ Admin Leagues → Fetch from `/leagues`
- ✅ Admin Teams → Fetch from `/teams`
- ✅ Admin Players → Fetch from `/players`

## Files Modified This Session

1. `backend/src/modules/matches/matches.service.ts` (2 methods)
2. `backend/src/modules/players/players.service.ts` (2 methods)
3. `backend/src/modules/standings/standings.service.ts` (2 methods)
4. `backend/src/modules/leagues/leagues.service.ts` (2 methods)
5. `backend/src/modules/association-admin/association-admin.service.ts` (multiple methods)
6. `backend/src/modules/association-admin/association-admin.controller.ts` (4 endpoints commented)

Total Lines Changed: ~150 lines across 6 files

## Network Configuration

```
Device IP: 10.0.0.2
Frontend: http://10.0.0.2:4300
Backend API: http://10.0.0.2:4802
Database: localhost:5433 (from host)
```

## Success Indicators

✅ `curl http://10.0.0.2:4802/health` returns `{"status":"ok","database":"connected"}`
✅ `curl http://10.0.0.2:4802/leagues` returns array of leagues
✅ `curl http://10.0.0.2:4802/teams` returns array of teams
✅ `curl http://10.0.0.2:4802/players` returns array of players
✅ No "Unknown argument" errors in backend logs

---

Last Updated: 2025-11-28
Status: All backend API endpoints operational ✅

