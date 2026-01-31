/**
 * Data Service for pillbow
 *
 * This service handles all data persistence using localStorage.
 * It's designed to be easily portable to React Native by replacing
 * localStorage with AsyncStorage.
 *
 * For React Native migration:
 * 1. Replace localStorage.getItem with AsyncStorage.getItem
 * 2. Replace localStorage.setItem with Asy
 * ncStorage.setItem
 * 3. Make all methods async (they already return promises-compatible values)
 */

import { AppData, Medication, DayLog, DoseRecord, DoseStatus, AppSettings } from '../types';

const STORAGE_KEY = 'pillbow_app_data';

// Default app data
const getDefaultAppData = (): AppData => ({
  medications: [],
  dayLogs: [],
  settings: {
    reminderEnabled: true,
    soundEnabled: true,
  },
  lastUpdated: new Date().toISOString(),
});

// Storage abstraction - easy to replace for React Native
const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  },
};

// Migrate old medication format to new format
const migrateMedication = (med: any): Medication => {
  // If already has timesOfDay, return as is
  if (med.timesOfDay && Array.isArray(med.timesOfDay)) {
    return med as Medication;
  }

  // Migrate from old format (timeOfDay single value)
  const timeMap: Record<string, string> = {
    'Morning': '06:00',
    'Noon': '10:00',
    'Afternoon': '14:00',
    'Evening': '20:00',
  };

  return {
    ...med,
    dosesPerDay: 1,
    timesOfDay: [timeMap[med.timeOfDay] || med.time || '06:00'],
  };
};

// Load all app data
export const loadAppData = (): AppData => {
  const raw = storage.get(STORAGE_KEY);
  if (!raw) {
    return getDefaultAppData();
  }
  try {
    const data = JSON.parse(raw) as AppData;
    // Migrate medications if needed
    if (data.medications) {
      data.medications = data.medications.map(migrateMedication);
    }
    return data;
  } catch {
    return getDefaultAppData();
  }
};

// Save all app data
export const saveAppData = (data: AppData): void => {
  data.lastUpdated = new Date().toISOString();
  storage.set(STORAGE_KEY, JSON.stringify(data));
};

// Get all medications
export const getMedications = (): Medication[] => {
  const data = loadAppData();
  return data.medications;
};

// Add a new medication
export const addMedication = (medication: Medication): void => {
  const data = loadAppData();
  data.medications.push(medication);
  saveAppData(data);
};

// Update a medication
export const updateMedication = (id: string, updates: Partial<Medication>): void => {
  const data = loadAppData();
  const index = data.medications.findIndex(m => m.id === id);
  if (index !== -1) {
    data.medications[index] = { ...data.medications[index], ...updates };
    saveAppData(data);
  }
};

// Delete a medication
export const deleteMedication = (id: string): void => {
  const data = loadAppData();
  data.medications = data.medications.filter(m => m.id !== id);
  saveAppData(data);
};

// Get day log for a specific date
export const getDayLog = (dateStr: string): DayLog | undefined => {
  const data = loadAppData();
  return data.dayLogs.find(log => log.date === dateStr);
};

// Get or create day log for a specific date
export const getOrCreateDayLog = (dateStr: string, medications: Medication[]): DayLog => {
  const data = loadAppData();
  let dayLog = data.dayLogs.find(log => log.date === dateStr);

  if (!dayLog) {
    // Create new day log with all pending doses
    const doses: DoseRecord[] = [];
    medications.forEach(med => {
      // Check if medication is active on this date
      const date = new Date(dateStr);
      const startDate = med.startDate ? new Date(med.startDate) : null;
      const endDate = med.endDate ? new Date(med.endDate) : null;

      if (startDate && date < startDate) return;
      if (endDate && date > endDate) return;

      // Day-of-week filter
      if (med.daysOfWeek && med.daysOfWeek.length > 0) {
        if (!med.daysOfWeek.includes(date.getDay())) return;
      }

      med.timesOfDay.forEach(time => {
        doses.push({
          medicationId: med.id,
          time,
          status: DoseStatus.PENDING,
        });
      });
    });

    dayLog = { date: dateStr, doses };
    data.dayLogs.push(dayLog);
    saveAppData(data);
  }

  return dayLog;
};

// Update dose status for a specific day/medication/time
export const updateDoseStatus = (
  dateStr: string,
  medicationId: string,
  time: string,
  status: DoseStatus
): void => {
  const data = loadAppData();
  let dayLog = data.dayLogs.find(log => log.date === dateStr);

  if (!dayLog) {
    dayLog = { date: dateStr, doses: [] };
    data.dayLogs.push(dayLog);
  }

  const doseIndex = dayLog.doses.findIndex(
    d => d.medicationId === medicationId && d.time === time
  );

  if (doseIndex !== -1) {
    dayLog.doses[doseIndex].status = status;
    if (status === DoseStatus.TAKEN) {
      dayLog.doses[doseIndex].takenAt = new Date().toISOString();
    }
  } else {
    dayLog.doses.push({
      medicationId,
      time,
      status,
      takenAt: status === DoseStatus.TAKEN ? new Date().toISOString() : undefined,
    });
  }

  saveAppData(data);
};

// Get dose status for a specific medication/time on a date
export const getDoseStatus = (
  dateStr: string,
  medicationId: string,
  time: string
): DoseStatus => {
  const dayLog = getDayLog(dateStr);
  if (!dayLog) return DoseStatus.PENDING;

  const dose = dayLog.doses.find(
    d => d.medicationId === medicationId && d.time === time
  );

  return dose?.status ?? DoseStatus.PENDING;
};

// Check if a date is editable (only today can be edited)
export const isDateEditable = (dateStr: string): boolean => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  return dateStr === todayStr;
};

// Get all day logs in a date range
export const getDayLogsInRange = (startDate: string, endDate: string): DayLog[] => {
  const data = loadAppData();
  return data.dayLogs.filter(log => log.date >= startDate && log.date <= endDate);
};

// Get settings
export const getSettings = (): AppSettings => {
  const data = loadAppData();
  return data.settings;
};

// Update settings
export const updateSettings = (updates: Partial<AppSettings>): void => {
  const data = loadAppData();
  data.settings = { ...data.settings, ...updates };
  saveAppData(data);
};

// Export data as JSON string (for backup)
export const exportData = (): string => {
  const data = loadAppData();
  return JSON.stringify(data, null, 2);
};

// Import data from JSON string (for restore)
export const importData = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr) as AppData;
    if (data.medications && data.dayLogs && data.settings) {
      saveAppData(data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// Clear all data
export const clearAllData = (): void => {
  // Clear the active storage key
  saveAppData(getDefaultAppData());

  // Clear all pillbow related keys in localStorage
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('pillbow_')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
};

// Get medications active on a specific date
export const getMedicationsForDate = (dateStr: string, medications: Medication[]): Medication[] => {
  if (!medications || !Array.isArray(medications)) return [];

  const date = new Date(dateStr);
  return medications.filter(med => {
    if (!med) return false;

    const startDate = med.startDate ? new Date(med.startDate) : null;
    const endDate = med.endDate ? new Date(med.endDate) : null;

    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;

    // Day-of-week filter
    if (med.daysOfWeek && med.daysOfWeek.length > 0) {
      if (!med.daysOfWeek.includes(date.getDay())) return false;
    }

    return true;
  }).map(migrateMedication);
};

// Get unique time slots for a specific date based on active medications
export const getTimeSlotsForDate = (dateStr: string, medications: Medication[]): string[] => {
  const activeMeds = getMedicationsForDate(dateStr, medications);
  const times = new Set<string>();

  activeMeds.forEach(med => {
    med.timesOfDay.forEach(time => times.add(time));
  });

  return Array.from(times).sort();
};

// Calculate completion stats for a day
export const getDayStats = (dateStr: string, medications: Medication[]): { total: number; taken: number } => {
  const dayLog = getDayLog(dateStr);
  const activeMeds = getMedicationsForDate(dateStr, medications);

  let total = 0;
  let taken = 0;

  activeMeds.forEach(med => {
    total += med.timesOfDay.length;
  });

  if (dayLog) {
    taken = dayLog.doses.filter(d => d.status === DoseStatus.TAKEN).length;
  }

  return { total, taken };
};
