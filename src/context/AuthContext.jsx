import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Mock accounts for switching (for demo purposes)
const mockAccounts = [
  { id: 1, name: 'Admin One', email: 'admin1@infosys.com', role: 'admin' },
  { id: 2, name: 'Admin Two', email: 'admin2@infosys.com', role: 'admin' },
  { id: 3, name: 'Viewer', email: 'viewer@infosys.com', role: 'viewer' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('mock_accounts');
    return saved ? JSON.parse(saved) : mockAccounts;
  });

  // Load persisted user (account switch) on mount
  useEffect(() => {
    const persisted = localStorage.getItem('auth_user');
    if (persisted) {
      setUser(JSON.parse(persisted));
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      api
        .get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // Simple mock validation using predefined accounts (any password accepted for demo)
    const account = accounts.find((acc) => acc.email === email);
    if (!account) {
      throw new Error('Invalid credentials');
    }
    const token = 'demo-token';
    localStorage.setItem('token', token);
    setUser(account);
    localStorage.setItem('auth_user', JSON.stringify(account));
  };

  const register = async (name, email, password) => {
    const existing = accounts.find((acc) => acc.email === email);
    if (existing) {
      throw new Error('Email already registered');
    }
    const newAccount = { id: Date.now(), name, email, role: 'viewer' };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('mock_accounts', JSON.stringify(updatedAccounts));
    
    const token = 'demo-token';
    localStorage.setItem('token', token);
    setUser(newAccount);
    localStorage.setItem('auth_user', JSON.stringify(newAccount));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const switchAccount = (account) => {
    setUser(account);
    localStorage.setItem('auth_user', JSON.stringify(account));
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        switchAccount,
        isAdmin,
        loading,
        mockAccounts: accounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
