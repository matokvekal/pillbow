/**
 * PILLBOW ICONS & IMAGES CONSTANTS
 *
 * Centralized configuration for all icons, emojis, and images used throughout the app.
 * This allows easy customization and theming in a single location.
 */

// ========== EMOJI ICONS ==========
export const ICONS = {
  // Time of Day Icons
  timeOfDay: {
    morning: '🌅',
    noon: '🌞',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
    lateNight: '🌃',
  },

  // Medication & Health
  medication: {
    pill: '💊',
    capsule: '💊',
    tablet: '⚕️',
    syringe: '💉',
    bandage: '🩹',
    firstAid: '🏥',
    prescription: '📋',
    bottle: '🧴',
  },

  // Actions & UI
  actions: {
    add: '➕',
    remove: '➖',
    close: '✕',
    check: '✓',
    checkmark: '✓',
    edit: '✏️',
    delete: '🗑️',
    save: '💾',
    camera: '📷',
    scan: '📸',
    calendar: '📅',
    clock: '⏰',
    alarm: '⏰',
    settings: '⚙️',
    menu: '☰',
    chevronDown: '▼',
    chevronUp: '▲',
    chevronRight: '▶',
    chevronLeft: '◀',
    arrowRight: '→',
    arrowLeft: '←',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  },

  // Status & Feedback
  status: {
    completed: '✅',
    pending: '⏳',
    missed: '❌',
    partial: '⚠️',
    lock: '🔒',
    unlock: '🔓',
    star: '⭐',
    heart: '❤️',
    fire: '🔥',
  },

  // User & Profile
  user: {
    person: '👤',
    family: '👨‍👩‍👧‍👦',
    elderly: '👴',
    child: '👶',
    adult: '👨',
    woman: '👩',
    man: '👨',
  },

  // Pill Shapes (Unicode representations)
  shapes: {
    circle: '●',
    oval: '⬭',
    capsule: '💊',
    square: '■',
    triangle: '▲',
    diamond: '◆',
    hexagon: '⬡',
    octagon: '⯃',
  },
} as const;

// ========== PILL COLORS ==========
export const PILL_COLORS = {
  blue: {
    name: 'Blue',
    bgClass: 'bg-blue-300',
    cssVar: '--color-primary-300',
    hex: '#93c5fd',
  },
  green: {
    name: 'Green',
    bgClass: 'bg-green-300',
    cssVar: '--color-success-300',
    hex: '#86efac',
  },
  yellow: {
    name: 'Yellow',
    bgClass: 'bg-yellow-300',
    cssVar: '--color-yellow-300',
    hex: '#fcd34d',
  },
  red: {
    name: 'Red',
    bgClass: 'bg-red-300',
    cssVar: '--color-error-300',
    hex: '#fca5a5',
  },
  purple: {
    name: 'Purple',
    bgClass: 'bg-purple-300',
    cssVar: '--color-purple-300',
    hex: '#d8b4fe',
  },
  pink: {
    name: 'Pink',
    bgClass: 'bg-pink-300',
    cssVar: '--color-pink-300',
    hex: '#f9a8d4',
  },
  orange: {
    name: 'Orange',
    bgClass: 'bg-orange-300',
    cssVar: '--color-orange-300',
    hex: '#fdba74',
  },
  cyan: {
    name: 'Cyan',
    bgClass: 'bg-cyan-300',
    cssVar: '--color-cyan-300',
    hex: '#67e8f9',
  },
  gray: {
    name: 'Gray',
    bgClass: 'bg-gray-300',
    cssVar: '--color-gray-300',
    hex: '#d1d5db',
  },
  white: {
    name: 'White',
    bgClass: 'bg-white',
    cssVar: '--color-background',
    hex: '#ffffff',
  },
} as const;

// ========== SVG ICONS (for React components) ==========
export const SVG_ICONS = {
  // Checkmark
  checkmark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),

  // Close/X
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),

  // Plus
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),

  // Minus
  minus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14" />
    </svg>
  ),

  // Edit/Pencil
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),

  // Trash/Delete
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),

  // Camera
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),

  // Calendar
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),

  // Clock
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),

  // Settings/Gear
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m5.196-13.196l-4.243 4.243m-5.91 5.91l-4.242 4.242M23 12h-6m-6 0H1m18.196 5.196l-4.243-4.243m-5.91-5.91l-4.242-4.242" />
    </svg>
  ),

  // ChevronDown
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),

  // ChevronUp
  chevronUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 15l-6-6-6 6" />
    </svg>
  ),

  // ChevronRight
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),

  // ChevronLeft
  chevronLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),

  // ArrowLeft
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),

  // Info
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),

  // Lock
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
} as const;

// ========== IMAGE PLACEHOLDERS ==========
export const IMAGE_PLACEHOLDERS = {
  // User avatars
  defaultAvatar: '👤',

  // Medication images (these would be URLs in production)
  pillBottle: '/images/pill-bottle.png',
  pillBox: '/images/pill-box.png',
  prescriptionPad: '/images/prescription.png',

  // App logo
  appLogo: '/images/pillbow-logo.png',
  appIcon: '💊',

  // Empty states
  emptyMedications: '📋',
  emptyCalendar: '📅',
  noCamera: '📷',
} as const;

// ========== TIME SLOT ICONS MAPPING ==========
// Maps time ranges to appropriate icons
export function getTimeOfDayIcon(time: string): string {
  const hour = parseInt(time.split(':')[0]);

  if (hour >= 5 && hour < 12) return ICONS.timeOfDay.morning;
  if (hour >= 12 && hour < 14) return ICONS.timeOfDay.noon;
  if (hour >= 14 && hour < 18) return ICONS.timeOfDay.afternoon;
  if (hour >= 18 && hour < 21) return ICONS.timeOfDay.evening;
  if (hour >= 21 || hour < 2) return ICONS.timeOfDay.night;
  return ICONS.timeOfDay.lateNight;
}

// ========== TIME SLOT LABELS ==========
export function getTimeOfDayLabel(time: string): string {
  const hour = parseInt(time.split(':')[0]);

  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 14) return 'Noon';
  if (hour >= 14 && hour < 18) return 'Afternoon';
  if (hour >= 18 && hour < 21) return 'Evening';
  if (hour >= 21 || hour < 2) return 'Night';
  return 'Late Night';
}

// ========== PILL SHAPE MAPPING ==========
export function getPillShapeIcon(shape: string): string {
  const shapeMap: Record<string, string> = {
    circle: ICONS.shapes.circle,
    oval: ICONS.shapes.oval,
    capsule: ICONS.shapes.capsule,
    square: ICONS.shapes.square,
    triangle: ICONS.shapes.triangle,
    diamond: ICONS.shapes.diamond,
    hexagon: ICONS.shapes.hexagon,
    octagon: ICONS.shapes.octagon,
  };

  return shapeMap[shape.toLowerCase()] || ICONS.shapes.circle;
}

// ========== TYPE EXPORTS ==========
export type IconCategory = keyof typeof ICONS;
export type PillColorName = keyof typeof PILL_COLORS;
export type SVGIconName = keyof typeof SVG_ICONS;
