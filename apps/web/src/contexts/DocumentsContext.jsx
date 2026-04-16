import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';
import { clearSourceAlerts } from '@/hooks/useAlertHub.js';
import SoatAlertAdapter from '@/patterns/adapters/SoatAlertAdapter.js';
import { publishAdaptedAlerts } from '@/patterns/adapters/publishAdaptedAlerts.js';

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

  const soatAlertAdapter = new SoatAlertAdapter();

  useEffect(() => {
    publishAdaptedAlerts(soatAlertAdapter, 'soats', soats);
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