// Form types for medications
export const FORM_TYPES = {
  pill: { icon: "💊", label: "Pill/Tablet" },
  injection: { icon: "💉", label: "Injection" },
  drops: { icon: "💧", label: "Drops" },
  cream: { icon: "🧴", label: "Cream/Ointment" },
  inhaler: { icon: "🌬️", label: "Inhaler" },
  liquid: { icon: "🧪", label: "Liquid/Syrup" },
  patch: { icon: "🩹", label: "Patch" },
  powder: { icon: "🥄", label: "Powder" },
  spray: { icon: "💨", label: "Spray" },
} as const;

// Warning codes
export const WARNING_CODES = {
  "no-drive": { icon: "🚗", label: "Don't drive", color: "#ef4444" },
  "no-alcohol": { icon: "🍺", label: "No alcohol", color: "#f97316" },
  "drowsy": { icon: "😴", label: "May cause drowsiness", color: "#eab308" },
  "no-sun": { icon: "☀️", label: "Avoid sun", color: "#f59e0b" },
  "refrigerate": { icon: "❄️", label: "Keep cold", color: "#3b82f6" },
  "no-pregnancy": { icon: "🤰", label: "Not for pregnancy", color: "#ec4899" },
  "take-standing": { icon: "🧍", label: "Take standing up", color: "#8b5cf6" },
  "lots-of-water": { icon: "💧", label: "Drink lots of water", color: "#06b6d4" },
} as const;

// Dose status
export const DOSE_STATUS = {
  taken: "taken",
  skipped: "skipped",
  pending: "pending",
} as const;

// Colors for medications
export const MED_COLORS = [
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
  "bg-orange-300",
  "bg-indigo-300",
  "bg-teal-300",
  "bg-cyan-300",
] as const;

export type FormType = keyof typeof FORM_TYPES;
export type WarningCode = keyof typeof WARNING_CODES;
export type DoseStatus = keyof typeof DOSE_STATUS;
export type MedColor = typeof MED_COLORS[number];
