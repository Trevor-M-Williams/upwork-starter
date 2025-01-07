import { create } from "zustand";

interface NewCompanyDialogStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useNewCompanyDialog = create<NewCompanyDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
