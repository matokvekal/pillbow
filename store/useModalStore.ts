import { create } from 'zustand';
import { Medication } from '../types';

interface ModalState {
   selectedMed: Medication | null;
   isOpen: boolean;
   openModal: (medication: Medication) => void;
   closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
   selectedMed: null,
   isOpen: false,
   openModal: (medication: Medication) =>
      set({ selectedMed: medication, isOpen: true }),
   closeModal: () =>
      set({ selectedMed: null, isOpen: false }),
}));
