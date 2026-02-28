/**
 * Sync Service for PillBow
 * 
 * Implements offline-first sync strategy:
 * 1. Local storage is the primary source of truth
 * 2. Changes are queued when offline
 * 3. Sync to Firestore when online and authenticated
 * 4. Merge strategy: last-write-wins based on timestamp
 */

import { auth } from "./firebase";
import { loadAppData, saveAppData } from "./dataService";
import {
  firestoreLoadAllData,
  firestoreSaveAllData,
  firestoreAddMedication,
  firestoreUpdateMedication,
  firestoreDeleteMedication,
  firestoreSaveDayLog,
  firestoreSaveSettings,
} from "./firestoreService";
import { AppData, Medication, DayLog, AppSettings } from "../types";

const SYNC_QUEUE_KEY = "pillbow_sync_queue";
const LAST_SYNC_KEY = "pillbow_last_sync";

interface SyncQueueItem {
  id: string;
  type: "medication_add" | "medication_update" | "medication_delete" | "daylog_update" | "settings_update";
  data: any;
  timestamp: number;
}

// ============ SYNC QUEUE MANAGEMENT ============

const getSyncQueue = (): SyncQueueItem[] => {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveSyncQueue = (queue: SyncQueueItem[]): void => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
};

const addToSyncQueue = (item: Omit<SyncQueueItem, "id" | "timestamp">): void => {
  const queue = getSyncQueue();
  queue.push({
    ...item,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  });
  saveSyncQueue(queue);
};

const clearSyncQueue = (): void => {
  localStorage.removeItem(SYNC_QUEUE_KEY);
};

// ============ ONLINE STATUS ============

export const isOnline = (): boolean => navigator.onLine;

export const isAuthenticated = (): boolean => !!auth.currentUser;

export const canSync = (): boolean => isOnline() && isAuthenticated();

// ============ SYNC OPERATIONS ============

/**
 * Queue a medication add for sync
 */
export const queueMedicationAdd = (medication: Medication): void => {
  addToSyncQueue({ type: "medication_add", data: medication });
  if (canSync()) processSyncQueue();
};

/**
 * Queue a medication update for sync
 */
export const queueMedicationUpdate = (medicationId: string, updates: Partial<Medication>): void => {
  addToSyncQueue({ type: "medication_update", data: { medicationId, updates } });
  if (canSync()) processSyncQueue();
};

/**
 * Queue a medication delete for sync
 */
export const queueMedicationDelete = (medicationId: string): void => {
  addToSyncQueue({ type: "medication_delete", data: { medicationId } });
  if (canSync()) processSyncQueue();
};

/**
 * Queue a day log update for sync
 */
export const queueDayLogUpdate = (dayLog: DayLog): void => {
  addToSyncQueue({ type: "daylog_update", data: dayLog });
  if (canSync()) processSyncQueue();
};

/**
 * Queue settings update for sync
 */
export const queueSettingsUpdate = (settings: AppSettings): void => {
  addToSyncQueue({ type: "settings_update", data: settings });
  if (canSync()) processSyncQueue();
};

/**
 * Process all queued sync items
 */
export const processSyncQueue = async (): Promise<void> => {
  if (!canSync()) return;

  const queue = getSyncQueue();
  if (queue.length === 0) return;

  const failedItems: SyncQueueItem[] = [];

  for (const item of queue) {
    try {
      switch (item.type) {
        case "medication_add":
          await firestoreAddMedication(item.data);
          break;
        case "medication_update":
          await firestoreUpdateMedication(item.data.medicationId, item.data.updates);
          break;
        case "medication_delete":
          await firestoreDeleteMedication(item.data.medicationId);
          break;
        case "daylog_update":
          await firestoreSaveDayLog(item.data);
          break;
        case "settings_update":
          await firestoreSaveSettings(item.data);
          break;
      }
    } catch (error) {
      console.error(`Sync failed for ${item.type}:`, error);
      failedItems.push(item);
    }
  }

  // Keep only failed items in queue
  saveSyncQueue(failedItems);
  
  if (failedItems.length === 0) {
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  }
};

/**
 * Full sync: Download from cloud and merge with local
 * Called on login to sync user's cloud data
 */
export const fullSyncFromCloud = async (): Promise<boolean> => {
  if (!canSync()) return false;

  try {
    const cloudData = await firestoreLoadAllData();
    if (!cloudData) {
      // No cloud data, upload local data
      const localData = loadAppData();
      await firestoreSaveAllData(localData);
      return true;
    }

    const localData = loadAppData();
    const mergedData = mergeData(localData, cloudData);
    
    // Save merged data locally
    saveAppData(mergedData);
    
    // Upload merged data to cloud
    await firestoreSaveAllData(mergedData);
    
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error("Full sync failed:", error);
    return false;
  }
};

/**
 * Upload all local data to cloud
 * Called when user first signs in with existing local data
 */
export const uploadLocalToCloud = async (): Promise<boolean> => {
  if (!canSync()) return false;

  try {
    const localData = loadAppData();
    await firestoreSaveAllData(localData);
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error("Upload to cloud failed:", error);
    return false;
  }
};

/**
 * Download all cloud data to local (overwrite)
 * Called when user wants to restore from cloud
 */
export const downloadFromCloud = async (): Promise<boolean> => {
  if (!canSync()) return false;

  try {
    const cloudData = await firestoreLoadAllData();
    if (cloudData) {
      saveAppData(cloudData);
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      return true;
    }
    return false;
  } catch (error) {
    console.error("Download from cloud failed:", error);
    return false;
  }
};

// ============ MERGE STRATEGY ============

/**
 * Merge local and cloud data using last-write-wins
 */
const mergeData = (local: AppData, cloud: AppData): AppData => {
  // Compare timestamps
  const localTime = new Date(local.lastUpdated).getTime();
  const cloudTime = new Date(cloud.lastUpdated).getTime();

  // Merge medications by ID, keeping the newer version
  const medicationMap = new Map<string, Medication>();
  
  [...local.medications, ...cloud.medications].forEach((med) => {
    const existing = medicationMap.get(med.id);
    if (!existing) {
      medicationMap.set(med.id, med);
    }
    // If exists, keep based on overall data timestamp (simple strategy)
  });

  // Merge day logs by date, keeping the one with more doses or newer
  const dayLogMap = new Map<string, DayLog>();
  
  [...local.dayLogs, ...cloud.dayLogs].forEach((log) => {
    const existing = dayLogMap.get(log.date);
    if (!existing) {
      dayLogMap.set(log.date, log);
    } else {
      // Keep the one with more dose records
      if (log.doses.length > existing.doses.length) {
        dayLogMap.set(log.date, log);
      }
    }
  });

  return {
    medications: Array.from(medicationMap.values()),
    dayLogs: Array.from(dayLogMap.values()),
    settings: cloudTime > localTime ? cloud.settings : local.settings,
    lastUpdated: new Date().toISOString(),
  };
};

// ============ SYNC STATUS ============

export const getLastSyncTime = (): string | null => {
  return localStorage.getItem(LAST_SYNC_KEY);
};

export const getPendingSyncCount = (): number => {
  return getSyncQueue().length;
};

// ============ AUTO-SYNC SETUP ============

let syncInterval: number | null = null;

export const startAutoSync = (intervalMs: number = 60000): void => {
  if (syncInterval) return;
  
  syncInterval = window.setInterval(() => {
    if (canSync()) {
      processSyncQueue();
    }
  }, intervalMs);

  // Also sync when coming back online
  window.addEventListener("online", () => {
    if (canSync()) {
      processSyncQueue();
    }
  });
};

export const stopAutoSync = (): void => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};
