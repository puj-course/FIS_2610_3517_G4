import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { authService } from '@/services/api.js';

const AuthContext = createContext(null);
const DUPLICATE_EMAIL_MESSAGE = 'Ya existe una cuenta con este correo electrónico.';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => String(value ?? '').trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();

const validateRegistrationData = ({ email, password, empresa, telefono }) => {
  if (!normalizeText(empresa)) return 'Ingresa el nombre de la empresa.';
  if (!normalizeText(telefono)) return 'Ingresa el teléfono.';
  if (!EMAIL_REGEX.test(normalizeEmail(email))) return 'Ingresa un correo electrónico válido.';
  if (!password) return 'Ingresa una contraseña.';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('syntix_user', null);
  // Nuevo: Guardamos el token de sesión industrial para rutas protegidas
  const [token, setToken] = useLocalStorage('syntix_token', null);
  const [usersDb, setUsersDb] = useLocalStorage('syntix_users_db', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- FALLBACKS LOCALES (Se mantienen igual) ---
  const registerLocal = useCallback((email, password, empresa, telefono) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedEmpresa = normalizeText(empresa);
    const normalizedTelefono = normalizeText(telefono);
    const validationError = validateRegistrationData({
      email: normalizedEmail,
      password,
      empresa: normalizedEmpresa,
      telefono: normalizedTelefono,
    });

    if (validationError) {
      return { success: false, message: validationError };
    }

    const currentUsers = Array.isArray(usersDb) ? usersDb : [];
    if (currentUsers.some(u => normalizeEmail(u.email) === normalizedEmail)) {
      return { success: false, message: DUPLICATE_EMAIL_MESSAGE };
    }

    const newUser = {
      email: normalizedEmail,
      password,
      empresa: normalizedEmpresa,
      telefono: normalizedTelefono,
      role: 'admin',
    };
    const userWithoutPass = {
      email: newUser.email,
      empresa: newUser.empresa,
      telefono: newUser.telefono,
      role: newUser.role,
    };

    setUsersDb([...currentUsers, newUser]);
    setUser(userWithoutPass);
    setToken(null);
    return { success: true, user: userWithoutPass };
  }, [usersDb, setUsersDb, setUser, setToken]);

  const loginLocal = useCallback((email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const currentUsers = Array.isArray(usersDb) ? usersDb : [];
    const foundUser = currentUsers.find(u => normalizeEmail(u.email) === normalizedEmail && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      setToken(null);
      return { success: true };
    }

    if (normalizedEmail === 'admin@syntix.tech' && password === 'admin123') {
      setUser({ email: normalizedEmail, empresa: 'SYNTIX Demo', telefono: '3000000000', role: 'admin' });
      setToken(null);
      return { success: true };
    }

    return { success: false, message: 'Credenciales inválidas' };
  }, [usersDb, setUser, setToken]);

  // --- MÉTODOS PRINCIPALES CON API ---
  const register = useCallback(async (email, password, empresa, telefono) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedEmpresa = normalizeText(empresa);
    const normalizedTelefono = normalizeText(telefono);
    const validationError = validateRegistrationData({
      email: normalizedEmail,
      password,
      empresa: normalizedEmpresa,
      telefono: normalizedTelefono,
    });

    if (validationError) {
      return { success: false, message: validationError };
    }

    setLoading(true);
    setError(null);

    try {
      const apiResult = await authService.register({
        email: normalizedEmail,
        password,
        empresa: normalizedEmpresa,
        telefono: normalizedTelefono,
      });

      if (apiResult.useLocalStorage) {
        return registerLocal(normalizedEmail, password, normalizedEmpresa, normalizedTelefono);
      }

      if (apiResult.success) {
        return {
          success: true,
          needsVerification: true,
          email: apiResult.data?.email || normalizedEmail,
          message: apiResult.message,
        };
      }

      return { success: false, message: apiResult.message || 'Error al registrar usuario' };
    } catch (err) {
      console.warn('Error en API, usando localStorage:', err);
      return registerLocal(normalizedEmail, password, normalizedEmpresa, normalizedTelefono);
    } finally {
      setLoading(false);
    }
  }, [registerLocal]);

  const login = useCallback(async (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    setLoading(true);
    setError(null);

    try {
      const apiResult = await authService.login(normalizedEmail, password);

      if (apiResult.useLocalStorage) {
        return loginLocal(normalizedEmail, password);
      }

      if (apiResult.success) {
        setUser(apiResult.data.user);
        setToken(apiResult.data.token);
        return { success: true };
      }

      const localResult = loginLocal(normalizedEmail, password);
      if (localResult.success) {
        return localResult;
      }

      return { success: false, message: apiResult.message };
    } catch (err) {
      console.warn('Error en API, usando localStorage:', err);
      return loginLocal(normalizedEmail, password);
    } finally {
      setLoading(false);
    }
  }, [loginLocal, setUser, setToken]);

  const loginAfterVerification = useCallback((verifiedUser, verifiedToken = null) => {
    if (!verifiedUser) return { success: false };
    setUser(verifiedUser);
    setToken(verifiedToken);
    return { success: true };
  }, [setUser, setToken]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
  }, [setUser, setToken]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user, token, login, register, loginAfterVerification, logout,
      isAuthenticated: !!user, loading, error, clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
