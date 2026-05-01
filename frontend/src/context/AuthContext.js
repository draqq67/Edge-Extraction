import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const CREDENTIALS = [
  { username: 'student', password: 'canny123' },
  { username: 'admin', password: 'admin' },
];

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('edgeAuth') === 'true'
  );
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem('edgeUser') || null
  );

  const login = (username, password) => {
    const found = CREDENTIALS.find(c => c.username === username && c.password === password);
    if (found) {
      localStorage.setItem('edgeAuth', 'true');
      localStorage.setItem('edgeUser', username);
      setIsAuthenticated(true);
      setCurrentUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('edgeAuth');
    localStorage.removeItem('edgeUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
