import { createContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
}

export type { User, AuthContextType };
export const AuthContext = createContext<AuthContextType | null>(null);
