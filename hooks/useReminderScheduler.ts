import { useEffect, useRef, useCallback, useState } from 'react';
import { Medication } from '../types';
import { useReminderStore } from '../store/useReminderStore';
import { getDueReminders, PendingReminder } from '../services/reminderService';
import { playNotificationSound } from '../utils/audioAndFileUtils';
import { NOTIFICATION_SOUND_URL } from '../constants';

const CHECK_INTERVAL_MS = 30_000; // 30 seconds

function sendBrowserNotification(reminder: PendingReminder): void {
  try {
    new Notification('PillBow Reminder', {
      body: `${reminder.medicationName} in ${reminder.minutesUntilDose} min (${reminder.time})`,
      icon: '/icon-192x192.png',
      tag: reminder.doseKey,
      requireInteraction: false,
    });
  } catch {
    // Browser notification not available
  }
}

export interface ActiveToast {
  id: string;
  medicationName: string;
  time: string;
  minutesUntil: number;
}

export function useReminderScheduler(medications: Medication[]) {
  const intervalRef = useRef<number | null>(null);
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);

  // Load stored preferences on mount
  useEffect(() => {
    useReminderStore.getState().loadFromStorage();
  }, []);

  const checkReminders = useCallback(() => {
    const { enabled, leadTimeMinutes, notifiedDoses, markDoseNotified, permissionGranted } =
      useReminderStore.getState();

    if (!enabled || medications.length === 0) return;

    const dueReminders = getDueReminders(medications, leadTimeMinutes, notifiedDoses);
    if (dueReminders.length === 0) return;

    for (const reminder of dueReminders) {
      markDoseNotified(reminder.doseKey);

      // Play sound
      playNotificationSound(NOTIFICATION_SOUND_URL);

      // Browser notification when tab not focused
      if (!document.hasFocus() && permissionGranted) {
        sendBrowserNotification(reminder);
      }

      // In-app toast (show the latest one)
      setActiveToast({
        id: reminder.doseKey,
        medicationName: reminder.medicationName,
        time: reminder.time,
        minutesUntil: reminder.minutesUntilDose,
      });
    }
  }, [medications]);

  // Start/stop interval based on enabled state
  useEffect(() => {
    const { enabled } = useReminderStore.getState();

    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Run immediately
    checkReminders();

    // Then every 30 seconds
    intervalRef.current = window.setInterval(checkReminders, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkReminders]);

  // Subscribe to enabled state changes to restart/stop interval
  useEffect(() => {
    const unsub = useReminderStore.subscribe((state, prev) => {
      if (state.enabled !== (prev as any).enabled) {
        // Clear old interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (state.enabled) {
          checkReminders();
          intervalRef.current = window.setInterval(checkReminders, CHECK_INTERVAL_MS);
        }
      }
    });

    return unsub;
  }, [checkReminders]);

  // Clear notified doses at midnight
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    const midnightTimer = window.setTimeout(() => {
      useReminderStore.getState().clearNotifiedDoses();
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return { activeToast, dismissToast };
}
