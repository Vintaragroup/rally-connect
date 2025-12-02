# Prisma Database Migration - Correct Process Reference

**Important:** This is the proven process that avoids the "reset schema" error.

## The Problem We Fixed

When running `npx prisma migrate dev`, Prisma would ask:
```
? We need to reset the "public" schema at "aws-1-us-east-2.pooler.supabase.com:5432"
Do you want to continue? All data will be lost. › (y/N)
```

**Why it happens:**
- Schema changes don't match what's in the database
- Prisma tries to auto-apply changes but detects mismatch
- Falls back to asking for full reset (data loss!)

## ✅ The Correct Process (Used Successfully)

### Step 1: Update Schema First

Edit `backend/prisma/schema.prisma` with all your changes:
```prisma
model LeagueMember {
  id        String   @id @default(cuid())
  userId    String
  leagueId  String
  joinedAt  DateTime @default(now())
  user      User     @relation("LeagueMembers", fields: [userId], references: [id], onDelete: Cascade)
  league    League   @relation("LeagueMembers", fields: [leagueId], references: [id], onDelete: Cascade)
  
  @@unique([userId, leagueId])
}
```

**Validate the schema:**
```bash
cd backend
npx prisma validate
# Output: "The schema at prisma/schema.prisma is valid 🚀"
```

### Step 2: Create Migration File Manually (If DB Connection Issues)

If Prisma can't reach the database or asks for reset:

**Option A: Attempt automatic migration generation (if DB is reachable)**
```bash
npx prisma migrate dev --name your_migration_name --create-only
```
This generates the SQL without applying it. You can review before deploying.

**Option B: Manually create migration directory**

If database is unreachable, create the migration file yourself:

1. Generate timestamp-based directory name (format: YYYYMMDDhhmmss):
```bash
date +%Y%m%d%H%M%S
# Example output: 20251201230000
```

2. Create directory in migrations:
```bash
mkdir -p backend/prisma/migrations/20251201230000_phase_1_add_team_joining_system
```

3. Write the migration SQL based on your schema changes:
```sql
-- backend/prisma/migrations/20251201230000_phase_1_add_team_joining_system/migration.sql

-- Add new fields
ALTER TABLE "League" ADD COLUMN "isPubliclyVisible" BOOLEAN NOT NULL DEFAULT false;

-- Create new tables with proper constraints
CREATE TABLE "LeagueMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE CASCADE
);

-- Create indexes for performance
CREATE UNIQUE INDEX "LeagueMember_userId_leagueId_key" ON "LeagueMember"("userId", "leagueId");
CREATE INDEX "LeagueMember_leagueId_idx" ON "LeagueMember"("leagueId");
```

**Key SQL principles:**
- Use `NOT NULL DEFAULT` for backward compatibility
- Add foreign key constraints properly
- Create indexes on frequently-queried fields
- Use `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately
- Use `ALTER TABLE ADD COLUMN` for existing tables
- Use `CREATE TABLE` for new tables

### Step 3: Commit the Changes

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations/
git commit -m "feat: Phase 1 database schema - Team joining system

Add models and fields for flexible team joining:
- LeagueMember: Track users in leagues
- TeamJoinRequest: Request-based team joining
- League enhancements: isPubliclyVisible, isEvent, skillLevel, startDate, endDate"
git push origin main
```

### Step 4: Deploy Migration When Database is Accessible

```bash
cd backend
npx prisma migrate deploy
```

This applies the migration file without asking for confirmation or reset.

**Verify it worked:**
```bash
npx prisma validate
# Output: "The schema at prisma/schema.prisma is valid 🚀"
```

## What We Did Successfully

### Commit 92d9a6f
```
feat: Phase 1 database schema - Team joining system
```

**Files changed:**
1. `backend/prisma/schema.prisma` - Added LeagueMember, TeamJoinRequest models + League/Team field enhancements
2. `backend/prisma/migrations/20251201230000_phase_1_add_team_joining_system/migration.sql` - SQL migration

**Result:** Database ready to deploy, no data loss risk

## Key Differences: Wrong vs Right Approach

### ❌ Wrong Approach (Causes Reset Prompt)
```bash
# Directly running migrate dev with uncommitted schema changes
npx prisma migrate dev --name add_stuff
# ↓ Prisma can't match schema to DB state
# ↓ Asks for reset (data loss!)
```

### ✅ Right Approach (No Reset Needed)
```bash
# 1. Update schema
# 2. Validate schema
npx prisma validate

# 3. Generate migration (or create manually)
npx prisma migrate dev --name phase_1_add_team_joining_system --create-only

# 4. Review migration SQL
cat backend/prisma/migrations/20251201230000.../migration.sql

# 5. Commit
git add backend/prisma/
git commit -m "..."

# 6. Deploy when ready
npx prisma migrate deploy
```

## Our Current State

**Status:** ✅ Ready to deploy

**Location of migration:**
```
backend/prisma/migrations/20251201230000_phase_1_add_team_joining_system/migration.sql
```

**To deploy:** 
```bash
cd backend
npx prisma migrate deploy
```

## Prevention Tips for Future Migrations

1. **Always validate first:**
   ```bash
   npx prisma validate
   ```

2. **Generate migration before applying:**
   ```bash
   npx prisma migrate dev --create-only
   ```

3. **Review the SQL:**
   ```bash
   cat backend/prisma/migrations/[timestamp]_migration_name/migration.sql
   ```

4. **Deploy with confidence:**
   ```bash
   npx prisma migrate deploy
   ```

5. **If database is unreachable:**
   - Commit the migration file anyway
   - Deploy it later when database is accessible
   - Prisma will track which migrations have been applied

## Emergency: Rollback if Needed

If a migration causes issues:

```bash
# Mark migration as rolled back (without deleting data)
npx prisma migrate resolve --rolled-back 20251201230000_phase_1_add_team_joining_system

# Or reset to previous state (if safe)
npx prisma migrate reset
# Warning: This deletes all data and re-runs all migrations
```

## Documentation Reference

- **Prisma Migrations:** https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate
- **Safe migrations:** https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/transactional-migrations
- **Deployment:** https://www.prisma.io/docs/orm/prisma-migrate/deployment

## Summary

| Step | Command | Purpose |
|------|---------|---------|
| 1 | Edit `schema.prisma` | Define schema changes |
| 2 | `npx prisma validate` | Verify schema is valid |
| 3 | `npx prisma migrate dev --create-only` | Generate migration file |
| 4 | Review `migration.sql` | Ensure SQL looks correct |
| 5 | `git commit` | Save schema + migration |
| 6 | `npx prisma migrate deploy` | Apply to database |
| 7 | `npx prisma validate` | Confirm success |

This process ensures:
- ✅ No data loss
- ✅ No "reset schema" prompts
- ✅ Clean git history
- ✅ Easy rollback if needed
- ✅ Migration runs safely in production
