/**
 * Hook useValidationHistory
 * Gestiona el historial de validaciones RUNT realizadas
 * Persiste en localStorage para auditoría y trazabilidad
 */

import { useLocalStorage } from './useLocalStorage.js';

const initialHistory = [];

export function useValidationHistory() {
  const [validations, setValidations] = useLocalStorage('syntix_validation_history', initialHistory);

  const addValidation = (placa, resultadoRUNT, usuario = 'Admin User', notas = '') => {
    const newValidation = {
      id: `val-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      placa: placa.toUpperCase(),
      timestamp: new Date().toISOString(),
      usuario,
      resultadoRUNT,
      notas,
      ip: 'localhost' // En producción obtener IP real
    };

    setValidations([...validations, newValidation]);
    return newValidation;
  };

  const getValidationHistory = (placa) => {
    const placaUpper = placa.toUpperCase();
    return validations.filter(v => v.placa === placaUpper).sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  const getAllValidations = () => {
    return [...validations].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  const deleteValidation = (validationId) => {
    setValidations(validations.filter(v => v.id !== validationId));
  };

  const getValidationsByDateRange = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio).getTime();
    const fin = new Date(fechaFin).getTime();

    return validations.filter(v => {
      const timestamp = new Date(v.timestamp).getTime();
      return timestamp >= inicio && timestamp <= fin;
    });
  };

  const getValidationById = (validationId) => {
    return validations.find(v => v.id === validationId);
  };

  const updateValidationNotes = (validationId, notas) => {
    setValidations(validations.map(v => 
      v.id === validationId ? { ...v, notas } : v
    ));
  };

  const exportToJSON = () => {
    return JSON.stringify(validations, null, 2);
  };

  const exportToCSV = () => {
    if (validations.length === 0) return '';

    const headers = ['ID', 'Placa', 'Fecha', 'Usuario', 'SOAT Vigente', 'RTM Vigente', 'Notas'];
    const rows = validations.map(v => [
      v.id,
      v.placa,
      new Date(v.timestamp).toLocaleString('es-CO'),
      v.usuario,
      v.resultadoRUNT?.data?.soat?.vigente ? 'Si' : 'No',
      v.resultadoRUNT?.data?.rtm?.vigente ? 'Si' : 'No',
      v.notas || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const getStatistics = () => {
    const total = validations.length;
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = validations.filter(v => 
      new Date(v.timestamp) >= weekAgo
    ).length;

    const withVencimientos = validations.filter(v => 
      !v.resultadoRUNT?.data?.soat?.vigente || 
      !v.resultadoRUNT?.data?.rtm?.vigente
    ).length;

    return {
      total,
      thisWeek,
      withVencimientos,
      compliancePercentage: total > 0 ? Math.round(((total - withVencimientos) / total) * 100) : 0
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
    validations
  };
}
