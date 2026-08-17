import { createContext, useContext, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('cgs_user');
    return raw ? JSON.parse(raw) : null;
  });

  async function login(username, password) {
    const res = await client.post('/auth/login', { username, password });
    const { token, ...userInfo } = res.data.data;
    localStorage.setItem('cgs_token', token);
    localStorage.setItem('cgs_user', JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  }

  function logout() {
    localStorage.removeItem('cgs_token');
    localStorage.removeItem('cgs_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
