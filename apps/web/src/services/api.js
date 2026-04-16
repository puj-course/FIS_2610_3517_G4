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
        message: error.response?.data?.message || 'Error al registrar usuario',
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
        message: error.response?.data?.message || 'Credenciales inválidas',
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
        message: error.response?.data?.message || 'Error al actualizar usuario',
      };
    }
  },
};

export default api;
