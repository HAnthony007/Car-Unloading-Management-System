import { create } from "zustand";
import type { Vehicle } from "../data/schema";

export type VehiclesDialogType = "add" | "edit" | "delete" | "view";

interface VehiclesState {
  open: VehiclesDialogType | null;
  setOpen: (value: VehiclesDialogType | null) => void;
  currentRow: Vehicle | null;
  setCurrentRow: (row: Vehicle | null) => void;
}

export const useVehiclesStore = create<VehiclesState>((set) => ({
  open: null,
  setOpen: (value) => set({ open: value }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
