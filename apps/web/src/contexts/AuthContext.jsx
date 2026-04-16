import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('syntix_user', null);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      // El backend debe devolver: { success: true, user: { email, empresa, ... } }
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Error al conectar con el servidor';
      return { success: false, message };
    }
  };

  // ── register ───────────────────────────────────────────────────────────────
  const register = async (email, password, empresa, telefono) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        empresa,
        telefono,
      });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Error al conectar con el servidor';
      return { success: false, message };
    }
  };

  // ── updateUser ─────────────────────────────────────────────────────────────
  const updateUser = async (newEmail, newPassword) => {
    if (!user) return { success: false, message: 'No hay usuario autenticado' };
    try {
      const { data } = await axios.put(
        `${API_URL}/api/auth/update`,
        { email: newEmail, password: newPassword },
        { headers: { 'x-user-email': user.email } }   // ajusta al auth que uses
      );
      setUser({ ...user, email: data.user?.email || newEmail || user.email });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Error al actualizar usuario';
      return { success: false, message };
    }
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, login, register, updateUser, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
