
import { Medication, TimeSlot } from './types';

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    company: 'Teva',
    strength: '500 mg',
    dosage: '1 X',
    dosesPerDay: 2,
    timesOfDay: ['06:00', '20:00'],
    instructions: 'Take with food',
    color: 'bg-blue-300',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
  },
  {
    id: '2',
    name: 'Aspirin',
    company: 'Bayer',
    strength: '100 mg',
    dosage: '1 X',
    dosesPerDay: 1,
    timesOfDay: ['06:00'],
    instructions: 'Take on empty stomach',
    color: 'bg-green-300',
    startDate: '2024-06-01',
  },
  {
    id: '3',
    name: 'Vitamin D3',
    company: 'Solgar',
    strength: '1000 IU',
    dosage: '1 X',
    dosesPerDay: 1,
    timesOfDay: ['10:00'],
    instructions: 'Daily supplement',
    color: 'bg-yellow-300',
    startDate: '2024-01-01',
  },
  {
    id: '4',
    name: 'Omega-3',
    company: 'Nordic Naturals',
    strength: '1000 mg',
    dosage: '2 X',
    dosesPerDay: 1,
    timesOfDay: ['12:00'],
    instructions: 'With lunch',
    color: 'bg-red-300',
    startDate: '2024-01-01',
  },
  {
    id: '5',
    name: 'Magnesium',
    company: 'NOW Foods',
    strength: '400 mg',
    dosage: '1 X',
    dosesPerDay: 1,
    timesOfDay: ['20:00'],
    instructions: 'Before bed',
    color: 'bg-purple-300',
    startDate: '2024-03-01',
  }
];

// All possible time slots
export const ALL_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-0600', label: 'Morning', time: '06:00', icon: '🌅' },
  { id: 'slot-1000', label: 'Mid-Morning', time: '10:00', icon: '☕' },
  { id: 'slot-1200', label: 'Noon', time: '12:00', icon: '🌞' },
  { id: 'slot-1500', label: 'Afternoon', time: '15:00', icon: '🌇' },
  { id: 'slot-2000', label: 'Evening', time: '20:00', icon: '🌙' },
];

// Legacy export for backwards compatibility
export const TIME_SLOTS = [
  { id: 'Morning', label: 'Sunrise', time: '06:00', icon: '🌅' },
  { id: 'Noon', label: 'Coffee', time: '10:00', icon: '☕' },
  { id: 'Afternoon', label: 'Sunset', time: '14:00', icon: '🌇' },
  { id: 'Evening', label: 'Bedtime', time: '20:00', icon: '🌙' }
];

// Get time slot by time string
export const getTimeSlotByTime = (time: string): TimeSlot | undefined => {
  return ALL_TIME_SLOTS.find(slot => slot.time === time);
};

// Get icon for a time
export const getIconForTime = (time: string): string => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 9) return '🌅';
  if (hour < 12) return '☕';
  if (hour < 15) return '🌞';
  if (hour < 18) return '🌇';
  return '🌙';
};

// Get label for a time
export const getLabelForTime = (time: string): string => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 9) return 'Morning';
  if (hour < 12) return 'Mid-Morning';
  if (hour < 15) return 'Noon';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};
