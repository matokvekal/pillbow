# PillBow QA Test Cases Document

## Overview

**Application:** PillBow - Medication Management App
**Version:** 2.0
**Target Users:** Elderly users, caregivers, people with disabilities
**Total Test Cases:** 400+

### How to Use This Document

Test cases are numbered sequentially (TC-001 to TC-400+). Assign ranges to QA members or AI agents:
- Agent 1: TC-001 to TC-050
- Agent 2: TC-051 to TC-100
- etc.

### Test Case Format

```
TC-XXX: [Title]
Category: [Category]
Priority: [P1-Critical | P2-High | P3-Medium | P4-Low]
Preconditions: [Setup required]
Steps: [Numbered steps]
Expected Result: [What should happen]
```

---

# SECTION 1: TIMELINE VIEW (TC-001 to TC-050)

## 1.1 Timeline Display

### TC-001: Timeline loads on app start
**Category:** UI/Functional
**Priority:** P1-Critical
**Preconditions:** App installed, first launch
**Steps:**
1. Open the PillBow app
2. Wait for initial load
**Expected Result:** Timeline view displays with scrollable list of days

### TC-002: Today is visible and centered on load
**Category:** UI/UX
**Priority:** P1-Critical
**Preconditions:** App opened
**Steps:**
1. Open app
2. Observe initial scroll position
**Expected Result:** Today's date card is visible and centered in viewport

### TC-003: Past days display correctly
**Category:** UI/Functional
**Priority:** P2-High
**Preconditions:** App has historical data
**Steps:**
1. Scroll up from today
2. Observe past day cards
**Expected Result:** Past days show with correct dates, day names, and status indicators

### TC-004: Future days display correctly
**Category:** UI/Functional
**Priority:** P2-High
**Preconditions:** App has scheduled medications
**Steps:**
1. Scroll down from today
2. Observe future day cards
**Expected Result:** Future days show scheduled medications without status indicators

### TC-005: Day card shows correct day name
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Timeline visible
**Steps:**
1. Check any day card
2. Verify day name matches date
**Expected Result:** Monday shows for Monday dates, Tuesday for Tuesday, etc.

### TC-006: Day card shows correct date format
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Timeline visible
**Steps:**
1. Observe date display on cards
**Expected Result:** Date displays in readable format (e.g., "Jan 23" or "23")

### TC-007: Timeline scrolls smoothly
**Category:** Performance/UX
**Priority:** P2-High
**Preconditions:** Timeline loaded
**Steps:**
1. Scroll up and down rapidly
2. Observe scroll behavior
**Expected Result:** No lag, stuttering, or frame drops during scroll

### TC-008: Timeline handles 5 years of past data
**Category:** Performance
**Priority:** P2-High
**Preconditions:** App configured with 5 years back
**Steps:**
1. Scroll to oldest available date
2. Continue scrolling
**Expected Result:** App handles large date range without crashing

### TC-009: Timeline handles 1 year of future data
**Category:** Performance
**Priority:** P2-High
**Preconditions:** App configured with 1 year forward
**Steps:**
1. Scroll to furthest future date
**Expected Result:** Future dates display correctly up to 1 year

### TC-010: Day card tap opens day modal
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Timeline visible
**Steps:**
1. Tap any day card
**Expected Result:** Day detail modal/box opens showing that day's medications

## 1.2 Day Status Indicators

### TC-011: Green status for fully completed day
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Past day with all doses marked taken
**Steps:**
1. Find a past day where all doses were taken
2. Observe status indicator
**Expected Result:** Day card shows green status indicator

### TC-012: Orange status for partially completed day
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Past day with some doses marked taken
**Steps:**
1. Find a past day with partial completion
2. Observe status indicator
**Expected Result:** Day card shows orange/yellow status indicator

### TC-013: Red status for missed day
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Past day with no doses taken
**Steps:**
1. Find a past day with zero doses taken
2. Observe status indicator
**Expected Result:** Day card shows red status indicator

### TC-014: No status indicator for today
**Category:** UI
**Priority:** P3-Medium
**Preconditions:** View today's card
**Steps:**
1. Locate today's card in timeline
2. Check for status indicator
**Expected Result:** Today shows current progress, not final status

### TC-015: No status indicator for future days
**Category:** UI
**Priority:** P3-Medium
**Preconditions:** View future day cards
**Steps:**
1. Scroll to future days
2. Check for status indicators
**Expected Result:** Future days do not show completion status

## 1.3 Timeline Navigation

### TC-016: "Today" button scrolls to today
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** User scrolled away from today
**Steps:**
1. Scroll far into past or future
2. Tap "Today" button
**Expected Result:** Timeline smoothly scrolls to today's position

### TC-017: Today button is always visible
**Category:** UI/UX
**Priority:** P2-High
**Preconditions:** Timeline view active
**Steps:**
1. Scroll throughout timeline
2. Check Today button visibility
**Expected Result:** Today button remains visible/accessible at all scroll positions

### TC-018: Scroll position persists during session
**Category:** State
**Priority:** P3-Medium
**Preconditions:** User scrolled to specific date
**Steps:**
1. Scroll to specific date
2. Open and close settings
3. Return to timeline
**Expected Result:** Timeline returns to same scroll position

### TC-019: Day click when another day is open
**Category:** Functional
**Priority:** P2-High
**Preconditions:** One day modal is open
**Steps:**
1. Open day A modal
2. Click day B card
**Expected Result:** Day A modal closes, Day B modal opens

### TC-020: Double tap on day card
**Category:** UI/Edge Case
**Priority:** P3-Medium
**Preconditions:** Timeline visible
**Steps:**
1. Double-tap quickly on a day card
**Expected Result:** Modal opens once without glitches

---

# SECTION 2: DAY DETAIL MODAL (TC-021 to TC-070)

## 2.1 Modal Display

### TC-021: Day modal displays medication list
**Category:** UI/Functional
**Priority:** P1-Critical
**Preconditions:** Day has medications scheduled
**Steps:**
1. Tap day card
2. Observe modal content
**Expected Result:** All scheduled medications for that day are listed

### TC-022: Modal shows correct date header
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Modal open
**Steps:**
1. Open any day modal
2. Check header date
**Expected Result:** Header shows correct day name and date

### TC-023: Modal close button (X) works
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Modal open
**Steps:**
1. Open day modal
2. Click X close button
**Expected Result:** Modal closes, returns to timeline view

### TC-024: Modal backdrop click closes modal
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Modal open
**Steps:**
1. Open day modal
2. Click outside modal (on backdrop)
**Expected Result:** Modal closes

### TC-025: Modal shows time slots
**Category:** UI/Functional
**Priority:** P2-High
**Preconditions:** Medications have multiple time slots
**Steps:**
1. Open day with multi-time medications
**Expected Result:** Time slots displayed (e.g., 08:00, 12:00, 20:00)

### TC-026: Time slots in chronological order
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Day has multiple time slots
**Steps:**
1. Open day modal
2. Check time slot order
**Expected Result:** Times sorted earliest to latest

### TC-027: Modal scrollable when content overflows
**Category:** UI/UX
**Priority:** P2-High
**Preconditions:** Day has many medications
**Steps:**
1. Open day with many meds
2. Try scrolling within modal
**Expected Result:** Modal content scrolls, page behind does not

### TC-028: Modal displays dose count summary
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Modal open
**Steps:**
1. Open day modal
2. Look for dose count
**Expected Result:** Shows "X/Y DONE" or similar summary

### TC-029: Medication pill icon displays
**Category:** UI
**Priority:** P3-Medium
**Preconditions:** Medications in modal
**Steps:**
1. Open day modal
2. Observe medication entries
**Expected Result:** Each medication shows pill/icon representation

### TC-030: Medication color coding displays
**Category:** UI
**Priority:** P3-Medium
**Preconditions:** Medications have assigned colors
**Steps:**
1. Open day modal
**Expected Result:** Medications show their assigned colors

## 2.2 Dose Marking (Today)

### TC-031: Mark dose as taken (today)
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Today's modal open
**Steps:**
1. Open today's modal
2. Tap checkbox/toggle for a dose
**Expected Result:** Dose marked as taken, UI updates immediately

### TC-032: Unmark dose as not taken (today)
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Today with marked dose
**Steps:**
1. Open today's modal
2. Tap taken dose to unmark
**Expected Result:** Dose unmarked, returns to pending state

### TC-033: Marking dose persists after modal close
**Category:** State/Data
**Priority:** P1-Critical
**Preconditions:** Marked a dose
**Steps:**
1. Mark dose as taken
2. Close modal
3. Reopen modal
**Expected Result:** Dose still shows as taken

### TC-034: Marking dose updates timeline card
**Category:** UI/State
**Priority:** P2-High
**Preconditions:** Today visible in timeline
**Steps:**
1. Mark dose in today's modal
2. Close modal
3. Observe today's card
**Expected Result:** Card shows updated progress

### TC-035: Mark entire time slot as taken
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Time slot with multiple meds
**Steps:**
1. Click time slot checkmark (not individual med)
**Expected Result:** All medications in that slot marked taken

### TC-036: Audio feedback on dose marking
**Category:** UX
**Priority:** P3-Medium
**Preconditions:** Sound enabled
**Steps:**
1. Mark a dose as taken
**Expected Result:** Pleasant confirmation sound plays

### TC-037: Visual feedback on dose marking
**Category:** UI/UX
**Priority:** P2-High
**Preconditions:** None
**Steps:**
1. Mark a dose
**Expected Result:** Visual animation/highlight confirms action

### TC-038: Marking dose saves to localStorage
**Category:** Data/State
**Priority:** P1-Critical
**Preconditions:** None
**Steps:**
1. Mark dose as taken
2. Refresh browser/app
3. Check dose status
**Expected Result:** Dose status persisted across refresh

### TC-039: Batch mark all doses for today
**Category:** Functional
**Priority:** P3-Medium
**Preconditions:** Multiple pending doses
**Steps:**
1. If available, use "Mark all" function
**Expected Result:** All today's doses marked at once

### TC-040: Cannot mark future day doses
**Category:** Business Rule
**Priority:** P2-High
**Preconditions:** Future day modal open
**Steps:**
1. Open a future day's modal
2. Try to mark dose as taken
**Expected Result:** Action prevented or disabled

## 2.3 Past Days (Read-Only)

### TC-041: Past day doses not editable
**Category:** Business Rule
**Priority:** P1-Critical
**Preconditions:** Past day modal open
**Steps:**
1. Open a past day's modal
2. Try to change dose status
**Expected Result:** Cannot modify past dose records

### TC-042: Past day shows lock indicator
**Category:** UI
**Priority:** P3-Medium
**Preconditions:** Past day modal
**Steps:**
1. Open past day modal
**Expected Result:** Visual indicator (lock icon) shows day is locked

### TC-043: Past day edit button disabled
**Category:** UI/Functional
**Priority:** P2-High
**Preconditions:** Past day modal
**Steps:**
1. Open past day modal
2. Look for edit options
**Expected Result:** Edit/modify options disabled or hidden

### TC-044: Historical data displays accurately
**Category:** Data
**Priority:** P2-High
**Preconditions:** Has historical dose data
**Steps:**
1. Open past days
2. Verify dose records
**Expected Result:** Shows exact historical taken/not-taken records

### TC-045: Past day schedule changes prevented
**Category:** Business Rule
**Priority:** P1-Critical
**Preconditions:** Past day
**Steps:**
1. Open past day
2. Attempt to change medication schedule
**Expected Result:** Cannot modify past schedules

## 2.4 Modal Animations

### TC-046: Modal opens with animation
**Category:** UI/UX
**Priority:** P3-Medium
**Preconditions:** None
**Steps:**
1. Tap day card to open modal
**Expected Result:** Modal slides/fades in smoothly

### TC-047: Modal closes with animation
**Category:** UI/UX
**Priority:** P3-Medium
**Preconditions:** Modal open
**Steps:**
1. Close modal
**Expected Result:** Modal slides/fades out smoothly

### TC-048: Modal animation doesn't block interaction
**Category:** Performance
**Priority:** P2-High
**Preconditions:** None
**Steps:**
1. Open modal
2. Immediately try to interact
**Expected Result:** No delay in interaction capability

### TC-049: Rapid open/close doesn't cause glitches
**Category:** Edge Case
**Priority:** P2-High
**Preconditions:** None
**Steps:**
1. Rapidly open and close modal multiple times
**Expected Result:** No visual glitches or stuck states

### TC-050: Modal z-index correct (appears on top)
**Category:** UI
**Priority:** P2-High
**Preconditions:** None
**Steps:**
1. Open modal
2. Verify it's above all other content
**Expected Result:** Modal fully overlays timeline content

---

# SECTION 3: MEDICATION DETAIL SHEET (TC-051 to TC-100)

## 3.1 Detail Sheet Display

### TC-051: Detail sheet opens on medication click
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Day modal open with medications
**Steps:**
1. Open day modal
2. Click on a medication
**Expected Result:** Medication detail sheet opens

### TC-052: Detail sheet shows medication name
**Category:** UI/Data
**Priority:** P1-Critical
**Preconditions:** Detail sheet open
**Steps:**
1. Open medication detail
**Expected Result:** Medication name prominently displayed

### TC-053: Detail sheet shows strength/dosage
**Category:** UI/Data
**Priority:** P1-Critical
**Preconditions:** Detail sheet open
**Steps:**
1. Open medication detail
**Expected Result:** Shows strength (e.g., "500mg") and dosage (e.g., "1 tablet")

### TC-054: Detail sheet shows schedule
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Detail sheet open
**Steps:**
1. Open medication detail
**Expected Result:** Shows times per day (e.g., "2x daily")

### TC-055: Detail sheet shows time slots
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Detail sheet open
**Steps:**
1. Open medication detail
**Expected Result:** Shows specific times (e.g., "08:00, 20:00")

### TC-056: Detail sheet shows start date
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Medication has start date
**Steps:**
1. Open medication detail
**Expected Result:** Start date displayed in readable format

### TC-057: Detail sheet shows end date
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Medication has end date
**Steps:**
1. Open medication detail
**Expected Result:** End date displayed or "Ongoing" if no end

### TC-058: Detail sheet shows status badge
**Category:** UI
**Priority:** P2-High
**Preconditions:** Detail sheet open
**Steps:**
1. Open medication detail
**Expected Result:** Shows status (Active, Ending Soon, Completed)

### TC-059: "Ending soon" warning displays
**Category:** UI/UX
**Priority:** P2-High
**Preconditions:** Medication ends within 7 days
**Steps:**
1. Open medication ending soon
**Expected Result:** Warning indicator/badge shows

### TC-060: Detail sheet shows company name
**Category:** UI/Data
**Priority:** P4-Low
**Preconditions:** Medication has company info
**Steps:**
1. Open medication with company data
**Expected Result:** Company/manufacturer name displayed

## 3.2 Detail Sheet Actions

### TC-061: Edit button visible on detail sheet
**Category:** UI
**Priority:** P1-Critical
**Preconditions:** Detail sheet open
**Steps:**
1. Open medication detail
**Expected Result:** Edit button clearly visible

### TC-062: Edit button opens edit form
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Detail sheet open
**Steps:**
1. Click Edit button
**Expected Result:** Edit form/modal opens

### TC-063: Close button (X) closes detail sheet
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Detail sheet open
**Steps:**
1. Click X button
**Expected Result:** Detail sheet closes

### TC-064: Order button opens search
**Category:** Functional
**Priority:** P3-Medium
**Preconditions:** Detail sheet open
**Steps:**
1. Click Order button
**Expected Result:** Opens Google search for medication

### TC-065: Info button opens drug info
**Category:** Functional
**Priority:** P3-Medium
**Preconditions:** Detail sheet open
**Steps:**
1. Click Info button
**Expected Result:** Opens drug information search

### TC-066: Ask AI button opens Claude
**Category:** Functional
**Priority:** P3-Medium
**Preconditions:** Detail sheet open
**Steps:**
1. Click Ask AI button
**Expected Result:** Opens Claude.ai with medication query

### TC-067: Backdrop click closes detail sheet
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Detail sheet open
**Steps:**
1. Click outside detail sheet
**Expected Result:** Detail sheet closes

### TC-068: Detail sheet scrollable
**Category:** UI/UX
**Priority:** P2-High
**Preconditions:** Long content
**Steps:**
1. Open detail with lots of info
2. Scroll within sheet
**Expected Result:** Content scrolls within sheet

### TC-069: Instructions section displays
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Medication has instructions
**Steps:**
1. Open medication with instructions
**Expected Result:** Instructions text displayed

### TC-070: Notes section displays
**Category:** UI/Data
**Priority:** P3-Medium
**Preconditions:** Medication has notes
**Steps:**
1. Open medication with notes
**Expected Result:** Notes text displayed

---

# SECTION 4: MEDICATION EDIT FORM (TC-071 to TC-130)

## 4.1 Edit Form Display

### TC-071: Edit form displays all sections
**Category:** UI
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Open edit form
**Expected Result:** Shows Dosage, Schedule, Duration, Stop sections

### TC-072: Current medication values pre-filled
**Category:** UI/Data
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Open edit for existing medication
**Expected Result:** All fields show current medication values

### TC-073: Medication name/icon displayed
**Category:** UI
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Open edit form
**Expected Result:** Shows medication name and icon at top

### TC-074: Close button visible
**Category:** UI
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Look for close/cancel option
**Expected Result:** X or Cancel button clearly visible

### TC-075: Save button visible
**Category:** UI
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Look for save option
**Expected Result:** Save Changes button clearly visible

## 4.2 Dosage Section

### TC-076: Strength adjuster works (increase)
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Click + button on strength
**Expected Result:** Strength increases to next value

### TC-077: Strength adjuster works (decrease)
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Click - button on strength
**Expected Result:** Strength decreases to previous value

### TC-078: Strength minimum limit
**Category:** Validation
**Priority:** P2-High
**Preconditions:** Strength at minimum
**Steps:**
1. Click - when at 25mg
**Expected Result:** Cannot go below minimum, button disabled

### TC-079: Strength maximum limit
**Category:** Validation
**Priority:** P2-High
**Preconditions:** Strength at maximum
**Steps:**
1. Click + when at 1000mg
**Expected Result:** Cannot exceed maximum, button disabled

### TC-080: Strength change shows "was X" hint
**Category:** UI/UX
**Priority:** P3-Medium
**Preconditions:** Changed strength
**Steps:**
1. Change strength from original
**Expected Result:** Shows "was [original value]" text

## 4.3 Schedule Section (Times Per Day)

### TC-081: Times per day chips displayed
**Category:** UI
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Look at schedule section
**Expected Result:** Shows 1x, 2x, 3x, 4x, 5x, 6x options

### TC-082: Current times per day selected
**Category:** UI/Data
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Check schedule section
**Expected Result:** Current value highlighted/selected

### TC-083: Selecting different times per day
**Category:** Functional
**Priority:** P1-Critical
**Preconditions:** Edit form open
**Steps:**
1. Click different times option
**Expected Result:** Selection changes, chip highlights

### TC-084: Times change shows "was X" hint
**Category:** UI/UX
**Priority:** P3-Medium
**Preconditions:** Changed times
**Steps:**
1. Change times per day
**Expected Result:** Shows "was [original]x" text

### TC-085: Only one times option selectable
**Category:** UI/Validation
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click one option, then another
**Expected Result:** Only one selected at a time (radio behavior)

## 4.4 Start Date Section

### TC-086: Start date section displays
**Category:** UI
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Look for start date section
**Expected Result:** Start date options visible

### TC-087: "Today" quick option works
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click "Today" button
**Expected Result:** Start date set to current date

### TC-088: "Tomorrow" quick option works
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click "Tomorrow" button
**Expected Result:** Start date set to tomorrow

### TC-089: Custom date picker works
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click date input
2. Select custom date
**Expected Result:** Start date set to selected date

### TC-090: Start date validates (not in past)
**Category:** Validation
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Try to select past date for start
**Expected Result:** Appropriate handling (warn or prevent)

## 4.5 End Date Section

### TC-091: End date section displays
**Category:** UI
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Look for end date section
**Expected Result:** End date options visible

### TC-092: "7 days" quick option works
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click "7 days" button
**Expected Result:** End date set to start + 7 days

### TC-093: "14 days" quick option works
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click "14 days" button
**Expected Result:** End date set to start + 14 days

### TC-094: "30 days" quick option works
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click "30 days" button
**Expected Result:** End date set to start + 30 days

### TC-095: "Ongoing" option works
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click "Ongoing" button
**Expected Result:** End date set to null (no end)

### TC-096: Custom days adjuster (+1)
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click +1 button
**Expected Result:** Adds 1 day to end date

### TC-097: Custom days adjuster (-1)
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click -1 button
**Expected Result:** Subtracts 1 day from end date

### TC-098: Custom days adjuster (+7)
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click +7 button
**Expected Result:** Adds 7 days to end date

### TC-099: Custom days adjuster (-7)
**Category:** Functional
**Priority:** P2-High
**Preconditions:** Edit form open
**Steps:**
1. Click -7 button
**Expected Result:** Subtracts 7 days from end date

### TC-100: End date preview displays
**Category:** UI
**Priority:** P2-High
**Preconditions:** End date set
**Steps:**
1. Set an end date
**Expected Result:** Shows "Ends: [formatted date]" preview
