import { Medication, TimeSlot, DayLog, DoseStatus } from "./types";
import { format, addDays } from "date-fns";

// Helper to create date strings
const today = new Date();
const dateStr = (offset: number) => format(addDays(today, offset), "yyyy-MM-dd");

// ============================================
// DEMO VITAMINS - Safe sample data for onboarding
// Only supplements, no real medications
// ============================================
export const MOCK_VITAMINS: Medication[] = [
  {
    id: "demo-vitc",
    name: "Vitamin C",
    company: "NOW Foods",
    strength: "500 mg",
    dosage: "1 tablet",
    dosesPerDay: 1,
    timesOfDay: ["08:00"],
    instructions: "With breakfast",
    color: "bg-orange-300",
    startDate: dateStr(-7),
    endDate: dateStr(30),
  },
  {
    id: "demo-vitd",
    name: "Vitamin D3",
    company: "Solgar",
    strength: "1000 IU",
    dosage: "1 tablet",
    dosesPerDay: 1,
    timesOfDay: ["08:00"],
    instructions: "With food",
    color: "bg-yellow-300",
    startDate: dateStr(-7),
    endDate: dateStr(30),
  },
  {
    id: "demo-zinc",
    name: "Zinc",
    company: "Nature Made",
    strength: "50 mg",
    dosage: "1 tablet",
    dosesPerDay: 1,
    timesOfDay: ["12:00"],
    instructions: "With lunch",
    color: "bg-cyan-300",
    startDate: dateStr(-7),
    endDate: dateStr(30),
  },
  {
    id: "demo-probiotic",
    name: "Probiotic",
    company: "Culturelle",
    strength: "10B CFU",
    dosage: "1 capsule",
    dosesPerDay: 1,
    timesOfDay: ["08:00"],
    instructions: "Before breakfast",
    color: "bg-purple-300",
    startDate: dateStr(-7),
    endDate: dateStr(30),
  },
  {
    id: "demo-omega",
    name: "Omega-3 Fish Oil",
    company: "Nordic Naturals",
    strength: "1000 mg",
    dosage: "1 softgel",
    dosesPerDay: 2,
    timesOfDay: ["08:00", "20:00"],
    instructions: "With meals",
    color: "bg-blue-300",
    startDate: dateStr(-7),
    endDate: dateStr(30),
  },
];

export const MOCK_MEDICATIONS: Medication[] = [
  // ============================================
  // SCENARIO A: 1 pill, 1x/day (days -20 to -15)
  // Shows: minimal UI, single pill
  // ============================================
  {
    id: "a1",
    name: "Aspirin",
    company: "Bayer",
    strength: "100 mg",
    dosage: "1 tablet",
    dosesPerDay: 1,
    timesOfDay: ["08:00"],
    instructions: "Once daily",
    color: "bg-blue-300",
    startDate: dateStr(-20),
    endDate: dateStr(-15),
  },

  // ============================================
  // SCENARIO B: 2 pills, 2x/day (days -14 to -10)
  // Shows: morning + evening, 2 different pills
  // ============================================
  {
    id: "b1",
    name: "Metformin",
    company: "Teva",
    strength: "500 mg",
    dosage: "1 tablet",
    dosesPerDay: 2,
    timesOfDay: ["07:00", "19:00"],
    instructions: "With meals",
    color: "bg-green-300",
    startDate: dateStr(-14),
    endDate: dateStr(-10),
  },
  {
    id: "b2",
    name: "Vitamin D",
    company: "Solgar",
    strength: "1000 IU",
    dosage: "1 tablet",
    dosesPerDay: 2,
    timesOfDay: ["07:00", "19:00"],
    instructions: "With food",
    color: "bg-yellow-300",
    startDate: dateStr(-14),
    endDate: dateStr(-10),
  },

  // ============================================
  // SCENARIO C: 6 pills, 3x/day (days -9 to -5)
  // Shows: busy schedule, many pills
  // ============================================
  {
    id: "c1",
    name: "Antibiotic",
    company: "Pfizer",
    strength: "250 mg",
    dosage: "2 tablets",
    dosesPerDay: 3,
    timesOfDay: ["08:00", "14:00", "20:00"],
    instructions: "Every 6 hours",
    color: "bg-red-300",
    startDate: dateStr(-9),
    endDate: dateStr(-5),
  },
  {
    id: "c2",
    name: "Probiotic",
    company: "BioGaia",
    strength: "10B CFU",
    dosage: "1 capsule",
    dosesPerDay: 3,
    timesOfDay: ["08:00", "14:00", "20:00"],
    instructions: "With antibiotic",
    color: "bg-purple-300",
    startDate: dateStr(-9),
    endDate: dateStr(-5),
  },
  {
    id: "c3",
    name: "Pain Relief",
    company: "Advil",
    strength: "200 mg",
    dosage: "1 tablet",
    dosesPerDay: 3,
    timesOfDay: ["08:00", "14:00", "20:00"],
    instructions: "As needed",
    color: "bg-orange-300",
    startDate: dateStr(-9),
    endDate: dateStr(-5),
  },
  {
    id: "c4",
    name: "Vitamin C",
    company: "NOW",
    strength: "500 mg",
    dosage: "1 tablet",
    dosesPerDay: 3,
    timesOfDay: ["08:00", "14:00", "20:00"],
    instructions: "Boost immunity",
    color: "bg-cyan-300",
    startDate: dateStr(-9),
    endDate: dateStr(-5),
  },
  {
    id: "c5",
    name: "Zinc",
    company: "Nature Made",
    strength: "50 mg",
    dosage: "1 tablet",
    dosesPerDay: 3,
    timesOfDay: ["08:00", "14:00", "20:00"],
    instructions: "With food",
    color: "bg-pink-300",
    startDate: dateStr(-9),
    endDate: dateStr(-5),
  },
  {
    id: "c6",
    name: "Iron",
    company: "Ferrous",
    strength: "65 mg",
    dosage: "1 tablet",
    dosesPerDay: 3,
    timesOfDay: ["08:00", "14:00", "20:00"],
    instructions: "Empty stomach",
    color: "bg-gray-300",
    startDate: dateStr(-9),
    endDate: dateStr(-5),
  },

  // ============================================
  // SCENARIO D: 3 pills, 1x/day (days -4 to +3) - CURRENT
  // Shows: simple daily routine
  // ============================================
  {
    id: "d1",
    name: "Blood Pressure",
    company: "Merck",
    strength: "10 mg",
    dosage: "1 tablet",
    dosesPerDay: 1,
    timesOfDay: ["08:00"],
    instructions: "Morning",
    color: "bg-blue-300",
    startDate: dateStr(-4),
    endDate: dateStr(3),
  },
  {
    id: "d2",
    name: "Cholesterol",
    company: "Lipitor",
    strength: "20 mg",
    dosage: "1 tablet",
    dosesPerDay: 1,
    timesOfDay: ["08:00"],
    instructions: "With breakfast",
    color: "bg-green-300",
    startDate: dateStr(-4),
    endDate: dateStr(3),
  },
  {
    id: "d3",
    name: "Thyroid",
    company: "Synthroid",
    strength: "50 mcg",
    dosage: "1 tablet",
    dosesPerDay: 1,
    timesOfDay: ["08:00"],
    instructions: "Empty stomach",
    color: "bg-purple-300",
    startDate: dateStr(-4),
    endDate: dateStr(3),
  },

  // ============================================
  // SCENARIO E: 4 pills, 5x/day (days +4 to +10) - FUTURE
  // Shows: intensive treatment coming up
  // ============================================
  {
    id: "e1",
    name: "Antibiotic Plus",
    company: "Pfizer",
    strength: "500 mg",
    dosage: "1 tablet",
    dosesPerDay: 5,
    timesOfDay: ["06:00", "10:00", "14:00", "18:00", "22:00"],
    instructions: "Every 4 hours",
    color: "bg-red-300",
    startDate: dateStr(4),
    endDate: dateStr(10),
  },
  {
    id: "e2",
    name: "Anti-inflammatory",
    company: "Celebrex",
    strength: "100 mg",
    dosage: "1 tablet",
    dosesPerDay: 5,
    timesOfDay: ["06:00", "10:00", "14:00", "18:00", "22:00"],
    instructions: "With food",
    color: "bg-orange-300",
    startDate: dateStr(4),
    endDate: dateStr(10),
  },
  {
    id: "e3",
    name: "Stomach Protector",
    company: "Nexium",
    strength: "20 mg",
    dosage: "1 tablet",
    dosesPerDay: 5,
    timesOfDay: ["06:00", "10:00", "14:00", "18:00", "22:00"],
    instructions: "Before meals",
    color: "bg-yellow-300",
    startDate: dateStr(4),
    endDate: dateStr(10),
  },
  {
    id: "e4",
    name: "Probiotic Plus",
    company: "Culturelle",
    strength: "15B CFU",
    dosage: "1 capsule",
    dosesPerDay: 5,
    timesOfDay: ["06:00", "10:00", "14:00", "18:00", "22:00"],
    instructions: "With each dose",
    color: "bg-cyan-300",
    startDate: dateStr(4),
    endDate: dateStr(10),
  },

  // ============================================
  // SCENARIO F: 1 pill, 2x/day (days +11 to +20) - FUTURE
  // Shows: back to simple routine
  // ============================================
  {
    id: "f1",
    name: "Maintenance Med",
    company: "Generic",
    strength: "25 mg",
    dosage: "1 tablet",
    dosesPerDay: 2,
    timesOfDay: ["08:00", "20:00"],
    instructions: "Morning and night",
    color: "bg-pink-300",
    startDate: dateStr(11),
    endDate: dateStr(20),
  },
];

// ============================================
// DEMO DAY LOGS - Past days with various taken/not taken
// ============================================
const generateDemoLogs = (): DayLog[] => {
  const logs: DayLog[] = [];

  // Helper to create dose records
  const createDoses = (meds: typeof MOCK_MEDICATIONS, dateOffset: number, takenPattern: boolean[]) => {
    const date = dateStr(dateOffset);
    const activeMeds = meds.filter(m => {
      const start = m.startDate ? new Date(m.startDate) : new Date("2020-01-01");
      const end = m.endDate ? new Date(m.endDate) : new Date("2030-12-31");
      const check = new Date(date);
      return check >= start && check <= end;
    });

    const doses: DayLog["doses"] = [];
    let patternIndex = 0;

    activeMeds.forEach(med => {
      med.timesOfDay.forEach(time => {
        const taken = takenPattern[patternIndex % takenPattern.length];
        doses.push({
          medicationId: med.id,
          time,
          status: taken ? DoseStatus.TAKEN : DoseStatus.PENDING,
          takenAt: taken ? `${date}T${time}:00.000Z` : undefined,
        });
        patternIndex++;
      });
    });

    if (doses.length > 0) {
      logs.push({ date, doses });
    }
  };

  // Days -20 to -15: 1 pill - all taken
  for (let i = -20; i <= -15; i++) {
    createDoses(MOCK_MEDICATIONS, i, [true]);
  }

  // Days -14 to -10: 2 pills 2x - some missed
  createDoses(MOCK_MEDICATIONS, -14, [true, true, true, true]); // all taken
  createDoses(MOCK_MEDICATIONS, -13, [true, false, true, true]); // 1 missed
  createDoses(MOCK_MEDICATIONS, -12, [true, true, false, false]); // 2 missed
  createDoses(MOCK_MEDICATIONS, -11, [false, false, false, false]); // all missed
  createDoses(MOCK_MEDICATIONS, -10, [true, true, true, true]); // all taken

  // Days -9 to -5: 6 pills 3x - varied
  createDoses(MOCK_MEDICATIONS, -9, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]); // all taken
  createDoses(MOCK_MEDICATIONS, -8, [true, true, true, false, false, false, true, true, true, true, true, true, false, false, false, true, true, true]); // afternoon missed
  createDoses(MOCK_MEDICATIONS, -7, [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]); // alternating
  createDoses(MOCK_MEDICATIONS, -6, [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]); // all missed (sick day)
  createDoses(MOCK_MEDICATIONS, -5, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]); // all taken

  // Days -4 to -1: 3 pills 1x - mostly taken
  createDoses(MOCK_MEDICATIONS, -4, [true, true, true]);
  createDoses(MOCK_MEDICATIONS, -3, [true, true, false]); // 1 missed
  createDoses(MOCK_MEDICATIONS, -2, [true, true, true]);
  createDoses(MOCK_MEDICATIONS, -1, [false, true, true]); // 1 missed

  return logs;
};

export const DEMO_DAY_LOGS = generateDemoLogs();

// All possible time slots
export const ALL_TIME_SLOTS: TimeSlot[] = [
  { id: "slot-0600", label: "Morning", time: "06:00", icon: "🌅" },
  { id: "slot-1000", label: "Mid-Morning", time: "10:00", icon: "☕" },
  { id: "slot-1200", label: "Noon", time: "12:00", icon: "🌞" },
  { id: "slot-1500", label: "Afternoon", time: "15:00", icon: "🌇" },
  { id: "slot-2000", label: "Evening", time: "20:00", icon: "🌙" },
];

// Legacy export for backwards compatibility
export const TIME_SLOTS = [
  { id: "Morning", label: "Sunrise", time: "06:00", icon: "🌅" },
  { id: "Noon", label: "Coffee", time: "10:00", icon: "☕" },
  { id: "Afternoon", label: "Sunset", time: "14:00", icon: "🌇" },
  { id: "Evening", label: "Bedtime", time: "20:00", icon: "🌙" },
];

// Get time slot by time string
export const getTimeSlotByTime = (time: string): TimeSlot | undefined => {
  return ALL_TIME_SLOTS.find((slot) => slot.time === time);
};

// Get icon for a time
export const getIconForTime = (time: string): string => {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 9) return "🌅";
  if (hour < 12) return "☕";
  if (hour < 15) return "🌞";
  if (hour < 18) return "🌇";
  return "🌙";
};

// Get label for a time
export const getLabelForTime = (time: string): string => {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 9) return "Morning";
  if (hour < 12) return "Mid-Morning";
  if (hour < 15) return "Noon";
  if (hour < 18) return "Afternoon";
  return "Evening";
};

// App Configuration Constants
export const INITIAL_SCROLL_DELAY = 100; // Delay to ensure DOM is ready before scrolling
export const NOTIFICATION_SOUND_URL =
  "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";

// Calendar Range Configuration
// Reduced for better performance - consider implementing virtualization for larger ranges
export const DAYS_BACK = 30; // 30 days of historical data
export const DAYS_FORWARD = 60; // 60 days of future data
export const TOTAL_DAYS = DAYS_BACK + DAYS_FORWARD + 1;
