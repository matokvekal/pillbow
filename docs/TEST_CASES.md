# PillBow App - Comprehensive Test Cases

## Test Environment
- URL: http://localhost:3003
- Browser: Chrome/Edge/Firefox
- Date of Testing: 2026-01-28

---

## 1. USER MANAGEMENT TESTS

### TC-U01: Default User Creation
- **Steps:** Open app fresh (clear localStorage first)
- **Expected:** Default user "Me" is created automatically
- **Status:** [ ]

### TC-U02: Add New Family Member
- **Steps:**
  1. Click user dropdown in header
  2. Click "Add Family Member"
  3. Select avatar emoji
  4. Enter name "Mom"
  5. Select relationship "Parent"
  6. Click "Add"
- **Expected:** New user appears in dropdown
- **Status:** [ ]

### TC-U03: Switch Between Users
- **Steps:**
  1. Add a second user
  2. Click user dropdown
  3. Select different user
- **Expected:** Page reloads, data changes to selected user
- **Status:** [ ]

### TC-U04: User Data Isolation
- **Steps:**
  1. Add medication as User A
  2. Switch to User B
  3. Check medications
- **Expected:** User B has no medications (separate data)
- **Status:** [ ]

### TC-U05: Remove User
- **Steps:**
  1. Have multiple users
  2. Go to settings
  3. Remove a non-active user
- **Expected:** User removed, their data deleted
- **Status:** [ ]

---

## 2. MEDICATION CRUD TESTS

### TC-M01: Add Medication - Manual (Basic)
- **Steps:**
  1. Click "+" FAB button
  2. Select "Add Manually"
  3. Enter name: "Aspirin"
  4. Enter strength: "100" mg
  5. Select Morning time
  6. Keep default duration (Ongoing)
  7. Select blue color
  8. Select round shape
  9. Click "Add Medicine"
- **Expected:** Medication added, appears in timeline for today
- **Status:** [ ]

### TC-M02: Add Medication - Multiple Times
- **Steps:**
  1. Add medication with Morning, Noon, Evening selected
- **Expected:** Medication shows 3 times per day in timeline
- **Status:** [ ]

### TC-M03: Add Medication - Custom Time
- **Steps:**
  1. In Manual Add, click "Add custom time"
  2. Enter "14:30"
  3. Click Add
- **Expected:** Custom time appears in selected times
- **Status:** [ ]

### TC-M04: Add Medication - With End Date
- **Steps:**
  1. Add medication with "7 days" duration
- **Expected:** End date shown, medication won't appear after 7 days
- **Status:** [ ]

### TC-M05: Add Medication - Custom End Date
- **Steps:**
  1. Click "Pick end date"
  2. Select date from calendar
  3. Save medication
- **Expected:** Custom end date saved correctly
- **Status:** [ ]

### TC-M06: View Medication Details
- **Steps:**
  1. Click on a medication in timeline
  2. View detail sheet
- **Expected:** All medication info displayed correctly
- **Status:** [ ]

### TC-M07: Edit Medication - Change Strength
- **Steps:**
  1. Open medication detail
  2. Click Edit
  3. Change strength value
  4. Save
- **Expected:** Strength updated in all views
- **Status:** [ ]

### TC-M08: Edit Medication - Change Times
- **Steps:**
  1. Edit medication
  2. Add/remove times of day
  3. Save
- **Expected:** Times updated, doses adjusted
- **Status:** [ ]

### TC-M09: Stop Medication - Today
- **Steps:**
  1. Open medication detail
  2. Click "Stop Taking"
  3. Select "Stop Today"
  4. Confirm
- **Expected:** Medication end date set to today
- **Status:** [ ]

### TC-M10: Stop Medication - Tomorrow
- **Steps:**
  1. Open medication detail
  2. Click "Stop Taking"
  3. Select "Stop Tomorrow"
- **Expected:** Medication end date set to tomorrow
- **Status:** [ ]

---

## 3. DOSE TRACKING TESTS

### TC-D01: Mark Dose as Taken
- **Steps:**
  1. Open today's card
  2. Click checkmark button on a dose
- **Expected:** Dose marked green, status = TAKEN
- **Status:** [ ]

### TC-D02: Mark Dose as Skipped
- **Steps:**
  1. Click taken dose again (toggle)
- **Expected:** Dose unmarked, status returns to PENDING
- **Status:** [ ]

### TC-D03: Today Only Editable
- **Steps:**
  1. Click on a past day
  2. Try to mark dose
- **Expected:** Checkmark disabled, cannot change status
- **Status:** [ ]

### TC-D04: Future Days Read-Only
- **Steps:**
  1. Click on a future day
  2. Try to mark dose
- **Expected:** Checkmark disabled, locked indicator shown
- **Status:** [ ]

### TC-D05: All Doses Taken - Visual
- **Steps:**
  1. Mark all doses for a time slot as taken
- **Expected:** Green checkmark appears on time slot header
- **Status:** [ ]

### TC-D06: Sound on Status Change
- **Steps:**
  1. Ensure sound is enabled in settings
  2. Mark dose as taken
- **Expected:** Notification sound plays
- **Status:** [ ]

---

## 4. VALIDATION TESTS

### TC-V01: Medication Name Required
- **Steps:**
  1. Try to save medication without name
- **Expected:** Save button disabled, error shown
- **Status:** [ ]

### TC-V02: Medication Name Min Length
- **Steps:**
  1. Enter single character name "A"
- **Expected:** Save button disabled (need 2+ chars)
- **Status:** [ ]

### TC-V03: At Least One Time Required
- **Steps:**
  1. Try to deselect all times
- **Expected:** Cannot remove last time, at least one stays selected
- **Status:** [ ]

### TC-V04: Strength Numeric Only
- **Steps:**
  1. Enter letters in strength field
- **Expected:** Only numbers accepted
- **Status:** [ ]

### TC-V05: Custom Time Format
- **Steps:**
  1. Add custom time with valid format (HH:MM)
- **Expected:** Time accepted and added
- **Status:** [ ]

### TC-V06: Import File Validation
- **Steps:**
  1. Try to import invalid JSON file
- **Expected:** Error message, import fails gracefully
- **Status:** [ ]

### TC-V07: Import Missing Fields
- **Steps:**
  1. Import JSON without medications array
- **Expected:** Error message about invalid format
- **Status:** [ ]

---

## 5. DATA PERSISTENCE TESTS

### TC-P01: Data Survives Reload
- **Steps:**
  1. Add medication
  2. Refresh page (F5)
- **Expected:** Medication still present
- **Status:** [ ]

### TC-P02: Dose Status Persists
- **Steps:**
  1. Mark dose as taken
  2. Refresh page
- **Expected:** Dose still marked as taken
- **Status:** [ ]

### TC-P03: User Selection Persists
- **Steps:**
  1. Switch to different user
  2. Refresh page
- **Expected:** Same user still selected
- **Status:** [ ]

### TC-P04: Settings Persist
- **Steps:**
  1. Toggle sound setting
  2. Refresh page
- **Expected:** Setting remains as changed
- **Status:** [ ]

---

## 6. EXPORT/IMPORT TESTS

### TC-E01: Export Data
- **Steps:**
  1. Go to Settings
  2. Click "Backup Data" / Export
  3. Save file
- **Expected:** JSON file downloads with name `pillbow-backup-YYYY-MM-DD.json`
- **Status:** [ ]

### TC-E02: Export Contains All Data
- **Steps:**
  1. Export data
  2. Open JSON file
- **Expected:** Contains medications[], dayLogs[], settings{}
- **Status:** [ ]

### TC-E03: Import Valid Backup
- **Steps:**
  1. Export data
  2. Clear all data / switch user
  3. Import the backup file
- **Expected:** All data restored correctly
- **Status:** [ ]

### TC-E04: Import Confirmation
- **Steps:**
  1. Click Import
  2. Select file
- **Expected:** Confirmation dialog appears before overwriting
- **Status:** [ ]

### TC-E05: Import Invalid File
- **Steps:**
  1. Try to import a non-JSON file
- **Expected:** Error message, no data changed
- **Status:** [ ]

### TC-E06: Import Corrupted JSON
- **Steps:**
  1. Create file with invalid JSON syntax
  2. Try to import
- **Expected:** Error message about parsing failure
- **Status:** [ ]

---

## 7. UI/NAVIGATION TESTS

### TC-N01: Scroll to Today
- **Steps:**
  1. Scroll away from today
  2. Click "Today" button
- **Expected:** Timeline scrolls to today's card
- **Status:** [ ]

### TC-N02: Open Day Card
- **Steps:**
  1. Click on any day card
- **Expected:** Expanded view opens with time slots
- **Status:** [ ]

### TC-N03: Close Day Card
- **Steps:**
  1. Open day card
  2. Click X button
- **Expected:** Card closes, returns to timeline
- **Status:** [ ]

### TC-N04: Modal Stack - Back Button
- **Steps:**
  1. Open day card
  2. Click medication
  3. Click back arrow
- **Expected:** Returns to day card (not closes all)
- **Status:** [ ]

### TC-N05: Settings Navigation
- **Steps:**
  1. Click settings icon
  2. Navigate through settings
  3. Close settings
- **Expected:** Smooth navigation, returns to timeline
- **Status:** [ ]

### TC-N06: Manage Medications View
- **Steps:**
  1. Go to Settings
  2. Click "Manage Medications"
- **Expected:** List of all medications grouped by status
- **Status:** [ ]

### TC-N07: Time Slot Layout - 3 Columns
- **Steps:**
  1. Open day with 3 or fewer time slots
- **Expected:** Slots displayed side by side (3 per row)
- **Status:** [ ]

### TC-N08: Time Slot Layout - 6 Slots
- **Steps:**
  1. Have medication with 5-6 times/day
  2. Open that day
- **Expected:** 3 slots top row, remaining in second row
- **Status:** [ ]

### TC-N09: Expanded Slot Position
- **Steps:**
  1. Open day with multiple slots
  2. Click to expand a slot
- **Expected:** Other slots stay in place, expanded content below
- **Status:** [ ]

---

## 8. EDGE CASES

### TC-EC01: Empty State - No Medications
- **Steps:**
  1. New user with no medications
  2. View timeline
- **Expected:** Helpful empty state message
- **Status:** [ ]

### TC-EC02: Medication Ending Soon
- **Steps:**
  1. Add medication ending in 3 days
  2. View in Manage section
- **Expected:** "Ending Soon" badge appears
- **Status:** [ ]

### TC-EC03: Last Day of Medication
- **Steps:**
  1. Add medication ending today
  2. View timeline
- **Expected:** "Last Day" indicator on card
- **Status:** [ ]

### TC-EC04: Completed Medication
- **Steps:**
  1. View past medication that has ended
- **Expected:** Shows as completed/ended, grayed out
- **Status:** [ ]

### TC-EC05: Very Long Medication Name
- **Steps:**
  1. Add medication with very long name
- **Expected:** Name truncates properly, doesn't break layout
- **Status:** [ ]

### TC-EC06: Multiple Medications Same Time
- **Steps:**
  1. Add 3+ medications for same time slot
- **Expected:** All pills visible in slot, scrollable if needed
- **Status:** [ ]

---

## 9. SCAN/PHOTO TESTS (Mock)

### TC-S01: Open Scan Screen
- **Steps:**
  1. Click "+" button
  2. Select "Scan Package"
- **Expected:** Camera/scan interface opens
- **Status:** [ ]

### TC-S02: Mock Scan Result
- **Steps:**
  1. Use scan feature
  2. Take photo or use mock
- **Expected:** Mock medication data returned
- **Status:** [ ]

### TC-S03: Confirm Scanned Medication
- **Steps:**
  1. After scan, review details
  2. Confirm addition
- **Expected:** Medication added with scanned details
- **Status:** [ ]

---

## 10. RESPONSIVE DESIGN

### TC-R01: Mobile Width (375px)
- **Steps:**
  1. Resize browser to 375px width
  2. Navigate through app
- **Expected:** All elements usable, no horizontal scroll
- **Status:** [ ]

### TC-R02: Tablet Width (768px)
- **Steps:**
  1. Resize to tablet width
- **Expected:** Layout adapts properly
- **Status:** [ ]

### TC-R03: Desktop Width (1200px)
- **Steps:**
  1. Full desktop width
- **Expected:** Centered content, max-width respected
- **Status:** [ ]

---

## 11. GOOGLE AUTHENTICATION TESTS

### TC-G01: Sign-in Button Visibility
- **Steps:** Go to Settings -> Account section
- **Expected:** "Sign in with Google" card is visible for non-authenticated users
- **Status:** [ ]

### TC-G02: Google Info in Settings
- **Steps:** 
  1. (Simulate) Perform Google login
  2. View Settings -> Account
- **Expected:** Shows User Name, Email, and Profile Photo
- **Status:** [ ]

### TC-G03: Sign Out from Google
- **Steps:** Click "Sign Out" in Account section
- **Expected:** Session cleared, button reverts to "Sign in with Google"
- **Status:** [ ]

### TC-G04: UserSwitcher Avatar Sync
- **Steps:** Login with Google
- **Expected:** Header dropdown "ME" shows Google profile image instead of 👤
- **Status:** [ ]

### TC-G05: Dropdown Option Image
- **Steps:** Open UserSwitcher dropdown
- **Expected:** Google user option shows circular profile photo
- **Status:** [ ]

### TC-G06: Profile Sync Persistence
- **Steps:** Login, then reload page
- **Expected:** Google profile image persists in header and dropdown
- **Status:** [ ]

### TC-G07: Multiple Profiles - Auth State
- **Steps:** 
  1. User A (Me) logs in with Google
  2. Switch to User B (Family)
- **Expected:** User B does NOT show User A's Google info (isolation)
- **Status:** [ ]

### TC-G08: Sign-in Prompt Alert
- **Steps:** Click Google Sign-in card (without live config)
- **Expected:** Instructions/Alert about OAuth configuration appears
- **Status:** [ ]

---

## 12. APPOINTMENT & EVENT TESTS

### TC-A01: Icon Reaction - Label Change
- **Steps:** In Manual Add, click Doctor or Hospital icon
- **Expected:** "Medicine Name" label changes to "Event Name"
- **Status:** [ ]

### TC-A02: Icon Reaction - Field Hiding
- **Steps:** Select "Dental" or "Hospital" icon
- **Expected:** "Amount / Strength" section is hidden automatically
- **Status:** [ ]

### TC-A03: Schedule Toggle Visibility
- **Steps:** Select an "Event" (Appointment) icon
- **Expected:** "Schedule" section appears with "One-time" and "Recurring" buttons
- **Status:** [ ]

### TC-A04: One-time Appointment Logic
- **Steps:** 
  1. Select Event icon
  2. Select "One-time"
- **Expected:** Simple Date Picker appears labeled "Appointment Date"
- **Status:** [ ]

### TC-A05: Recurring Appointment - Weeks
- **Steps:** 
  1. Select Event icon
  2. Select "Recurring"
- **Expected:** "Every X weeks" number picker appears (1-4)
- **Status:** [ ]

### TC-A06: Recurring Appointment - Day
- **Steps:** In Recurring mode, select "Fr" (Friday)
- **Expected:** Friday is selected for the schedule
- **Status:** [ ]

### TC-A07: Event Slot Prompt
- **Steps:** View "When to take" section for Events
- **Expected:** Label is "In what time" (or similar specific prompt)
- **Status:** [ ]

### TC-A08: Duration Hiding for Events
- **Steps:** Select Appointment icon
- **Expected:** "For how long?" (Duration) section is hidden (scheduling handles it)
- **Status:** [ ]

### TC-A09: Add One-time Appointment
- **Steps:** 
  1. Create One-time Doctor appt for tomorrow
  2. Save
- **Expected:** Event appears ONLY in tomorrow's timeline
- **Status:** [ ]

### TC-A10: Add Weekly Appointment
- **Steps:** 
  1. Create Weekly Hospital appt (Every 1 week on Monday)
  2. Save
- **Expected:** Appears every Monday in the timeline
- **Status:** [ ]

### TC-A11: Switch Back to Medicine
- **Steps:** 
  1. Select Event icon (fields hide)
  2. Click "Pill" icon
- **Expected:** "Amount", "Duration", and "Medicine Name" return to UI
- **Status:** [ ]

### TC-A12: Appointment Preview in Card
- **Steps:** View Timeline with an Appointment
- **Expected:** Event Name shown clearly (e.g. "Doctor") without units
- **Status:** [ ]

---

## 13. AI FEATURE TESTS

### TC-AI01: Ask AI Button Visibility
- **Steps:** Open Manual Add form
- **Expected:** Sparkle icon "Ask AI" button visible next to Name field
- **Status:** [ ]

### TC-AI02: Registration Prompt (Unauth)
- **Steps:** 
  1. Ensure not signed in with Google
  2. Click "Ask AI" button
- **Expected:** Alert shows "Register with Google to get 50 credits"
- **Status:** [ ]

### TC-AI03: Priority Mention (Auth)
- **Steps:** 
  1. Sign in with Google
  2. Click "Ask AI"
- **Expected:** Alert shows "Ask AI is coming soon for your account"
- **Status:** [ ]

### TC-AI04: Button Style
- **Steps:** Hover over "Ask AI" button
- **Expected:** Smooth transition, slight lift, purple glow
- **Status:** [ ]

### TC-AI05: Input Constraints
- **Steps:** Click Ask AI inside the Name input wrapper
- **Expected:** Input doesn't lose focus, button fits in the "padding-right"
- **Status:** [ ]

---

## 14. REFILL ALERT IMPROVEMENTS

### TC-RA01: Alert Threshold - 3 Days
- **Steps:** Add med ending in 3 days
- **Expected:** NO "Refill soon" badge visible (Threshold is 2)
- **Status:** [ ]

### TC-RA02: Alert Threshold - 2 Days
- **Steps:** Add med ending in 2 days
- **Expected:** "Refill soon" badge appears on card
- **Status:** [ ]

### TC-RA03: Dismiss Button "X"
- **Steps:** View "Refill soon" badge
- **Expected:** Small "X" button visible on the right of the badge
- **Status:** [ ]

### TC-RA04: Permanent Dismissal
- **Steps:** 
  1. Click "X" on refill badge
  2. Badge disappears
  3. Reload page
- **Expected:** Badge does NOT return for that medication
- **Status:** [ ]

### TC-RA05: Dismissal Priority
- **Steps:** Dismiss alert for Med A but not Med B (both ending)
- **Expected:** Badge still shows for Med B
- **Status:** [ ]

### TC-RA06: Manage List Sync
- **Steps:** Dismiss refill in timeline
- **Expected:** Refill alert also hidden in "Manage Medications" list
- **Status:** [ ]

---

## 15. SMART FORM LOGIC (REACTIONS)

### TC-L01: Unit Auto-Adjust (Pills)
- **Steps:** Select "Pills" unit
- **Expected:** Amount value defaults to "1"
- **Status:** [ ]

### TC-L02: Unit Auto-Adjust (Drops)
- **Steps:** Select "Drops" unit
- **Expected:** Amount value defaults to "10"
- **Status:** [ ]

### TC-L03: Unit Auto-Adjust (Liquid)
- **Steps:** Select "Liquid" unit
- **Expected:** Amount value defaults to "5" (ml)
- **Status:** [ ]

### TC-L04: Start Date Phrasing
- **Steps:** View Start Date section
- **Expected:** Label is "Start Date" (Professional English)
- **Status:** [ ]

### TC-L05: Start Date Custom Toggle
- **Steps:** Click "Pick Date" in Start Date
- **Expected:** Calendar opens, previous "Today/Tomorrow" options unselect
- **Status:** [ ]

### TC-L06: Form Reset on Icon Switch
- **Steps:** 
  1. Enter name "Tylenol"
  2. Switch to Event icon
- **Expected:** Name persists, but mode-specific fields adjust
- **Status:** [ ]

---

## 16. COMPREHENSIVE CLEAR DATA

### TC-C01: Wipe All Keys
- **Steps:** 
  1. Add Users, Meds, Google linkage
  2. Click "Clear All Data" in Settings
- **Expected:** localStorage is completely wiped of `pillbow_*` keys
- **Status:** [ ]

### TC-C02: Onboarding Reset
- **Steps:** 
  1. Clear all data
  2. Re-open app
- **Expected:** Onboarding screen showing "Welcome" (Dismissed state deleted)
- **Status:** [ ]

### TC-C03: Force Reload Sync
- **Steps:** Clear data
- **Expected:** Page reloads automatically to clear memory stores
- **Status:** [ ]

---

## 17. RECURRING EVENT EDGE CASES

### TC-RE01: Every 4 Weeks Calculation
- **Steps:** Set event to "Every 4 weeks" starting Jan 1st
- **Expected:** Next event shows on Jan 29th
- **Status:** [ ]

### TC-RE02: Multiple Days Recurring
- **Steps:** Try to select multiple days for a recurring event
- **Expected:** (Constraint Check) Current logic supports one day per weekly schedule
- **Status:** [ ]

### TC-RE03: Start Date in Past
- **Steps:** Set recurring event start date to 1 month ago
- **Expected:** Past instances populated in timeline (if relevant)
- **Status:** [ ]

---

## 18. UX MICRO-ANIMATIONS

### TC-UX01: Google Hover Effect
- **Steps:** Hover over Google sign-in card
- **Expected:** Card lifts slightly (transform), border glows blue
- **Status:** [ ]

### TC-UX02: AI Button Sparkle
- **Steps:** Look at AI button
- **Expected:** Sparkle icon (✨) is visible and clear
- **Status:** [ ]

### TC-UX03: Refill Dismiss Pulse
- **Steps:** Hover over "X" in refill badge
- **Expected:** Background darkens, cursor is pointer
- **Status:** [ ]

---

## Test Summary

| Category | Total | Passed | Failed | Blocked |
|----------|-------|--------|--------|---------|
| User Management | 5 | | | |
| Medication CRUD | 10 | | | |
| Dose Tracking | 6 | | | |
| Validation | 7 | | | |
| Data Persistence | 4 | | | |
| Export/Import | 6 | | | |
| UI/Navigation | 9 | | | |
| Edge Cases | 6 | | | |
| Scan/Photo | 3 | | | |
| Responsive | 3 | | | |
| **Google Auth** | **8** | | | |
| **Appointments** | **12** | | | |
| **AI Features** | **5** | | | |
| **Refills** | **6** | | | |
| **Smart Logic** | **6** | | | |
| **Clear Data** | **3** | | | |
| **Recur. Edge Cases**| **3** | | | |
| **UX Polish** | **3** | | | |
| **TOTAL** | **105** | | | |

---

## Issues Found

| ID | Severity | Description | Steps to Reproduce | Status |
|----|----------|-------------|-------------------|--------|
| BUG-001 | Medium | Import validation incomplete - only checked medications array, not dayLogs/settings | Import JSON with only medications[] | FIXED |
| BUG-002 | Low | "Start from when?" used awkward English phrasing | View Manual Add form | FIXED |
| BUG-003 | High | Clear All Data didn't remove user-specific keys | Click Clear All in Settings | FIXED |

---

## Notes
- Last Update: 2026-01-30 18:35
- Automated Tests: No (Manual validation required)
- Next Steps: Verify Appointment recurring scheduling calculations for 2026 leap years.
