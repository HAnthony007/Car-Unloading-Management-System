import { ApiError, apiLogin, apiLogout, apiMe, BackendUser } from '@/src/modules/auth/services/api';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthContextValue = {
  user?: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user || undefined) as User | undefined;
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const setBackendUser = useAuthStore((s) => s.setBackendUser);
  const reset = useAuthStore((s) => s.reset);
  const token = useAuthStore((s) => s.token);

  const mapToUIUser = (u: BackendUser): User => ({
    id: String(u.user_id),
    name:
      u.display_name ||
      u.full_name ||
      `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() ||
      'Utilisateur',
    email: u.email,
    role: u.role?.display_name || u.role?.role_name,
  });

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    const backendUser = res?.data?.user;
    const token = res?.data?.token;
    if (!backendUser || !token) {
      throw new ApiError(res?.message || 'Email ou mot de passe incorrect.', 401, res);
    }
    setToken(token);
    setBackendUser(backendUser);
    setUser(mapToUIUser(backendUser));
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Auth] apiLogout failed, continuing local sign-out', e);
    } finally {
      reset();
      router.replace('/(auth)');
    }
  };

  // On mount: if token exists but user isn't loaded yet, refresh from /auth/me
  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      if (!token || user) return;
      try {
        const res = await apiMe();
        const backendUser = res?.data?.user as BackendUser | undefined;
        if (backendUser && mounted) {
          setBackendUser(backendUser);
          setUser(mapToUIUser(backendUser));
        }
      } catch (e: any) {
        // 401 -> token invalid/expired; clean local state
        if (mounted) reset();
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
    // only run when token changes from persisted state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
