# ✅ Supabase OAuth Configuration - Final Steps

## What Needs to Be Fixed

### 1. **Site URL** (Currently wrong)
- **Current**: `http://localhost:3000` ❌
- **Should be**: `http://138.197.31.8` ✅

### 2. **Redirect URLs** (Need cleanup)
- Remove old/incorrect URLs
- Keep only these:

```
http://138.197.31.8/auth/callback
http://138.197.31.8:3000/auth/callback
https://138.197.31.8/auth/callback
https://138.197.31.8:3000/auth/callback
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback
```

---

## Step-by-Step Fix

### **Step 1: Update Site URL**

1. Go to: https://app.supabase.com
2. Select project: `godsuzfuwmitwtjqckdz`
3. Click **Authentication** (left sidebar)
4. Click **URL Configuration**
5. Find **"Site URL"** field (currently shows `http://localhost:3000`)
6. **Change it to**: `http://138.197.31.8`
7. Click **"Save changes"** (green button)

### **Step 2: Clean Up Redirect URLs**

In the same **URL Configuration** page:

1. Find **"Redirect URLs"** section
2. **Delete these old ones** (click the trash icon):
   - ❌ `http://10.0.0.2:4300/`
   - ❌ `http://10.0.0.2:4300/auth/callback`

3. **Keep these**:
   - ✅ `http://localhost:4300`
   - ✅ `http://localhost:4300/auth/callback`
   - ✅ `https://138.197.31.8/auth/callback`
   - ✅ `https://138.197.31.8:3000/auth/callback`

4. **Add if missing**:
   - ✅ `http://138.197.31.8/auth/callback`
   - ✅ `http://138.197.31.8:3000/auth/callback`

5. Click **"Save changes"**

---

## Final Configuration Should Look Like:

| Setting | Value |
|---------|-------|
| **Site URL** | `http://138.197.31.8` |
| **Redirect URLs** | See list below |

### Redirect URLs (complete list):
```
http://localhost:4300
http://localhost:4300/auth/callback
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback
http://138.197.31.8/auth/callback
http://138.197.31.8:3000/auth/callback
https://138.197.31.8/auth/callback
https://138.197.31.8:3000/auth/callback
```

---

## ✅ After Saving

1. **Clear browser cache** (Cmd+Shift+Delete on Mac)
2. **Or use incognito/private mode**
3. **Go to**: `http://138.197.31.8`
4. **Click "Sign in with Google"**
5. **After login**: Should redirect to your app correctly ✅

---

## 🧪 Test It

After updating:

1. Open `http://138.197.31.8` on your iPhone
2. Click "Sign in with Google"
3. Authenticate
4. Should redirect back to `http://138.197.31.8` with you logged in ✅

**Not** `localhost:3000/...` ❌

---

## Why This Works

- **Site URL**: Default redirect location (fallback)
- **Redirect URLs**: Allowed redirect endpoints after OAuth
- Supabase now knows: "Send users back to `138.197.31.8`, not `localhost`"

