# PWA Mobile Update Fix - Immediate Action Required

## Problem

Your phone shows old version because there were **two conflicting service worker registrations** that prevented proper updates.

## Fixed (Code Changes)

✅ Removed duplicate SW registration from `index.tsx`
✅ Keeping only the proper one in `App.tsx` with update banner
✅ Version bumped to 0.0.3

---

## For Your Phone RIGHT NOW (Before Rebuilding)

### Option 1: Clear Everything (Recommended)

1. **Open your site on phone**
2. **Browser menu** → **Settings**
3. **Site settings** → **Clear & reset**
4. **Clear all site data** (cookies, cache, storage)
5. **Close browser completely**
6. **Reopen** and visit site again

### Option 2: Unregister Service Worker

1. **On phone**, visit: `chrome://inspect/#service-workers` (Chrome) or `about:debugging#workers` (Firefox)
2. Find your site
3. Tap **Unregister**
4. Hard reload page

### Option 3: Reinstall PWA

If installed as app:

1. **Long press** the app icon
2. **Remove from home screen**
3. **Open** in browser
4. **Clear site data** (Option 1)
5. **Reinstall** PWA

---

## Deploy New Version

```bash
# Build with fixed code
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

---

## After Deployment - Test on Phone

1. **Visit site** on phone
2. **Wait 60 seconds** (service worker checks for updates)
3. **Should see update banner** at top: "New version available!"
4. **Tap "Update Now"**
5. **Page reloads** with v0.0.3

---

## Why This Happened

**Problem:** `index.tsx` had this:

```typescript
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true); // Auto-reloaded immediately
  }
});
```

**AND** `App.tsx` had this:

```typescript
const { needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onNeedRefresh() {
    setNeedRefresh(true); // Shows banner
  }
});
```

**Result:** Two service workers fighting each other. The first one auto-reloaded before the second could show the banner, causing confusion and preventing proper updates on mobile.

**Fix:** Now only `App.tsx` registers the service worker with the update banner UI.

---

## How to Verify It's Working

### On Desktop (Test First)

```bash
npm run build
npm run preview
```

1. Open http://localhost:4173
2. Note the version in console
3. Make a visible change (e.g., change header text)
4. Run `npm run build` again
5. Refresh preview page
6. **Within 60 seconds:** Update banner should appear
7. Click "Update Now" → should reload with changes

### On Mobile

1. Visit your Netlify URL
2. Check browser console (if available)
3. Should see: `"Service Worker registered: /sw.js"`
4. Wait for next deployment
5. Within 60 seconds of visiting, should see update banner

---

## Netlify Cache Headers (Optional but Recommended)

Create `public/_headers` file:

```
/
  Cache-Control: no-cache, must-revalidate

/sw.js
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

This ensures:

- HTML is never cached (always fetches latest)
- Service worker file is never cached
- Assets with [hash] are cached forever (safe because hash changes)

---

## Emergency: Manually Unregister Service Worker

If phone still shows old version after everything:

**JavaScript console on phone:**

```javascript
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((reg) => {
    reg.unregister();
    console.log("Unregistered:", reg.scope);
  });
  alert("Service workers cleared. Reload page.");
});
```

Copy/paste into console and press Enter.

---

## Prevention for Future

**Always increment version** in `package.json` before deployment:

```bash
npm version patch  # 0.0.3 -> 0.0.4
npm run build
netlify deploy --prod --dir=dist
```

Service worker detects the new hashed filenames and prompts users automatically.

---

_Created: January 31, 2026_
_Issue: Duplicate SW registration preventing mobile updates_
_Status: FIXED in v0.0.3_
