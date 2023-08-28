import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, []);

  const value = {
    isLoggedIn: !!token,
    token,
    login: (token) => {
      localStorage.setItem('token', token);
      setToken(token);
    },
    logout: () => {
      localStorage.removeItem('token');
      setToken(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

