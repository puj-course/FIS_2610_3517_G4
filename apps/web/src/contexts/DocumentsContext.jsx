import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';
import { clearSourceAlerts } from '@/hooks/useAlertHub.js';
import SoatAlertAdapter from '@/patterns/adapters/SoatAlertAdapter.js';
import { publishAdaptedAlerts } from '@/patterns/adapters/publishAdaptedAlerts.js';

const DocumentsContext = createContext(null);
const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

export function DocumentsProvider({ children }) {
  const [storedSoats, setStoredSoats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { simulatedDate } = useSimulatedDate();
  const [threshold] = useLocalStorage('syntix_threshold', 15);

  const fetchSoats = useCallback(async () => {
    if (!user?.email) {
      setStoredSoats([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/soats', { params: { email: user.email } });
      setStoredSoats(res.data.map((s) => ({ ...s, id: s._id || s.id })));
    } catch (err) {
      console.error('Error cargando SOATs:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchSoats();
  }, [fetchSoats]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleVehiclesUpdated = () => {
      fetchSoats();
    };

    window.addEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
    return () => window.removeEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
  }, [fetchSoats]);

  const soats = useMemo(() => {
    return storedSoats.map((soat) => {
      const diasRestantes = calculateDaysRemaining(soat.fechaVencimiento, simulatedDate);
      const estado = calculateDocumentState(diasRestantes, threshold);
      return { ...soat, diasRestantes, estado };
    });
  }, [storedSoats, simulatedDate, threshold]);

  const soatAlertAdapter = new SoatAlertAdapter();
  useEffect(() => {
    publishAdaptedAlerts(soatAlertAdapter, 'soats', soats);
    return () => clearSourceAlerts('soats');
  }, [soats]);

  const addSoat = async (nuevoSoat) => {
    if (!user?.email) throw new Error('No hay usuario autenticado');
    await api.post('/soats', { ...nuevoSoat, ownerEmail: user.email });
    await fetchSoats();
  };

  const removeSoat = async (id) => {
    await api.delete(`/soats/${id}`);
    await fetchSoats();
  };

  return (
    <DocumentsContext.Provider value={{ soats, addSoat, removeSoat, loading }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) throw new Error('useDocuments debe usarse dentro de DocumentsProvider');
  return context;
}
