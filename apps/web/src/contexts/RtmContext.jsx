import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';
import { clearSourceAlerts } from '@/hooks/useAlertHub.js';
import { publishAdaptedAlerts } from '@/patterns/adapters/publishAdaptedAlerts.js';
import RtmAlertAdapter from '@/patterns/adapters/RtmAlertAdapter.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/rtms`;

const RtmContext = createContext(null);

export function RtmProvider({ children }) {
  const [storedRtms, setStoredRtms] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { simulatedDate } = useSimulatedDate();
  const [threshold] = useLocalStorage('syntix_threshold', 15);

  const fetchRtms = useCallback(async () => {
    if (!user?.email) {
      setStoredRtms([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(API_URL, { params: { email: user.email } });
      setStoredRtms(res.data.map((r) => ({ ...r, id: r._id || r.id })));
    } catch (err) {
      console.error('Error cargando RTMs:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchRtms();
  }, [fetchRtms]);

  const rtms = useMemo(() => {
    return storedRtms.map((rtm) => {
      const diasRestantes = calculateDaysRemaining(rtm.fechaVencimiento, simulatedDate);
      const estado = calculateDocumentState(diasRestantes, threshold);
      return { ...rtm, diasRestantes, estado };
    });
  }, [storedRtms, simulatedDate, threshold]);

  const rtmAlertAdapter = new RtmAlertAdapter();
  useEffect(() => {
    publishAdaptedAlerts(rtmAlertAdapter, 'rtms', rtms);
    return () => clearSourceAlerts('rtms');
  }, [rtms]);

  const addRtm = async (nuevaRtm) => {
    if (!user?.email) throw new Error('No hay usuario autenticado');
    await axios.post(API_URL, { ...nuevaRtm, ownerEmail: user.email });
    await fetchRtms();
  };

  const removeRtm = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    await fetchRtms();
  };

  return (
    <RtmContext.Provider value={{ rtms, addRtm, removeRtm, loading }}>
      {children}
    </RtmContext.Provider>
  );
}

export function useRtm() {
  const context = useContext(RtmContext);
  if (!context) throw new Error('useRtm debe usarse dentro de RtmProvider');
  return context;
}
