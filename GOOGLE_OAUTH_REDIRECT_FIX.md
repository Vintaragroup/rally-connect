# OAuth Mobile Fix - Google Cloud Console Update

## Root Cause
The `localhost:3000` redirect is coming from **Google Cloud Console OAuth settings**, not Supabase.

## Solution: Update Google OAuth Authorized Redirect URIs

### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (Rally-connect or similar)

2. **Navigate to OAuth Consent Screen**
   - Left sidebar: `APIs & Services`
   - Click: `Credentials`
   - Find your OAuth 2.0 Client ID (Web application)
   - Click it to edit

3. **Update Authorized Redirect URIs**
   - Scroll to "Authorized redirect URIs"
   - You should see: `http://localhost:3000/`
   - **Add these new URIs:**
     - `http://10.0.0.2:4300/`
     - `http://10.0.0.2:4300/auth/callback`
     - `http://10.0.0.2:4300/` (for Supabase callback)

4. **Save Changes**
   - Click "SAVE"
   - Wait a moment for changes to propagate

5. **Test Again**
   - Clear your phone's browser cache completely
   - Go to: `http://10.0.0.2:4300`
   - Try OAuth login again

### Current Setup Should Have:
- `http://localhost:3000/`
- `http://localhost:3001/`
- `http://10.0.0.2:4300/` ← **Add this**
- `http://10.0.0.2:4300/auth/callback` ← **Add this**

## Note
The redirect happening to `localhost:3000` is because Google OAuth is redirecting you BACK to the client (your app), and it's using the FIRST valid redirect URI in the list. We need to add your mobile IP so Google knows where to redirect you when you're testing on mobile.

## Double-Check
After you add these URIs to Google Cloud Console:
1. It may take 1-5 minutes to propagate
2. Clear browser cache on phone again
3. Try OAuth login fresh
