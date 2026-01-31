PillBow – Software Requirements Specification (SRS)
1. Purpose
PillBow is a mobile-first medication reminder and tracking application that uses a pill-box metaphor to help users understand and manage daily medicine intake.
​
The app focuses on three main goals: knowing what to take today, tracking what was taken in the past, and planning upcoming medication schedules.
​

2. Scope
The initial version is a frontend-only React mobile web app, using Zustand as a single global state store and local JSON files as a per-user database.
​
The architecture is designed so that the local JSON structure can later be persisted to a backend database and migrated to React Native with minimal refactoring.
​

Platform: React (mobile-first, PWA-friendly), TypeScript

State: Zustand single store

Storage v1: local JSON file per user (can be simulated via localStorage / file import-export)

Out of scope v1: backend, login/auth, cloud sync, payments

3. Users and Roles
There are two conceptual roles but no enforced RBAC in v1.

Primary User

Manages their own medication schedule and intake tracking.

Caregiver

Uses the same UI to manage medication for another person (e.g., child, parent) by switching to that person’s profile.

User switching is implemented by:

One JSON file per user (e.g., /data/users/{userId}.json)

Loading the chosen user JSON into the Zustand store as the active user

4. Core Concepts
4.1 Day Card (Timeline Item)
The main screen is a vertical, scrollable timeline of days (past → today → future), where each day is rendered as a Day Card.
​

Each Day Card shows:

Day name (Mon, Tue, …)

Date (YYYY-MM-DD)

Visual segments (1–6) indicating intake “parts” (time slots) for that day

Status indicator (for past days only):

Green: all parts taken

Orange: partially taken

Red: nothing taken

Past days are fully read-only; user cannot modify taken flags or medicine definitions for dates < today.

4.2 Day Box (Expanded Day View)
Clicking a Day Card expands a Day Box which shows detailed content for that day.

Behavior:

Only one Day Box can be open at a time.

Auto-close behavior:

If pin = OFF: when the user scrolls and the Day Box scrolls out of view, it closes automatically.

If pin = ON: the Day Box stays open even when scrolling; it closes only when:

The ❌ in that box is clicked, or

Another Day Card is opened (which closes the current one and opens the new one).

Structure:

Day Box is split into 1–6 Parts (slots), each representing one medication intake time.

Each Part displays:

Time (HH:mm)

A list of medicines scheduled for that time

Taken flag (checkbox or toggle)

Color (rainbow palette, one color per part, to match the “PillBow” identity)

5. Main Screen – Timeline View
5.1 Layout & Navigation
Infinite or large-range vertical scroll of days.

Today is centered or auto-scrolled into view on first load.

Day Cards are tap targets; tapping toggles the corresponding Day Box.

5.2 Interactions
Tap a Day Card:

If closed: open its Day Box and close any other open Day Box.

If open: close it.

Scroll:

If current Day Box is pinned: it remains open.

If unpinned and completely scrolled out of view: it auto-closes.

Past days:

Status indicator:

Computed from Part taken flags:

all true → green

some true → orange

none true → red

No editing allowed for past days (no toggling taken, no changing times/medicines).

Today and future days:

User can mark parts as taken.

User can edit schedule (within day-level rules described below).

6. Day Box – Part-Level Behavior
Each Part:

Represents a specific time (e.g., 08:00, 12:00, 18:00).

Can contain 0–N medicines.

Has a boolean taken flag per day, per part.

Has a unique visual color from a fixed rainbow palette (['red','orange','yellow','green','blue','violet'] etc).

Actions:

Mark as taken / not taken (only today/future).

Open medicine details (simple inline list or modal).

Interact with pin/unpin for the Day Box.

Close Day Box via ❌.

7. Medicine Model & Scheduling
7.1 Medicine Properties
Each medicine defined for a user has:

id: unique per user

name: “Paracetamol”, “Vitamin C”, etc.

dose: string like “200mg”

pills: number of pills per intake at a given Part

startDate: first date it should appear in the schedule

endDate: last date (optional; if null, indefinite)

active: boolean flag indicating if the medicine is currently in use

source: ai or manual to track origin

7.2 Generation / Reuse Logic
When a medicine is added, the app auto-generates Part entries for the date range [startDate, endDate] with the specified intake times.

If a medicine is finished (end date in the past), user can choose to extend duration (e.g., “add 30 days more”), and the app auto-fills future days with the same schedule.
​

Edits:

Changing schedule can be applied with scope:

“Today only” – changes only the selected day.

“From today forward” – updates all future occurrences (today and > today), leaving past untouched.

8. Data Model (App-Level JSON)
8.1 User File (Local JSON)
Example path: /data/users/{userId}.json

json
{
  "user": {
    "id": "u_001",
    "name": "David Cohen",
    "role": "primary",
    "createdAt": "2026-01-01"
  },
  "settings": {
    "timezone": "Asia/Jerusalem",
    "notifications": true
  },
  "days": [
    {
      "date": "2026-01-13",
      "dayName": "Tuesday",
      "status": "partial",
      "parts": [
        {
          "time": "08:00",
          "color": "red",
          "taken": true,
          "medicines": [
            {
              "id": "m_1001",
              "name": "Paracetamol",
              "dose": "200mg",
              "pills": 2,
              "startDate": "2026-01-10",
              "endDate": "2026-02-10",
              "active": true,
              "source": "ai"
            }
          ]
        },
        {
          "time": "13:00",
          "color": "orange",
          "taken": false,
          "medicines": [
            {
              "id": "m_1001",
              "name": "Paracetamol",
              "dose": "200mg",
              "pills": 2,
              "startDate": "2026-01-10",
              "endDate": "2026-02-10",
              "active": true,
              "source": "ai"
            },
            {
              "id": "m_2001",
              "name": "Vitamin C",
              "dose": "500mg",
              "pills": 1,
              "startDate": "2026-01-01",
              "endDate": null,
              "active": true,
              "source": "manual"
            }
          ]
        }
      ]
    }
  ],
  "medicinesIndex": {
    "m_1001": {
      "name": "Paracetamol",
      "defaultSchedule": ["08:00", "13:00", "19:00"],
      "durationDays": 30,
      "active": true
    },
    "m_2001": {
      "name": "Vitamin C",
      "defaultSchedule": ["13:00"],
      "durationDays": null,
      "active": true
    }
  }
}
Notes:

days[] is denormalized to make the UI simple (direct mapping to the timeline).

medicinesIndex is a lookup table for default schedule and metadata per medicine, ready for migration to a relational DB.

8.2 TypeScript Models (Conceptual)
ts
type Medicine = {
  id: string
  name: string
  dose: string
  pills: number
  startDate: string // ISO date
  endDate: string | null
  active: boolean
  source: 'ai' | 'manual'
}

type Part = {
  time: string // "HH:mm"
  color: string
  taken: boolean
  medicines: Medicine[]
}

type Day = {
  date: string // "YYYY-MM-DD"
  dayName: string
  status: 'none' | 'partial' | 'full'
  parts: Part[]
}

type UserSettings = {
  timezone: string
  notifications: boolean
}

type UserMeta = {
  id: string
  name: string
  role: 'primary' | 'caregiver'
  createdAt: string
}

type UserData = {
  user: UserMeta
  settings: UserSettings
  days: Day[]
  medicinesIndex: Record<string, {
    name: string
    defaultSchedule: string[]
    durationDays: number | null
    active: boolean
  }>
}
9. State Management (Zustand)
Zustand is used as a single global store, with React components being as dumb as possible.
​

9.1 Store Shape
ts
type PillBowState = {
  currentUserId: string | null
  usersCache: Record<string, UserData>

  days: Day[] // derived from active user
  openDayDate: string | null // date string of currently open Day Box
  isPinned: boolean
  scrollPosition: number

  // Derived selectors
  getDayStatus: (date: string) => 'none' | 'partial' | 'full'
  getDayByDate: (date: string) => Day | undefined

  // Actions
  loadUser: (userId: string, data: UserData) => void
  switchUser: (userId: string) => void

  setOpenDay: (date: string | null) => void
  togglePin: () => void
  setScrollPosition: (pos: number) => void

  markPartTaken: (date: string, time: string, taken: boolean) => void

  addMedicineManual: (payload: {
    medicine: Omit<Medicine, 'id' | 'source'>
    times: string[]
  }) => void

  applyScheduleEdit: (opts: {
    medicineId: string
    fromDate: string
    scope: 'today' | 'forward'
    times?: string[]
    endDate?: string | null
  }) => void

  deleteMedicine: (opts: {
    medicineId: string
    fromDate: string
    scope: 'today' | 'forward'
  }) => void

  mergeAiSchedule: (aiResult: AiScheduleResult) => void
}
AiScheduleResult is the object returned from the AI server (see below).

10. Add / Edit / Delete Medication
10.1 Manual Add Flow
User chooses:

Medicine name, dose, pills per intake.

Start date and end date.

One to six intake times.

App generates:

medicinesIndex entry (if new).

For each date in [startDate, endDate], ensures the appropriate Part exists and inserts the medicine into that Part’s medicines[].

10.2 Edit Rules
Past days:

Locked, cannot edit time, medicine, or taken flag.

Today and future:

User can:

Change times.

Change pills per intake.

Change end date.

Edit scope:

Today only.

From today forward.

10.3 Delete Rules
Same scope options as edit:

“Today only” → remove medicine instance from that day’s parts.

“From today forward” → remove from all Day parts >= today’s date.

No deletion affects past days.

11. AI Integration (Optional, Credit-Based)
11.1 Flow
In Add Medicine screen, user can choose “Scan label/box”.

User takes or uploads a photo of a prescription / box.

The app sends the image plus userId to an AI server, if the user has available credits.
​

AI server responds with structured JSON similar to:

json
{
  "medicine": "Paracetamol",
  "durationDays": 30,
  "schedule": [
    { "time": "07:00", "pills": 2, "dose": "200mg" },
    { "time": "13:00", "pills": 2, "dose": "200mg" },
    { "time": "19:00", "pills": 2, "dose": "200mg" }
  ]
}
App shows a preview UI where:

User can adjust name, dose, times, pills.

User can choose start date (default today) and confirm duration (durationDays → endDate).

On confirm, the app calls mergeAiSchedule(aiResult) which:

Creates or updates medicinesIndex entry.

Populates days[] with Parts and medicines according to the schedule.

11.2 Error Handling & Duplicates
If AI returns a medicine name that already exists in medicinesIndex (same or similar name):

Show “merge with existing medicine?” prompt.

If times conflict with existing meds:

Show them together in the same Part; user can later edit.

AI parsing errors:

Fallback to manual form with best-effort prefilled fields.

12. Notifications & Reminders
Local (device) notifications per Part time.
​

For each Part scheduled for today:

Create a local notification near time.

When user taps notification, open the corresponding Day Box and Part.

Optional snooze (future enhancement in v1 or v1.1):

Snooze for N minutes and re-trigger.

No backend push in v1; all reminders are local.

13. UI / UX Requirements
Target users include older adults, so UI must be extremely simple and high contrast.
​

Mobile-only layout (one column, big touch targets).

Minimal text input (prefer tapping, selecting time pickers, using AI scan).

Clear icons for:

Taken / not taken.

Pin / unpin.

Add / edit / delete.

CSS:

Class-based, minimal nesting; easy to restyle for React Native later.

Component names:

Simple, semantic, e.g.:

DayList

DayCard

DayBox

PartRow

MedicineChip

AddMedicineForm

AiScanButton

14. Non-Functional Requirements
Offline-first (works without network after initial load).

Fast scrolling over potentially hundreds of days (consider windowing/virtualization).

Deterministic state transitions (all updates through Zustand actions).

Easy migration path to:

React Native UI.

Backend persistence (REST or GraphQL).

No backend dependency in v1; all data is local JSON plus optional AI server calls.

15. Future Enhancements (Out of Scope v1)
Backend DB + API for persistence and sync.

Auth and multi-device sync.

Subscription / credit purchase flows for AI.

Stock tracking (pills remaining, refill reminders).
​

Wearable integration (watch notifications, complications).

Sharing live schedule with family via accounts/links instead of local user-switch only.