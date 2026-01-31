# PillBow - Testing Guide

> **Purpose:** Complete testing documentation including test cases, automated tests, and testing procedures.

---

## Quick Test

**Start app:**

```bash
npm run dev
# Opens at http://localhost:3001
```

**Run automated tests:**

1. Open http://localhost:3001 in browser
2. Press `F12` → Console tab
3. Copy/paste contents of `test-runner.js`
4. Press Enter
5. Should see: ✅ Passed: 24 tests

---

## Test Categories

### 1. User Management Tests

#### TC-U01: Default User Creation

- **Steps:** Open app fresh (clear localStorage)
- **Expected:** Default user "Me" created automatically
- **Status:** [ ]

#### TC-U02: Add New Family Member

- **Steps:**
  1. Click user dropdown in header
  2. Click "Add Family Member"
  3. Select avatar, name "Mom", relationship "Parent"
  4. Click "Add"
- **Expected:** New user in dropdown
- **Status:** [ ]

#### TC-U03: Switch Between Users

- **Steps:** Switch from User A to User B
- **Expected:** Page reloads, shows User B data
- **Status:** [ ]

#### TC-U04: User Data Isolation

- **Steps:** Add med as User A, switch to User B
- **Expected:** User B has no medications
- **Status:** [ ]

---

### 2. Medication Management Tests

#### TC-M01: Add Medication (Manual)

- **Steps:**
  1. Click + FAB button
  2. Select "Manual Entry"
  3. Fill: name, strength, times, start date
  4. Click "Add Medicine"
- **Expected:** Med appears on timeline from start date forward
- **Status:** [ ]

#### TC-M02: Add Event (Doctor Appointment)

- **Steps:**
  1. Click + FAB
  2. Select doctor/hospital shape
  3. Fill event details
  4. Verify button says "Add Event" not "Add Medicine"
- **Expected:** Event added, no strength field shown
- **Status:** [ ]

#### TC-M03: Edit Medication (Today Only)

- **Steps:**
  1. Open ActivePillboxCard for today
  2. Click pill → Edit
  3. Change time from 08:00 → 09:00
  4. Select "Today only"
- **Expected:** Only today's time changes, tomorrow unchanged
- **Status:** [ ]

#### TC-M04: Edit Medication (From Today Forward)

- **Steps:**
  1. Edit medication
  2. Change dosage
  3. Select "From today forward"
- **Expected:** Today + all future dates updated
- **Status:** [ ]

#### TC-M05: Stop Medication

- **Steps:**
  1. Click pill → Edit → Stop
  2. Select "Stop from tomorrow"
- **Expected:** endDate set to today, disappears from tomorrow
- **Status:** [ ]

#### TC-M06: Delete Medication

- **Steps:**
  1. Click pill → Edit → Delete
  2. Confirm deletion
- **Expected:** Removed from all dates, logs cleared
- **Status:** [ ]

---

### 3. Dose Status Tracking Tests

#### TC-D01: Mark Dose Taken

- **Steps:**
  1. Open today's card
  2. Click pill toggle ON
- **Expected:** Pill shows green checkmark, status = "Taken"
- **Status:** [ ]

#### TC-D02: Mark Dose Skipped

- **Steps:**
  1. Open today's card
  2. Click pill toggle OFF
- **Expected:** Pill shows red X, status = "Skipped"
- **Status:** [ ]

#### TC-D03: Cannot Edit Past Dates

- **Steps:**
  1. Scroll to yesterday
  2. Try to toggle dose status
- **Expected:** No toggle available, read-only
- **Status:** [ ]

#### TC-D04: Future Date Tracking

- **Steps:**
  1. Scroll to tomorrow
  2. Toggle pill status
- **Expected:** Can mark taken/skipped for future dates
- **Status:** [ ]

---

### 4. Timeline & UI Tests

#### TC-T01: Scroll to Today

- **Steps:**
  1. Scroll far up/down
  2. Click "Today" button in header
- **Expected:** Timeline scrolls to today's card
- **Status:** [ ]

#### TC-T02: InactivePillboxCard Display

- **Steps:** View inactive day cards
- **Expected:**
  - Shows date, colored time bars
  - Shows unique med type icons (💊💉🪥)
  - Shows badge with icon count
- **Status:** [ ]

#### TC-T03: ActivePillboxCard Display

- **Steps:** Click any day card
- **Expected:**
  - Opens as modal
  - Shows TimeSlotView (1-5 slots) or ListView (6+)
  - Can toggle doses if editable
- **Status:** [ ]

#### TC-T04: Time Slice Icons

- **Steps:** View day with multiple meds at different times
- **Expected:** Each time bar shows relevant type icons
- **Status:** [ ]

---

### 5. PWA & Update Tests

#### TC-P01: Service Worker Registration

- **Steps:**
  1. Open app
  2. DevTools → Application → Service Workers
- **Expected:** sw.js registered and active
- **Status:** [ ]

#### TC-P02: Update Detection

- **Steps:**
  1. Build v1: `npm run build && npm run preview`
  2. Make code change
  3. Build v2: `npm run build`
  4. Refresh preview page
  5. Wait 60 seconds
- **Expected:** Update banner appears at top
- **Status:** [ ]

#### TC-P03: Update Application

- **Steps:**
  1. See update banner
  2. Click "Update Now"
- **Expected:** Page reloads, new version active
- **Status:** [ ]

---

### 6. Data Persistence Tests

#### TC-S01: localStorage Save

- **Steps:**
  1. Add medication
  2. Close browser tab
  3. Reopen app
- **Expected:** Medication still present
- **Status:** [ ]

#### TC-S02: User Data Namespace

- **Steps:**
  1. Check localStorage for keys
- **Expected:**
  - `pillbow_app_data` (active user)
  - `pillbow_data_{userId}` (per user backup)
- **Status:** [ ]

#### TC-S03: Data Migration

- **Steps:**
  1. Manually create old format medication (no timesOfDay)
  2. Reload app
- **Expected:** Auto-migrated to new format
- **Status:** [ ]

---

### 7. Form Validation Tests

#### TC-F01: Required Fields

- **Steps:**
  1. Open Add Medication
  2. Leave name empty
  3. Try to submit
- **Expected:** Button disabled or error shown
- **Status:** [ ]

#### TC-F02: Date Range Validation

- **Steps:**
  1. Set startDate > endDate
- **Expected:** Validation error
- **Status:** [ ]

#### TC-F03: Event Shape Validation

- **Steps:**
  1. Select hospital/doctor shape
  2. Verify "Strength" field hidden
  3. Verify label says "Event Name"
- **Expected:** UI adapts for event types
- **Status:** [ ]

---

### 8. Medication Schedule Tests

#### TC-SC01: Multiple Times Per Day

- **Steps:**
  1. Add med with 3 times: 08:00, 14:00, 20:00
- **Expected:** 3 pills shown in ActivePillboxCard
- **Status:** [ ]

#### TC-SC02: Days of Week Filter

- **Steps:**
  1. Add med with daysOfWeek: [1,3,5] (Mon/Wed/Fri)
  2. Check Tuesday
- **Expected:** Med not shown on Tuesday
- **Status:** [ ]

#### TC-SC03: Date Range

- **Steps:**
  1. Add med: start Jan 1, end Jan 10
  2. Check Jan 11
- **Expected:** Med not shown after end date
- **Status:** [ ]

---

## Automated Test Coverage

Run `test-runner.js` in console for:

✅ **Storage & Data Service (8 tests)**

- Default data structure
- Add/update/delete medications
- Dose status tracking
- Day log management

✅ **Date Handling (4 tests)**

- isDateEditable validation
- Past/future date checks
- Date range filtering

✅ **UI State Management (4 tests)**

- Zustand store initialization
- User switching
- Modal stack

✅ **Medication Scheduling (8 tests)**

- timesOfDay array handling
- daysOfWeek filtering
- Date range boundaries
- Edit scope (today only vs forward)

**Total: 24 automated tests**

---

## Performance Tests

### Load Time

- **Metric:** Initial paint < 1s
- **Tool:** Chrome DevTools Lighthouse
- **Target:** 90+ performance score

### Scroll Performance

- **Test:** Scroll rapidly through 90-day timeline
- **Expected:** Smooth 60fps, no jank

### PWA Score

- **Tool:** Lighthouse PWA audit
- **Target:** All checks green

---

## Browser Compatibility

Tested on:

- ✅ Chrome 120+
- ✅ Edge 120+
- ✅ Firefox 121+
- ✅ Safari 17+ (iOS)
- ✅ Mobile Chrome (Android)

---

## Known Issues & Edge Cases

### Issue: Past Date Editing

- **Symptom:** UI shows toggles on past dates
- **Resolution:** Check `isDateEditable()` enforcement
- **Status:** Fixed

### Issue: Service Worker Stale Cache

- **Symptom:** Users see old version after deployment
- **Resolution:** Update banner now prompts within 60s
- **Status:** Fixed (v0.0.2)

---

## Test Data Setup

**Load sample data:**

```javascript
// In browser console
localStorage.clear();
location.reload();
// Click "Try with Sample Vitamins" in onboarding
```

**Manual test user:**

```javascript
const testUser = {
  id: "test123",
  name: "Test User",
  relationship: "Self",
  avatar: "👤",
  color: "blue"
};
```

---

_Last updated: January 31, 2026_
