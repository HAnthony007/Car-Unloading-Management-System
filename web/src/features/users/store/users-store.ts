import { create } from "zustand";
import type { User } from "../data/schema";

export type UsersDialogType = "add" | "edit" | "delete";

interface UsersState {
  open: UsersDialogType | null;
  setOpen: (value: UsersDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: (row: User | null) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  open: null,
  setOpen: (value) => set({ open: value }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
