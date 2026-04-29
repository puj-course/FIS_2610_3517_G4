import axios from 'axios';

// Base URL para el backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    const userStr = localStorage.getItem('syntix_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        // Si el usuario tiene un token de sesión seguro, lo enviamos en los headers
        if (parsed && parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.error('Error al leer el token:', error);
      }
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
    return 'Ruta de autenticacion no encontrada. Revisa VITE_API_URL y asegúrate de incluir /api.';
  }

  if (status === 503) {
    return 'El backend no tiene acceso a la base de datos en este momento.';
  }

  return fallbackMessage;
};

// Servicios de autenticación
export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      // El endpoint de registro retorna message/email; no retorna token hasta verificar OTP.
      return { success: true, data: response.data };
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
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
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
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
      return { success: true, data: response.data };
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
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
      if (error.code === 'ERR_NETWORK') {
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
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
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