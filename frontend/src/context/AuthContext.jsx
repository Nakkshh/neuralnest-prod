/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage ONCE, during first render
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('nn_token');  // Match Dashboard.jsx
    const storedUser = localStorage.getItem('nn_user');

    if (!storedToken) return null;

    return {
      token: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null  // Store full user object
    };
  });

  const login = (token, user) => {  // ✅ FIXED params
    if (!token) return;

    localStorage.setItem('nn_token', token);              // ✅ FIXED
    localStorage.setItem('nn_user', JSON.stringify(user)); // ✅ FIXED
    
    setUser({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('nn_token');    // ✅ FIXED
    localStorage.removeItem('nn_user');     // ✅ FIXED
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
