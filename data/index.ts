// Data exports
export * from "./constants";
export * from "./medications";
export * from "./schedules";
export * from "./logs";

import { MEDICATIONS, MedicationDef, getMedicationById } from "./medications";
import { SCHEDULES, Schedule, getSchedulesForDate } from "./schedules";
import { LOGS, DoseLog, getLogsForDate, getLogStatus, exportLogsAsText, getLogsForDateRange } from "./logs";
import { FORM_TYPES, WARNING_CODES } from "./constants";

// Combined view for a single day
export interface DayDose {
  medId: string;
  medication: MedicationDef;
  schedule: Schedule;
  time: string;
  status: "taken" | "skipped" | "pending";
  takenAt?: string;
}

export interface DayView {
  date: string;
  doses: DayDose[];
  stats: {
    total: number;
    taken: number;
    skipped: number;
    pending: number;
  };
}

// Get combined view for a day
export const getDayView = (date: string): DayView => {
  const schedules = getSchedulesForDate(date);
  const doses: DayDose[] = [];

  schedules.forEach(schedule => {
    const medication = getMedicationById(schedule.medId);
    if (!medication) return;

    schedule.times.forEach(time => {
      const log = getLogStatus(date, schedule.medId, time);
      doses.push({
        medId: schedule.medId,
        medication,
        schedule,
        time,
        status: log?.status || "pending",
        takenAt: log?.takenAt,
      });
    });
  });

  // Sort by time
  doses.sort((a, b) => a.time.localeCompare(b.time));

  const taken = doses.filter(d => d.status === "taken").length;
  const skipped = doses.filter(d => d.status === "skipped").length;

  return {
    date,
    doses,
    stats: {
      total: doses.length,
      taken,
      skipped,
      pending: doses.length - taken - skipped,
    },
  };
};

// Get day status color
export const getDayStatusColor = (stats: DayView["stats"]): "green" | "orange" | "red" | "gray" => {
  if (stats.total === 0) return "gray";
  if (stats.taken === stats.total) return "green";
  if (stats.taken === 0 && stats.skipped > 0) return "red";
  return "orange";
};

// Share helpers
export const shareViaEmail = (startDate: string, endDate: string, email?: string) => {
  const text = exportLogsAsText(startDate, endDate);
  const subject = encodeURIComponent(`My Medication History: ${startDate} to ${endDate}`);
  const body = encodeURIComponent(text);
  const mailtoUrl = email
    ? `mailto:${email}?subject=${subject}&body=${body}`
    : `mailto:?subject=${subject}&body=${body}`;
  window.open(mailtoUrl);
};

export const shareViaWhatsApp = (startDate: string, endDate: string) => {
  const text = exportLogsAsText(startDate, endDate);
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`);
};

export const copyToClipboard = async (startDate: string, endDate: string): Promise<boolean> => {
  const text = exportLogsAsText(startDate, endDate);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Export as JSON for backup
export const exportAsJSON = () => {
  return JSON.stringify({
    medications: MEDICATIONS,
    schedules: SCHEDULES,
    logs: LOGS,
    exportedAt: new Date().toISOString(),
  }, null, 2);
};

// Save to file (download)
export const saveToFile = (filename?: string) => {
  const data = exportAsJSON();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `pillbow-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Save history range to file (text format)
export const saveHistoryToFile = (startDate: string, endDate: string) => {
  const text = exportLogsAsText(startDate, endDate);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pillbow-history-${startDate}-to-${endDate}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Load from file (for import)
export const loadFromFile = (file: File): Promise<{ medications: MedicationDef[], schedules: Schedule[], logs: DoseLog[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve({
          medications: data.medications || [],
          schedules: data.schedules || [],
          logs: data.logs || [],
        });
      } catch (err) {
        reject(new Error("Invalid file format"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
