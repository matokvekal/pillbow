# PillBow AI Coding Instructions

## Project Overview

**PillBow** is a mobile-first medication reminder and tracking app built for elderly users. It uses React + TypeScript with Vite, Zustand for state management, and localStorage for data persistence. The app is designed to be easily portable to React Native in the future.

**Key Goals:**

- Help users know what medications to take today
- Track what was taken in the past
- Plan upcoming medication schedules
- Serve elderly users with high-contrast, large UI elements

## Essential Architecture

### Data Flow & Storage

**Data Persistence Layer** ([services/dataService.ts](services/dataService.ts)):

- All data persists via `localStorage` with key `pillbow_data`
- User-specific data is namespaced as `pillbow_data_{userId}`
- Storage is abstraction-friendly: replacing `localStorage` calls with `AsyncStorage` enables React Native migration
- Data structures auto-migrate on load (see `migrateMedication` function)

**State Management** (Zustand stores in [store/](store/)):

- **useUserStore**: Manages user switching (multi-user support). Handles loading/saving user-specific data from localStorage
- **useDayCardStore**: UI state for expanded time slots and manage list visibility
- **useModalStore**: Manages modal stack
- **useTimeSlotStore**: Time slot-specific state

### Component Hierarchy

**Core Timeline Architecture** ([components/TimelineContainer](components/TimelineContainer/)):

- Infinite vertical scroll of days (5 years back → 1 year forward, defined in [constants.tsx](constants.tsx#L1))
- Each day renders as either **InactivePillboxCard** (past) or **ActivePillboxCard** (today/future)
- InactivePillboxCard is read-only; displays dose status (green/orange/red from computed flags)
- ActivePillboxCard allows toggling doses and expanding to view medications

**Key Components:**

- **TimelineContainer**: Renders day cards, manages which day is expanded
- **ActivePillboxCard/InactivePillboxCard**: Individual day renderers
- **TimeSlotView**: Expandable time slot showing medications and dose status
- **AddMedication**: Flow for manual + AI scan-based medication entry
- **MedicationEdit**: Edit/delete medication with scope ("today only" or "forward")
- **UserSwitcher**: Multi-user profile switching

### Data Model

**Core Types** ([types.ts](types.ts)):

```typescript
Medication: id, name, strength, dosage, dosesPerDay, timesOfDay[], startDate, endDate, color, shape
DoseRecord: medicationId, time, status (Taken|Skipped|Pending), takenAt timestamp
DayLog: date (ISO), doses: DoseRecord[]
UserProfile: id, name, relationship, avatar, color, createdAt
AppData: medications[], dayLogs[], settings, lastUpdated
```

**Date Boundaries:**

- Past dates (< today): read-only, display computed status
- Today & future: fully editable (mark taken, change schedule, add/remove meds)
- Edit scope: "Today only" or "From today forward" (affects all future dates)

## Critical Developer Workflows

### Build & Run

```bash
npm install                # Install dependencies
npm run dev               # Start Vite dev server (http://localhost:5173)
npm run build             # Production build
npm run preview           # Preview production build
```

### Key Dependencies

- **date-fns**: Date manipulation (never use native Date for comparisons)
- **zustand**: Lightweight state management (no Redux)
- **classnames**: CSS class utility (used throughout)
- **@google/genai**: Gemini API for medication image scanning (optional, credit-based)

### Adding a Feature

1. **Define types first** in [types.ts](types.ts)
2. **Add data logic** in [services/dataService.ts](services/dataService.ts)
3. **Update Zustand store** if new UI state needed
4. **Create component** in [components/](components/) with `.tsx` and `.css` file
5. **Test date-based logic** carefully (editable vs read-only boundary)

## Project-Specific Conventions

### CSS & Styling

- **Class-based CSS** (not inline styles) in `.css` files matching component name
- **No CSS-in-JS frameworks** (design is portable to React Native)
- High contrast required for elderly users (WCAG AAA ≥ 7:1 contrast ratio)
- Large touch targets minimum 48px × 48px
- Color palette: use CSS classes like `bg-blue-300`, `bg-red-300` (defined in [variables.css](variables.css))

### Component Organization

Each component lives in its own folder:

```
components/ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.css
  └── index.ts (exports component for convenience)
```

### Date Handling

- Always use **date-fns** (imported in most files)
- ISO format strings for storage: `"YYYY-MM-DD"`
- `isDateEditable(dateStr)` function in dataService determines if past or not
- Compare with `format(new Date(), 'yyyy-MM-dd')` for today's date

### Medication Updates

- Changes to past medications are silently ignored (no mutation)
- Use `applyScheduleEdit()` in dataService with scope parameter for forward-looking changes
- `timesOfDay` is an array (supports 1–6 times per day)

## Cross-Component Communication Patterns

### User Switching Flow

1. User clicks profile in **UserSwitcher** component
2. `useUserStore.switchUser(userId)` called
3. Store saves current user data to namespaced localStorage key
4. Loads new user's data into generic `pillbow_app_data` key
5. `App.tsx` re-renders with new data via `loadAppData()`

### Adding a Medication (Manual & AI)

1. **AddMedication** component opens (modal)
2. User enters name, dose, times, start/end dates (manual) or AI scans image
3. On confirm: `addMedication()` called in dataService
4. For each date in range, ensures Part exists and inserts medicine
5. UI re-renders via state update in App.tsx

### Marking Dose Taken

1. User clicks toggle on TimeSlotView
2. `onStatusChange()` callback triggered
3. `updateDoseStatus()` in dataService updates DayLog
4. localStorage persisted immediately
5. UI re-renders via `updateKey` state increment in App.tsx

## Files to Know

**Service Layer:**

- [services/dataService.ts](services/dataService.ts) — All CRUD operations, localStorage wrangling, date logic
- [services/geminiService.ts](services/geminiService.ts) — AI medication scanning (optional)

**Store Definitions:**

- [store/useUserStore.ts](store/useUserStore.ts) — Multi-user management
- [store/useDayCardStore.ts](store/useDayCardStore.ts) — UI expansion state
- [store/useModalStore.ts](store/useModalStore.ts) — Modal stack

**Constants & Utilities:**

- [constants.tsx](constants.tsx) — Mock data, day range, notification settings
- [utils/audioAndFileUtils.ts](utils/audioAndFileUtils.ts) — Notifications, file I/O
- [types.ts](types.ts) — All TypeScript interfaces

**Entry Point:**

- [App.tsx](App.tsx) — Root component, day generation, data loading, view routing

## Common Pitfalls to Avoid

1. **Date comparisons**: Always use ISO strings in storage, convert with date-fns for logic
2. **Past-date editing**: Check `isDateEditable()` before allowing mutations
3. **localStorage exceptions**: Wrapped in try-catch; errors logged but don't crash app
4. **Component re-renders**: Use `updateKey` state increment to force refresh after data mutations
5. **User switching**: Ensure both `currentUserId` state AND localStorage key sync correctly
6. **Medication duplication**: Check `medicinesIndex` before creating new entries
7. **Missing migrations**: Old medication format lacks `timesOfDay` array; migration happens on load

## Future Extension Points

- **Backend**: Replace localStorage calls with API endpoints; user store handles switching
- **React Native**: Swap localStorage ↔ AsyncStorage, replace CSS with React Native styles
- **Notifications**: Already structured for local notifications; can extend to push
- **Wearable**: Timeline data structure easily surfaces to watch complications
- **Stock tracking**: Add `pillsRemaining` field to Medication type; extend UI

---

**Last updated:** January 2026  
**For questions about architecture**, refer to [Agent.md](../Agent.md) for comprehensive SRS.
