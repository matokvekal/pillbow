# PillBow: React Native Migration & Backend Integration Plan

**Document Version:** 1.0  
**Created:** January 23, 2026  
**Target:** Convert PillBow from React Web to React Native (Android → iOS) with Backend Integration

---

## Table of Contents

1. [Overview & Strategy](#overview--strategy)
2. [Phase 1: React Native Setup](#phase-1-react-native-setup)
3. [Phase 2: Component Migration](#phase-2-component-migration)
4. [Phase 3: Backend Architecture](#phase-3-backend-architecture)
5. [Phase 4: API Integration](#phase-4-api-integration)
6. [Phase 5: Real-time Communication](#phase-5-real-time-communication)
7. [Phase 6: Push Notifications](#phase-6-push-notifications)
8. [Phase 7: Android Deployment](#phase-7-android-deployment)
9. [Phase 8: iOS Deployment](#phase-8-ios-deployment)
10. [Testing & Validation](#testing--validation)

---

## Overview & Strategy

### Current State

- **Platform:** React Web App (Vite + TypeScript)
- **State Management:** Zustand
- **Storage:** localStorage
- **Styling:** CSS files (BEM naming)
- **Date Library:** date-fns
- **No Backend:** Fully client-side

### Target State

- **Platform:** React Native (Expo framework)
- **State Management:** Zustand (keep)
- **Storage:** AsyncStorage + Backend sync
- **Styling:** StyleSheet (React Native)
- **Backend:** Node.js + Express OR Firebase
- **Real-time:** Socket.io OR Firebase Realtime Database
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Database:** PostgreSQL/MongoDB OR Firestore

### Migration Approach

**Strategy:** Incremental migration with parallel codebases initially

1. Set up React Native project alongside existing web app
2. Migrate components one section at a time
3. Build backend infrastructure in parallel
4. Integrate backend APIs progressively
5. Deploy Android first (easier testing)
6. Deploy iOS after Android stabilization

---

## Phase 1: React Native Setup

### Step 1.1: Initialize React Native Project

```bash
# Use Expo for easier cross-platform development
npx create-expo-app pillbow-mobile --template

cd pillbow-mobile

# Install core dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install zustand date-fns
npm install @react-native-async-storage/async-storage
```

### Step 1.2: Project Structure

Create parallel structure to web app:

```
pillbow-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Timeline view
│   │   ├── manage.tsx         # Manage medications
│   │   └── settings.tsx       # Settings
│   └── _layout.tsx
├── components/
│   ├── TimelineContainer/
│   ├── ActivePillboxCard/
│   ├── InactivePillboxCard/
│   ├── DetailSheet/
│   └── ... (migrate all components)
├── store/
│   ├── useUserStore.ts        # Copy from web
│   ├── useDayCardStore.ts
│   ├── useModalStore.ts
│   └── useTimeSlotStore.ts
├── services/
│   ├── dataService.ts         # MODIFIED for AsyncStorage
│   ├── apiService.ts          # NEW - Backend API calls
│   ├── syncService.ts         # NEW - Data synchronization
│   └── notificationService.ts # NEW - Push notifications
├── types/
│   └── index.ts               # Copy from web
├── constants/
│   └── index.ts               # Copy from web
└── utils/
    └── ... (copy from web)
```

### Step 1.3: Configure Navigation

**File:** `app/_layout.tsx`

```typescript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
```

### Step 1.4: Replace localStorage with AsyncStorage

**File:** `services/dataService.ts` (React Native version)

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// BEFORE (Web):
const data = localStorage.getItem("pillbow_data");

// AFTER (React Native):
const data = await AsyncStorage.getItem("pillbow_data");

// Update ALL storage functions to be async
export const loadAppData = async (): Promise<AppData> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : getDefaultAppData();
};

export const saveAppData = async (data: AppData): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
```

### Step 1.5: Setup Environment Variables

**File:** `.env`

```bash
# Backend API
API_BASE_URL=https://your-api.com
# OR for local development
API_BASE_URL=http://10.0.2.2:3001  # Android emulator
# API_BASE_URL=http://localhost:3000  # iOS simulator

# Firebase (if using Firebase)
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:android:abc123

# Socket.io
SOCKET_URL=https://your-socket-server.com
```

---

## Phase 2: Component Migration

### Step 2.1: CSS to StyleSheet Conversion Strategy

**BEFORE (Web - CSS):**

```css
/* CardHeader.css */
.card-header {
  display: flex;
  align-items: center;
  padding: 1.25rem 1rem;
  background-color: white;
}

.card-header__title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
}
```

**AFTER (React Native - StyleSheet):**

```typescript
// CardHeader.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white"
  },
  cardHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b"
  }
});
```

### Step 2.2: Component Migration Checklist

For EACH component, follow this process:

#### Convert Component Structure

**BEFORE (Web):**

```tsx
export const CardHeader: React.FC<CardHeaderProps> = ({ date, onClose }) => {
  return (
    <div className="card-header">
      <div className="card-header__left">
        <h2 className="card-header__title">{dayName}</h2>
      </div>
      <button className="card-header__close-btn" onClick={onClose}>
        <svg>...</svg>
      </button>
    </div>
  );
};
```

**AFTER (React Native):**

```tsx
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./CardHeader.styles";

export const CardHeader: React.FC<CardHeaderProps> = ({ date, onClose }) => {
  return (
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderLeft}>
        <Text style={styles.cardHeaderTitle}>{dayName}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        {/* Use react-native-svg or Icon library */}
      </TouchableOpacity>
    </View>
  );
};
```

#### HTML → React Native Element Mapping

| Web (HTML/CSS)          | React Native                          | Notes                        |
| ----------------------- | ------------------------------------- | ---------------------------- |
| `<div>`                 | `<View>`                              | Container element            |
| `<span>`, `<p>`, `<h1>` | `<Text>`                              | All text MUST be in `<Text>` |
| `<button>`              | `<TouchableOpacity>` or `<Pressable>` | Touchable elements           |
| `<input>`               | `<TextInput>`                         | Text input                   |
| `<img>`                 | `<Image>`                             | Images                       |
| `<svg>`                 | `react-native-svg`                    | Install library              |
| `className`             | `style`                               | StyleSheet object            |
| `onClick`               | `onPress`                             | Touch handler                |
| `onChange`              | `onChangeText`                        | For TextInput                |

### Step 2.3: Migration Order (Priority)

Migrate in this order (easiest → hardest):

1. **Types & Constants** (No changes needed)
   - `types.ts` → Copy as-is
   - `constants/` → Copy as-is

2. **Zustand Stores** (Minimal changes)
   - All `store/*.ts` files
   - Only update if using async storage

3. **Data Service** (Major changes)
   - `services/dataService.ts`
   - Convert all localStorage → AsyncStorage (async/await)

4. **Simple Components** (Low complexity)
   - `PillGraphic` → Uses View, Text
   - `CardHeader` → Basic layout
   - `AppHeader` → Simple header

5. **Medium Components** (Moderate complexity)
   - `TimeSlotView` → Scrollable layout
   - `ListView` → FlatList
   - `MedicationFooter` → Expandable section

6. **Complex Components** (High complexity)
   - `TimelineContainer` → Infinite scroll (FlatList with pagination)
   - `ActivePillboxCard` → Animations
   - `DetailSheet` → Modal with bottom sheet
   - `AddMedication` → Form with image picker

7. **Modal System**
   - `ModalContainer` → React Navigation modal stack

### Step 2.4: Install Required Libraries

```bash
# UI Components
npm install react-native-paper  # Material Design components
npm install react-native-vector-icons

# Modals/Sheets
npm install @gorhom/bottom-sheet
npm install react-native-reanimated
npm install react-native-gesture-handler

# Date Picker
npm install react-native-date-picker

# Image Picker (for AI scan)
npm install expo-image-picker

# SVG Support
npm install react-native-svg

# Loading/Spinners
npm install react-native-loading-spinner-overlay

# Notifications
npm install expo-notifications
npm install @react-native-firebase/messaging  # If using Firebase
```

### Step 2.5: Example: TimelineContainer Migration

**File:** `components/TimelineContainer/TimelineContainer.tsx`

```tsx
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ActivePillboxCard } from '../ActivePillboxCard/ActivePillboxCard';
import { InactivePillboxCard } from '../InactivePillboxCard/InactivePillboxCard';

export const TimelineContainer: React.FC<TimelineProps> = ({ days, ... }) => {
  const renderDay = ({ item: day }) => {
    const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    if (isToday || isAfter(day.date, new Date())) {
      return <ActivePillboxCard {...dayProps} />;
    }
    return <InactivePillboxCard {...dayProps} />;
  };

  return (
    <FlatList
      data={days}
      renderItem={renderDay}
      keyExtractor={(item) => item.date}
      initialScrollIndex={todayIndex}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      onScrollToIndexFailed={(info) => {
        // Handle scroll failure
      }}
    />
  );
};
```

---

## Phase 3: Backend Architecture

### Decision: Firebase vs Node.js Server

| Feature                | Firebase              | Node.js + Express   | Recommendation     |
| ---------------------- | --------------------- | ------------------- | ------------------ |
| **Setup Speed**        | ⚡ Very Fast          | 🐢 Slower           | Firebase for MVP   |
| **Real-time**          | ✅ Built-in           | 🔧 Add Socket.io    | Firebase easier    |
| **Authentication**     | ✅ Built-in           | 🔧 Build custom     | Firebase easier    |
| **Cost (small scale)** | 💰 Free tier generous | 💰 Cheaper at scale | Firebase for start |
| **Scalability**        | ✅ Auto-scales        | 🔧 Manual           | Firebase better    |
| **Control**            | ⚠️ Limited            | ✅ Full control     | Node.js better     |
| **Offline Support**    | ✅ Excellent          | 🔧 Build custom     | Firebase wins      |
| **Custom Logic**       | ⚠️ Cloud Functions    | ✅ Full Node.js     | Node.js better     |

**RECOMMENDATION:** Start with Firebase, migrate to Node.js later if needed.

### Step 3.1: Firebase Setup (Recommended)

#### Install Firebase

```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-firebase/storage
npm install @react-native-firebase/messaging
npm install @react-native-firebase/database  # For real-time
```

#### Configure Firebase

**File:** `services/firebase.ts`

```typescript
import { firebase } from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import database from "@react-native-firebase/database";
import messaging from "@react-native-firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firestore, database, messaging };
export default firebase;
```

#### Firestore Data Structure

```
users/
  ├── {userId}/
  │   ├── profile: { name, relationship, avatar, color, createdAt }
  │   ├── medications/
  │   │   ├── {medicationId}/
  │   │   │   ├── name, strength, dosage, timesOfDay[], startDate, endDate
  │   │   │   └── createdAt, updatedAt
  │   ├── dayLogs/
  │   │   ├── {YYYY-MM-DD}/
  │   │   │   ├── doses: []
  │   │   │   └── updatedAt
  │   └── settings/
  │       └── timezone, notifications, etc.
```

### Step 3.2: Node.js Backend Setup (Alternative)

If you choose Node.js instead:

#### Initialize Node Server

```bash
mkdir pillbow-server
cd pillbow-server
npm init -y

npm install express cors dotenv
npm install socket.io
npm install pg  # PostgreSQL
# OR
npm install mongoose  # MongoDB
npm install jsonwebtoken bcrypt  # Authentication
npm install firebase-admin  # For FCM notifications
```

#### Server Structure

```
pillbow-server/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── firebase.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── medicationController.ts
│   │   └── doseController.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Medication.ts
│   │   └── DoseLog.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── medications.ts
│   │   └── doses.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── notificationService.ts
│   │   └── syncService.ts
│   ├── sockets/
│   │   └── index.ts
│   └── server.ts
├── .env
└── package.json
```

#### Basic Server Setup

**File:** `src/server.ts`

```typescript
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import medicationRoutes from "./routes/medications";
import doseRoutes from "./routes/doses";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/doses", doseRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("dose-update", (data) => {
    // Broadcast to user's devices
    socket.broadcast.to(data.userId).emit("dose-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Phase 4: API Integration

### Step 4.1: Create API Service Layer

**File:** `services/apiService.ts`

```typescript
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout
      await AsyncStorage.removeItem("auth_token");
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

// API Methods
export const apiService = {
  // Auth
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (userData: any) => api.post("/auth/register", userData),

  // Users
  getUserProfile: (userId: string) => api.get(`/users/${userId}`),

  updateUserProfile: (userId: string, data: any) =>
    api.put(`/users/${userId}`, data),

  // Medications
  getMedications: (userId: string) => api.get(`/users/${userId}/medications`),

  createMedication: (userId: string, medication: Medication) =>
    api.post(`/users/${userId}/medications`, medication),

  updateMedication: (
    userId: string,
    medicationId: string,
    data: Partial<Medication>
  ) => api.put(`/users/${userId}/medications/${medicationId}`, data),

  deleteMedication: (userId: string, medicationId: string) =>
    api.delete(`/users/${userId}/medications/${medicationId}`),

  // Dose Logs
  getDoseLogs: (userId: string, startDate: string, endDate: string) =>
    api.get(`/users/${userId}/doses`, { params: { startDate, endDate } }),

  updateDoseStatus: (userId: string, date: string, doseData: any) =>
    api.post(`/users/${userId}/doses/${date}`, doseData),

  // Sync
  syncData: (userId: string, localData: any) =>
    api.post(`/users/${userId}/sync`, localData)
};

export default api;
```

### Step 4.2: Firebase API Service (Alternative)

**File:** `services/firebaseService.ts`

```typescript
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Medication, DoseLog, UserProfile } from "../types";

export const firebaseService = {
  // Auth
  signUp: async (email: string, password: string) => {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  },

  signIn: async (email: string, password: string) => {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  },

  signOut: () => auth().signOut(),

  getCurrentUser: () => auth().currentUser,

  // Medications
  getMedications: async (userId: string): Promise<Medication[]> => {
    const snapshot = await firestore()
      .collection("users")
      .doc(userId)
      .collection("medications")
      .get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Medication
    );
  },

  addMedication: async (userId: string, medication: Medication) => {
    const ref = await firestore()
      .collection("users")
      .doc(userId)
      .collection("medications")
      .add({
        ...medication,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp()
      });

    return ref.id;
  },

  updateMedication: async (
    userId: string,
    medicationId: string,
    data: Partial<Medication>
  ) => {
    await firestore()
      .collection("users")
      .doc(userId)
      .collection("medications")
      .doc(medicationId)
      .update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
  },

  deleteMedication: async (userId: string, medicationId: string) => {
    await firestore()
      .collection("users")
      .doc(userId)
      .collection("medications")
      .doc(medicationId)
      .delete();
  },

  // Dose Logs
  getDoseLogs: async (userId: string, startDate: string, endDate: string) => {
    const snapshot = await firestore()
      .collection("users")
      .doc(userId)
      .collection("dayLogs")
      .where(firestore.FieldPath.documentId(), ">=", startDate)
      .where(firestore.FieldPath.documentId(), "<=", endDate)
      .get();

    return snapshot.docs.map((doc) => ({ date: doc.id, ...doc.data() }));
  },

  updateDoseLog: async (userId: string, date: string, doses: any[]) => {
    await firestore()
      .collection("users")
      .doc(userId)
      .collection("dayLogs")
      .doc(date)
      .set(
        {
          doses,
          updatedAt: firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
  },

  // Real-time listeners
  onMedicationsChange: (
    userId: string,
    callback: (medications: Medication[]) => void
  ) => {
    return firestore()
      .collection("users")
      .doc(userId)
      .collection("medications")
      .onSnapshot((snapshot) => {
        const medications = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Medication
        );
        callback(medications);
      });
  }
};
```

### Step 4.3: Sync Service (Offline-First Strategy)

**File:** `services/syncService.ts`

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { apiService } from "./apiService";

const SYNC_QUEUE_KEY = "sync_queue";

interface SyncOperation {
  id: string;
  type: "create" | "update" | "delete";
  entity: "medication" | "dose";
  data: any;
  timestamp: number;
}

export const syncService = {
  // Add operation to sync queue
  queueSync: async (operation: Omit<SyncOperation, "id" | "timestamp">) => {
    const queueStr = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const queue: SyncOperation[] = queueStr ? JSON.parse(queueStr) : [];

    const newOp: SyncOperation = {
      ...operation,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };

    queue.push(newOp);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));

    // Try to sync immediately if online
    this.processQueue();
  },

  // Process sync queue
  processQueue: async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log("Offline, skipping sync");
      return;
    }

    const queueStr = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (!queueStr) return;

    const queue: SyncOperation[] = JSON.parse(queueStr);
    const userId = await AsyncStorage.getItem("userId");

    const failed: SyncOperation[] = [];

    for (const op of queue) {
      try {
        switch (op.entity) {
          case "medication":
            if (op.type === "create") {
              await apiService.createMedication(userId!, op.data);
            } else if (op.type === "update") {
              await apiService.updateMedication(userId!, op.data.id, op.data);
            } else if (op.type === "delete") {
              await apiService.deleteMedication(userId!, op.data.id);
            }
            break;

          case "dose":
            await apiService.updateDoseStatus(userId!, op.data.date, op.data);
            break;
        }
      } catch (error) {
        console.error("Sync failed for operation:", op.id, error);
        failed.push(op);
      }
    }

    // Update queue with failed operations
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(failed));
  },

  // Full sync from server
  fullSync: async (userId: string) => {
    try {
      // Get all data from server
      const [medications, doseLogs] = await Promise.all([
        apiService.getMedications(userId),
        apiService.getDoseLogs(userId, "2020-01-01", "2030-12-31")
      ]);

      // Update local storage
      const appData = {
        medications: medications.data,
        dayLogs: doseLogs.data,
        settings: {},
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem("pillbow_data", JSON.stringify(appData));

      return appData;
    } catch (error) {
      console.error("Full sync failed:", error);
      throw error;
    }
  },

  // Setup auto-sync
  setupAutoSync: () => {
    // Listen for network changes
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncService.processQueue();
      }
    });

    // Periodic sync every 5 minutes
    setInterval(
      () => {
        syncService.processQueue();
      },
      5 * 60 * 1000
    );
  }
};
```

---

## Phase 5: Real-time Communication

### Option A: Firebase Realtime Database

**File:** `services/realtimeService.ts`

```typescript
import database from "@react-native-firebase/database";

export const realtimeService = {
  // Listen to dose updates
  subscribeToDoseUpdates: (userId: string, callback: (data: any) => void) => {
    const ref = database().ref(`users/${userId}/doses`);

    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });

    // Return unsubscribe function
    return () => ref.off("value");
  },

  // Broadcast dose update
  broadcastDoseUpdate: async (userId: string, date: string, dose: any) => {
    await database()
      .ref(`users/${userId}/doses/${date}`)
      .set({
        ...dose,
        timestamp: database.ServerValue.TIMESTAMP
      });
  },

  // Listen to medication changes
  subscribeMedicationChanges: (
    userId: string,
    callback: (data: any) => void
  ) => {
    const ref = database().ref(`users/${userId}/medications`);

    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });

    return () => ref.off("value");
  }
};
```

### Option B: Socket.io Client

**File:** `services/socketService.ts`

```typescript
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3001";

class SocketService {
  private socket: any = null;
  private userId: string | null = null;

  async connect() {
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("auth_token");

    this.userId = userId;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"]
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.socket.emit("join", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Emit dose update
  emitDoseUpdate(date: string, dose: any) {
    if (this.socket) {
      this.socket.emit("dose-update", {
        userId: this.userId,
        date,
        dose
      });
    }
  }

  // Listen for dose updates
  onDoseUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("dose-updated", callback);
    }
  }

  // Emit medication change
  emitMedicationChange(
    action: "create" | "update" | "delete",
    medication: any
  ) {
    if (this.socket) {
      this.socket.emit("medication-change", {
        userId: this.userId,
        action,
        medication
      });
    }
  }

  // Listen for medication changes
  onMedicationChange(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("medication-changed", callback);
    }
  }
}

export default new SocketService();
```

### Integration in App

**File:** `App.tsx`

```typescript
import { useEffect } from 'react';
import socketService from './services/socketService';
// OR
import { realtimeService } from './services/realtimeService';

export default function App() {
  useEffect(() => {
    // Option A: Socket.io
    socketService.connect();

    socketService.onDoseUpdate((data) => {
      // Update local state
      console.log('Dose updated from another device:', data);
    });

    return () => {
      socketService.disconnect();
    };

    // Option B: Firebase
    // const unsubscribe = realtimeService.subscribeToDoseUpdates(
    //   userId,
    //   (data) => {
    //     console.log('Dose updated:', data);
    //   }
    // );
    // return () => unsubscribe();
  }, []);

  return <NavigationContainer>...</NavigationContainer>;
}
```

---

## Phase 6: Push Notifications

### Step 6.1: Firebase Cloud Messaging Setup

**Install:**

```bash
npm install @react-native-firebase/messaging
npm install @notifee/react-native  # For local notifications
```

**File:** `services/notificationService.ts`

```typescript
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const notificationService = {
  // Request permission
  requestPermission: async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Notification permission granted");
      return true;
    }
    return false;
  },

  // Get FCM token
  getToken: async () => {
    const token = await messaging().getToken();
    await AsyncStorage.setItem("fcm_token", token);
    return token;
  },

  // Listen for token refresh
  onTokenRefresh: (callback: (token: string) => void) => {
    return messaging().onTokenRefresh(callback);
  },

  // Handle foreground messages
  onMessage: () => {
    return messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground message:", remoteMessage);

      // Display local notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: "default",
          importance: AndroidImportance.HIGH
        }
      });
    });
  },

  // Handle background messages
  setBackgroundMessageHandler: () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background message:", remoteMessage);
    });
  },

  // Schedule local notification (for dose reminders)
  scheduleNotification: async (medication: any, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const trigger = new Date();
    trigger.setHours(hours, minutes, 0, 0);

    // If time already passed today, schedule for tomorrow
    if (trigger < new Date()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await notifee.createTriggerNotification(
      {
        title: "Time to take your medication",
        body: `${medication.name} - ${medication.strength}`,
        android: {
          channelId: "medication-reminders",
          importance: AndroidImportance.HIGH
        }
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: trigger.getTime(),
        repeatFrequency: RepeatFrequency.DAILY
      }
    );
  },

  // Create notification channels (Android)
  createChannels: async () => {
    await notifee.createChannel({
      id: "default",
      name: "Default",
      importance: AndroidImportance.HIGH
    });

    await notifee.createChannel({
      id: "medication-reminders",
      name: "Medication Reminders",
      importance: AndroidImportance.HIGH,
      sound: "default"
    });
  },

  // Initialize notification service
  initialize: async () => {
    await notificationService.createChannels();
    await notificationService.requestPermission();
    const token = await notificationService.getToken();

    // Send token to backend
    // await apiService.updateFCMToken(userId, token);

    // Setup listeners
    notificationService.onMessage();
    notificationService.setBackgroundMessageHandler();
    notificationService.onTokenRefresh(async (newToken) => {
      // Update token on backend
      // await apiService.updateFCMToken(userId, newToken);
    });
  }
};
```

### Step 6.2: Backend Notification Sending (Node.js)

**File:** `src/services/notificationService.ts` (Server)

```typescript
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  })
});

export const sendNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: any
) => {
  try {
    const message = {
      notification: {
        title,
        body
      },
      data,
      token: fcmToken
    };

    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// Send to multiple devices
export const sendMulticastNotification = async (
  fcmTokens: string[],
  title: string,
  body: string
) => {
  const message = {
    notification: { title, body },
    tokens: fcmTokens
  };

  const response = await admin.messaging().sendMulticast(message);
  console.log("Multicast sent:", response);
  return response;
};
```

### Step 6.3: Schedule Dose Reminders

**File:** `services/reminderService.ts`

```typescript
import { notificationService } from "./notificationService";
import { getMedications } from "./dataService";

export const scheduleAllReminders = async (userId: string) => {
  const medications = await getMedications(userId);

  // Clear existing reminders
  await notifee.cancelAllNotifications();

  // Schedule new reminders
  for (const medication of medications) {
    for (const time of medication.timesOfDay) {
      await notificationService.scheduleNotification(medication, time);
    }
  }
};
```

---

## Phase 7: Android Deployment

### Step 7.1: Configure Android Build

**File:** `android/app/build.gradle`

```gradle
android {
    ...
    defaultConfig {
        applicationId "com.pillbow.app"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            storeFile file('pillbow-release-key.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias 'pillbow'
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 7.2: Generate Signing Key

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore pillbow-release-key.keystore -alias pillbow -keyalg RSA -keysize 2048 -validity 10000
```

### Step 7.3: Build APK/AAB

```bash
# Development APK
cd android
./gradlew assembleRelease

# Production AAB (for Play Store)
./gradlew bundleRelease

# Output:
# android/app/build/outputs/apk/release/app-release.apk
# android/app/build/outputs/bundle/release/app-release.aab
```

### Step 7.4: Test on Android Device

```bash
# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# OR use Expo
npx expo run:android --variant release
```

### Step 7.5: Google Play Store Submission

1. Create Google Play Console account ($25 one-time fee)
2. Create app listing
3. Upload AAB file
4. Fill out store listing (screenshots, description, privacy policy)
5. Submit for review

---

## Phase 8: iOS Deployment

### Step 8.1: Prerequisites

- macOS computer (required for iOS builds)
- Apple Developer account ($99/year)
- Xcode installed

### Step 8.2: Configure iOS Build

**File:** `ios/PillBow/Info.plist`

```xml
<key>CFBundleDisplayName</key>
<string>PillBow</string>
<key>CFBundleIdentifier</key>
<string>com.pillbow.app</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<!-- Permissions -->
<key>NSCameraUsageDescription</key>
<string>Take photos of medication labels for AI scanning</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Select medication photos from your library</string>
<key>NSUserNotificationsUsageDescription</key>
<string>Receive reminders for your medications</string>
```

### Step 8.3: Setup Provisioning

1. Open Xcode
2. Select project → Signing & Capabilities
3. Select team (Apple Developer account)
4. Enable "Automatically manage signing"
5. Configure capabilities:
   - Push Notifications
   - Background Modes (Remote notifications)

### Step 8.4: Build iOS App

```bash
# Using Expo
npx expo run:ios --configuration Release

# OR build for App Store
eas build --platform ios

# OR manually with Xcode
# Open ios/PillBow.xcworkspace
# Product → Archive
```

### Step 8.5: App Store Submission

1. Open Xcode
2. Product → Archive
3. Distribute App → App Store Connect
4. Upload
5. Open App Store Connect
6. Fill out app information
7. Submit for review

---

## Phase 9: Testing & Validation

### Step 9.1: Testing Checklist

#### Functional Testing

- [ ] All components render correctly
- [ ] Navigation works (tabs, modals, back)
- [ ] CRUD operations for medications
- [ ] Dose marking and persistence
- [ ] User switching
- [ ] Import/export functionality
- [ ] Offline functionality
- [ ] Sync after going online
- [ ] Real-time updates across devices
- [ ] Push notifications received
- [ ] Local notifications at scheduled times

#### Platform-Specific Testing

- [ ] Android: Back button handling
- [ ] Android: Notification channels
- [ ] iOS: Swipe gestures
- [ ] iOS: Safe area insets
- [ ] Both: Keyboard avoidance
- [ ] Both: Orientation changes

#### Performance Testing

- [ ] App startup time < 3 seconds
- [ ] Smooth scrolling (60 FPS)
- [ ] No memory leaks
- [ ] Battery usage acceptable
- [ ] Network usage reasonable

### Step 9.2: Automated Testing

**File:** `__tests__/api.test.ts`

```typescript
import { apiService } from "../services/apiService";

describe("API Service", () => {
  it("should fetch medications", async () => {
    const medications = await apiService.getMedications("user123");
    expect(medications).toBeDefined();
    expect(Array.isArray(medications.data)).toBe(true);
  });

  it("should update dose status", async () => {
    const result = await apiService.updateDoseStatus("user123", "2026-01-23", {
      medicationId: "med1",
      status: "taken"
    });
    expect(result.status).toBe(200);
  });
});
```

---

## Phase 10: Deployment Checklist

### Pre-Launch

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] Support email configured
- [ ] Analytics integrated (optional)
- [ ] Crash reporting setup (Sentry, etc.)

### Android Launch

- [ ] APK/AAB built and signed
- [ ] Tested on multiple devices
- [ ] Screenshots prepared (phone + tablet)
- [ ] Store listing complete
- [ ] Privacy policy URL added
- [ ] Submitted to Play Store
- [ ] Monitoring reviews and crashes

### iOS Launch

- [ ] App archived and uploaded
- [ ] Tested on multiple devices
- [ ] Screenshots prepared (all required sizes)
- [ ] App Store listing complete
- [ ] Privacy policy URL added
- [ ] Submitted to App Store
- [ ] Monitoring TestFlight feedback

### Backend Launch

- [ ] Server deployed (Heroku, AWS, GCP, etc.)
- [ ] Database backups configured
- [ ] SSL certificate installed
- [ ] Rate limiting configured
- [ ] Monitoring/alerting setup
- [ ] Scaling plan in place

---

## Estimated Timeline

| Phase                      | Duration | Dependencies    |
| -------------------------- | -------- | --------------- |
| 1. React Native Setup      | 1 week   | None            |
| 2. Component Migration     | 4 weeks  | Phase 1         |
| 3. Backend Architecture    | 2 weeks  | None (parallel) |
| 4. API Integration         | 2 weeks  | Phase 2, 3      |
| 5. Real-time Communication | 1 week   | Phase 4         |
| 6. Push Notifications      | 1 week   | Phase 3         |
| 7. Android Deployment      | 1 week   | Phase 2-6       |
| 8. iOS Deployment          | 1 week   | Phase 2-6       |
| 9. Testing & QA            | 2 weeks  | Phase 7-8       |
| 10. Launch & Monitoring    | 1 week   | Phase 9         |

**Total: 12-16 weeks** (3-4 months)

---

## Quick Start Commands

```bash
# 1. Create React Native project
npx create-expo-app pillbow-mobile
cd pillbow-mobile

# 2. Install dependencies
npm install @react-navigation/native @react-navigation/stack
npm install zustand date-fns
npm install @react-native-async-storage/async-storage
npm install @react-native-firebase/app @react-native-firebase/firestore
npm install @react-native-firebase/messaging
npm install @notifee/react-native

# 3. Run on Android
npx expo run:android

# 4. Run on iOS (macOS only)
npx expo run:ios

# 5. Build for production
eas build --platform android
eas build --platform ios
```

---

**END OF MIGRATION PLAN**

For questions or issues during migration, refer to:

- React Native docs: https://reactnative.dev
- Expo docs: https://docs.expo.dev
- Firebase docs: https://rnfirebase.io
- Socket.io docs: https://socket.io/docs/v4/
