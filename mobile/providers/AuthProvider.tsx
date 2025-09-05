import { router } from 'expo-router';
import React, { createContext, useContext, useMemo, useState } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthContextValue = {
  user?: User;
  login: (email: string, _password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const login = async (email: string, _password: string) => {
    // TODO: Replace with real API login; persist token securely
    const namePart = email.split('@')[0] || 'Agent';
    setUser({ id: 'me', name: namePart.charAt(0).toUpperCase() + namePart.slice(1), email, role: 'Agent terrain' });
  };

  const logout = () => {
    setUser(undefined);
    router.replace('/(auth)');
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
