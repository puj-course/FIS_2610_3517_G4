import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';

const RtmContext = createContext(null);
const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

const normalizeRtm = (rtm) => {
  const numeroCertificado = rtm.numeroCertificado || rtm.numeroRtm || '';
  const fechaExpedicion = rtm.fechaExpedicion || rtm.fechaInicio || '';
  const placaVehiculo = rtm.placaVehiculo || rtm.vehiculoPlaca || rtm.placa || '';

  return {
    ...rtm,
    id: rtm._id || rtm.id,
    numeroCertificado,
    numeroRtm: numeroCertificado,
    fechaExpedicion,
    fechaInicio: fechaExpedicion,
    placaVehiculo,
    vehiculoPlaca: placaVehiculo,
    placa: placaVehiculo,
  };
};

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
      setStoredRtms(res.data.map(normalizeRtm));
    } catch (err) {
      console.error('Error cargando RTMs:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchRtms();
  }, [fetchRtms]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleVehiclesUpdated = () => { fetchRtms(); };
    window.addEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
    return () => window.removeEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
  }, [fetchRtms]);

  const rtms = useMemo(() => {
    return storedRtms.map((rtm) => {
      const normalized = normalizeRtm(rtm);
      const diasRestantes = calculateDaysRemaining(normalized.fechaVencimiento, simulatedDate);
      const estado = calculateDocumentState(diasRestantes, threshold);
      return { ...normalized, diasRestantes, estado };
    });
  }, [storedRtms, simulatedDate, threshold]);

  const addRtm = async (nuevaRtm) => {
    if (!user?.email) throw new Error('No hay usuario autenticado');
    await api.post('/rtms', {
      ...nuevaRtm,
      ownerEmail: user.email,
      ownerEmpresa: user.empresa || '',
    });
    await fetchRtms();
  };

  const editRtm = async (id, datos) => {
    await api.put(`/rtms/${id}`, datos);
    await fetchRtms();
  };

  const removeRtm = async (id) => {
    await api.delete(`/rtms/${id}`);
    await fetchRtms();
  };

  return (
    <RtmContext.Provider value={{ rtms, addRtm, editRtm, removeRtm, loading }}>
      {children}
    </RtmContext.Provider>
  );
}

export function useRtm() {
  const context = useContext(RtmContext);
  if (!context) throw new Error('useRtm debe usarse dentro de RtmProvider');
  return context;
}
