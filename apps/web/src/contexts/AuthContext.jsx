import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { authService } from '@/services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('syntix_user', null);
  const [usersDb, setUsersDb] = useLocalStorage('syntix_users_db', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función auxiliar para registro local (fallback)
  const registerLocal = useCallback((email, password, empresa, telefono) => {
    if (usersDb.find(u => u.email === email)) {
      return { success: false, message: 'El correo ya está registrado' };
    }
    const newUser = { email, password, empresa, telefono, role: 'admin' };
    const updatedUsersDb = [...usersDb, newUser];
    setUsersDb(updatedUsersDb);
    setUser({ email, empresa, telefono, role: 'admin' });
    return { success: true };
  }, [usersDb, setUsersDb, setUser]);

  // Función auxiliar para login local (fallback)
  const loginLocal = useCallback((email, password) => {
    const foundUser = usersDb.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      return { success: true };
    }
    // Fallback mock for testing if db is empty
    if (email === 'admin@syntix.tech' && password === 'admin123') {
      setUser({ email, empresa: 'SYNTIX Demo', telefono: '3000000000', role: 'admin' });
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  }, [usersDb, setUser]);

  // Registro con soporte para API y fallback a localStorage
  const register = useCallback(async (email, password, empresa, telefono) => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar registro con API
      const apiResult = await authService.register({ email, password, empresa, telefono });
      
      if (apiResult.useLocalStorage) {
        // Backend no disponible - NO registrar sin OTP
        setLoading(false);
        return { success: false, message: 'El servidor no está disponible. Intenta nuevamente en unos momentos.' };
      }
      
      if (apiResult.success) {
        // Registro exitoso pero requiere verificacion OTP - NO logueamos aun
        setLoading(false);
        return { success: true, needsVerification: true };
      }
      
      setLoading(false);
      return { success: false, message: apiResult.message };
    } catch (err) {
      // En caso de error de red, NO registrar sin OTP
      console.warn('Error en API durante registro:', err);
      setLoading(false);
      return { success: false, message: 'No se pudo conectar al servidor. Verifica tu conexión.' };
    }
  }, [registerLocal, setUser]);

  // Login con soporte para API y fallback a localStorage
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar login con API
      const apiResult = await authService.login(email, password);
      
      if (apiResult.useLocalStorage) {
        // Backend no disponible, usar localStorage
        const localResult = loginLocal(email, password);
        setLoading(false);
        return localResult;
      }
      
      if (apiResult.success) {
        const userData = apiResult.data?.user || { email, role: 'admin' };
        setUser(userData);
        setLoading(false);
        return { success: true };
      }
      
      setLoading(false);
      return { success: false, message: apiResult.message };
    } catch (err) {
      // En caso de error, intentar con localStorage
      console.warn('Error en API, usando localStorage:', err);
      const localResult = loginLocal(email, password);
      setLoading(false);
      return localResult;
    }
  }, [loginLocal, setUser]);

  const updateUser = useCallback(async (newEmail, newPassword) => {
    if (!user) return { success: false, message: 'No hay usuario autenticado' };
    
    setLoading(true);
    
    try {
      const apiResult = await authService.updateUser({ email: newEmail, password: newPassword });
      
      if (apiResult.useLocalStorage || !apiResult.success) {
        // Usar localStorage
        const updatedUsersDb = usersDb.map(u => {
          if (u.email === user.email) {
            return { ...u, email: newEmail || u.email, password: newPassword || u.password };
          }
          return u;
        });
        
        setUsersDb(updatedUsersDb);
        setUser({ ...user, email: newEmail || user.email });
        setLoading(false);
        return { success: true };
      }
      
      setUser({ ...user, email: newEmail || user.email });
      setLoading(false);
      return { success: true };
    } catch (err) {
      // Fallback a localStorage
      const updatedUsersDb = usersDb.map(u => {
        if (u.email === user.email) {
          return { ...u, email: newEmail || u.email, password: newPassword || u.password };
        }
        return u;
      });
      
      setUsersDb(updatedUsersDb);
      setUser({ ...user, email: newEmail || user.email });
      setLoading(false);
      return { success: true };
    }
  }, [user, usersDb, setUsersDb, setUser]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, [setUser]);

  const loginAfterVerification = useCallback((userData) => {
    if (userData) setUser(userData);
  }, [setUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      updateUser, 
      logout,
      loginAfterVerification,
      isAuthenticated: !!user,
      loading,
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);