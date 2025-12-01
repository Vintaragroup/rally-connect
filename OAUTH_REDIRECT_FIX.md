# 🔧 Fix OAuth Redirect URLs in Supabase

## The Problem

After OAuth login, you're being redirected to `localhost:3000` instead of `http://138.197.31.8` or `https://138.197.31.8`.

This happens because **Supabase needs to be configured with your production redirect URLs**.

---

## ✅ Solution: Update Supabase Settings

### **Step 1: Go to Supabase Dashboard**
https://app.supabase.com

### **Step 2: Select Your Project**
- Project: `godsuzfuwmitwtjqckdz`

### **Step 3: Navigate to OAuth Settings**
1. Click **Authentication** (left sidebar)
2. Click **Providers**
3. Click **Google** (or whichever provider you're using)

### **Step 4: Update Redirect URLs**

You should see a field for "Redirect URLs" or "Authorized redirect URIs".

**Clear any existing URLs and add these:**

```
http://138.197.31.8/auth/callback
http://138.197.31.8:3000/auth/callback
https://138.197.31.8/auth/callback
https://138.197.31.8:3000/auth/callback
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback
```

### **Step 5: Save**
Click the **Save** button.

---

## 🔄 How OAuth Redirect Works

```
1. User clicks "Sign in with Google"
   ↓
2. Redirects to Google login
   ↓
3. User authenticates with Google
   ↓
4. Google redirects back to URL specified in Supabase
   ↓
5. Your app receives auth token and logs user in
```

**The redirect URL must match exactly** what you configured in Supabase.

---

## 🧪 Test After Updating

1. **Clear browser cache** (or use incognito/private mode)
2. **Go to:** `http://138.197.31.8`
3. **Click "Sign in with Google"**
4. **After login**, you should be redirected to `http://138.197.31.8` ✅

---

## 📝 If Using HTTPS

If you want to use HTTPS:

```
https://138.197.31.8/auth/callback
https://138.197.31.8:3000/auth/callback
```

Then access the app via: `https://138.197.31.8`

---

## ⚠️ Common Issues

### "Invalid redirect_uri"
- Check that your redirect URL exactly matches what's in Supabase
- No trailing slashes, exact case match

### "Redirect to localhost still happening"
- Browser cache - clear it or use incognito
- Supabase cache - wait 1-2 minutes after saving
- Check you clicked "Save" button

### "Still redirecting to localhost"
- Make sure you updated the **right** provider (Google/Apple)
- Verify the redirect URL field is filled (not empty)
- Take a screenshot and verify the URL is correct

---

## 🔍 How to Verify It's Configured

1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Look for the "Redirect URLs" section
3. You should see your URLs listed there
4. Make sure they start with `http://138.197.31.8` or `https://138.197.31.8`

---

## 💡 Pro Tip: Frontend Code

Your frontend already handles this correctly in `OAuthCallbackHandler.tsx`. 

The issue is **purely Supabase configuration** - not code.

---

## ✅ Summary

1. ✅ Go to Supabase Dashboard
2. ✅ Authentication → Providers → Google
3. ✅ Add redirect URLs including `http://138.197.31.8/auth/callback`
4. ✅ Save
5. ✅ Test by logging in again

**That's it!** OAuth should now redirect to your app correctly.

