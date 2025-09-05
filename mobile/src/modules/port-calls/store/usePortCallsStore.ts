import { create } from 'zustand';

type State = {
  q: string;
  status: string;
  sortBy: 'eta' | 'vehicles' | 'created';
  setQ: (q: string) => void;
  setStatus: (s: string) => void;
  setSortBy: (s: State['sortBy']) => void;
};

export const usePortCallsStore = create<State>((set: any) => ({
  q: '',
  status: 'all',
  sortBy: 'eta',
  setQ: (q: string) => set({ q }),
  setStatus: (status: string) => set({ status }),
  setSortBy: (sortBy: State['sortBy']) => set({ sortBy }),
}));
