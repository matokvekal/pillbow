# PillBow - Architecture & Design

> **Purpose:** Technical architecture overview for developers and agents working on the codebase.

## Quick Links

- **User Documentation:** [USER_GUIDE.md](USER_GUIDE.md)
- **Testing:** [TESTING.md](TESTING.md)
- **Future Plans:** [ROADMAP.md](ROADMAP.md)

---

## System Architecture

### Core Stack

- **Frontend:** React 19 + TypeScript + Vite 6
- **State Management:** Zustand (single global store)
- **Storage:** localStorage (user-namespaced keys)
- **Date Library:** date-fns
- **PWA:** vite-plugin-pwa with service worker

### Data Flow

1. User actions trigger Zustand store updates
2. Store mutations call `dataService.ts` functions
3. dataService reads/writes to localStorage
4. App.tsx increments `updateKey` to force re-render
5. Components read from store and dayLogs map

### Storage Architecture

- **Generic key:** `pillbow_app_data` (currently active user)
- **User-specific:** `pillbow_data_{userId}` (backup when switching)
- **Migration:** Auto-migrates old medication format on load
- **Future:** Replace localStorage with API calls for backend

---

## Component Architecture

### Hierarchy

```
App.tsx (root)
├── AppHeader (nav + user switcher)
├── TimelineContainer (vertical scroll)
│   ├── InactivePillboxCard (past/future days)
│   └── ActivePillboxCard (today, opened via modal)
│       ├── CardHeader
│       ├── TimeSlotView (1-5 time slots)
│       │   └── PillGraphic
│       └── ListView (6+ time slots)
├── AddMedication (modal flow)
│   ├── ScanScreen (AI image scan)
│   └── ManualAddFlow
├── MedicationEdit (edit/delete flow)
│   ├── ChangeFlow
│   └── StopFlow
└── SettingsView
```

### Key Principles

- **One component = one folder** with `.tsx`, `.css`, `index.ts`
- **Class-based CSS only** (no inline styles for React Native portability)
- **BEM naming:** `.component__element--modifier`
- **No CSS-in-JS frameworks**

---

## Data Model

### Core Types (types.ts)

**Medication**

```typescript
{
  id: string;
  name: string;
  strength?: string;
  dosage: string;
  dosesPerDay: number;
  timesOfDay: string[]; // ["08:00", "20:00"]
  startDate: string; // "YYYY-MM-DD"
  endDate?: string;
  color: string; // "blue", "green", etc.
  shape: string; // "capsule", "hospital", etc.
  daysOfWeek?: number[]; // [1,3,5] = Mon/Wed/Fri
}
```

**DoseRecord**

```typescript
{
  medicationId: string;
  time: string; // "08:00"
  status: "Taken" | "Skipped" | "Pending";
  takenAt?: string; // ISO timestamp
}
```

**DayLog**

```typescript
{
  date: string; // "YYYY-MM-DD"
  doses: DoseRecord[];
}
```

### Date Boundaries

- **Editable:** Today and future dates
- **Read-only:** Past dates (< today)
- **Function:** `isDateEditable(dateStr)` in dataService.ts
- **Edit scope:** "today only" or "from today forward"

---

## UI/UX Design

### Timeline Concept

- **Range:** 30 days back to 60 days forward
- **Cards:** InactivePillboxCard (compact) or ActivePillboxCard (expanded)
- **Visual:** Colored time-slice bars showing medication types
- **Icons:** Shape emoji (💊 💉 🪥 🩻 etc.) from `getShapeIcon()`

### Event Shapes vs Medications

- **Event types:** hospital (🚑), stethoscope (🩻), tooth (🪥)
- **Detection:** `isEventShape(shapeId)` from medFormConfig.ts
- **UI difference:**
  - Events hide "Strength" field
  - Labels say "Event Name" instead of "Medicine Name"
  - Buttons say "Add Event" instead of "Add Medicine"

### Accessibility

- **Contrast:** WCAG AAA (7:1 minimum)
- **Touch targets:** 48px × 48px minimum
- **Font sizes:** Large for elderly users
- **Color palette:** High-contrast defined in variables.css

---

## State Management

### Zustand Stores

**useUserStore** - Multi-user management

- Current user, user list, Google auth state
- Loads/saves per-user data
- Triggers `window.location.reload()` on switch

**useDayCardStore** - UI expansion state

- `expandedSlot`, `isManageListOpen`

**useModalStore** - Modal stack

- `pushModal()`, `popModal()`
- Used for ActivePillboxCard display

**useTimeSlotStore** - Time slot state

- Per-slot UI state

---

## Key Services

### dataService.ts

All CRUD operations:

- `loadAppData()`, `saveAppData()`
- `addMedication()`, `updateMedication()`
- `updateDoseStatus()`, `getDayLog()`
- `applyScheduleEdit()` (with scope handling)

### geminiService.ts

AI medication scanning via Google Gemini API

- Requires `GEMINI_API_KEY` in `.env.local`
- Returns medication data from photo

### googleAuthService.ts

Google auth simulation (localStorage-based)

- Production would use Google Identity Services

---

## Form Configuration

### Single Source of Truth: constants/medFormConfig.ts

**DO NOT hardcode these values in components:**

- `FORM_COLORS` - medication colors
- `FORM_SHAPES` - pill/event shapes
- `FORM_UNITS` - strength units (mg, ml, etc.)
- `FORM_DURATIONS` - preset duration options
- `FORM_TIME_PRESETS` - common times
- `EVENT_SHAPE_IDS` - which shapes are events

**Helpers:**

- `isEventShape(shapeId)` - check if event type
- `getShapeIcon(shapeId)` - get emoji icon

---

## PWA Configuration

### Service Worker (vite-plugin-pwa)

- **Type:** `registerType: 'prompt'` (user-controlled updates)
- **Cache:** Auto-cleanup of old versions
- **Update check:** Every 60 seconds
- **UI:** UpdateBanner component prompts user

### Cache Busting

- Build files have `[hash]` in filenames
- Service worker detects changes automatically
- Users see update banner within 60s of new deployment

---

## Development Conventions

### Must-Follow Rules

1. **Never mutate past dates** - check `isDateEditable()` first
2. **Always use date-fns** - never native Date for comparisons
3. **Store dates as ISO strings** - `"YYYY-MM-DD"`
4. **Get icons via `getShapeIcon()`** - never hardcode emoji
5. **Check event shapes** - use `isEventShape()` for label logic
6. **Increment updateKey** - after data mutations in App.tsx
7. **Use form config** - import from medFormConfig.ts, don't duplicate

### Path Alias

- `@/*` maps to project root (tsconfig + vite config)

### Environment Variables

- Exposed via Vite's `define` as `process.env.GEMINI_API_KEY`
- Set in `.env.local`

---

## Migration Paths

### Backend Integration

1. Replace localStorage calls with API endpoints
2. Keep storage abstraction in dataService
3. User switching still saves/loads namespaced data

### React Native

1. Swap `localStorage` ↔ `AsyncStorage`
2. Replace CSS with React Native styles
3. Component structure remains identical

---

_Last updated: January 31, 2026_
