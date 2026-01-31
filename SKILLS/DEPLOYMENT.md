# PWA Update Deployment Guide

## Quick Start

After implementing the PWA cache fix, users will now automatically see update prompts when you deploy new versions.

## How to Deploy a New Version

### 1. Bump Version

```powershell
# Manually update version in package.json
# Or use npm version command:
npm version patch  # 0.0.2 -> 0.0.3
npm version minor  # 0.0.3 -> 0.1.0
npm version major  # 0.1.0 -> 1.0.0
```

### 2. Build

```powershell
npm run build
```

This creates hashed filenames in `dist/` for automatic cache busting.

### 3. Deploy

Upload the `dist/` folder to your hosting provider:

**Netlify:**

```powershell
netlify deploy --prod --dir=dist
```

**Vercel:**

```powershell
vercel --prod
```

**GitHub Pages / Manual:**

- Upload all files from `dist/` to your web server
- Ensure `dist/index.html` is the entry point

### 4. Users See Update

Within 60 seconds of visiting the app:

1. Service Worker detects new version
2. Beautiful update banner appears at top
3. User clicks "Update Now"
4. App reloads with latest version
5. ✅ Done!

## Testing Updates Locally

```powershell
# Build current version
npm run build
npm run preview

# Visit http://localhost:4173 in browser

# Make a visible change (e.g., change header text in App.tsx)

# Build again
npm run build

# Refresh the preview page
# Within ~60 seconds, you should see the update banner appear
```

## Cache Headers (Optional)

For production hosting, add these HTTP headers to maximize performance:

### For HTML files:

```
Cache-Control: no-cache, must-revalidate
```

### For JS/CSS with [hash] in filename:

```
Cache-Control: public, max-age=31536000, immutable
```

### Netlify (\_headers file):

```
/index.html
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### Vercel (vercel.json):

```json
{
  "headers": [
    {
      "source": "/",
      "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Users still seeing old version?

1. Check service worker is registered:
   - Open DevTools → Application → Service Workers
   - Should see status "activated and running"

2. Force update check:
   - In DevTools → Application → Service Workers
   - Click "Update" button

3. Clear everything:
   - DevTools → Application → Clear storage → "Clear site data"
   - Hard reload: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Update banner not appearing?

- Check console for errors related to `virtual:pwa-register`
- Verify `vite-plugin-pwa` is installed: `npm ls vite-plugin-pwa`
- Ensure build completed without errors

### Service Worker not installing?

- Must be served over HTTPS (or localhost)
- Check browser console for registration errors
- Verify `sw.js` exists in `dist/` after build

## Monitoring

### Check if update prompt is working:

Add to your analytics:

```typescript
// In App.tsx, inside useRegisterSW callback
onNeedRefresh() {
  setNeedRefresh(true);
  // Track update prompt shown
  analytics.track('update_prompt_shown');
}
```

Track button clicks:

```typescript
const handleUpdate = () => {
  // Track user accepted update
  analytics.track("update_accepted");
  updateServiceWorker(true);
};
```

---

**Version:** 0.0.2  
**Last Updated:** January 31, 2026
