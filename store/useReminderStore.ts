import { create } from 'zustand';

const REMINDER_STORAGE_KEY = 'pillbow_reminders';

export type ReminderLeadTime = 10 | 20 | 30 | 60;

interface ReminderState {
  enabled: boolean;
  leadTimeMinutes: ReminderLeadTime;
  notifiedDoses: Set<string>;
  isModalOpen: boolean;
  permissionGranted: boolean;

  setEnabled: (enabled: boolean) => void;
  setLeadTime: (minutes: ReminderLeadTime) => void;
  markDoseNotified: (doseKey: string) => void;
  clearNotifiedDoses: () => void;
  openModal: () => void;
  closeModal: () => void;
  setPermissionGranted: (granted: boolean) => void;
  loadFromStorage: () => void;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  enabled: false,
  leadTimeMinutes: 10,
  notifiedDoses: new Set<string>(),
  isModalOpen: false,
  permissionGranted: false,

  setEnabled: (enabled) => {
    set({ enabled });
    const { leadTimeMinutes } = get();
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify({ enabled, leadTimeMinutes }));
  },

  setLeadTime: (minutes) => {
    set({ leadTimeMinutes: minutes });
    const { enabled } = get();
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify({ enabled, leadTimeMinutes: minutes }));
  },

  markDoseNotified: (doseKey) => {
    set((state) => {
      const next = new Set(state.notifiedDoses);
      next.add(doseKey);
      return { notifiedDoses: next };
    });
  },

  clearNotifiedDoses: () => {
    set({ notifiedDoses: new Set() });
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setPermissionGranted: (granted) => set({ permissionGranted: granted }),

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          enabled: data.enabled ?? false,
          leadTimeMinutes: data.leadTimeMinutes ?? 10,
        });
      }
      if ('Notification' in window) {
        set({ permissionGranted: Notification.permission === 'granted' });
      }
    } catch {
      // ignore corrupt data
    }
  },
}));
