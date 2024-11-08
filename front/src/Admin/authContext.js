// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize isAuthenticated from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return JSON.parse(localStorage.getItem('isAuthenticated')) || false;
  });

  // Login function to set isAuthenticated to true
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
  };

  // Logout function to set isAuthenticated to false
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', JSON.stringify(false));
  };

  useEffect(() => {
    // Sync isAuthenticated state with localStorage on load
    const storedAuthState = JSON.parse(localStorage.getItem('isAuthenticated'));
    if (storedAuthState) {
      setIsAuthenticated(storedAuthState);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
