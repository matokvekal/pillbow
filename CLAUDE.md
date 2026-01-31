# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **📁 Documentation:** All detailed markdown files, instructions, and technical documentation are located in the **SKILLS/** folder. This includes architecture docs, test cases, migration plans, and deployment guides.

## Project Overview

PillBow is a mobile-first PWA medication reminder and tracking app for elderly users. Built with React 19 + TypeScript + Vite 6, using Zustand for state management and localStorage for persistence. Designed for future React Native migration.

## Commands

```bash
npm run dev       # Vite dev server at http://localhost:3001
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

No test runner or linter is currently configured in package.json.

## Architecture

### Data Flow

All data persists to `localStorage` under key `pillbow_app_data` (generic working key). Per-user data is saved to `pillbow_data_{userId}` when switching users. The storage layer in `services/dataService.ts` is abstracted behind a `storage` object to enable React Native migration by swapping to AsyncStorage.

State management uses Zustand stores in `store/`:

- **useUserStore** - multi-user profile switching with Google auth support, saves/loads per-user data. Calls `window.location.reload()` on user switch to avoid stale data.
- **useDayCardStore** - UI expansion state for day cards (expandedSlot, isManageListOpen)
- **useModalStore** - modal stack management (pushModal/popModal)
- **useReminderStore** - reminder bell state: enabled, leadTimeMinutes (10/20/30/60), notifiedDoses Set, modal open/close. Persists to `pillbow_reminders` in localStorage.

`App.tsx` is the root component that generates the day list, loads data, and forces re-renders via an `updateKey` state counter after data mutations.

### Timeline Architecture

The core UI is a vertical scroll of day cards spanning 30 days back to 60 days forward (configured via `DAYS_BACK`/`DAYS_FORWARD` in `constants.tsx`). Each day renders as an **InactivePillboxCard** in the scrollable list. Clicking a card opens an **ActivePillboxCard** via the modal stack (`useModalStore.pushModal`).

InactivePillboxCard shows: date, colored time-slice preview bars with shape icons per slot (via `getShapeIcon()`), pill count, and status badges (ending-soon, last-day, ended). Each time slice displays the unique medication type icons for that slot (💊💉🪥 etc.), truncated to 1-2 icons + ".." when there are many slices (4+) or many types per slot (3+). ActivePillboxCard renders time slots via **TimeSlotView** (1-5 slots as a grid) or **ListView** (6+ slots).

The date boundary (`isDateEditable()` in dataService) is critical: past dates cannot be mutated.

### Data Model (types.ts)

- **Medication** - id, name, strength, dosage, timesOfDay[], startDate, endDate, color, shape, daysOfWeek[], refillDismissed
- **DoseRecord** - medicationId, time, status (Taken|Skipped|Pending), takenAt
- **DayLog** - date (ISO "YYYY-MM-DD"), doses[]
- **AppData** - medications[], dayLogs[], settings, lastUpdated, users[], currentUserId
- **UserProfile** - id, name, relationship, avatar, color, createdAt, plus optional Google auth fields (email, photoURL, isGoogleUser, googleId)

### Pill Shapes & Event Types

`PILL_SHAPES` in types.ts uses medical emoji icons: capsule (💊), syringe (💉), drops (💧), vitamin (🧴), stethoscope (🩻), hospital (🚑), tooth (🪥), heart (❤️), herb (🌿), eye (👁️).

Some shapes represent events rather than medications. `constants/medFormConfig.ts` defines `EVENT_SHAPE_IDS = ["hospital", "stethoscope", "tooth", "vet"]` — these hide the strength field in forms since they're appointments, not pills. Use `isEventShape(shapeId)` helper to check. All UI labels must adapt: "Medicine Name" / "Add Medicine" for pills, "Event Name" / "Add Event" for event shapes. This applies to ManualAddFlow, MedicationEditForm, and any future forms.

### Key Services

- `services/dataService.ts` - all CRUD operations, localStorage, date logic, medication migration
- `services/geminiService.ts` - Google Gemini API for medication image scanning (requires `GEMINI_API_KEY` in `.env.local`)
- `services/googleAuthService.ts` - Google auth simulation via localStorage (demo; production would use Google Identity Services)
- `services/reminderService.ts` - `getDueReminders()` pure logic: checks today's medication times vs current time within a configurable lead window

### Form Configuration

`constants/medFormConfig.ts` is the single source of truth for medication add/edit form options: colors (FORM_COLORS), shapes (FORM_SHAPES), strength units (FORM_UNITS), duration presets (FORM_DURATIONS), time presets (FORM_TIME_PRESETS), and day labels. Do not duplicate these values in component files.

### Onboarding Flow

New users (no medications, onboarding not dismissed) see a welcome modal with terms acceptance. They can load `MOCK_VITAMINS` sample data or add their own medication. Dismissal is tracked via `pillbow_onboarding_dismissed` in localStorage.

## Conventions

### Component Structure

Each component in its own folder with matching `.tsx`, `.css`, and `index.ts` files:

```
components/ComponentName/
  ComponentName.tsx
  ComponentName.css
  index.ts
```

### Styling

- Class-based CSS only (no inline styles, no CSS-in-JS) for React Native portability
- Medication colors defined in `styles/med-colors.css` (bg-blue-300, bg-green-300, etc.) and mirrored with hex values in `constants/medFormConfig.ts`
- Design tokens in `variables.css`: pill sizes (28-72px), icon sizes, touch targets, spacing, shadows
- Tailwind CDN loaded externally (not a build dependency)
- WCAG AAA compliance required: 7:1 contrast ratio minimum
- Touch targets minimum 48px x 48px

### Date Handling

- Always use `date-fns` for date operations, never native Date for comparisons
- Store dates as ISO strings: `"YYYY-MM-DD"`
- Check `isDateEditable(dateStr)` before allowing any mutation
- Medication edits use `applyScheduleEdit()` with scope: "today only" or "from today forward"
- Medications support `daysOfWeek` filtering (0=Sun through 6=Sat; undefined = every day)

### Path Alias

`@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).

### Environment Variables

Gemini API key is exposed to client code via Vite's `define` config as `process.env.GEMINI_API_KEY`. Set the value in `.env.local` as `GEMINI_API_KEY=your_key`.

## Common Pitfalls

- Data mutations to past dates are silently ignored; always check `isDateEditable()` first
- After data mutations, increment the `updateKey` counter in App.tsx to trigger re-render
- Old medication records may lack `timesOfDay`; the `migrateMedication()` function handles this on load
- User switching triggers `window.location.reload()`; do not expect in-memory state to survive a switch
- `timesOfDay` is an array supporting 1-5 entries; check before creating duplicates
- The generic localStorage key `pillbow_app_data` holds whichever user is currently active; per-user backup is at `pillbow_data_{userId}`
- Form config (colors, shapes, units) lives in `constants/medFormConfig.ts` — do not hardcode these in components
- All shape icons must come from `getShapeIcon()` in `types.ts` — never hardcode emoji icons in components
- When showing labels for event shapes (hospital, stethoscope, tooth), use "Event" not "Medicine" — check with `isEventShape()`

---

## PWA Cache Update Fix (January 31, 2026)

### Problem

Users were seeing old cached versions of the PWA app after deployments. They had to manually open dev tools and clear cache/hard reload.

### Solution Implemented

**1. Vite PWA Configuration Updates** ([vite.config.ts](vite.config.ts))

- Changed `registerType: 'autoUpdate'` → `'prompt'` for user-controlled updates
- Added `cleanupOutdatedCaches: true`, `skipWaiting: false`, `clientsClaim: false`
- Implemented build-time cache busting with hashed filenames in `rollupOptions`

**2. Service Worker with Update Detection** ([index.tsx](index.tsx))

- Uses `virtual:pwa-register` with `immediate: true`
- Periodic update checks every 60 seconds via `registration.update()`
- Callbacks for `onNeedRefresh()`, `onOfflineReady()`, `onRegisterError()`

**3. Update Banner Component**

- Created [UpdateBanner.tsx](components/UpdateBanner/UpdateBanner.tsx) and [UpdateBanner.css](components/UpdateBanner/UpdateBanner.css)
- Animated gradient banner with rotating icon
- "Update Now" button triggers `updateServiceWorker(true)` → auto-reload
- Mobile responsive, positioned at top with z-index 10000

**4. App Integration** ([App.tsx](App.tsx))

- Added `useRegisterSW` hook from `virtual:pwa-register/react`
- Tracks `needRefresh` state, conditionally renders `<UpdateBanner />`
- `handleUpdate()` calls `updateServiceWorker(true)` to install new SW and reload

**5. Version Tracking**

- Bumped [package.json](package.json) to `0.0.2`
- Created [public/version.json](public/version.json) for deployment metadata

**How it works:** SW detects new version → `needRefresh` becomes true → banner appears → user clicks → page reloads with latest code. No manual intervention needed.

**Testing:** Build twice with a visible change between builds; preview server will show update banner within 60s.

---

## PWA Mobile Update Fix (January 31, 2026) - v0.0.3

### Problem

Mobile devices were not receiving PWA updates even after new deployments to Netlify. Users had to manually clear site data to see new versions.

### Root Cause

**Duplicate service worker registrations** causing conflicts:

1. [index.tsx](index.tsx) - Had `registerSW()` with auto-reload on detection
2. [App.tsx](App.tsx) - Had `useRegisterSW()` hook with update banner UI

Both registrations competed, preventing proper update flow on mobile devices.

### Solution Implemented

**1. Removed Duplicate Registration** ([index.tsx](index.tsx))

- Deleted entire `registerSW()` call and logic from index.tsx
- Added comment: "PWA service worker registration is handled in App.tsx via useRegisterSW hook"
- Now only App.tsx manages service worker lifecycle

**2. Version Bump** ([package.json](package.json))

- `0.0.2` → `0.0.3`

**3. Documentation** ([MOBILE_UPDATE_FIX.md](MOBILE_UPDATE_FIX.md))

- Created troubleshooting guide for mobile PWA updates
- Includes immediate fixes (clear site data)
- Deployment verification steps
- Emergency service worker unregistration script

**How it works now:** Only one registration path (App.tsx) → service worker detects updates → banner appears consistently → user clicks "Update Now" → clean reload with new version.

**Mobile fix:** Users must clear site data once on their phone, then future updates will work automatically via the update banner.

---

## Medication Reminder Notifications (January 31, 2026)

### Overview

Bell icon in the header lets users enable medication reminders. Checks every 30 seconds for upcoming doses and alerts via sound, browser notification, and in-app toast.

### Architecture

- **`store/useReminderStore.ts`** — Zustand store for reminder state. Persists `enabled` and `leadTimeMinutes` to localStorage (`pillbow_reminders` key). `notifiedDoses` Set is session-only (resets on reload).
- **`services/reminderService.ts`** — Pure logic. `getDueReminders()` checks today's medications against current time. Returns doses where `now` is within `[doseTime - leadMinutes, doseTime)` and dose is still Pending.
- **`hooks/useReminderScheduler.ts`** — React hook used in App.tsx. Runs a 30-second `setInterval` when enabled. Triggers sound via `playNotificationSound()`, browser `Notification` when tab unfocused, and in-app toast when focused. Clears notified set at midnight.

### UI Components

- **`components/ReminderBell/`** — Circular button in AppHeader between UserSwitcher and Today button. Opacity 0.5 + gray border when inactive, full opacity + red border when active.
- **`components/ReminderModal/`** — Config overlay. Enable/disable toggle, lead time picker (10/20/30/60 min). Requests browser notification permission on enable (user gesture).
- **`components/ReminderToast/`** — Fixed top-center dark toast. Shows medication name + time. Auto-dismisses after 8 seconds.

### Header Layout

```
[ PillBow Logo ] [ UserSwitcher ] [ Bell ] [ Today ] [ Settings ]
```

### Integration Points

- **App.tsx**: `useReminderScheduler(medications)` hook + `<ReminderModal />` + `<ReminderToast />` rendering
- **AppHeader.tsx**: `<ReminderBell />` between UserSwitcher and Today button

### Notification Behavior

| Condition | Sound | Browser Notification | In-app Toast |
|-----------|-------|---------------------|--------------|
| Tab focused | Yes | No | Yes |
| Tab backgrounded | Yes | Yes (if permitted) | No |
| App closed | No | No | No |

### Battery / Memory

- Single 30s `setInterval`, cleared when disabled
- No web workers, no polling APIs, no DOM observers
- `notifiedDoses` Set: max ~20 entries/day
- Reminder settings are per-device (survive user switch, since notification permissions are per-browser)
