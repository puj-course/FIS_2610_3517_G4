import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { authService } from '@/services/api.js';
import { isValidEmailFormat } from '@/utils/emailValidation.js';

const AuthContext = createContext(null);
// Mensaje compartido para no duplicar texto cuando backend y fallback local
// detectan el mismo caso de correo ya registrado.
const DUPLICATE_EMAIL_MESSAGE = 'Ya existe una cuenta con este correo electrónico.';
// Quita espacios laterales y garantiza que trabajemos siempre con strings.
const normalizeText = (value) => String(value ?? '').trim();
// El correo se normaliza en minúsculas para evitar duplicados por casing.
const normalizeEmail = (value) => normalizeText(value).toLowerCase();

// La validación previa evita golpear la API con datos que ya sabemos que son inconsistentes.
const validateRegistrationData = ({ email, password, empresa, telefono }) => {
  // La empresa es obligatoria porque el sistema está pensado para flotas empresariales.
  if (!normalizeText(empresa)) return 'Ingresa el nombre de la empresa.';
  // El teléfono se usa más adelante para recuperación y contacto de la cuenta.
  if (!normalizeText(telefono)) return 'Ingresa el teléfono.';
  // El correo debe tener forma válida antes de intentar registro o login federado.
  if (!isValidEmailFormat(normalizeEmail(email))) return 'Ingresa un correo electrónico válido.';
  // No permitimos continuar sin contraseña en el registro tradicional.
  if (!password) return 'Ingresa una contraseña.';
  // Se exige un mínimo corto pero suficiente para el MVP.
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
};

export function AuthProvider({ children }) {
  // `syntix_user` sostiene el perfil mínimo necesario para pintar la UI.
  const [user, setUser] = useLocalStorage('syntix_user', null);
  // El token se guarda aparte para desacoplar la sesión del perfil mínimo mostrado en UI.
  const [token, setToken] = useLocalStorage('syntix_token', null);
  // Base local de respaldo usada solo en demos o cuando el backend no está disponible.
  const [usersDb, setUsersDb] = useLocalStorage('syntix_users_db', []);
  // `loading` permite bloquear botones y evitar dobles envíos.
  const [loading, setLoading] = useState(false);
  // `error` centraliza mensajes cuando un consumidor quiera leerlos desde contexto.
  const [error, setError] = useState(null);

  // Fallback local: permite que el frontend siga operando cuando el backend aún no está disponible.
  const registerLocal = useCallback((email, password, empresa, telefono) => {
    // Se normalizan los campos para que el fallback local se comporte igual que la API real.
    const normalizedEmail = normalizeEmail(email);
    const normalizedEmpresa = normalizeText(empresa);
    const normalizedTelefono = normalizeText(telefono);
    // Se reutiliza la misma validación previa del flujo remoto.
    const validationError = validateRegistrationData({
      email: normalizedEmail,
      password,
      empresa: normalizedEmpresa,
      telefono: normalizedTelefono,
    });

    if (validationError) {
      return { success: false, message: validationError };
    }

    // Se protege el storage local contra registros duplicados por correo.
    const currentUsers = Array.isArray(usersDb) ? usersDb : [];
    if (currentUsers.some(u => normalizeEmail(u.email) === normalizedEmail)) {
      return { success: false, message: DUPLICATE_EMAIL_MESSAGE };
    }

    // Este objeto simula la persistencia mínima que luego tendría MongoDB.
    const newUser = {
      email: normalizedEmail,
      password,
      empresa: normalizedEmpresa,
      telefono: normalizedTelefono,
      role: 'admin',
    };
    // La UI nunca necesita la contraseña después del registro exitoso.
    const userWithoutPass = {
      email: newUser.email,
      empresa: newUser.empresa,
      telefono: newUser.telefono,
      role: newUser.role,
    };

    // Se persiste el usuario demo y se inicia sesión local inmediata.
    setUsersDb([...currentUsers, newUser]);
    setUser(userWithoutPass);
    // No hay JWT real en modo local, por eso el token se limpia explícitamente.
    setToken(null);
    return { success: true, user: userWithoutPass };
  }, [usersDb, setUsersDb, setUser, setToken]);

  const loginLocal = useCallback((email, password) => {
    // El login demo busca coincidencia exacta sobre el storage local.
    const normalizedEmail = normalizeEmail(email);
    const currentUsers = Array.isArray(usersDb) ? usersDb : [];
    const foundUser = currentUsers.find(u => normalizeEmail(u.email) === normalizedEmail && u.password === password);

    if (foundUser) {
      // Igual que en producción, jamás se conserva la contraseña en el estado del cliente.
      const { password: _, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      setToken(null);
      return { success: true };
    }

    // Credencial administrativa fija para demostraciones rápidas del sistema.
    if (normalizedEmail === 'admin@syntix.tech' && password === 'admin123') {
      setUser({ email: normalizedEmail, empresa: 'SYNTIX Demo', telefono: '3000000000', role: 'admin' });
      setToken(null);
      return { success: true };
    }

    return { success: false, message: 'Credenciales inválidas' };
  }, [usersDb, setUser, setToken]);

  // Flujo principal: intenta backend y solo vuelve al almacenamiento local si la integración falla.
  const register = useCallback(async (email, password, empresa, telefono) => {
    // Se normaliza antes de salir del frontend para mantener consistencia con backend.
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

    // Se activa loading solo cuando ya sabemos que el formulario está correcto.
    setLoading(true);
    setError(null);

    try {
      // El backend es la única fuente válida para registro con verificación por correo.
      const apiResult = await authService.register({
        email: normalizedEmail,
        password,
        empresa: normalizedEmpresa,
        telefono: normalizedTelefono,
      });

      if (apiResult.useLocalStorage) {
        // El registro no cae a localStorage porque saltaría el OTP y rompería la seguridad del flujo.
        return {
          success: false,
          message:
            apiResult.message ||
            'El backend no esta disponible para completar el registro con verificacion por correo.',
        };
      }

      if (apiResult.success) {
        // El modal de registro usa `needsVerification` para pasar al paso OTP.
        return {
          success: true,
          needsVerification: true,
          email: apiResult.data?.email || normalizedEmail,
          message: apiResult.data?.message || apiResult.message || 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
        };
      }

      return { success: false, message: apiResult.message || 'Error al registrar usuario' };
    } catch (err) {
      // Un fallo inesperado no debe crear cuentas locales ni dejar al usuario sin explicación.
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
    // En login también se normaliza el correo para evitar fallos por mayúsculas.
    const normalizedEmail = normalizeEmail(email);
    setLoading(true);
    setError(null);

    try {
      // Primero se intenta el backend porque ahí vive la sesión real con JWT.
      const apiResult = await authService.login(normalizedEmail, password);

      if (apiResult.useLocalStorage) {
        // Solo el login puede degradar a localStorage sin romper el modelo de verificación.
        return loginLocal(normalizedEmail, password);
      }

      if (apiResult.success) {
        // Si el backend valida, guardamos usuario y token como sesión principal.
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
    // Google login comparte el mismo control de loading que login/register.
    setLoading(true);
    setError(null);

    try {
      // El backend valida el token de Google y decide si crea o reutiliza la cuenta.
      const apiResult = await authService.googleAuth({
        idToken,
        empresa: normalizeText(empresa),
        telefono: normalizeText(telefono),
      });

      if (apiResult.success) {
        // La sesión federada termina igual que una sesión normal: usuario + JWT.
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
        // Google nunca cae a modo local porque requiere validación real del idToken.
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
    // El modal OTP usa esta función para materializar la sesión después de verificar el código.
    if (!verifiedUser) return { success: false };
    setUser(verifiedUser);
    setToken(verifiedToken);
    setError(null);
    return { success: true };
  }, [setUser, setToken]);

  const logout = useCallback(() => {
    // Cerrar sesión limpia tanto perfil como JWT y cualquier error residual.
    setUser(null);
    setToken(null);
    setError(null);
  }, [setUser, setToken]);

  // Se expone helper para que formularios descarten errores previos al cambiar de modo.
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
