# Google OAuth Setup for Supabase

Your Supabase project is connected! Now we need to configure Google OAuth.

## Step 1: Get Your Supabase Redirect URI

In your Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Find and click **Google**
3. You'll see a **Redirect URI** that looks like:
   ```
   https://godsuzfuwmitwtjqckdz.supabase.co/auth/v1/callback?provider=google
   ```
4. **Copy this URI** - you'll need it for Google Cloud

## Step 2: Configure Google Cloud Console

In [Google Cloud Console](https://console.cloud.google.com):

1. Go to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 app for Rally Connect
3. Click the **edit button** (pencil icon)
4. Under **Authorized redirect URIs**, click **Add URI**
5. **Paste the Supabase redirect URI** from Step 1
   - Example: `https://godsuzfuwmitwtjqckdz.supabase.co/auth/v1/callback?provider=google`
6. Click **Save**

## Step 3: Complete Google Setup in Supabase

Back in Supabase Dashboard:
1. In **Authentication** → **Providers** → **Google**
2. Paste your Google OAuth credentials:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
3. Toggle **Enable** if not already enabled
4. Click **Save**

## Step 4: Add Authorized Redirect URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:

Add these URLs under **Authorized redirect URLs**:
```
http://localhost:4300
http://localhost:4300/auth/callback
```

## Step 5: Test OAuth

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:4300 in your browser

3. Click **"Sign Up"**

4. Click **"Continue with Google"**

5. You should be redirected to Google sign-in

6. After signing in, you should see the onboarding flow ✅

## ✅ Success!

If you see:
- ✅ Redirected to Google login
- ✅ Signed in with your Google account
- ✅ Redirected back to Rally Connect onboarding flow

**Then OAuth is working!** 🎉

## 📱 Troubleshooting

### "Redirect URI mismatch" Error
- Make sure the redirect URI in Google Cloud **exactly matches** the one from Supabase
- Copy and paste to avoid typos
- Try disabling and re-enabling the Google provider in Supabase

### Blank page after Google login
- Check browser console for errors (F12)
- Verify `/auth/callback` route exists (it should)
- Make sure `.env.local` has the correct Supabase URL and key
- Restart dev server: `npm run dev`

### Google button not appearing
- Check that browser cached CSS (try Cmd+Shift+R hard refresh)
- Verify Google provider is **enabled** in Supabase dashboard

### "Missing Supabase environment variables"
- Open `.env.local` and verify it has:
  - `VITE_SUPABASE_URL` (your project URL)
  - `VITE_SUPABASE_ANON_KEY` (your API key)
- Restart dev server after editing env vars

## Next Steps

Once OAuth is working:
1. Test the complete sign-up flow
2. Test the onboarding flow (all 5 screens)
3. Test sign-in with email/password
4. Then connect NestJS backend to Supabase database

Let me know once you've completed the Google OAuth setup! 🚀
