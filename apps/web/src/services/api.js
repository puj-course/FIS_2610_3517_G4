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

// Servicios de autenticación
export const authService = {
  async register(userData) {
    try {
      // Nota: Asumiendo que tu backend usa las rutas /auth/register y /auth/login
      const response = await api.post('/auth/register', userData);
      // Extraemos la propiedad 'data' que viene de la respuesta de Express
      return { success: true, data: response.data.data }; 
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return { success: false, useLocalStorage: true };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
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
        message: error.response?.data?.message || 'Credenciales inválidas',
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
        message: error.response?.data?.message || 'Error al actualizar usuario',
      };
    }
  },
};

export default api;