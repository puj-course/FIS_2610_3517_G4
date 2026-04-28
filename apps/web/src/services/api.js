import axios from 'axios';

// Base URL para el backend API (configurar cuando esté disponible)
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
    const user = localStorage.getItem('syntix_user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
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
      // Backend no disponible - se manejará con localStorage
      console.warn('Backend no disponible, usando almacenamiento local');
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
  /**
   * Registrar un nuevo usuario
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        // Backend no disponible - usar localStorage
        return { success: false, useLocalStorage: true };
      }
      return {
        success: false,
        message: normalizeApiErrorMessage(error, 'Error al registrar usuario'),
      };
    }
  },

  /**
   * Iniciar sesión
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        // Backend no disponible - usar localStorage
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

  /**
   * Actualizar datos del usuario
   */
  async updateUser(userData) {
    try {
      const response = await api.put('/auth/user', userData);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
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
