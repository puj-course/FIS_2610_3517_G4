import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { authService } from '@/services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('syntix_user', null);
  // Nuevo: Guardamos el token de sesión industrial para rutas protegidas
  const [token, setToken] = useLocalStorage('syntix_token', null); 
  const [usersDb, setUsersDb] = useLocalStorage('syntix_users_db', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- FALLBACKS LOCALES (Se mantienen igual) ---
  const registerLocal = useCallback((email, password, empresa, telefono) => {
    if (usersDb.find(u => u.email === email)) {
      return { success: false, message: 'El correo ya está registrado' };
    }
    const newUser = { email, password, empresa, telefono, role: 'admin' };
    setUsersDb([...usersDb, newUser]);
    setUser({ email, empresa, telefono, role: 'admin' });
    return { success: true };
  }, [usersDb, setUsersDb, setUser]);

  const loginLocal = useCallback((email, password) => {
    const foundUser = usersDb.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      return { success: true };
    }
    if (email === 'admin@syntix.tech' && password === 'admin123') {
      setUser({ email, empresa: 'SYNTIX Demo', telefono: '3000000000', role: 'admin' });
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  }, [usersDb, setUser]);

  // --- MÉTODOS PRINCIPALES CON API ---
  const register = useCallback(async (email, password, empresa, telefono) => {
    setLoading(true);
    setError(null);
    try {
      const apiResult = await authService.register({ email, password, empresa, telefono });
      
      if (apiResult.useLocalStorage) {
        const localResult = registerLocal(email, password, empresa, telefono);
        setLoading(false);
        return { success: false, message: 'El servidor no está disponible. Intenta nuevamente en unos momentos.' };
      }
      
      if (apiResult.success) {
        setUser(apiResult.data.user);
        setToken(apiResult.data.token); // Guardamos el JWT
        setLoading(false);
        return { success: true, needsVerification: true };
      }
      
      setLoading(false);
      return { success: false, message: apiResult.message };
    } catch (err) {
      console.warn('Error en API, usando localStorage:', err);
      const localResult = registerLocal(email, password, empresa, telefono);
      setLoading(false);
      return { success: false, message: 'No se pudo conectar al servidor. Verifica tu conexión.' };
    }
  }, [registerLocal, setUser, setToken]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const apiResult = await authService.login(email, password);
      
      if (apiResult.useLocalStorage) {
        const localResult = loginLocal(email, password);
        setLoading(false);
        return localResult;
      }
      
      if (apiResult.success) {
        setUser(apiResult.data.user);
        setToken(apiResult.data.token); // Guardamos el JWT
        setLoading(false);
        return { success: true };
      }
      
      setLoading(false);
      return { success: false, message: apiResult.message };
    } catch (err) {
      console.warn('Error en API, usando localStorage:', err);
      const localResult = loginLocal(email, password);
      setLoading(false);
      return localResult;
    }
  }, [loginLocal, setUser, setToken]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
  }, [setUser, setToken]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ 
      user, token, login, register, logout, 
      isAuthenticated: !!user, loading, error, clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);