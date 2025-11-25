# Supabase Migration Setup Guide

## Migration Complete! ✅

Your Rally Connect app has been successfully migrated from Stack Auth to **Supabase** - a more reliable, open-source authentication solution.

## Step 1: Create a Supabase Project

1. **Go to** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Sign in** (create account if needed - free tier available)
3. **Create new project**:
   - Organization: Create new or select existing
   - Project name: `rally-connect`
   - Database password: Generate strong password (save it!)
   - Region: Choose closest to you
   - Click **Create new project**

4. **Wait** for project to initialize (2-3 minutes)

## Step 2: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

3. Update `.env.local` in your project:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-key...
   ```

## Step 3: Configure Google OAuth in Supabase

1. **In Supabase Dashboard**, go to **Authentication** → **Providers**
2. **Enable Google**:
   - Click on Google provider
   - Copy the **Redirect URI** (looks like: `https://xxxxx.supabase.co/auth/v1/callback?provider=google`)

3. **In Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com)):
   - Go to your OAuth app
   - Settings → Authorized redirect URIs
   - **Add** the Supabase redirect URI from step 2
   - Save changes

4. **Back in Supabase**, paste your Google OAuth credentials:
   - Client ID: (from Google Cloud)
   - Client secret: (from Google Cloud)
   - Click **Save**

## Step 4: Add Authorized URL

In Supabase **Authentication** → **URL Configuration**:
- Add Authorized redirect URLs:
  - `http://localhost:4300`
  - `http://localhost:4300/auth/callback`
  - Your production domain (when ready)

## Step 5: Enable Email/Password (Optional)

In Supabase **Authentication** → **Providers**:
- Email/password is enabled by default
- Adjust settings as needed:
  - Confirm email (optional)
  - Double confirm email changes (optional)
  - Require email verification (recommended for production)

## Step 6: Test OAuth Flow

1. **Start your app**: `npm run dev`
2. **Visit**: `http://localhost:4300`
3. **Click** "Sign Up"
4. **Click** "Continue with Google"
5. **Sign in** with your Google account
6. **Verify** you're logged in and redirected to onboarding

## Key Differences from Stack Auth

| Feature | Stack Auth | Supabase |
|---------|-----------|----------|
| Open Source | ❌ No | ✅ Yes |
| Session Creation | ❌ Broken | ✅ Works |
| OAuth Support | ✅ Yes | ✅ Yes |
| Database | ❌ No | ✅ PostgreSQL |
| Self-Hostable | ❌ No | ✅ Yes |
| Cost | Freemium | Free tier generous |
| Community | ❌ Small | ✅ Large |

## What Changed in Your Code

**Removed:**
- `@stackframe/js` SDK
- `Stack Auth` hooks
- `Stack Auth` provider

**Added:**
- `@supabase/supabase-js` SDK
- `AuthContext` provider
- `src/lib/supabase/client.ts` configuration
- Supabase OAuth callback handler at `/auth/callback`

**Modified:**
- `RegisterScreen.tsx` - Now uses Supabase auth methods
- `App.tsx` - Uses Supabase `useAuth()` hook
- `main.tsx` - Uses AuthProvider instead of StackAuthProvider
- `.env.local` - Supabase credentials

## Environment Variables

Required for development:
```env
VITE_API_URL=http://localhost:4800
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
Run: `npm install @supabase/supabase-js`

### OAuth redirect to blank page
- Verify redirect URI in Supabase matches Google Cloud
- Check that `/auth/callback` route exists
- Check browser console for errors

### "Missing Supabase environment variables"
- Verify `.env.local` has correct keys
- Restart dev server after updating `.env.local`
- Keys should be copied exactly with no spaces

### User authenticated but not persisting
- Clear browser cookies/cache
- Check that session is being stored in Supabase
- Verify `AuthContext` is wrapping your App

## Next Steps

1. ✅ Complete initial OAuth setup above
2. ✅ Test Google/Apple OAuth
3. 📝 Create Supabase database schema for your team data
4. 🔐 Set up Row Level Security (RLS) policies
5. 📡 Connect NestJS backend to Supabase
6. 🚀 Deploy to production

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Supabase OAuth**: https://supabase.com/docs/guides/auth/social-login
- **GitHub**: https://github.com/supabase/supabase

## Support

If you hit any issues:
1. Check browser console for error messages
2. Check `/debug` page for OAuth errors
3. Visit Supabase dashboard → Logs for backend errors
4. Post in Supabase Discord: https://discord.supabase.com
