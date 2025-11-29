# OAuth Mobile Testing - Complete Fix Guide

## Problem
After adding `http://10.0.0.2:4300/` to Supabase redirect URIs, you're still being redirected to `localhost:3000`.

## Root Causes
1. Browser cache on your phone remembering `localhost:3000`
2. Supabase might need time to propagate the change
3. The callback route `/auth/callback` might not be set up correctly

## Complete Fix - Do All Steps

### Step 1: Clear Mobile Browser Cache
**On your iPhone/Android:**
- Open Safari/Chrome Settings
- Clear browsing data/cache
- Close and reopen the browser completely

### Step 2: Verify Supabase Configuration
Go to https://supabase.com/dashboard → Your Project → Authentication → URL Configuration

**Confirm these Redirect URLs are listed:**
- `http://localhost:3000/`
- `http://10.0.0.2:4300/`
- `http://10.0.0.2:4300/auth/callback`

If any are missing, add them manually.

### Step 3: Test Fresh
1. Navigate to: `http://10.0.0.2:4300` (from your phone)
2. Clear ALL previous data/sessions
3. Try OAuth login again

### Step 4: If Still Redirecting to localhost:3000
The issue is that Supabase is redirecting to the FIRST configured redirect URI by default. 

**Solution:** In Supabase dashboard, you might need to:
1. Remove `http://localhost:3000/` temporarily (or move it to the bottom)
2. Make sure `http://10.0.0.2:4300/` is listed
3. Test again

### Step 5: Alternative - Use Direct Route
If the above doesn't work, we can modify the app to explicitly set the callback route.

Tell me if you've done Steps 1-4 and what happens!

## Quick IP Check
If you need to verify your current IP:
```bash
ifconfig | grep -E "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
```

Currently: `10.0.0.2`
