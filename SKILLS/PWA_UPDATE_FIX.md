# PWA Cache Update Fix - Deployment Guide

## Problem Solved

Users were seeing old cached versions of the app. This update ensures users automatically get the latest version without manual cache clearing.

## What Changed

### 1. **Automatic Update Detection**

- Service worker now detects when a new version is deployed
- Shows a prominent update banner to users
- Auto-reloads the app when user clicks "Update Now"

### 2. **Cache Busting**

- All build files now have unique hashes in filenames
- Old versions are automatically cleaned up
- Service worker configured with `cleanupOutdatedCaches: true`

### 3. **Update Check Interval**

- Checks for updates every 60 seconds
- Prompts user when new version is available
- No manual dev tools clearing needed

## Files Modified

- `vite.config.ts` - Added cache busting, improved service worker config
- `index.tsx` - Service worker registration with update checking
- `App.tsx` - Added update banner UI integration
- `package.json` - Version bumped to 0.0.2
- `components/UpdateBanner/` - New component for update notification

## Deployment Steps

### For Each Deployment:

1. **Update version** in `package.json`:

   ```json
   "version": "0.0.3"
   ```

2. **Update version.json** in `public/`:

   ```json
   {
     "version": "0.0.3",
     "buildDate": "2026-02-01",
     "description": "Description of changes"
   }
   ```

3. **Build the app**:

   ```bash
   npm run build
   ```

4. **Deploy the `dist/` folder** to your hosting provider

5. **Users will automatically see update banner** within 60 seconds of visiting

## How It Works

1. Service worker registers on first app load
2. Checks for updates every 60 seconds
3. When new service worker is found:
   - Update banner appears at top of screen
   - User clicks "Update Now"
   - App reloads with new version
   - Old cache is cleared automatically

## Testing

To test locally:

```bash
# Build and preview
npm run build
npm run preview
```

Open in browser, then:

1. Make a change to the code
2. Run `npm run build` again
3. Refresh the preview
4. You should see the update banner

## Important Notes

- **Don't use `registerType: 'autoUpdate'`** - This bypasses user control
- **Keep `registerType: 'prompt'`** - Gives users control over when to update
- **Cache cleanup is automatic** - No manual intervention needed
- **Version numbers help tracking** - Update them with each deployment

## Troubleshooting

### Users still see old version?

1. Check that version in `package.json` was updated
2. Verify `dist/` contains new build files with different hashes
3. Clear service worker manually in dev tools (Application → Service Workers → Unregister)
4. Hard reload: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Update banner not showing?

1. Service worker needs time to detect changes (up to 60 seconds)
2. Check browser console for service worker messages
3. Verify service worker is registered: Dev Tools → Application → Service Workers

### Build files not updating?

1. Delete `dist/` folder and rebuild: `rm -rf dist && npm run build`
2. Check Vite config has correct hash settings
3. Verify hosting provider isn't adding its own cache headers

## Future Enhancements

- Add version display in Settings view
- Show changelog when update banner appears
- Add "Skip this version" option
- Implement background update downloads
