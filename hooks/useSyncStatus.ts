/**
 * Hook to monitor sync status
 * Provides real-time sync status for UI components
 */

import { useState, useEffect, useCallback } from 'react';
import {
  isOnline,
  isAuthenticated,
  canSync,
  getLastSyncTime,
  getPendingSyncCount,
  processSyncQueue,
  fullSyncFromCloud,
} from '../services/syncService';

interface SyncStatus {
  isOnline: boolean;
  isAuthenticated: boolean;
  canSync: boolean;
  lastSyncTime: string | null;
  pendingCount: number;
  isSyncing: boolean;
}

export const useSyncStatus = () => {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: isOnline(),
    isAuthenticated: isAuthenticated(),
    canSync: canSync(),
    lastSyncTime: getLastSyncTime(),
    pendingCount: getPendingSyncCount(),
    isSyncing: false,
  });

  // Update status periodically
  useEffect(() => {
    const updateStatus = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: isOnline(),
        isAuthenticated: isAuthenticated(),
        canSync: canSync(),
        lastSyncTime: getLastSyncTime(),
        pendingCount: getPendingSyncCount(),
      }));
    };

    // Update on online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Poll every 10 seconds for pending count changes
    const interval = setInterval(updateStatus, 10000);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  // Manual sync trigger
  const triggerSync = useCallback(async () => {
    if (!canSync()) return false;

    setStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      await processSyncQueue();
      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: getLastSyncTime(),
        pendingCount: getPendingSyncCount(),
      }));
      return true;
    } catch (error) {
      setStatus((prev) => ({ ...prev, isSyncing: false }));
      return false;
    }
  }, []);

  // Full sync from cloud
  const syncFromCloud = useCallback(async () => {
    if (!canSync()) return false;

    setStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      const result = await fullSyncFromCloud();
      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: getLastSyncTime(),
        pendingCount: getPendingSyncCount(),
      }));
      return result;
    } catch (error) {
      setStatus((prev) => ({ ...prev, isSyncing: false }));
      return false;
    }
  }, []);

  return {
    ...status,
    triggerSync,
    syncFromCloud,
  };
};
