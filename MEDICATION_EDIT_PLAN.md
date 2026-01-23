# Medication Edit UX Refactor Plan

## Current Problem

The current edit flow has poor UX with multiple steps:
1. Click "Edit" → opens sidebar with "Change" and "Stop" buttons
2. Click "Change" → opens another half-page form
3. Too many clicks, confusing navigation, split attention

## Goal

**Single unified edit modal** that replaces the current multi-step flow. One click on "Edit" opens everything the user needs.

---

## New Edit Modal Design

### Modal Structure

```
┌─────────────────────────────────────────┐
│  ✕                    Edit Medication   │
├─────────────────────────────────────────┤
│                                         │
│  💊 Medication Name                     │
│      Current: 500mg, 2x daily           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DOSAGE                                 │
│  ┌─────────────────────────────────┐    │
│  │  Strength: [  500  ] [mg ▼]    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Amount:   [  1   ] [tablet ▼] │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  SCHEDULE                               │
│  Times per day:                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │ 1x │ │ 2x │ │ 3x │ │ 4x │ │ 5x │    │
│  └────┘ └────┘ └────┘ └────┘ └────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DURATION                               │
│                                         │
│  Start Date:                            │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐  │
│  │  Today  │ │ Tomorrow │ │ Pick... │  │
│  └─────────┘ └──────────┘ └─────────┘  │
│                                         │
│  End Date:                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 7 days  │ │ 14 days │ │ 30 days │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐  │
│  │ Ongoing │ │  ± days  │ │ Pick... │  │
│  └─────────┘ └──────────┘ └─────────┘  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     🛑 STOP THIS MEDICATION     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  When to stop?                          │
│  ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │  Today   │ │ Tomorrow │ │ Cancel │  │
│  └──────────┘ └──────────┘ └────────┘  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────┐ ┌───────────────┐  │
│  │     CANCEL      │ │  SAVE CHANGES │  │
│  └─────────────────┘ └───────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Component Structure

### Option A: Replace Current Modal (Recommended)

Transform `detail-sheet-overlay` into edit mode when "Edit" is clicked.

```
DetailSheet.tsx
├── View Mode (current content)
│   └── Edit button → switches to Edit Mode
│
└── Edit Mode (new)
    ├── MedicationEditForm.tsx (new component)
    │   ├── DosageSection
    │   ├── ScheduleSection
    │   ├── DurationSection
    │   ├── StopMedicationSection
    │   └── ActionButtons (Cancel/Save)
    └── Back to View Mode on Cancel/Save
```

### Option B: New Overlay Modal

Open a new modal on top of DetailSheet.

```
DetailSheet.tsx
└── Edit button → opens MedicationEditModal

MedicationEditModal.tsx (new)
├── Full screen overlay
├── All edit options in one view
└── Close → returns to DetailSheet
```

---

## Data Flow

### Props/State for Edit Form

```typescript
interface MedicationEditFormProps {
  medication: Medication;
  onSave: (updates: Partial<Medication>) => void;
  onStop: (when: 'today' | 'tomorrow') => void;
  onCancel: () => void;
}

// Form state
interface EditFormState {
  strength: string;        // e.g., "500mg"
  dosage: string;          // e.g., "1 tablet"
  dosesPerDay: number;     // 1-6
  startDate: string;       // ISO date
  endDate: string | null;  // ISO date or null for ongoing
}
```

### Zustand Store Updates

```typescript
// useModalStore.ts - add edit mode
interface ModalState {
  // ... existing
  isEditMode: boolean;
  setEditMode: (editing: boolean) => void;
}
```

---

## UI Components Needed

### 1. StrengthInput
- Number input + unit dropdown (mg, mcg, ml, etc.)

### 2. DosageInput
- Number input + form dropdown (tablet, capsule, drop, etc.)

### 3. FrequencySelector
- Chip/button group: 1x, 2x, 3x, 4x, 5x, 6x per day

### 4. DateSelector
- Quick options: Today, Tomorrow, +7 days, +14 days, +30 days
- Custom date picker option
- ± days adjuster (increment/decrement)

### 5. StopMedicationSection
- Expandable/collapsible section
- "Stop" button that reveals: Today / Tomorrow / Cancel options
- Warning styling (red/orange)

### 6. ActionButtons
- Cancel (secondary, gray)
- Save Changes (primary, purple/blue gradient)

---

## Implementation Steps

### Phase 1: Create New Edit Form Component
1. [ ] Create `components/MedicationEditForm/MedicationEditForm.tsx`
2. [ ] Create `components/MedicationEditForm/MedicationEditForm.css`
3. [ ] Build form sections (Dosage, Schedule, Duration, Stop)
4. [ ] Add form state management

### Phase 2: Integrate with DetailSheet
1. [ ] Add `isEditing` state to DetailSheet
2. [ ] Toggle between View/Edit modes
3. [ ] Connect save handler to dataService
4. [ ] Update medication in parent state

### Phase 3: Remove Old Components
1. [ ] Remove or deprecate `MedicationEdit.tsx` (old sidebar)
2. [ ] Clean up unused CSS
3. [ ] Update any references

### Phase 4: Polish & Test
1. [ ] Animations for mode switching
2. [ ] Form validation
3. [ ] Error handling
4. [ ] Test all edit scenarios

---

## Files to Modify

| File | Action |
|------|--------|
| `components/MedicationEditForm/MedicationEditForm.tsx` | CREATE |
| `components/MedicationEditForm/MedicationEditForm.css` | CREATE |
| `components/DetailSheet/DetailSheet.tsx` | MODIFY - add edit mode |
| `components/DetailSheet/DetailSheet.css` | MODIFY - edit mode styles |
| `components/MedicationEdit/MedicationEdit.tsx` | DELETE (after migration) |
| `components/MedicationEdit/MedicationEdit.css` | DELETE (after migration) |
| `store/useModalStore.ts` | MODIFY - add edit mode state (optional) |

---

## Questions to Decide

1. **Animation**: Slide transition between view/edit, or instant switch?
2. **Date picker**: Use native input or custom calendar component?
3. **Validation**: Show errors inline or on submit?
4. **Stop confirmation**: Require double-confirm for stopping medication?

---

## Mockup Summary

**One page, one click:**
- Header: Medication name + close button
- Dosage section: Strength + Amount inputs
- Schedule section: Times per day chips (1x-6x)
- Duration section: Start date + End date quick picks
- Stop section: Collapsible with Today/Tomorrow options
- Footer: Cancel + Save buttons

All visible, no navigation, no sidebars, no multi-step wizard.
