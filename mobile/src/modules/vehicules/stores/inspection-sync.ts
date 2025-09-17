import { create } from "zustand";

interface InspectionSyncState {
    version: number;
    bump: () => void;
}

export const useInspectionSync = create<InspectionSyncState>((set, get) => ({
    version: 0,
    bump: () => set({ version: get().version + 1 }),
}));
