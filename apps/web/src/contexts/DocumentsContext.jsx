import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';
import { clearSourceAlerts } from '@/hooks/useAlertHub.js';
import SoatAlertAdapter from '@/patterns/adapters/SoatAlertAdapter.js';
import { publishAdaptedAlerts } from '@/patterns/adapters/publishAdaptedAlerts.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/soats`;

const DocumentsContext = createContext(null);

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
      const res = await axios.get(API_URL, { params: { email: user.email } });
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
    await axios.post(API_URL, { ...nuevoSoat, ownerEmail: user.email });
    await fetchSoats();
  };

  const removeSoat = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
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