import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('transport_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('transport_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    refreshProfile().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('transport_token', data.data.accessToken);
    localStorage.setItem('transport_user', JSON.stringify(data.data.user));
    setToken(data.data.accessToken);
    setUser(data.data.user);
    await refreshProfile();
  };

  const logout = () => {
    localStorage.removeItem('transport_token');
    localStorage.removeItem('transport_user');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data } = await api.get('/auth/me');
    const normalized = {
      ...data.data,
      role: data.data.role,
      fullName: data.data.full_name,
      departmentId: data.data.department_id,
      employeeId: data.data.employee_id,
      id: data.data.id,
    } as AuthUser;
    localStorage.setItem('transport_user', JSON.stringify(normalized));
    setUser(normalized);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, refreshProfile }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
