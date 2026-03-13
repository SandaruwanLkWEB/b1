import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const TOKEN_KEY = 'transport_token';
const USER_KEY = 'transport_user';
const SAVED_EMAIL_KEY = 'transport_saved_email';

const readStorage = <T,>(key: string): T | null => {
  const local = localStorage.getItem(key);
  if (local) return JSON.parse(local) as T;
  const session = sessionStorage.getItem(key);
  return session ? (JSON.parse(session) as T) : null;
};

const readToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

const saveAuth = (remember: boolean, token: string, user: AuthUser) => {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => readStorage<AuthUser>(USER_KEY));
  const [token, setToken] = useState<string | null>(() => readToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    refreshProfile().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string, remember = true) => {
    const { data } = await api.post('/auth/login', { email, password });
    const normalized = {
      ...data.data.user,
      role: data.data.user.role,
      fullName: data.data.user.full_name ?? data.data.user.fullName,
      departmentId: data.data.user.department_id,
      employeeId: data.data.user.employee_id,
      id: data.data.user.id,
      phone: data.data.user.phone,
      emp_no: data.data.user.emp_no,
      f2a_enabled: data.data.user.f2a_enabled,
    } as AuthUser;

    saveAuth(remember, data.data.accessToken, normalized);
    if (remember) {
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }

    setToken(data.data.accessToken);
    setUser(normalized);
    await refreshProfile();
  };

  const logout = () => {
    clearAuth();
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
      phone: data.data.phone,
      emp_no: data.data.emp_no,
      f2a_enabled: data.data.f2a_enabled,
    } as AuthUser;

    const remembered = Boolean(localStorage.getItem(TOKEN_KEY));
    saveAuth(remembered, readToken() || token || '', normalized);
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

export { SAVED_EMAIL_KEY };
