// Shared form configuration for medication add/edit flows
// Single source of truth - do NOT duplicate these in component files

// Colors: id, name, class (for CSS), hex (for inline styles)
export const FORM_COLORS = [
  { id: "blue", name: "Blue", class: "bg-blue-300", hex: "#93c5fd" },
  { id: "green", name: "Green", class: "bg-green-300", hex: "#86efac" },
  { id: "yellow", name: "Yellow", class: "bg-yellow-300", hex: "#fcd34d" },
  { id: "red", name: "Red", class: "bg-red-300", hex: "#fca5a5" },
  { id: "purple", name: "Purple", class: "bg-purple-300", hex: "#d8b4fe" },
  { id: "orange", name: "Orange", class: "bg-orange-300", hex: "#fdba74" },
  { id: "pink", name: "Pink", class: "bg-pink-300", hex: "#f9a8d4" },
  { id: "cyan", name: "Cyan", class: "bg-cyan-300", hex: "#67e8f9" },
  { id: "gray", name: "Gray", class: "bg-gray-300", hex: "#d1d5db" },
  { id: "white", name: "White", class: "bg-white", hex: "#ffffff" },
];

// Shapes/Icons: id, label, icon emoji
export const FORM_SHAPES = [
  { id: "capsule", label: "Capsule", icon: "💊" },
  { id: "syringe", label: "Injection", icon: "💉" },
  { id: "drops", label: "Drops", icon: "💧" },
  { id: "vitamin", label: "Vitamin", icon: "🧴" },
  { id: "stethoscope", label: "Doctor", icon: "🩺" },
  { id: "hospital", label: "Hospital", icon: "🚑" },
  { id: "tooth", label: "Dental", icon: "🪥" },
  { id: "herb", label: "Herb", icon: "🌿" },
  { id: "eye", label: "Eye", icon: "👁️" },
];

// Strength units with smart defaults
export const FORM_UNITS: { unit: string; defaultValue: string }[] = [
  { unit: "mg", defaultValue: "150" },
  { unit: "ml", defaultValue: "5" },
  { unit: "pills", defaultValue: "1" },
  { unit: "drops", defaultValue: "5" },
];

// Duration presets
export const FORM_DURATIONS = [
  { label: "7 days", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "Ongoing", days: 0 },
];

// Time-of-day presets
export const FORM_TIME_PRESETS = [
  { id: "morning", label: "Morning", time: "08:00", icon: "🌅" },
  { id: "noon", label: "Noon", time: "12:00", icon: "☀️" },
  { id: "afternoon", label: "Afternoon", time: "15:00", icon: "🌤️" },
  { id: "evening", label: "Evening", time: "19:00", icon: "🌆" },
  { id: "night", label: "Night", time: "22:00", icon: "🌙" },
];

// Day labels
export const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Event-type shapes (hide strength field for these)
export const EVENT_SHAPE_IDS = ["hospital", "stethoscope", "tooth"];

// Helper: is this shape an event (not a medicine)?
export const isEventShape = (shapeId: string) => EVENT_SHAPE_IDS.includes(shapeId);

// Helper: get default value for a unit
export const getUnitDefault = (unitName: string): string => {
  const found = FORM_UNITS.find(u => u.unit === unitName);
  return found ? found.defaultValue : "1";
};
