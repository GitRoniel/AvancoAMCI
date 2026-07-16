import { create } from 'zustand';

interface SelectionState {
  selectedUnitId: string | null;
  bottomSheetOpen: boolean;
  select: (id: string) => void;
  close: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedUnitId: null,
  bottomSheetOpen: false,
  select: (id) => set({ selectedUnitId: id, bottomSheetOpen: true }),
  close: () => set({ bottomSheetOpen: false }),
}));
