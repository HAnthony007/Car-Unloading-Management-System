import { create } from "zustand";
import type { User } from "../data/schema";

export type UsersDialogType = "add" | "edit" | "delete";

interface UsersState {
  open: UsersDialogType | null;
  setOpen: (value: UsersDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: (row: User | null) => void;
  // List state (filters, pagination)
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  q: string;
  setQ: (q: string) => void;
  roles: string[];
  setRoles: (roles: string[]) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  open: null,
  setOpen: (value) => set({ open: value }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
  // Defaults aligned with UI
  page: 1,
  setPage: (page) => set({ page }),
  perPage: 15,
  setPerPage: (perPage) => set({ perPage }),
  q: "",
  setQ: (q) => set({ q }),
  roles: [],
  setRoles: (roles) => set({ roles }),
}));
