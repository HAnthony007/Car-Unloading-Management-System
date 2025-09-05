import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UIUser = { id: string; name: string; email: string; role?: string } | null;

export type AuthState = {
	token: string | null;
	user: UIUser;
	backendUser?: any | null;
	setToken: (token: string | null) => void;
	setUser: (user: UIUser) => void;
	setBackendUser: (backendUser: any | null) => void;
	reset: () => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			backendUser: null,
			setToken: (token) => set({ token }),
			setUser: (user) => set({ user }),
			setBackendUser: (backendUser) => set({ backendUser }),
			reset: () => set({ token: null, user: null, backendUser: null }),
		}),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => AsyncStorage),
			// Only persist necessary fields
			partialize: (state) => ({ token: state.token, user: state.user, backendUser: state.backendUser }),
		}
	)
);

