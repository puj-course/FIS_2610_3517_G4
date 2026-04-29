import axios from 'axios';

// Base URL para el backend API
const normalizeApiBaseUrl = (value) => {
  const baseUrl = String(value || 'http://localhost:5000/api').replace(/\/+$/, '');
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const tokenStr = localStorage.getItem('syntix_token');
    const userStr = localStorage.getItem('syntix_user');
    let token = null;

    if (tokenStr) {
      try {
        token = JSON.parse(tokenStr);
      } catch {
        token = tokenStr;
      }
    }

    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        // Si el usuario tiene un token de sesión seguro, lo enviamos en los headers
        token = token || parsed?.token;
      } catch (error) {
        console.error('Error al leer el token:', error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend no disponible, activando modo local (fallback)');
    }
    return Promise.reject(error);
  }
);

const normalizeApiErrorMessage = (error, fallbackMessage) => {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;
  const requestPath = error?.config?.url || '';

  const normalizedBackendMessage = backendMessage?.toLowerCase() || '';

  if (status === 400 && normalizedBackendMessage.includes('ya') && normalizedBackendMessage.includes('registr')) {
    return 'Ya existe una cuenta con este correo electrónico.';
  }

  if (backendMessage) {
    return backendMessage;
  }

  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
    return 'No se pudo conectar con el servidor backend. Verifica que este ejecutandose.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'El servidor tardo demasiado en responder. Intenta nuevamente.';
  }

  if (status === 404 && requestPath.startsWith('/auth/')) {
    return 'Ruta de autenticacion no encontrada. Revisa que el backend este ejecutandose en la URL configurada.';
  }

  if (status === 503) {
    return 'El backend no tiene acceso a la base de datos en este momento.';
  }

  return fallbackMessage;
};

const shouldUseLocalStorage = (error) => {
  const status = error?.response?.status;
  const code = error?.response?.data?.code;
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNREFUSED' ||
    (status === 503 && code === 'DB_UNAVAILABLE')
  );
};

// Servicios de autenticación
export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      if (shouldUseLocalStorage(error)) {
        return { success: false, useLocalStorage: true };
      }
      return {
        success: false,
        message: normalizeApiErrorMessage(error, 'Error al registrar usuario'),
      };
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { success: true, data: response.data.data };
    } catch (error) {
      if (shouldUseLocalStorage(error)) {
        return { success: false, useLocalStorage: true };
      }
      return {
        success: false,
        message: normalizeApiErrorMessage(error, 'Credenciales inválidas'),
      };
    }
  },

  /**
   * Verificar codigo OTP
   */
  async verificarCodigo(email, codigo) {
    try {
      const response = await api.post('/auth/verificar-codigo', { email, codigo });
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      if (shouldUseLocalStorage(error)) {
        return { success: false, useLocalStorage: true };
      }
      return {
        success: false,
        message: normalizeApiErrorMessage(error, 'Codigo incorrecto'),
      };
    }
  },

  /**
   * Reenviar codigo OTP
   */
  async reenviarCodigo(email) {
    try {
      const response = await api.post('/auth/reenviar-codigo', { email });
      return { success: true, data: response.data };
    } catch (error) {
      if (shouldUseLocalStorage(error)) {
        return { success: false, useLocalStorage: true };
      }
      return {
        success: false,
        message: normalizeApiErrorMessage(error, 'Error al reenviar codigo'),
      };
    }
  },

  async updateUser(userData) {
    try {
      const response = await api.put('/auth/user', userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      if (shouldUseLocalStorage(error)) {
        return { success: false, useLocalStorage: true };
      }
      return {
        success: false,
        message: normalizeApiErrorMessage(error, 'Error al actualizar usuario'),
      };
    }
  },
};

export default api;
