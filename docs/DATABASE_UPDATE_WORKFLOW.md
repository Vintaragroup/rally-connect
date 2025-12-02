# Database Update Workflow - Visual Guide

## The Flow (Correct Process)

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Update Schema                                           │
│ ─────────────────────────────────────────────────────────────── │
│ Edit: backend/prisma/schema.prisma                              │
│ • Add new models                                                │
│ • Add new fields                                                │
│ • Update relations                                              │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Validate Schema                                         │
│ ─────────────────────────────────────────────────────────────── │
│ $ npx prisma validate                                           │
│ ✓ Output: "The schema is valid 🚀"                              │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
        ┌────────────────────┐
        │ DB Reachable?      │
        └─────┬──────────┬───┘
          YES │          │ NO
              ↓          ↓
        ┌──────────┐   ┌──────────────────────┐
        │ Auto     │   │ Manual               │
        │ Generate │   │ Create Migration     │
        └────┬─────┘   └──────────┬───────────┘
             │                    │
             ↓                    ↓
    ┌──────────────────┐  ┌──────────────────────────┐
    │ $ npx prisma     │  │ mkdir -p backend/prisma/ │
    │   migrate dev    │  │   migrations/[timestamp] │
    │   --create-only  │  │                          │
    │                  │  │ Write migration.sql file │
    └────────┬─────────┘  └──────────┬───────────────┘
             │                       │
             └───────────┬───────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Review Migration SQL                                    │
│ ─────────────────────────────────────────────────────────────── │
│ $ cat backend/prisma/migrations/[timestamp]/migration.sql       │
│ • Verify ALTER TABLE statements                                 │
│ • Check CREATE TABLE syntax                                     │
│ • Confirm foreign key constraints                               │
│ • Ensure indexes exist                                          │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Commit to Git                                           │
│ ─────────────────────────────────────────────────────────────── │
│ $ git add backend/prisma/schema.prisma                          │
│ $ git add backend/prisma/migrations/                            │
│ $ git commit -m "feat: Database changes"                        │
│ $ git push origin main                                          │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Deploy When Database is Accessible                      │
│ ─────────────────────────────────────────────────────────────── │
│ $ cd backend                                                    │
│ $ npx prisma migrate deploy                                     │
│                                                                 │
│ Note: This is safe - migration file is already reviewed!        │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Verify Success                                          │
│ ─────────────────────────────────────────────────────────────── │
│ $ npx prisma validate                                           │
│ ✓ Output: "The schema is valid 🚀"                              │
│                                                                 │
│ Database is now updated!                                        │
└─────────────────────────────────────────────────────────────────┘
```

## What We Did (Phase 1 Example)

```
Edit schema.prisma
    ↓
    ├─ Add: model LeagueMember { ... }
    ├─ Add: model TeamJoinRequest { ... }
    └─ Update: model League { + 5 fields }
    ↓
Validate: ✓ "The schema is valid 🚀"
    ↓
Create Migration File (Manual)
    ├─ Directory: 20251201230000_phase_1_add_team_joining_system
    └─ SQL: ALTER TABLE, CREATE TABLE, CREATE INDEX statements
    ↓
Commit to Git
    ├─ schema.prisma changes
    ├─ migration.sql file
    └─ docs/PHASE_1_IMPLEMENTATION_STATUS.md
    ↓
Ready to Deploy (When DB accessible)
    └─ $ npx prisma migrate deploy
```

## Decision Tree: What to Do

```
                    Need to update database?
                            │
                            ↓
                ┌──────────────────────────┐
                │ Updated schema.prisma?   │
                └──────────┬───────────────┘
                       NO  │  YES
                   ┌───────┴─────────┐
                   ↓                 ↓
            Do it!         Is DB reachable?
                           ┌─────────┬────────┐
                       YES │         │ NO     
                           ↓         ↓
                    Try:            Do manual:
                  auto-gen     mkdir + write SQL
                    ↓               ↓
        ┌─────────────────┐    ┌─────────────────┐
        │ --create-only   │    │ migration.sql   │
        │ Review SQL      │    │ file            │
        └────────┬────────┘    └────────┬────────┘
                 │                      │
                 └──────────┬───────────┘
                            ↓
                    $ git commit
                    $ git push
                            ↓
                    When DB available:
                    $ npx prisma 
                      migrate deploy
                            ↓
                    Verify: $ npx prisma validate
                            ↓
                        ✓ Success!
```

## Error Prevention Matrix

| Situation | Action | Result |
|-----------|--------|--------|
| Schema changed, DB reachable | `prisma migrate dev --create-only` | Migration file generated, no data loss |
| Schema changed, DB unreachable | Create migration file manually | Safe to commit, deploy later |
| Try to `migrate dev` without `--create-only` | Migration asks for reset | ❌ Data loss risk |
| Run `migrate deploy` with reviewed file | Applies safely | ✓ No reset prompt, no data loss |
| Validate schema after migration | Confirms sync | ✓ Schema = Database |

## Files Involved

```
backend/
├── prisma/
│   ├── schema.prisma              ← Edit here first
│   └── migrations/
│       └── [timestamp]_name/
│           └── migration.sql      ← Generated or created here
├── .env                           ← Database connection
└── package.json
```

## Commands Reference

```bash
# Development
npx prisma validate               # Check schema is valid
npx prisma migrate dev            # Generate + apply migration (DEV ONLY)
npx prisma migrate dev --create-only  # Generate migration, don't apply

# Production / Safe Deployment
npx prisma migrate deploy         # Apply pre-generated migrations

# Troubleshooting
npx prisma migrate reset          # ⚠️ Deletes all data, re-runs migrations
npx prisma migrate resolve        # Mark migration as deployed
npx prisma db pull                # Introspect database (advanced)
```

## Real World Timeline

**Monday 9:00 AM** - Developer updates schema.prisma
```bash
$ npx prisma validate  ✓
$ npx prisma migrate dev --create-only
$ git commit && git push
```

**Monday 2:00 PM** - DevOps deploys to production
```bash
$ cd backend
$ npx prisma migrate deploy
$ npx prisma validate  ✓
# 🎉 Database updated safely!
```

This approach means:
- ✓ Schema changes are reviewed in PR
- ✓ Migration SQL is reviewed before deployment
- ✓ No surprises during production deployment
- ✓ Easy to rollback if needed
- ✓ Zero data loss risk
