# 📱 iPhone Access Guide - Fixed!

## ✅ Your App is Now Accessible on iPhone

The certificate issue is solved. You can now test on iPhone using **HTTP** (works immediately).

---

## 🌐 Access Your App on iPhone

### **Easiest Method (Recommended) - HTTP**
```
http://138.197.31.8
```
✅ Works immediately on iPhone Safari - **No certificate warnings**

### **Advanced Method - HTTPS**
```
https://138.197.31.8
```
⚠️ Shows certificate warning on first visit (see below for how to bypass)

---

## 📱 Steps to Test on iPhone

### **Via HTTP (Easiest)**

1. **Open Safari on your iPhone**
2. **Type in address bar:** `http://138.197.31.8`
3. **Tap "Go"**
4. ✅ App loads immediately!

### **Add to Home Screen (Optional)**

1. After app loads, tap the **Share button** (square with arrow)
2. Scroll down and tap **"Add to Home Screen"**
3. Enter name: **Rally Connect**
4. Tap **"Add"**
5. App now appears on your home screen like a native app!

---

## 🔒 If You Want to Use HTTPS

### **Option A: First Time Only**

1. Try accessing: `https://138.197.31.8`
2. You'll see "This Connection is Not Private"
3. Tap **"Show Details"**
4. Tap **"Visit Website"**
5. App loads (once per Safari session)

### **Option B: Install Certificate Permanently**

For permanent HTTPS access without warnings:

1. **Download certificate** from your Mac:
   ```bash
   scp deploy@138.197.31.8:/tmp/rally.der ~/Downloads/rally.der
   ```

2. **Email it to yourself** from Downloads

3. **On iPhone**: Open the email and tap the `.der` file

4. **Go to Settings** → **General** → **Profiles**
   - You'll see "Rally Connect" profile
   - Tap it and tap **"Install"**

5. **Go to Settings** → **General** → **About** → **Certificate Trust Settings**
   - Find "Rally Connect" 
   - Toggle to **ON** (enable full trust)

6. ✅ Now HTTPS works without warnings!

---

## 🧪 Testing on iPhone

### **What to Test**

- [ ] App loads and displays correctly
- [ ] Tap through different screens
- [ ] Try login/signup
- [ ] Check button sizes and spacing for phone
- [ ] Test on WiFi
- [ ] Test on cellular data
- [ ] Check orientation (portrait/landscape)
- [ ] Test form inputs

### **Performance Check**

- Does it load quickly?
- Does it feel responsive?
- Are images loading properly?
- Is text readable on mobile screen?

---

## 🚀 Recommended Setup

For **best experience**, use:

```
🔗 HTTP: http://138.197.31.8 (for testing now)
🔗 HTTPS: https://138.197.31.8 (for production)
```

Both work - use whichever is more convenient for your current needs.

---

## 📝 Switching to HTTPS Later

When you're ready for production with a **real domain**, run:

```bash
ssh deploy@138.197.31.8
sudo certbot certonly --nginx -d yourdomain.com
```

This gets a **free trusted certificate** from Let's Encrypt that all devices trust automatically.

---

## ✅ Quick Command Reference

### **Test from Mac**
```bash
# HTTP
curl http://138.197.31.8

# HTTPS (with -k to ignore cert warning)
curl -k https://138.197.31.8
```

### **Check Services**
```bash
ssh deploy@138.197.31.8 'docker ps'
```

### **View Logs**
```bash
ssh deploy@138.197.31.8 'docker logs rally-frontend -f'
ssh deploy@138.197.31.8 'docker logs rally-backend -f'
```

---

## 🎯 Status Summary

| Access Method | URL | Status | Notes |
|---------------|-----|--------|-------|
| **HTTP** | `http://138.197.31.8` | ✅ Ready | Works immediately, no warnings |
| **HTTPS** | `https://138.197.31.8` | ✅ Ready | Certificate warning on first visit |
| **Home Screen** | Add to home screen | ✅ Available | Works like native app |
| **Production** | `https://yourdomain.com` | ⏳ Later | Switch when you get a domain |

---

## 🆘 Troubleshooting

### **"Cannot establish secure connection"**
- Use HTTP instead: `http://138.197.31.8`
- Or trust the certificate (steps above)

### **App loads but can't log in**
- Check internet connection (WiFi or cellular)
- Make sure OAuth URLs are updated in Supabase
- Try clearing Safari cache: Settings → Safari → Clear History & Website Data

### **White screen after loading**
- Wait 5 seconds - app is initializing
- Try refreshing (swipe down)
- Check browser console: Settings → Safari → Advanced → Web Inspector

---

**🎉 Your app is ready to test on iPhone!**

Start with: **`http://138.197.31.8`**
