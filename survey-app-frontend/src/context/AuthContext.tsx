import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } })
    });
    const data = await res.json();
    setUser(data.status.data.user);
    setToken(data.status.token);
  };

  const signup = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const res = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { name, email, password, password_confirmation: passwordConfirmation } })
    });
    const data = await res.json();
    setUser(data.status.data.user);
    setToken(data.status.token);
  };

  const logout = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
