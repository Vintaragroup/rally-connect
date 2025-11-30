# Quick Start: Supabase OAuth Setup (15 minutes)

## 1. Create Supabase Project (3 min)

```bash
# 1. Go to https://supabase.com/dashboard
# 2. Sign up (free)
# 3. Click "New Project"
# 4. Fill in:
#    - Project Name: "rally-connect"
#    - Database Password: (generate & save)
#    - Region: (closest to you)
# 5. Wait 2-3 minutes for creation
```

## 2. Get Your Credentials (1 min)

In Supabase Dashboard → Settings → API:
- Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
- Copy **Anon public key** (e.g., `eyJ...`)

## 3. Update .env.local (1 min)

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-key...
```

## 4. Enable Google OAuth in Supabase (3 min)

In Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Find **Google** → Click **Enable**
3. Copy the **Redirect URI** shown
   - Looks like: `https://xxxxx.supabase.co/auth/v1/callback?provider=google`

## 5. Configure Google Cloud (5 min)

In [Google Cloud Console](https://console.cloud.google.com):
1. Go to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 app
3. Click **Edit**
4. Under **Authorized redirect URIs**, add:
   - The Supabase redirect URI from step 4
   - Example: `https://xxxxx.supabase.co/auth/v1/callback?provider=google`
5. Click **Save**

## 6. Complete Supabase Google Setup (2 min)

Back in Supabase Dashboard:
1. In **Authentication** → **Providers** → **Google**
2. Paste your credentials from Google Cloud:
   - **Client ID** (from Google Cloud)
   - **Client Secret** (from Google Cloud)
3. Click **Save**

## 7. Add Authorized URLs (1 min)

In Supabase → **Authentication** → **URL Configuration**:

Add these URLs:
```
http://localhost:4300
http://localhost:4300/auth/callback
```

(Add production domain later when deploying)

## 8. Test It! (1 min)

```bash
# Terminal 1: Start the app
npm run dev

# Browser: Go to http://localhost:4300
# Click "Sign Up"
# Click "Continue with Google"
# Sign in with your Google account
# 🎉 Should redirect to onboarding!
```

## ✅ Success Indicators

- ✅ Redirected to Google sign-in
- ✅ Returned to app after signing in
- ✅ Showed onboarding flow
- ✅ Can see your email in profile

## ❌ Troubleshooting (2 min)

**Issue**: Redirects to blank page
- **Fix**: Check browser console for errors, verify redirect URI in both Google Cloud AND Supabase

**Issue**: "Redirect URI mismatch" error
- **Fix**: Make sure Supabase redirect URI exactly matches in Google Cloud (copy-paste, no typos)

**Issue**: Environment variable error
- **Fix**: Restart `npm run dev` after editing `.env.local`

**Issue**: Google button doesn't work
- **Fix**: Check that Google provider is enabled in Supabase dashboard

## Next

Once OAuth works:
1. Set up database schema for teams, matches, users
2. Connect NestJS backend to Supabase
3. Test full app flow
4. Deploy to production

---

**Total Time**: ~15 minutes from start to working OAuth ✨
