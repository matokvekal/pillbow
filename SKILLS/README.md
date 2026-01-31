# SKILLS Folder - Documentation Index

> **Quick Navigation:** All PillBow documentation organized for fast access by agents and developers.

---

## 📚 Main Documentation Files

### [ARCHITECTURE.md](ARCHITECTURE.md) - Technical Design

**For:** Developers, AI agents working on the codebase
**Contains:**

- System architecture overview
- Component hierarchy and patterns
- Data model and types
- State management (Zustand stores)
- Key services (dataService, geminiService)
- Form configuration
- PWA & service worker setup
- Development conventions & rules

**Quick answers:**

- "How does data flow work?"
- "Where is medication data stored?"
- "How do I add a new component?"
- "What's the difference between event shapes and medications?"

---

### [USER_GUIDE.md](USER_GUIDE.md) - End User Documentation

**For:** End users, caregivers, elderly users
**Contains:**

- Quick start guide
- How to add/edit/delete medications
- How to track doses
- Managing multiple users
- Adding appointments (vs medications)
- Settings and preferences
- Troubleshooting common issues
- Deployment instructions

**Quick answers:**

- "How do I add my medication?"
- "How do I mark a dose as taken?"
- "How do I add family members?"
- "Why can't I edit yesterday's doses?"

---

### [TESTING.md](TESTING.md) - Testing Guide

**For:** QA, developers, AI testing agents
**Contains:**

- Quick test procedure
- Comprehensive test cases (8 categories)
- Automated test coverage (24 tests)
- Performance testing
- Browser compatibility
- Known issues & edge cases
- Test data setup

**Quick answers:**

- "How do I run tests?"
- "What test cases cover dose tracking?"
- "How do I test PWA updates?"
- "What's the automated test coverage?"

---

### [ROADMAP.md](ROADMAP.md) - Future Plans

**For:** Product managers, contributors, stakeholders
**Contains:**

- Completed features (v0.0.1, v0.0.2)
- Current sprint items
- Short-term planned features
- Backend integration plan (Q2 2026)
- React Native migration plan (Q3 2026)
- Advanced features (2027+)
- Technical debt priorities
- Performance targets
- Scaling considerations

**Quick answers:**

- "What's next for PillBow?"
- "When is backend integration coming?"
- "How will React Native migration work?"
- "What's the refill tracking feature?"

---

## 🗂️ Other Files

### flow.drawio

Visual diagram of app architecture and data flow. Open with draw.io or diagrams.net.

### test-runner.js

Automated test suite. Copy/paste into browser console to run 24 automated tests.

---

## 🚀 Quick Start by Role

### As a Developer

1. Read **ARCHITECTURE.md** first (system design)
2. Check **TESTING.md** for test procedures
3. Reference **ROADMAP.md** for upcoming work

### As a Tester

1. Read **TESTING.md** (test cases + automation)
2. Use `test-runner.js` for quick validation
3. Reference **USER_GUIDE.md** for expected behavior

### As a User

1. Read **USER_GUIDE.md** (complete usage guide)
2. Check troubleshooting section for issues
3. Reference **ROADMAP.md** for upcoming features

### As an AI Agent

1. Read **ARCHITECTURE.md** for code structure
2. Check **TESTING.md** before making changes
3. Follow conventions in ARCHITECTURE.md
4. Reference **ROADMAP.md** for context on planned work

---

## 📊 Documentation Stats

| File            | Size   | Purpose          | Last Updated |
| --------------- | ------ | ---------------- | ------------ |
| ARCHITECTURE.md | 6.8 KB | Technical design | Jan 31, 2026 |
| USER_GUIDE.md   | 7.6 KB | End user docs    | Jan 31, 2026 |
| TESTING.md      | 8.5 KB | Test procedures  | Jan 31, 2026 |
| ROADMAP.md      | 8.0 KB | Future plans     | Jan 31, 2026 |

**Total:** 4 core files, ~31 KB of documentation

---

## 🔍 Search Tips

Looking for specific information? Use these keywords:

**Architecture:**

- Component: "Component Hierarchy"
- Data: "Data Model", "Storage Architecture"
- State: "Zustand Stores"
- Styling: "UI/UX Design", "Accessibility"

**User Guide:**

- Getting started: "Quick Start"
- Medications: "Adding Medications", "Editing Medications"
- Tracking: "Tracking Doses", "Mark as Taken"
- Users: "Managing Multiple Users"

**Testing:**

- Running tests: "Quick Test", "Automated Tests"
- Test cases: "TC-U" (user), "TC-M" (medication), "TC-D" (dose)
- Issues: "Known Issues"

**Roadmap:**

- Current work: "In Progress"
- Future: "Planned Features"
- Backend: "Backend Integration"
- Mobile: "React Native Migration"

---

## 📝 Maintenance

**When to update:**

- After completing a major feature → Update ROADMAP.md
- After finding bugs → Update TESTING.md known issues
- After architecture changes → Update ARCHITECTURE.md
- After UX changes → Update USER_GUIDE.md

**Consolidation rules:**

- Keep only 4 main files
- Don't split by small topics
- Merge similar content
- Keep each file focused on one audience

---

_Last updated: January 31, 2026_
