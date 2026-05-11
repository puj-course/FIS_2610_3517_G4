import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { calculateDaysRemaining, calculateDocumentState } from '../utils/dateUtils.js';
import { useSimulatedDate } from './useSimulatedDate.js';
import { useLocalStorage } from './useLocalStorage.js';

const CONDUCTORS_UPDATED_EVENT = 'syntix:conductors-updated';
const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

// Normaliza IDs del backend para que el resto de hooks no dependa de _id vs id.
const normalizeConductor = (conductor) => ({
  ...conductor,
  id: conductor._id || conductor.id,
});

const notifyConductorsUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CONDUCTORS_UPDATED_EVENT));
  }
};

const notifyVehiclesUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(VEHICLES_UPDATED_EVENT));
  }
};

export function useConductors() {
  const [conductores, setConductores] = useState([]);
  const { user } = useAuth();
  const { simulatedDate } = useSimulatedDate();
  const [threshold] = useLocalStorage('syntix_threshold', 15);

  const fetchConductors = useCallback(async () => {
    if (!user?.email) {
      setConductores([]);
      return;
    }

    try {
      const res = await api.get('/conductores', {
        params: { email: user.email },
      });

      setConductores(res.data.map(normalizeConductor));
    } catch (err) {
      console.error('Error cargando conductores', err);
    }
  }, [user?.email]);

  useEffect(() => {
    // Cada sesión ve solo sus conductores, por eso la consulta depende del usuario autenticado.
    fetchConductors();
  }, [fetchConductors]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    // El evento permite refrescar la lista desde cualquier pantalla que muta conductores.
    const handleConductorsUpdated = () => {
      fetchConductors();
    };

    window.addEventListener(CONDUCTORS_UPDATED_EVENT, handleConductorsUpdated);
    return () => window.removeEventListener(CONDUCTORS_UPDATED_EVENT, handleConductorsUpdated);
  }, [fetchConductors]);

  const addConductor = async (data) => {
    if (!user?.email) {
      throw new Error('No hay usuario autenticado');
    }

    const response = await api.post('/conductores', {
      ...data,
      documento: String(data.documento ?? '').trim(),
      telefono: String(data.telefono ?? '').trim(),
      ownerEmail: user.email,
    });

    await fetchConductors();
    notifyConductorsUpdated();

    return normalizeConductor(response.data);
  };

  const updateConductor = async (id, data) => {
    const response = await api.put(`/conductores/${id}`, {
      ...data,
      documento: String(data.documento ?? '').trim(),
      telefono: String(data.telefono ?? '').trim(),
    });

    await fetchConductors();
    notifyConductorsUpdated();

    return normalizeConductor(response.data);
  };

  const deleteConductor = async (id) => {
    await api.delete(`/conductores/${id}`);
    await fetchConductors();
    notifyConductorsUpdated();
    notifyVehiclesUpdated();
  };

  const conductorsWithState = useMemo(() => conductores.map((conductor) => {
    // El estado de la licencia se deriva en cliente para responder a la fecha simulada del dashboard.
    const days = calculateDaysRemaining(conductor.fechaVencimiento, simulatedDate);

    return {
      ...conductor,
      diasRestantes: days,
      estado: calculateDocumentState(days, threshold),
    };
  }), [conductores, simulatedDate, threshold]);

  return {
    conductores: conductorsWithState,
    addConductor,
    updateConductor,
    deleteConductor,
    fetchConductors,
  };
}
