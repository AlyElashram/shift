import { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../api/auth';
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext';

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('jwt_token');
    if (stored && token) {
      return JSON.parse(stored);
    }
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(() => getStoredUser() !== null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    getMe()
      .then((data) => {
        if (cancelled) return;
        const freshUser = data.user as User;
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('jwt_token');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    const userData = data.user as User;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isSuperAdmin: user?.role === 'super_admin',
  }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
