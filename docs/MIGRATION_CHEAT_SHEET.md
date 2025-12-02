# Prisma Migration Cheat Sheet

**Quick Reference - Print This!**

## The One-Page Rule

**NEVER do this:**
```bash
# ❌ This will ask for reset!
npx prisma migrate dev --name something
```

**ALWAYS do this:**
```bash
# ✓ This is safe
1. npx prisma validate
2. npx prisma migrate dev --create-only
3. Review migration.sql
4. git commit
5. npx prisma migrate deploy
```

## 6 Step Safe Process

### 1️⃣ Update schema.prisma
```bash
# Edit the file
vim backend/prisma/schema.prisma
# Add models, fields, relations
```

### 2️⃣ Validate
```bash
cd backend
npx prisma validate
# Output: ✓ "The schema is valid 🚀"
```

### 3️⃣ Generate Migration
```bash
# If DB reachable:
npx prisma migrate dev --create-only

# If DB unreachable:
mkdir -p prisma/migrations/[YYYYMMDDHHMMSS]_your_name
# Write migration.sql manually
```

### 4️⃣ Review SQL
```bash
cat prisma/migrations/[timestamp]_name/migration.sql
# Check for:
# ✓ ALTER TABLE statements
# ✓ CREATE TABLE statements
# ✓ Foreign key constraints
# ✓ Indexes
```

### 5️⃣ Commit
```bash
git add backend/prisma/schema.prisma
git add backend/prisma/migrations/
git commit -m "feat: Database changes"
git push origin main
```

### 6️⃣ Deploy (when DB available)
```bash
cd backend
npx prisma migrate deploy
npx prisma validate
# Output: ✓ "The schema is valid 🚀"
```

---

## Common Scenarios

### Scenario A: "I've Updated schema.prisma"
```bash
cd backend
npx prisma validate           # ← Check first
npx prisma migrate dev --create-only  # ← Generate
# Review migration.sql
git commit && git push        # ← Save
```

### Scenario B: "Database Connection Failed"
```bash
# Don't worry! Continue anyway:
mkdir -p prisma/migrations/20251201230000_your_change
# Write migration.sql based on your schema changes
git commit && git push        # ← Still safe!
# Deploy later when DB is available
npx prisma migrate deploy
```

### Scenario C: "Database Asked for Reset"
```bash
# ❌ Don't press Y!
# Instead:
git checkout backend/prisma/schema.prisma  # Revert changes
npx prisma migrate dev --create-only  # Start over correctly
```

### Scenario D: "Migration is Already Deployed"
```bash
# No problem! Git tracks this
npx prisma migrate status    # Check status
npx prisma validate          # Verify sync
```

---

## Migration File Structure

```
backend/prisma/migrations/
├── 20241124211033_add_onboarding_completed/
│   └── migration.sql
├── 20251125032202_add_phase1_models/
│   └── migration.sql
└── 20251201230000_phase_1_add_team_joining_system/
    └── migration.sql        ← We created this!
```

Each migration.sql file contains PostgreSQL statements:
```sql
-- Add fields
ALTER TABLE "User" ADD COLUMN "newField" TEXT;

-- Create tables
CREATE TABLE "NewModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "NewModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create indexes
CREATE UNIQUE INDEX "NewModel_userId_key" ON "NewModel"("userId");
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Can't reach database" | Use manual migration creation, deploy later |
| "Reset schema?" prompt | Press N, use `--create-only` instead |
| "Schema not valid" | Run `npx prisma validate` to see errors |
| "Migration conflict" | Run `npx prisma migrate resolve` |
| "Need to rollback" | Manual revert OR `npx prisma migrate reset` (⚠️ deletes data) |

---

## What Went Wrong (For Reference)

**The mistake we were making:**
```bash
# We edited schema.prisma
# Then ran:
npx prisma migrate dev --name X
# ↓ Prisma tried to auto-apply changes
# ↓ Database didn't match schema
# ↓ Prisma panicked: "RESET EVERYTHING?"
# ↓ Data loss risk! ❌
```

**What fixed it:**
```bash
# We manually created migration.sql with proper SQL
# No auto-apply attempt
# Clean SQL that's safely applied
# No data loss risk! ✓
```

---

## Commands at a Glance

```bash
# Validate
npx prisma validate

# Generate (safe - don't apply yet)
npx prisma migrate dev --create-only

# Deploy (apply pre-generated migrations)
npx prisma migrate deploy

# Check status
npx prisma migrate status

# Reset (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# Resolve conflicts
npx prisma migrate resolve --rolled-back [migration_name]
```

---

## Key Principles

1. **Always validate first** - Catch errors early
2. **Generate before deploying** - Review before applying
3. **Commit migrations to git** - Track database changes
4. **Deploy with confidence** - Migration is already tested
5. **Never auto-reset database** - Use `--create-only`

---

## In Case of Emergency

```bash
# If everything is broken:
cd backend

# Check status
npx prisma migrate status

# See the damage
npx prisma db pull  # Shows current DB schema

# Recovery option 1: Reset (DELETES DATA)
npx prisma migrate reset

# Recovery option 2: Mark as rolled back (safer)
npx prisma migrate resolve --rolled-back [migration_name]

# Recovery option 3: Fix schema and try again
npx prisma validate
npx prisma migrate dev --create-only
# Review and fix issues...
```

---

## Phase 1 Status

**Commit:** 92d9a6f (feat: Phase 1 database schema)

**Migration file:** `backend/prisma/migrations/20251201230000_phase_1_add_team_joining_system/migration.sql`

**Status:** ✓ Ready to deploy

**To deploy:**
```bash
cd backend && npx prisma migrate deploy
```

---

**Remember:** When in doubt, validate first! 🚀
