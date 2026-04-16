import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { calculateDaysRemaining, calculateDocumentState } from '../utils/dateUtils.js';
import { useSimulatedDate } from './useSimulatedDate.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/conductores`;
const CONDUCTORS_UPDATED_EVENT = 'syntix:conductors-updated';
const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

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
  const threshold = 15;

  const fetchConductors = useCallback(async () => {
    if (!user?.email) {
      setConductores([]);
      return;
    }

    try {
      const res = await axios.get(API_URL, {
        params: { email: user.email },
      });

      setConductores(res.data.map(normalizeConductor));
    } catch (err) {
      console.error('Error cargando conductores', err);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchConductors();
  }, [fetchConductors]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

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

    const response = await axios.post(API_URL, {
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
    const response = await axios.put(`${API_URL}/${id}`, {
      ...data,
      documento: String(data.documento ?? '').trim(),
      telefono: String(data.telefono ?? '').trim(),
    });

    await fetchConductors();
    notifyConductorsUpdated();

    return normalizeConductor(response.data);
  };

  const deleteConductor = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    await fetchConductors();
    notifyConductorsUpdated();
    notifyVehiclesUpdated();
  };

  const conductorsWithState = conductores.map((conductor) => {
    const days = calculateDaysRemaining(conductor.fechaVencimiento, simulatedDate);

    return {
      ...conductor,
      diasRestantes: days,
      estado: calculateDocumentState(days, threshold),
    };
  });

  return {
    conductores: conductorsWithState,
    addConductor,
    updateConductor,
    deleteConductor,
    fetchConductors,
  };
}
