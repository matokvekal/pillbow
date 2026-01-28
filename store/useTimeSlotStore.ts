import { create } from 'zustand';

interface TimeSlotState {
  // Which date's card is expanded (dateStr like "2026-01-17")
  expandedDate: string | null;
  // Which time slot is expanded within that date (time like "06:00")
  expandedSlot: string | null;

  // Actions
  openDate: (dateStr: string) => void;
  closeDate: () => void;
  openSlot: (dateStr: string, time: string) => void;
  closeSlot: () => void;
  toggleSlot: (dateStr: string, time: string) => void;
}

export const useTimeSlotStore = create<TimeSlotState>((set, get) => ({
  expandedDate: null,
  expandedSlot: null,

  openDate: (dateStr: string) => set({
    expandedDate: dateStr,
    expandedSlot: null
  }),

  closeDate: () => set({
    expandedDate: null,
    expandedSlot: null
  }),

  openSlot: (dateStr: string, time: string) => set({
    expandedDate: dateStr,
    expandedSlot: time
  }),

  closeSlot: () => set({
    expandedSlot: null
  }),

  toggleSlot: (dateStr: string, time: string) => {
    console.log('toggleSlot called:', dateStr, time);
    const { expandedSlot, expandedDate } = get();
    console.log('current state:', { expandedDate, expandedSlot });
    if (expandedDate === dateStr && expandedSlot === time) {
      console.log('closing slot');
      set({ expandedSlot: null });
    } else {
      console.log('opening slot');
      set({ expandedDate: dateStr, expandedSlot: time });
    }
  },
}));
