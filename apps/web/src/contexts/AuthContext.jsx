import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { authService } from '@/services/api.js';

const AuthContext = createContext(null);
const DUPLICATE_EMAIL_MESSAGE = 'Ya existe una cuenta con este correo electrónico.';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => String(value ?? '').trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();

// La validación previa evita golpear la API con datos que ya sabemos que son inconsistentes.
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
  // El token se guarda aparte para desacoplar la sesión del perfil mínimo mostrado en UI.
  const [token, setToken] = useLocalStorage('syntix_token', null);
  const [usersDb, setUsersDb] = useLocalStorage('syntix_users_db', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback local: permite que el frontend siga operando cuando el backend aún no está disponible.
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

  // Flujo principal: intenta backend y solo vuelve al almacenamiento local si la integración falla.
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
        return {
          success: false,
          message:
            apiResult.message ||
            'El backend no esta disponible para completar el registro con verificacion por correo.',
        };
      }

      if (apiResult.success) {
        return {
          success: true,
          needsVerification: true,
          email: apiResult.data?.email || normalizedEmail,
          message: apiResult.data?.message || apiResult.message || 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
        };
      }

      return { success: false, message: apiResult.message || 'Error al registrar usuario' };
    } catch (err) {
      console.warn('Error en API durante registro:', err);
      return {
        success: false,
        message: 'No se pudo completar el registro. Verifica que el backend y la base de datos esten disponibles.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

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

      // Si la API responde error funcional, aún se revisa el fallback local para no romper demos.
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

  const loginWithGoogle = useCallback(async ({ idToken, empresa = '', telefono = '' }) => {
    setLoading(true);
    setError(null);

    try {
      const apiResult = await authService.googleAuth({
        idToken,
        empresa: normalizeText(empresa),
        telefono: normalizeText(telefono),
      });

        if (apiResult.success) {
          setUser(apiResult.data.user);
          setToken(apiResult.data.token);
          return {
            success: true,
            created: Boolean(apiResult.data.created),
            user: apiResult.data.user,
            message: apiResult.message,
          };
        }

      if (apiResult.useLocalStorage) {
        return {
          success: false,
          message: 'La autenticacion con Google requiere que el backend este disponible.',
        };
      }

      return { success: false, message: apiResult.message || 'No se pudo autenticar con Google' };
    } catch (err) {
      return { success: false, message: 'Error inesperado al autenticar con Google.' };
    } finally {
      setLoading(false);
    }
  }, [setUser, setToken]);

  const loginAfterVerification = useCallback((verifiedUser, verifiedToken = null) => {
    if (!verifiedUser) return { success: false };
    setUser(verifiedUser);
    setToken(verifiedToken);
    setError(null);
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
      user, token, login, loginWithGoogle, register, loginAfterVerification, logout,
      isAuthenticated: !!user, loading, error, clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
