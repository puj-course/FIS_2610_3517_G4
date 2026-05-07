import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';
import { clearSourceAlerts } from '@/hooks/useAlertHub.js';
import { publishAdaptedAlerts } from '@/patterns/adapters/publishAdaptedAlerts.js';
import RtmAlertAdapter from '@/patterns/adapters/RtmAlertAdapter.js';

const RtmContext = createContext(null);
const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

// RtmProvider replica la misma estrategia documental, pero para tecnomecánica.
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
      const res = await api.get('/rtms', { params: { email: user.email } });
      setStoredRtms(res.data.map((r) => ({ ...r, id: r._id || r.id })));
    } catch (err) {
      console.error('Error cargando RTMs:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    // La fuente RTM se vuelve a consultar cuando cambia el usuario activo.
    fetchRtms();
  }, [fetchRtms]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    // Si cambia la flota, también cambia el universo de RTM que debe mostrarse en pantalla.
    const handleVehiclesUpdated = () => {
      fetchRtms();
    };

    window.addEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
    return () => window.removeEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
  }, [fetchRtms]);

  const rtms = useMemo(() => {
    return storedRtms.map((rtm) => {
      // Igual que SOAT, el estado visible depende de la fecha simulada y del umbral del usuario.
      const diasRestantes = calculateDaysRemaining(rtm.fechaVencimiento, simulatedDate);
      const estado = calculateDocumentState(diasRestantes, threshold);
      return { ...rtm, diasRestantes, estado };
    });
  }, [storedRtms, simulatedDate, threshold]);

  const rtmAlertAdapter = new RtmAlertAdapter();
  useEffect(() => {
    // El hub de alertas recibe una versión ya adaptada al formato unificado de la aplicación.
    publishAdaptedAlerts(rtmAlertAdapter, 'rtms', rtms);
    return () => clearSourceAlerts('rtms');
  }, [rtms]);

  const addRtm = async (nuevaRtm) => {
    if (!user?.email) throw new Error('No hay usuario autenticado');
    await api.post('/rtms', { ...nuevaRtm, ownerEmail: user.email });
    await fetchRtms();
  };

  const removeRtm = async (id) => {
    await api.delete(`/rtms/${id}`);
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
