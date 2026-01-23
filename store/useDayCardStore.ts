import { create } from 'zustand';

interface DayCardStore {
  // Which time slot is expanded (null = none)
  expandedSlot: string | null;
  // Is manage list open
  isManageListOpen: boolean;

  // Actions
  openSlot: (time: string) => void;
  closeSlot: () => void;
  toggleSlot: (time: string) => void;
  openManageList: () => void;
  closeManageList: () => void;
  toggleManageList: () => void;
  closeAll: () => void;
}

export const useDayCardStore = create<DayCardStore>((set, get) => ({
  expandedSlot: null,
  isManageListOpen: false,

  openSlot: (time: string) => set({
    expandedSlot: time,
    isManageListOpen: false, // Close manage list when opening slot
  }),

  closeSlot: () => set({
    expandedSlot: null,
  }),

  toggleSlot: (time: string) => {
    const { expandedSlot } = get();
    if (expandedSlot === time) {
      set({ expandedSlot: null });
    } else {
      set({
        expandedSlot: time,
        isManageListOpen: false, // Close manage list when opening slot
      });
    }
  },

  openManageList: () => set({
    isManageListOpen: true,
    expandedSlot: null, // Close any open slot when opening manage list
  }),

  closeManageList: () => set({
    isManageListOpen: false,
  }),

  toggleManageList: () => {
    const { isManageListOpen } = get();
    if (isManageListOpen) {
      set({ isManageListOpen: false });
    } else {
      set({
        isManageListOpen: true,
        expandedSlot: null, // Close any open slot
      });
    }
  },

  closeAll: () => set({
    expandedSlot: null,
    isManageListOpen: false,
  }),
}));
