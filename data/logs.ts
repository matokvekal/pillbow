// Daily dose logs - flat records of what was taken/skipped
export interface DoseLog {
  date: string;      // "2025-01-16"
  medId: string;     // references MedicationDef.id
  time: string;      // "08:00"
  status: "taken" | "skipped" | "pending";
  takenAt?: string;  // actual time taken "08:15"
}

// Generate sample 3 months history
const generateLogs = (): DoseLog[] => {
  const logs: DoseLog[] = [];

  // Helper to add log entry
  const addLog = (date: string, medId: string, time: string, status: "taken" | "skipped" | "pending", takenAt?: string) => {
    logs.push({ date, medId, time, status, takenAt });
  };

  // October 2025 - Start of Metformin, Aspirin, Vitamin D, Lisinopril, Insulin
  // User is getting used to routine, some misses

  // Oct 1-7: Learning phase, many misses
  addLog("2025-10-01", "med_1", "08:00", "taken", "08:30");
  addLog("2025-10-01", "med_1", "20:00", "skipped");
  addLog("2025-10-01", "med_2", "08:00", "taken", "08:30");
  addLog("2025-10-01", "med_3", "08:00", "skipped");
  addLog("2025-10-01", "med_7", "22:00", "taken", "22:15");

  addLog("2025-10-02", "med_1", "08:00", "skipped");
  addLog("2025-10-02", "med_1", "20:00", "taken", "20:45");
  addLog("2025-10-02", "med_2", "08:00", "skipped");
  addLog("2025-10-02", "med_3", "08:00", "skipped");
  addLog("2025-10-02", "med_7", "22:00", "taken", "22:00");

  addLog("2025-10-03", "med_1", "08:00", "taken", "08:15");
  addLog("2025-10-03", "med_1", "20:00", "taken", "20:30");
  addLog("2025-10-03", "med_2", "08:00", "taken", "08:15");
  addLog("2025-10-03", "med_3", "08:00", "taken", "08:15");
  addLog("2025-10-03", "med_7", "22:00", "skipped");

  // Oct 4-10: Getting better
  for (let day = 4; day <= 10; day++) {
    const date = `2025-10-${day.toString().padStart(2, '0')}`;
    const allTaken = day % 3 !== 0; // Every 3rd day has some skips

    addLog(date, "med_1", "08:00", allTaken ? "taken" : "skipped", allTaken ? "08:20" : undefined);
    addLog(date, "med_1", "20:00", "taken", "20:15");
    addLog(date, "med_2", "08:00", allTaken ? "taken" : "skipped", allTaken ? "08:20" : undefined);
    addLog(date, "med_3", "08:00", "taken", "08:20");
    addLog(date, "med_7", "22:00", "taken", "22:00");
  }

  // Oct 11-20: Good compliance, Lisinopril starts Oct 15
  for (let day = 11; day <= 20; day++) {
    const date = `2025-10-${day.toString().padStart(2, '0')}`;

    addLog(date, "med_1", "08:00", "taken", "08:10");
    addLog(date, "med_1", "20:00", "taken", "20:00");
    addLog(date, "med_2", "08:00", "taken", "08:10");
    addLog(date, "med_3", "08:00", "taken", "08:10");
    addLog(date, "med_7", "22:00", "taken", "22:00");

    if (day >= 15) {
      addLog(date, "med_5", "09:00", day % 4 === 0 ? "skipped" : "taken", day % 4 === 0 ? undefined : "09:15");
    }
  }

  // Oct 21-31: Mostly good, occasional miss
  for (let day = 21; day <= 31; day++) {
    const date = `2025-10-${day}`;
    const missedMorning = day === 25 || day === 28;

    addLog(date, "med_1", "08:00", missedMorning ? "skipped" : "taken", missedMorning ? undefined : "08:05");
    addLog(date, "med_1", "20:00", "taken", "20:10");
    addLog(date, "med_2", "08:00", missedMorning ? "skipped" : "taken", missedMorning ? undefined : "08:05");
    addLog(date, "med_3", "08:00", "taken", "08:05");
    addLog(date, "med_5", "09:00", "taken", "09:00");
    addLog(date, "med_7", "22:00", "taken", "22:00");
  }

  // November 2025 - Omeprazole added, stable routine
  for (let day = 1; day <= 30; day++) {
    const date = `2025-11-${day.toString().padStart(2, '0')}`;
    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
    const missedSome = day === 5 || day === 12 || day === 19 || day === 26; // Fridays bad

    addLog(date, "med_4", "07:30", missedSome ? "skipped" : "taken", missedSome ? undefined : "07:35");
    addLog(date, "med_1", "08:00", isWeekend && day < 15 ? "skipped" : "taken", isWeekend && day < 15 ? undefined : "08:15");
    addLog(date, "med_1", "20:00", "taken", "20:00");
    addLog(date, "med_2", "08:00", "taken", "08:15");
    addLog(date, "med_3", "08:00", "taken", "08:15");
    addLog(date, "med_5", "09:00", missedSome ? "skipped" : "taken", missedSome ? undefined : "09:10");
    addLog(date, "med_7", "22:00", "taken", "22:05");
  }

  // December 2025 - Eye drops added, holiday disruptions
  for (let day = 1; day <= 31; day++) {
    const date = `2025-12-${day.toString().padStart(2, '0')}`;
    const isHoliday = day >= 24 && day <= 26; // Christmas
    const isNewYear = day === 31;
    const allMissed = day === 25; // Christmas day forgot everything

    if (!allMissed) {
      addLog(date, "med_4", "07:30", "taken", "07:40");
      addLog(date, "med_1", "08:00", isHoliday ? "skipped" : "taken", isHoliday ? undefined : "08:00");
      addLog(date, "med_1", "20:00", "taken", "20:30");
      addLog(date, "med_2", "08:00", "taken", "08:00");
      addLog(date, "med_3", "08:00", "taken", "08:00");
      addLog(date, "med_5", "09:00", isNewYear ? "skipped" : "taken", isNewYear ? undefined : "09:00");
      addLog(date, "med_7", "22:00", "taken", "22:00");

      // Eye drops 3x daily
      addLog(date, "med_6", "08:00", "taken", "08:10");
      addLog(date, "med_6", "14:00", day % 5 === 0 ? "skipped" : "taken", day % 5 === 0 ? undefined : "14:15");
      addLog(date, "med_6", "20:00", "taken", "20:05");
    } else {
      // Christmas - all skipped
      addLog(date, "med_4", "07:30", "skipped");
      addLog(date, "med_1", "08:00", "skipped");
      addLog(date, "med_1", "20:00", "skipped");
      addLog(date, "med_2", "08:00", "skipped");
      addLog(date, "med_3", "08:00", "skipped");
      addLog(date, "med_5", "09:00", "skipped");
      addLog(date, "med_6", "08:00", "skipped");
      addLog(date, "med_6", "14:00", "skipped");
      addLog(date, "med_6", "20:00", "skipped");
      addLog(date, "med_7", "22:00", "skipped");
    }
  }

  // January 2026 - Back to normal, good compliance
  for (let day = 1; day <= 16; day++) {
    const date = `2026-01-${day.toString().padStart(2, '0')}`;
    const perfectDay = day % 7 !== 0; // Sundays sometimes miss

    addLog(date, "med_4", "07:30", "taken", "07:30");
    addLog(date, "med_1", "08:00", "taken", "08:00");
    addLog(date, "med_1", "20:00", "taken", "20:00");
    addLog(date, "med_2", "08:00", "taken", "08:00");
    addLog(date, "med_3", "08:00", "taken", "08:00");
    addLog(date, "med_5", "09:00", perfectDay ? "taken" : "skipped", perfectDay ? "09:05" : undefined);
    addLog(date, "med_7", "22:00", "taken", "22:00");

    addLog(date, "med_6", "08:00", "taken", "08:05");
    addLog(date, "med_6", "14:00", perfectDay ? "taken" : "skipped", perfectDay ? "14:10" : undefined);
    addLog(date, "med_6", "20:00", "taken", "20:00");
  }

  return logs;
};

export const LOGS: DoseLog[] = generateLogs();

// Helper functions
export const getLogsForDate = (date: string): DoseLog[] => {
  return LOGS.filter(l => l.date === date);
};

export const getLogsForDateRange = (startDate: string, endDate: string): DoseLog[] => {
  return LOGS.filter(l => l.date >= startDate && l.date <= endDate);
};

export const getLogStatus = (date: string, medId: string, time: string): DoseLog | undefined => {
  return LOGS.find(l => l.date === date && l.medId === medId && l.time === time);
};

// For sharing - export as simple text
export const exportLogsAsText = (startDate: string, endDate: string): string => {
  const logs = getLogsForDateRange(startDate, endDate);
  const grouped = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, DoseLog[]>);

  let text = `Medication History: ${startDate} to ${endDate}\n`;
  text += "=".repeat(40) + "\n\n";

  Object.entries(grouped).sort().forEach(([date, dayLogs]) => {
    const taken = dayLogs.filter(l => l.status === "taken").length;
    const total = dayLogs.length;
    text += `${date}: ${taken}/${total} taken\n`;
    dayLogs.forEach(l => {
      const icon = l.status === "taken" ? "✓" : "✗";
      text += `  ${icon} ${l.time} - ${l.medId} (${l.status})\n`;
    });
    text += "\n";
  });

  return text;
};
