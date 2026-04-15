import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';
import { registerSourceAlerts, clearSourceAlerts } from '@/hooks/useAlertHub.js';

const STORAGE_KEY = 'syntix_soats';
const DocumentsContext = createContext(null);

export function DocumentsProvider({ children }) {
  const [storedSoats, setStoredSoats] = useLocalStorage(STORAGE_KEY, []);
  const { simulatedDate } = useSimulatedDate();
  const [threshold] = useLocalStorage('syntix_threshold', 15);

  const soats = useMemo(() => {
    return storedSoats.map((soat) => {
      const diasRestantes = calculateDaysRemaining(soat.fechaVencimiento, simulatedDate);
      const estado = calculateDocumentState(diasRestantes, threshold);

      return {
        ...soat,
        diasRestantes,
        estado
      };
    });
  }, [storedSoats, simulatedDate, threshold]);

  useEffect(() => {
    const alerts = soats
      .filter((soat) => soat.estado === 'rojo' || soat.estado === 'amarillo')
      .map((soat) => ({
        id: `soat-${soat.id}`,
        tipo: 'SOAT',
        entidad: `Vehículo ${soat.vehiculoId}`,
        mensaje: soat.estado === 'rojo' ? 'SOAT vencido' : 'SOAT próximo a vencer',
        diasRestantes: soat.diasRestantes,
        prioridad: soat.estado,
        fecha: new Date().toISOString()
      }));

    registerSourceAlerts('soats', alerts);

    return () => clearSourceAlerts('soats');
  }, [soats]);

  const addSoat = (nuevoSoat) => {
    const soatConDatos = {
      id: Date.now().toString(),
      ...nuevoSoat
    };

    setStoredSoats((prev) => {
      const filtrados = prev.filter((s) => s.vehiculoId !== nuevoSoat.vehiculoId);
      return [...filtrados, soatConDatos];
    });
  };

  const removeSoat = (id) => {
    setStoredSoats((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <DocumentsContext.Provider
      value={{
        soats,
        addSoat,
        removeSoat,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error('useDocuments debe usarse dentro de DocumentsProvider');
  }

  return context;
}