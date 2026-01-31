
export enum DoseStatus {
  TAKEN = 'Taken',
  SKIPPED = 'Skipped',
  PENDING = 'Pending'
}

export interface Medication {
  id: string;
  name: string;
  company?: string;           // Manufacturer/company name
  strength: string;           // e.g., "150 mg"
  dosage: string;             // e.g., "3 X" (pills per dose)
  dosesPerDay: number;        // How many times per day (1-5)
  timesOfDay: string[];       // Array of times ["06:00", "14:00", "20:00"]
  instructions: string;
  color: string;
  shape?: string;             // Pill shape: "round-small", "round-large", "oval", "capsule", "tablet"
  pillImageUrl?: string;
  startDate?: string;         // ISO date string
  endDate?: string;           // ISO date string
  daysOfWeek?: number[];      // 0=Sun, 1=Mon, ..., 6=Sat. Undefined = every day
  notes?: string;
  refillDismissed?: boolean;  // User dismissed the refill alert
}

// Shape definitions with icons - clear medical emojis
export const PILL_SHAPES = {
  "capsule": { label: "Capsule", icon: "💊", css: "pill-shape--capsule" },
  "syringe": { label: "Injection", icon: "💉", css: "pill-shape--syringe" },
  "drops": { label: "Drops", icon: "💧", css: "pill-shape--drops" },
  "vitamin": { label: "Vitamin", icon: "🧴", css: "pill-shape--vitamin" },
  "stethoscope": { label: "Doctor", icon: "🩻", css: "pill-shape--stethoscope" },
  "hospital": { label: "Hospital", icon: "🚑", css: "pill-shape--hospital" },
  "tooth": { label: "Dental", icon: "🪥", css: "pill-shape--tooth" },
  "heart": { label: "Heart", icon: "❤️", css: "pill-shape--heart" },
  "herb": { label: "Herb", icon: "🌿", css: "pill-shape--herb" },
  "eye": { label: "Eye", icon: "👁️", css: "pill-shape--eye" },
  "vet": { label: "Vet", icon: "🐾", css: "pill-shape--vet" },
} as const;

export type PillShape = keyof typeof PILL_SHAPES;

// Helper to get shape icon
export const getShapeIcon = (shape?: string): string => {
  if (!shape || !(shape in PILL_SHAPES)) return "💊"; // Default to capsule
  return PILL_SHAPES[shape as PillShape].icon;
};

// Record of dose status for a specific medication on a specific time
export interface DoseRecord {
  medicationId: string;
  time: string;               // "06:00", "14:00", etc.
  status: DoseStatus;
  takenAt?: string;           // ISO timestamp when marked as taken
}

// Log for a single day
export interface DayLog {
  date: string;               // ISO date string "2025-01-12"
  doses: DoseRecord[];
}

// User Profile for Family Management
export interface UserProfile {
  id: string;
  name: string;
  relationship: 'self' | 'child' | 'parent' | 'spouse' | 'other';
  avatar?: string; // emoji or image URL
  color: string; // for visual distinction
  createdAt: string;
  // Google auth fields
  email?: string;
  photoURL?: string;
  isGoogleUser?: boolean;
  googleId?: string;
}

// Complete app data structure (saved to JSON)
export interface AppData {
  // New multi-user fields
  currentUserId?: string;
  users?: UserProfile[];

  // Existing data (now associated with currentUserId)
  medications: Medication[];
  dayLogs: DayLog[];
  settings: AppSettings;
  lastUpdated: string;        // ISO timestamp
}

export interface AppSettings {
  reminderEnabled: boolean;
  soundEnabled: boolean;
}

export type ViewState = 'timeline' | 'manage' | 'scan' | 'review' | 'settings';

// Time slot configuration for display
export interface TimeSlot {
  id: string;
  label: string;
  time: string;
  icon: string;
}

// Helper to get default time slots based on doses per day
export const getTimeSlotsForDoses = (dosesPerDay: number): TimeSlot[] => {
  const allSlots: TimeSlot[] = [
    { id: 'slot1', label: 'Morning', time: '06:00', icon: '🌅' },
    { id: 'slot2', label: 'Mid-Morning', time: '10:00', icon: '☕' },
    { id: 'slot3', label: 'Noon', time: '12:00', icon: '🌞' },
    { id: 'slot4', label: 'Afternoon', time: '15:00', icon: '🌇' },
    { id: 'slot5', label: 'Evening', time: '20:00', icon: '🌙' },
  ];

  if (dosesPerDay <= 0) return [];
  if (dosesPerDay === 1) return [allSlots[0]];
  if (dosesPerDay === 2) return [allSlots[0], allSlots[4]];
  if (dosesPerDay === 3) return [allSlots[0], allSlots[2], allSlots[4]];
  if (dosesPerDay === 4) return [allSlots[0], allSlots[1], allSlots[3], allSlots[4]];
  return allSlots.slice(0, dosesPerDay);
};
