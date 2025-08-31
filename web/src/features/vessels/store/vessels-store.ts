import { create } from "zustand";
import type { Vessel } from "../data/schema";

export type VesselsDialogType = "add" | "edit" | "view";

interface VesselsState {
  open: VesselsDialogType | null;
  setOpen: (value: VesselsDialogType | null) => void;
  currentRow: Vessel | null;
  setCurrentRow: (row: Vessel | null) => void;
}

export const useVesselsStore = create<VesselsState>((set) => ({
  open: null,
  setOpen: (value) => set({ open: value }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
