# Supabase Database Migration Guide

## Step 1: Get Your Supabase Connection String

1. Go to https://app.supabase.com/projects
2. Select your project: "godsuzfuwmitwtjqckdz"
3. Click "Settings" → "Database"
4. Find the "Connection string" section
5. Select "URI" and copy the connection string (should look like):
   ```
   postgresql://postgres:[YOUR_PASSWORD]@godsuzfuwmitwtjqckdz.c.supabase.co:5432/postgres
   ```

## Step 2: Apply Schema to Supabase

Once you have the connection string, run:

```bash
export SUPABASE_DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@godsuzfuwmitwtjqckdz.c.supabase.co:5432/postgres"
cd backend
npx prisma migrate deploy --name "initial_schema"
```

## Step 3: Update Environment Files

Replace the DATABASE_URL in:
- `.env.development`
- `.env.staging`
- `.env.production`

With your Supabase connection string.

## Step 4: Seed Data

```bash
export DATABASE_URL="your_supabase_connection_string"
npx ts-node prisma/seed.ts
```

