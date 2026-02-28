# Firebase Firestore Setup Guide

> **Purpose:** Instructions for setting up Firestore security rules and database structure.

---

## Database Structure

```
users/
  {userId}/
    medications/
      {medicationId}/
        - id: string
        - name: string
        - strength: string
        - dosage: string
        - timesOfDay: string[]
        - startDate: string
        - endDate?: string
        - color: string
        - shape: string
        - daysOfWeek?: number[]
        - createdAt: timestamp
        - updatedAt: timestamp
    
    dayLogs/
      {date}/  (e.g., "2026-02-10")
        - date: string
        - doses: DoseRecord[]
        - updatedAt: timestamp
    
    profile/
      data/
        - id: string
        - name: string
        - email?: string
        - avatar: string
        - color: string
        - createdAt: timestamp
        - updatedAt: timestamp
    
    settings/
      data/
        - reminderEnabled: boolean
        - soundEnabled: boolean
        - updatedAt: timestamp
```

---

## Security Rules

Copy these rules to your Firebase Console:
**Firebase Console → Firestore Database → Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns this document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - each user can only access their own data
    match /users/{userId} {
      // User profile
      match /profile/{document=**} {
        allow read, write: if isOwner(userId);
      }
      
      // User settings
      match /settings/{document=**} {
        allow read, write: if isOwner(userId);
      }
      
      // User medications
      match /medications/{medicationId} {
        allow read, write: if isOwner(userId);
      }
      
      // User day logs
      match /dayLogs/{date} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Block all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Setup Steps

### 1. Enable Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **pillbow-851fa**
3. Navigate to **Build → Firestore Database**
4. Click **Create database**
5. Select **Start in production mode** (we'll add rules next)
6. Choose a location (e.g., `us-central1`)

### 2. Apply Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the default rules with the rules above
3. Click **Publish**

### 3. Create Indexes (Optional, for queries)

If you get index errors, create these indexes:

**For dayLogs date range query:**
```
Collection: users/{userId}/dayLogs
Fields: date (Ascending)
```

Navigate to **Firestore → Indexes → Create Index** or click the link in the console error.

---

## Testing Security Rules

Use the Firebase Rules Playground in the console:

### Test 1: Authenticated user reading own data
```
Path: /users/{YOUR_USER_ID}/medications/test123
Method: get
Auth: Signed in as {YOUR_USER_ID}
Expected: ✅ Allowed
```

### Test 2: Authenticated user reading other user's data
```
Path: /users/OTHER_USER_ID/medications/test123
Method: get
Auth: Signed in as {YOUR_USER_ID}
Expected: ❌ Denied
```

### Test 3: Unauthenticated access
```
Path: /users/ANY_USER_ID/medications/test123
Method: get
Auth: Not signed in
Expected: ❌ Denied
```

---

## Offline Support

Firestore offline persistence is enabled in `services/firebase.ts`:

```typescript
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support
  }
});
```

This means:
- Data is cached locally in IndexedDB
- Reads work offline
- Writes are queued and sync when online

---

## Sync Strategy

PillBow uses **offline-first** sync:

1. **Writes go to localStorage first** (instant)
2. **Writes are queued** for cloud sync
3. **Queue processes** when online + authenticated
4. **Auto-sync** every 60 seconds when signed in

### Sync Queue Storage

Pending changes stored in `pillbow_sync_queue` localStorage key.

### Conflict Resolution

**Last-write-wins** strategy:
- Medications: merged by ID, newer timestamp wins
- DayLogs: merged by date, more doses wins
- Settings: cloud timestamp wins if newer

---

## Monitoring Usage

1. **Firebase Console → Firestore → Usage**
2. Monitor reads, writes, and storage
3. Free tier: 50K reads, 20K writes per day

---

## Troubleshooting

### "Permission denied" errors
- Check security rules are published
- Verify user is authenticated
- Check user ID matches document path

### Data not syncing
- Check `canSync()` returns true (online + authenticated)
- Look for errors in browser console
- Check `getPendingSyncCount()` for queued items

### IndexedDB errors
- User may have multiple tabs open
- Browser may not support IndexedDB
- Try clearing browser data

---

_Last updated: February 10, 2026_
