/**
 * PILLBOW CONSTANTS INDEX
 *
 * Central export point for all app constants, icons, and configuration.
 * Import everything you need from this single location.
 *
 * Usage:
 *   import { ICONS, PILL_COLORS, APP_CONFIG } from './constants'
 */

// Re-export all icons and images
export * from './icons';

// Re-export legacy constants for backwards compatibility
export {
  MOCK_VITAMINS,
  MOCK_MEDICATIONS,
  ALL_TIME_SLOTS,
  TIME_SLOTS,
  getTimeSlotByTime,
  getIconForTime,
  getLabelForTime,
  INITIAL_SCROLL_DELAY,
  NOTIFICATION_SOUND_URL,
  DAYS_BACK,
  DAYS_FORWARD,
  TOTAL_DAYS,
} from '../constants';

// ========== APP CONFIGURATION ==========
export const APP_CONFIG = {
  // App Info
  name: 'PillBow',
  version: '1.0.0',
  description: 'Medication reminder and tracking app for elderly users',

  // Calendar Settings
  daysBack: 30,
  daysForward: 60,

  // Notification Settings
  notificationSoundUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',

  // UI Settings
  initialScrollDelay: 100,
  maxMedicationsPerSlot: 10,

  // Animation Durations (ms)
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },

  // Touch Target Sizes (px)
  touchTargets: {
    minimum: 48,
    comfortable: 60,
    large: 80,
  },

  // Accessibility
  accessibility: {
    minContrastRatio: 7, // WCAG AAA
    minFontSize: 14, // px
    recommendedFontSize: 16, // px for elderly
  },
} as const;

// ========== THEME CONFIGURATION ==========
export const THEME = {
  // Rainbow Colors for Time Slots
  rainbow: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'],

  // Status Colors
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    neutral: '#64748b',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    rainbow: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
    surface: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #fdf4ff 100%)',
  },
} as const;

// ========== ROUTES / SCREENS ==========
export const SCREENS = {
  main: 'main',
  settings: 'settings',
  addMedication: 'add-medication',
  scanMedication: 'scan-medication',
  manualAdd: 'manual-add',
  editMedication: 'edit-medication',
  medicationDetail: 'medication-detail',
  userManagement: 'user-management',
  dataManagement: 'data-management',
} as const;

// ========== LOCAL STORAGE KEYS ==========
export const STORAGE_KEYS = {
  userData: 'pillbow_user_data',
  currentUser: 'pillbow_current_user',
  medications: 'pillbow_medications',
  schedule: 'pillbow_schedule',
  settings: 'pillbow_settings',
  lastSync: 'pillbow_last_sync',
} as const;

// ========== VALIDATION RULES ==========
export const VALIDATION = {
  medication: {
    nameMinLength: 2,
    nameMaxLength: 100,
    strengthMinLength: 1,
    strengthMaxLength: 20,
    dosageMin: 1,
    dosageMax: 10,
  },

  user: {
    nameMinLength: 2,
    nameMaxLength: 50,
  },

  timeSlots: {
    min: 1,
    max: 6,
  },
} as const;

// ========== ERROR MESSAGES ==========
export const ERROR_MESSAGES = {
  // Medication errors
  medicationNameRequired: 'Please enter a medication name',
  medicationNameTooShort: 'Medication name must be at least 2 characters',
  medicationStrengthRequired: 'Please enter the medication strength',
  invalidDosage: 'Dosage must be between 1 and 10',

  // Camera/Scan errors
  cameraPermissionDenied: 'Camera permission denied. Please enable camera access.',
  cameraNotAvailable: 'Camera not available on this device',
  scanFailed: 'Failed to scan medication. Please try again or enter manually.',

  // Generic errors
  genericError: 'Something went wrong. Please try again.',
  networkError: 'Network error. Please check your connection.',
  saveError: 'Failed to save. Please try again.',
} as const;

// ========== SUCCESS MESSAGES ==========
export const SUCCESS_MESSAGES = {
  medicationAdded: 'Medication added successfully!',
  medicationUpdated: 'Medication updated successfully!',
  medicationDeleted: 'Medication removed successfully!',
  settingsSaved: 'Settings saved!',
  dataSynced: 'Data synchronized!',
} as const;

// Type exports for TypeScript
export type ScreenName = typeof SCREENS[keyof typeof SCREENS];
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
export type SuccessMessage = typeof SUCCESS_MESSAGES[keyof typeof SUCCESS_MESSAGES];
