import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getStoredUser,
  getStoredToken,
} from '../lib/auth';

const defaultAuthContext = {
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => null,
  register: async () => null,
  logout: () => {},
};

const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = getStoredUser();
      const storedToken = getStoredToken();

      if (storedUser) setUser(storedUser);
      if (storedToken) setTokenState(storedToken);
    } catch (error) {
      console.error('Error loading auth state:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(data.user);
    setTokenState(data.token);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    setUser(data.user);
    setTokenState(data.token);
    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setTokenState(null);
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
    }),
    [user, token, loading, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};