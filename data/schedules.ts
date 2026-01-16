// User's medication schedules - what they take and when
export interface Schedule {
  id: string;
  medId: string;        // references MedicationDef.id
  dosage: string;       // "1 pill", "2 pills", "10 units", etc.
  amount: number;       // numeric amount for calculations
  times: string[];      // ["08:00", "14:00", "20:00"]
  startDate: string;    // ISO date
  endDate: string | null; // ISO date or null for ongoing
  notes?: string;
}

// User's active schedules
export const SCHEDULES: Schedule[] = [
  {
    id: "sch_1",
    medId: "med_1", // Metformin
    dosage: "1 pill",
    amount: 1,
    times: ["08:00", "20:00"],
    startDate: "2025-10-01",
    endDate: "2026-03-31",
    notes: "For blood sugar control",
  },
  {
    id: "sch_2",
    medId: "med_2", // Aspirin
    dosage: "1 pill",
    amount: 1,
    times: ["08:00"],
    startDate: "2025-09-15",
    endDate: null, // ongoing
  },
  {
    id: "sch_3",
    medId: "med_3", // Vitamin D3
    dosage: "1 pill",
    amount: 1,
    times: ["08:00"],
    startDate: "2025-10-01",
    endDate: null,
  },
  {
    id: "sch_4",
    medId: "med_4", // Omeprazole
    dosage: "1 pill",
    amount: 1,
    times: ["07:30"],
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    notes: "30 min before breakfast",
  },
  {
    id: "sch_5",
    medId: "med_5", // Lisinopril
    dosage: "1 pill",
    amount: 1,
    times: ["09:00"],
    startDate: "2025-10-15",
    endDate: null,
  },
  {
    id: "sch_6",
    medId: "med_6", // Eye Drops
    dosage: "2 drops",
    amount: 2,
    times: ["08:00", "14:00", "20:00"],
    startDate: "2025-12-01",
    endDate: "2026-02-28",
  },
  {
    id: "sch_7",
    medId: "med_7", // Insulin
    dosage: "15 units",
    amount: 15,
    times: ["22:00"],
    startDate: "2025-10-01",
    endDate: null,
  },
];

// Helper to get schedules for a specific date
export const getSchedulesForDate = (date: string): Schedule[] => {
  return SCHEDULES.filter(s => {
    const d = new Date(date);
    const start = new Date(s.startDate);
    const end = s.endDate ? new Date(s.endDate) : new Date("2099-12-31");
    return d >= start && d <= end;
  });
};

// Helper to get schedule by medication ID
export const getScheduleByMedId = (medId: string): Schedule | undefined => {
  return SCHEDULES.find(s => s.medId === medId);
};
