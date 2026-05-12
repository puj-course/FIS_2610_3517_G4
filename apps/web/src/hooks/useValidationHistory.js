/**
 * Hook useValidationHistory
 * Gestiona el historial de validaciones RUNT realizadas
 * Persiste en MongoDB a través de la API
 */

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function useValidationHistory() {
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Carga el historial desde MongoDB cuando el usuario inicia sesión
  const fetchValidations = useCallback(async () => {
    if (!user?.email) {
      setValidations([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/validaciones', { params: { email: user.email } });
      // Normalizar _id de Mongo a id para mantener compatibilidad con el resto del código
      setValidations(res.data.map((v) => ({ ...v, id: v._id || v.id })));
    } catch (err) {
      console.error('Error cargando historial RUNT:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchValidations();
  }, [fetchValidations]);

  // Guarda una nueva validación en MongoDB
  const addValidation = async (placa, resultadoRUNT, usuario = 'Admin User', notas = '') => {
    if (!user?.email) throw new Error('No hay usuario autenticado');

    const res = await api.post('/validaciones', {
      placa: placa.toUpperCase(),
      usuario,
      ownerEmail: user.email,
      resultadoRUNT,
      notas,
    });

    const nueva = { ...res.data, id: res.data._id || res.data.id };
    setValidations((prev) => [nueva, ...prev]);
    return nueva;
  };

  // Elimina una validación de MongoDB
  const deleteValidation = async (validationId) => {
    await api.delete(`/validaciones/${validationId}`);
    setValidations((prev) => prev.filter((v) => v.id !== validationId));
  };

  // Actualiza las notas de una validación en MongoDB
  const updateValidationNotes = async (validationId, notas) => {
    const res = await api.put(`/validaciones/${validationId}/notas`, { notas });
    setValidations((prev) =>
      prev.map((v) => (v.id === validationId ? { ...v, notas: res.data.notas } : v))
    );
  };

  // ── Funciones de lectura (sin cambios, trabajan sobre el estado en memoria) ──

  const getValidationHistory = (placa) => {
    const placaUpper = placa.toUpperCase();
    return validations
      .filter((v) => v.placa === placaUpper)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getAllValidations = () => {
    return [...validations].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getValidationsByDateRange = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio).getTime();
    const fin = new Date(fechaFin).getTime();
    return validations.filter((v) => {
      const timestamp = new Date(v.timestamp).getTime();
      return timestamp >= inicio && timestamp <= fin;
    });
  };

  const getValidationById = (validationId) => {
    return validations.find((v) => v.id === validationId);
  };

  // ── Exportación ──

  const exportToJSON = () => JSON.stringify(validations, null, 2);

  const exportToCSV = () => {
    if (validations.length === 0) return '';

    const headers = ['ID', 'Placa', 'Fecha', 'Usuario', 'SOAT Vigente', 'RTM Vigente', 'Notas'];
    const rows = validations.map((v) => [
      v.id,
      v.placa,
      new Date(v.timestamp).toLocaleString('es-CO'),
      v.usuario,
      v.resultadoRUNT?.data?.soat?.vigente ? 'Si' : 'No',
      v.resultadoRUNT?.data?.rtm?.vigente ? 'Si' : 'No',
      v.notas || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')
      ),
    ].join('\n');

    return csvContent;
  };

  // ── Estadísticas ──

  const getStatistics = () => {
    const total = validations.length;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = validations.filter((v) => new Date(v.timestamp) >= weekAgo).length;

    const withVencimientos = validations.filter(
      (v) => !v.resultadoRUNT?.data?.soat?.vigente || !v.resultadoRUNT?.data?.rtm?.vigente
    ).length;

    return {
      total,
      thisWeek,
      withVencimientos,
      compliancePercentage:
        total > 0 ? Math.round(((total - withVencimientos) / total) * 100) : 0,
    };
  };

  return {
    // CRUD
    addValidation,
    deleteValidation,
    getValidationById,
    updateValidationNotes,

    // Lectura
    getValidationHistory,
    getAllValidations,
    getValidationsByDateRange,

    // Exportación
    exportToJSON,
    exportToCSV,

    // Estadísticas
    getStatistics,

    // Data
    validations,
    loading,
  };
}
