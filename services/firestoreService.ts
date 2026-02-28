/**
 * Firestore Service for PillBow
 * 
 * Handles all Firestore database operations.
 * Data structure:
 *   users/{userId}/medications/{medicationId}
 *   users/{userId}/dayLogs/{date}
 *   users/{userId}/profile
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { Medication, DayLog, UserProfile, AppSettings, AppData } from "../types";

// Get current user ID or null
const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};

// Collection references
const getUserMedicationsRef = (userId: string) =>
  collection(db, "users", userId, "medications");

const getUserDayLogsRef = (userId: string) =>
  collection(db, "users", userId, "dayLogs");

const getUserProfileRef = (userId: string) =>
  doc(db, "users", userId, "profile", "data");

const getUserSettingsRef = (userId: string) =>
  doc(db, "users", userId, "settings", "data");

// ============ MEDICATIONS ============

export const firestoreAddMedication = async (medication: Medication): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const medRef = doc(getUserMedicationsRef(userId), medication.id);
  await setDoc(medRef, {
    ...medication,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const firestoreUpdateMedication = async (
  medicationId: string,
  updates: Partial<Medication>
): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const medRef = doc(getUserMedicationsRef(userId), medicationId);
  await updateDoc(medRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const firestoreDeleteMedication = async (medicationId: string): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const medRef = doc(getUserMedicationsRef(userId), medicationId);
  await deleteDoc(medRef);
};

export const firestoreGetMedications = async (): Promise<Medication[]> => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const snapshot = await getDocs(getUserMedicationsRef(userId));
  return snapshot.docs.map((doc) => doc.data() as Medication);
};

// ============ DAY LOGS ============

export const firestoreGetDayLog = async (dateStr: string): Promise<DayLog | null> => {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const logRef = doc(getUserDayLogsRef(userId), dateStr);
  const snapshot = await getDoc(logRef);
  return snapshot.exists() ? (snapshot.data() as DayLog) : null;
};

export const firestoreSaveDayLog = async (dayLog: DayLog): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const logRef = doc(getUserDayLogsRef(userId), dayLog.date);
  await setDoc(logRef, {
    ...dayLog,
    updatedAt: serverTimestamp(),
  });
};

export const firestoreGetDayLogsInRange = async (
  startDate: string,
  endDate: string
): Promise<DayLog[]> => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const logsRef = getUserDayLogsRef(userId);
  const q = query(logsRef, where("date", ">=", startDate), where("date", "<=", endDate));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as DayLog);
};

// ============ USER PROFILE ============

export const firestoreGetUserProfile = async (): Promise<UserProfile | null> => {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const profileRef = getUserProfileRef(userId);
  const snapshot = await getDoc(profileRef);
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
};

export const firestoreSaveUserProfile = async (profile: UserProfile): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const profileRef = getUserProfileRef(userId);
  await setDoc(profileRef, {
    ...profile,
    updatedAt: serverTimestamp(),
  });
};

// ============ SETTINGS ============

export const firestoreGetSettings = async (): Promise<AppSettings | null> => {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const settingsRef = getUserSettingsRef(userId);
  const snapshot = await getDoc(settingsRef);
  return snapshot.exists() ? (snapshot.data() as AppSettings) : null;
};

export const firestoreSaveSettings = async (settings: AppSettings): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const settingsRef = getUserSettingsRef(userId);
  await setDoc(settingsRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  });
};

// ============ BULK OPERATIONS ============

export const firestoreSaveAllData = async (data: AppData): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const batch = writeBatch(db);

  // Save medications
  data.medications.forEach((med) => {
    const medRef = doc(getUserMedicationsRef(userId), med.id);
    batch.set(medRef, { ...med, updatedAt: serverTimestamp() });
  });

  // Save day logs
  data.dayLogs.forEach((log) => {
    const logRef = doc(getUserDayLogsRef(userId), log.date);
    batch.set(logRef, { ...log, updatedAt: serverTimestamp() });
  });

  // Save settings
  const settingsRef = getUserSettingsRef(userId);
  batch.set(settingsRef, { ...data.settings, updatedAt: serverTimestamp() });

  await batch.commit();
};

export const firestoreLoadAllData = async (): Promise<AppData | null> => {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const [medications, settings] = await Promise.all([
    firestoreGetMedications(),
    firestoreGetSettings(),
  ]);

  // Get day logs for reasonable range (30 days back, 60 forward)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 60);

  const dayLogs = await firestoreGetDayLogsInRange(
    startDate.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0]
  );

  return {
    medications,
    dayLogs,
    settings: settings || { reminderEnabled: true, soundEnabled: true },
    lastUpdated: new Date().toISOString(),
  };
};

// ============ REAL-TIME LISTENERS ============

export const subscribeToMedications = (
  callback: (medications: Medication[]) => void
): Unsubscribe | null => {
  const userId = getCurrentUserId();
  if (!userId) return null;

  return onSnapshot(getUserMedicationsRef(userId), (snapshot) => {
    const medications = snapshot.docs.map((doc) => doc.data() as Medication);
    callback(medications);
  });
};

export const subscribeToDayLog = (
  dateStr: string,
  callback: (dayLog: DayLog | null) => void
): Unsubscribe | null => {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const logRef = doc(getUserDayLogsRef(userId), dateStr);
  return onSnapshot(logRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.data() as DayLog) : null);
  });
};
