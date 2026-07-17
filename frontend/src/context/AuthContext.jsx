import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const save = (data) => { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); };
  const login = async (details) => save((await api.post('/auth/login', details)).data);
  const register = async (details) => save((await api.post('/auth/register', details)).data);
  const logout = () => { api.post('/auth/logout').catch(() => {}); localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  useEffect(() => { window.addEventListener('auth-expired', logout); return () => window.removeEventListener('auth-expired', logout); }, []);
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
