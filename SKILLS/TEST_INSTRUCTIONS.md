# PillBow App - Test Instructions

## Quick Start

**App URL:** http://localhost:3003

**Start the app:**
```bash
cd E:/DEV2026/pillBow-v1
npm run dev
```

---

## 1. Automated Tests (Browser Console)

### How to Run:
1. Open http://localhost:3003 in your browser
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Copy the entire contents of `test-runner.js`
5. Paste into console and press **Enter**

### Expected Output:
```
========================================
🧪 PILLBOW AUTOMATED TEST SUITE
========================================

--- 1. Storage & Data Service Tests ---
✅ PASS: 1.1 Default data structure
✅ PASS: 1.2 Add medication to storage
...

========================================
📊 TEST SUMMARY
========================================
✅ Passed: 24
❌ Failed: 0
⏭️ Skipped: 0
📝 Total: 24
========================================
```

---

## 2. Manual Test Execution

### Test Categories Overview:

| # | Category | Test Count | Priority |
|---|----------|------------|----------|
| 1 | User Management | 5 | High |
| 2 | Medication CRUD | 10 | Critical |
| 3 | Dose Tracking | 6 | Critical |
| 4 | Validation | 7 | High |
| 5 | Data Persistence | 4 | Critical |
| 6 | Export/Import | 6 | High |
| 7 | UI/Navigation | 9 | Medium |
| 8 | Edge Cases | 6 | Medium |
| 9 | Scan/Photo | 3 | Low |
| 10 | Responsive | 3 | Medium |

---

## 3. Critical Path Tests (Must Pass)

### A. Add Medication Flow
```
1. Click "+" button (bottom right)
2. Select "Add Manually"
3. Enter: Name = "Test Medicine"
4. Enter: Strength = 100, Unit = mg
5. Select: Morning time (08:00)
6. Select: Blue color, Round shape
7. Click "Add Medicine"
✓ VERIFY: Medicine appears in today's timeline
```

### B. Mark Dose as Taken
```
1. Click on today's card to expand
2. Find the test medication
3. Click the circle/checkmark button
✓ VERIFY: Button turns green with checkmark
✓ VERIFY: Sound plays (if enabled)
```

### C. Date Lock Verification
```
1. Click on YESTERDAY's card
2. Try to mark a dose
✓ VERIFY: Checkmark is disabled/grayed
✓ VERIFY: Lock icon visible

3. Click on TOMORROW's card
4. Try to mark a dose
✓ VERIFY: Checkmark is disabled/grayed
```

### D. Export Data
```
1. Click Settings icon (top right)
2. Click "Export" card
✓ VERIFY: File downloads as "pillbow-backup-YYYY-MM-DD.json"
✓ VERIFY: File contains medications, dayLogs, settings
```

### E. Import Data
```
1. Click Settings icon
2. Click "Import" card
3. Select a valid backup file
4. Click OK on confirmation
✓ VERIFY: Page reloads
✓ VERIFY: Data restored correctly
```

### F. User Switching
```
1. Click user dropdown (top left, shows current user)
2. Click "Add Family Member"
3. Select avatar, enter name "Test User"
4. Click Add
✓ VERIFY: New user appears in dropdown

5. Click to switch to new user
✓ VERIFY: Page reloads
✓ VERIFY: No medications (fresh user)
```

---

## 4. Validation Tests

### Name Validation
| Input | Expected |
|-------|----------|
| Empty | Save disabled |
| "A" (1 char) | Save disabled |
| "AB" (2 chars) | Save enabled |
| "Aspirin" | Save enabled |

### Time Selection
| Action | Expected |
|--------|----------|
| Deselect all times | Last time stays selected |
| Add custom time "14:30" | Time added to list |
| Select multiple times | All shown as selected |

### Import Validation
| File Type | Expected |
|-----------|----------|
| Valid JSON with all fields | Import succeeds |
| JSON missing dayLogs | Error message |
| JSON missing settings | Error message |
| Invalid JSON syntax | Error message |
| Non-JSON file | Error message |

---

## 5. Bug Tracking

### Fixed Bugs:
| ID | Description | Status |
|----|-------------|--------|
| BUG-001 | Import validation incomplete | ✅ FIXED |

### How to Report New Bugs:
1. Add to `TEST_CASES.md` Issues table
2. Include: ID, Severity, Description, Steps, Status

---

## 6. Test Files Reference

| File | Purpose |
|------|---------|
| `TEST_CASES.md` | All 59 test cases with checkboxes |
| `TEST_INSTRUCTIONS.md` | This file - how to run tests |
| `test-runner.js` | Automated browser console tests |

---

## 7. Quick Smoke Test (5 minutes)

Run these 10 checks to verify basic functionality:

- [ ] 1. App loads without errors
- [ ] 2. Timeline shows days (past, today, future)
- [ ] 3. "Today" button scrolls to today
- [ ] 4. Can open a day card
- [ ] 5. Can close a day card
- [ ] 6. Can open Settings
- [ ] 7. Can add a new medication
- [ ] 8. Can mark dose as taken (today only)
- [ ] 9. Can export data
- [ ] 10. Data persists after page refresh

---

## 8. Browser Compatibility

Test on:
- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

---

## 9. Responsive Testing

Test at these widths:
- [ ] 375px (iPhone SE)
- [ ] 414px (iPhone Plus)
- [ ] 768px (Tablet)
- [ ] 1024px (Desktop)
- [ ] 1440px (Large Desktop)

---

## 10. Performance Checks

- [ ] App loads in < 3 seconds
- [ ] Scrolling is smooth (60fps)
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] LocalStorage < 5MB usage

---

## Contact

For issues or questions about testing, check the `TEST_CASES.md` file for detailed test scenarios.
