# Mobile Testing Setup - OAuth Fix

## Issue
After OAuth verification, you're redirected to `localhost:3000` on your phone, which doesn't exist.

## Solution
Add your mobile testing URL to Supabase's authorized redirect URIs.

### Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `Rally-connect`

2. **Navigate to Authentication Settings**
   - Left sidebar: `Authentication`
   - Go to: `URL Configuration`

3. **Add New Redirect URI**
   - Find the "Redirect URLs" section
   - Click "Add URL"
   - Add this URL: `http://10.0.0.2:4300/`
   - Click "Save"

4. **Test OAuth Again**
   - Go to `http://10.0.0.2:4300` on your phone
   - Try OAuth login again
   - You should be redirected to the app (not localhost:3000)

### Current Authorized URIs (should include):
- `http://localhost:3000/`
- `http://localhost:3001/`
- `http://10.0.0.2:4300/` ← **Add this one**

### Note
Your IP address (`10.0.0.2`) may change if you restart your network. If it does, you'll need to update the Supabase redirect URI with the new IP.

To check your current IP:
```bash
ifconfig | grep -E "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
```

Then update the Supabase redirect URI accordingly.
