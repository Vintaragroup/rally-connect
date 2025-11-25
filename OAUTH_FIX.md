# OAuth Configuration Fix for redirect_uri_mismatch

## Problem
When clicking "Continue with Google", you get:
```
Error 400: redirect_uri_mismatch
```

This happens because the Google OAuth credentials in your Stack Auth project aren't configured with the correct redirect URIs.

## Solution

### Step 1: Go to Stack Auth Dashboard
1. Navigate to [Stack Auth Dashboard](https://app.stack-auth.com)
2. Select your project (Rally Connect)
3. Go to **Settings** → **Connected Services** or **OAuth Providers**

### Step 2: Configure Google OAuth
You need to update the Google OAuth configuration with the correct redirect URIs:

**For Local Development:**
- `http://localhost:4300` (JavaScript origin)
- `https://api.stack-auth.com/api/v1/auth/oauth/callback/google` (Redirect URI)

**For Production:**
- Add your production domain (e.g., `https://rallyos.com`)
- Keep the Stack Auth callback: `https://api.stack-auth.com/api/v1/auth/oauth/callback/google`

### Step 3: Update in Google Cloud Console
Alternatively, if you have access to the Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Find your project (it's linked to your Client ID: `582938995428-lqi780od5uh5l8ub3il4tacj621ms10s.apps.googleusercontent.com`)
3. Go to **Credentials** → **OAuth 2.0 Client IDs** → Your client
4. Add to **Authorized JavaScript origins:**
   ```
   http://localhost:4300
   ```
5. Add to **Authorized redirect URIs:**
   ```
   https://api.stack-auth.com/api/v1/auth/oauth/callback/google
   ```

### Step 4: Restart & Test
1. Save changes in Stack Auth Dashboard
2. Reload the app at `http://localhost:4300`
3. Try clicking "Continue with Google" again

## Workaround (Immediate)
While you configure OAuth, you can:
- Use **Email/Password** authentication for testing
- Fill in name, email, password manually
- This will work without OAuth configuration

## Note
The redirect URI must be **exactly** as configured. Stack Auth handles the OAuth flow:
1. Your app sends request to Stack Auth
2. Stack Auth redirects to Google
3. Google redirects back to Stack Auth
4. Stack Auth redirects back to your app with the token

This is different from a direct OAuth integration where Google redirects directly to your app.
