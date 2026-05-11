import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '@/utils/dateUtils.js';

const DocumentsContext = createContext(null);
const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

const normalizeSoat = (soat) => {
  const fechaInicioVigencia = soat.fechaInicioVigencia || soat.fechaInicio || '';
  const fechaFinVigencia = soat.fechaFinVigencia || soat.fechaVencimiento || '';
  const placaVehiculo = soat.placaVehiculo || soat.vehiculoPlaca || soat.placa || '';

  return {
    ...soat,
    id: soat._id || soat.id,
    placaVehiculo,
    vehiculoPlaca: placaVehiculo,
    placa: placaVehiculo,
    fechaInicioVigencia,
    fechaFinVigencia,
    fechaInicio: fechaInicioVigencia,
    fechaVencimiento: fechaFinVigencia,
  };
};

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
      setStoredSoats(res.data.map(normalizeSoat));
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
    const handleVehiclesUpdated = () => { fetchSoats(); };
    window.addEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
    return () => window.removeEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
  }, [fetchSoats]);

  const soats = useMemo(() => {
    return storedSoats.map((soat) => {
      const normalized = normalizeSoat(soat);
      const diasRestantes = calculateDaysRemaining(normalized.fechaFinVigencia, simulatedDate);
      const estado = calculateDocumentState(diasRestantes, threshold);
      return { ...normalized, diasRestantes, estado };
    });
  }, [storedSoats, simulatedDate, threshold]);

  const addSoat = async (nuevoSoat) => {
    if (!user?.email) throw new Error('No hay usuario autenticado');
    await api.post('/soats', {
      ...nuevoSoat,
      ownerEmail: user.email,
      ownerEmpresa: user.empresa || '',
    });
    await fetchSoats();
  };

  const editSoat = async (id, datos) => {
    await api.put(`/soats/${id}`, datos);
    await fetchSoats();
  };

  const removeSoat = async (id) => {
    await api.delete(`/soats/${id}`);
    await fetchSoats();
  };

  return (
    <DocumentsContext.Provider value={{ soats, addSoat, editSoat, removeSoat, loading }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) throw new Error('useDocuments debe usarse dentro de DocumentsProvider');
  return context;
}
