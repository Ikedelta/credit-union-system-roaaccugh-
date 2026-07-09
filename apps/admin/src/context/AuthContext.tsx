import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (token: string, adminData: Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dev auto-login removed so user can test real login

    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      // In development, the proxy will handle /api
      const res = await axios.get('/api/admin/me');
      setAdmin(res.data.admin);
    } catch (error) {
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, adminData: Admin) => {
    localStorage.setItem('adminToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
