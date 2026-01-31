# PillBow - Roadmap & Future Plans

> **Purpose:** Migration plans, future features, and next-generation improvements.

---

## Completed Features ✅

### v0.0.1 (Initial Release)

- ✅ Timeline day cards with visual time slices
- ✅ Add/edit/delete medications
- ✅ Dose status tracking (taken/skipped)
- ✅ Multi-user profiles with data isolation
- ✅ localStorage persistence
- ✅ Event types (doctor, dental, hospital)
- ✅ Days-of-week filtering
- ✅ Edit scope (today only vs forward)

### v0.0.2 (PWA Update Fix)

- ✅ Service worker auto-update detection
- ✅ Update banner with user prompt
- ✅ Cache busting with hashed filenames
- ✅ Automatic old version cleanup
- ✅ 60-second update check interval

---

## In Progress 🚧

### Current Sprint

- 🚧 Medication type icons on timeline cards
- 🚧 Shape icon badges (show actual type, not generic pill)
- 🚧 Event-aware form labels

---

## Planned Features 📋

### Short Term (Next 2 Sprints)

#### Refill Tracking

- **Goal:** Alert when medication supply running low
- **Features:**
  - "Pills remaining" field on medication
  - Auto-decrement on each dose taken
  - Refill reminder when < 7 days left
  - Dismiss/snooze refill notifications
- **Priority:** HIGH

#### Local Notifications

- **Goal:** Remind users when dose is due
- **Features:**
  - Browser push notifications (PWA)
  - Customizable reminder times (5min, 15min, 30min before)
  - Snooze option
  - Daily summary notification
- **Priority:** HIGH

#### Smart Scheduling

- **Goal:** Simplify medication time entry
- **Features:**
  - Common presets: "Morning", "Evening", "Before bed"
  - AI-suggested times based on dose count
  - Bulk time assignment
- **Priority:** MEDIUM

#### Enhanced Timeline

- **Goal:** Better visual overview
- **Features:**
  - Week/month calendar view toggle
  - Status summary per day (X/Y taken)
  - Completion percentage graphs
  - Streak tracking (days in a row)
- **Priority:** MEDIUM

---

## Backend Integration (Q2 2026)

### Architecture Changes

**Current (localStorage):**

```
App → Zustand → dataService → localStorage
```

**Future (API):**

```
App → Zustand → dataService → API → Database
```

### Migration Strategy

1. **Phase 1: API Layer**
   - Create REST endpoints matching dataService functions
   - Add authentication (JWT)
   - Keep localStorage as fallback

2. **Phase 2: Cloud Sync**
   - Sync user data to cloud on edit
   - Offline-first with sync queue
   - Conflict resolution (last-write-wins)

3. **Phase 3: Real-time**
   - WebSocket for multi-device sync
   - Push notifications from server
   - Shared family profiles

### Database Schema

**PostgreSQL tables:**

```sql
users (id, email, name, avatar, created_at)
medications (id, user_id, name, strength, dosage, times, start_date, end_date, color, shape)
dose_logs (id, medication_id, date, time, status, taken_at)
family_members (id, owner_id, member_id, relationship)
```

### API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/users/me
POST   /api/medications
PUT    /api/medications/:id
DELETE /api/medications/:id
GET    /api/medications
POST   /api/doses
PUT    /api/doses/:id
GET    /api/doses?date=YYYY-MM-DD
```

---

## React Native Migration (Q3 2026)

### Why React Native?

- Native app performance
- Push notifications without PWA limitations
- Better offline support
- App store distribution
- Native camera integration

### Migration Plan

#### Phase 1: Prepare Codebase (2 weeks)

- ✅ Class-based CSS (already done)
- ✅ No CSS-in-JS (already done)
- Extract inline styles to separate files
- Replace web-specific APIs (localStorage → AsyncStorage)

#### Phase 2: Create RN Project (1 week)

```bash
npx react-native init PillBowApp --template react-native-template-typescript
```

Copy over:

- All components (80% reusable)
- All services (100% reusable)
- All types (100% reusable)
- All stores (100% reusable)

#### Phase 3: Rebuild Styles (3 weeks)

Convert CSS → StyleSheet:

```tsx
// Before (web)
<div className="pillbox-card">

// After (RN)
<View style={styles.pillboxCard}>
```

Use libraries:

- `react-native-paper` for Material components
- `react-native-vector-icons` for icons
- `react-native-calendars` for timeline

#### Phase 4: Platform-Specific Features (2 weeks)

- Camera integration (react-native-camera)
- Local notifications (react-native-push-notification)
- Biometric auth (react-native-biometrics)
- Haptic feedback

#### Phase 5: Testing & Release (2 weeks)

- Unit tests (Jest)
- E2E tests (Detox)
- Beta testing (TestFlight + Google Play Beta)
- App store submission

**Total timeline: ~10 weeks**

### Storage Migration

```typescript
// Web
localStorage.setItem("pillbow_app_data", JSON.stringify(data));

// React Native
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.setItem("pillbow_app_data", JSON.stringify(data));
```

---

## Advanced Features (2027+)

### AI-Powered Insights

- Medication adherence scoring
- Pattern recognition (missed doses on weekends?)
- Personalized reminders based on habits
- Drug interaction warnings (via API)
- Symptom correlation tracking

### Health Integration

- Apple Health sync (medications, doses)
- Google Fit integration
- Wearable support (Apple Watch, Fitbit)
- Export data for doctor visits

### Social Features

- Family dashboard (caregiver view)
- Shared medication lists
- Compliance reports for doctors
- Medication sharing (roommates)

### Smart Home Integration

- Alexa/Google Assistant reminders
- Smart pill dispenser connection
- IoT sensor tracking (did user open bottle?)

### Gamification

- Achievement badges
- Streaks and milestones
- Leaderboards (family challenge)
- Reward system for compliance

---

## Technical Debt

### Priority 1 (Must Fix)

- [ ] Add comprehensive error handling
- [ ] Implement retry logic for failed saves
- [ ] Add loading states to all async operations
- [ ] Optimize timeline rendering (virtualization)

### Priority 2 (Should Fix)

- [ ] Add TypeScript strict mode
- [ ] Write unit tests for services
- [ ] Add E2E tests with Playwright
- [ ] Performance profiling with React DevTools

### Priority 3 (Nice to Have)

- [ ] Add Storybook for component docs
- [ ] Set up CI/CD pipeline
- [ ] Add automated screenshot tests
- [ ] Implement code splitting

---

## Performance Targets

### Current Performance

- Initial load: ~1.2s
- Lighthouse score: 85
- Timeline scroll: 55fps

### Target Performance (2026)

- Initial load: <800ms
- Lighthouse score: 95+
- Timeline scroll: 60fps constant
- API response: <200ms

---

## Scaling Considerations

### When to Scale?

- 1,000+ active users → Add caching layer (Redis)
- 10,000+ active users → Horizontal scaling (load balancer)
- 100,000+ active users → Database sharding by user_id

### Infrastructure Plan

```
[Users] → [CDN: CloudFlare]
       → [Load Balancer]
       → [API Server 1, 2, 3...]
       → [Redis Cache]
       → [PostgreSQL Primary + Read Replicas]
```

---

## Open Questions

### UX Decisions Needed

- How to handle missed doses from past? (Mark as skipped auto?)
- Should we allow editing past dates? (Currently disabled)
- Max timeline range? (Currently 30 back, 60 forward)

### Technical Decisions Needed

- Authentication provider? (Firebase, Auth0, custom?)
- Backend framework? (Node.js + Express, Go, Python FastAPI?)
- Hosting? (AWS, Google Cloud, Azure?)
- Database? (PostgreSQL, MongoDB, Firebase?)

---

## Contributing

Want to help build these features?

1. Check current sprint issues
2. Claim a feature from "Planned" section
3. Follow architecture in [ARCHITECTURE.md](ARCHITECTURE.md)
4. Write tests (see [TESTING.md](TESTING.md))
5. Submit PR with clear description

---

_Last updated: January 31, 2026_
