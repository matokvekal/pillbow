import { create } from 'zustand';
import { Medication } from '../types';

// Modal types in the navigation stack
export type ModalType = 'day' | 'manage' | 'detail';

export interface ModalStackItem {
   type: ModalType;
   data?: any; // Can hold date, medication, etc.
}

interface ModalState {
   // Legacy fields for backward compatibility
   selectedMed: Medication | null;
   isOpen: boolean;

   // New modal stack system
   modalStack: ModalStackItem[];

   // Legacy methods
   openModal: (medication: Medication) => void;
   closeModal: () => void;

   // New stack methods
   pushModal: (item: ModalStackItem) => void;
   popModal: () => void;
   replaceModal: (item: ModalStackItem) => void;
   clearStack: () => void;
   getCurrentModal: () => ModalStackItem | null;
}

export const useModalStore = create<ModalState>((set, get) => ({
   // Legacy
   selectedMed: null,
   isOpen: false,

   // New stack
   modalStack: [],

   // Legacy methods
   openModal: (medication: Medication) =>
      set({ selectedMed: medication, isOpen: true }),
   closeModal: () =>
      set({ selectedMed: null, isOpen: false }),

   // Push a new modal onto the stack
   pushModal: (item: ModalStackItem) =>
      set((state) => ({
         modalStack: [...state.modalStack, item]
      })),

   // Pop the top modal from the stack
   popModal: () =>
      set((state) => ({
         modalStack: state.modalStack.slice(0, -1)
      })),

   // Replace the current modal with a new one (same position in stack)
   replaceModal: (item: ModalStackItem) =>
      set((state) => {
         if (state.modalStack.length === 0) {
            return { modalStack: [item] };
         }
         const newStack = [...state.modalStack];
         newStack[newStack.length - 1] = item;
         return { modalStack: newStack };
      }),

   // Clear all modals
   clearStack: () =>
      set({ modalStack: [] }),

   // Get the current (top) modal
   getCurrentModal: () => {
      const stack = get().modalStack;
      return stack.length > 0 ? stack[stack.length - 1] : null;
   }
}));
