import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { calculateDaysRemaining, calculateDocumentState } from '../utils/dateUtils.js';
import { useSimulatedDate } from './useSimulatedDate.js';

const API_URL = 'http://localhost:5000/api/conductores';

export function useConductors() {
  const [conductores, setConductores] = useState([]);
  const { user } = useAuth();
  const { simulatedDate } = useSimulatedDate();
  const threshold = 15;

  const fetchConductors = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`${API_URL}?email=${user.email}`);
      setConductores(res.data.map(c => ({ ...c, id: c._id })));
    } catch (err) {
      console.error('Error cargando conductores', err);
    }
  }, [user]);

  useEffect(() => {
    fetchConductors();
  }, [fetchConductors]);

  const addConductor = async (data) => {
    const response = await axios.post(API_URL, { ...data, ownerEmail: user.email });
    const newConductor = { ...response.data, id: response.data._id };
    await fetchConductors();
    return newConductor;
  };

  const deleteConductor = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    await fetchConductors();
  };

  const conductorsWithState = conductores.map(c => {
    const days = calculateDaysRemaining(c.fechaVencimiento, simulatedDate);
    return {
      ...c,
      diasRestantes: days,
      estado: calculateDocumentState(days, threshold)
    };
  });

  return {
    conductores: conductorsWithState,
    addConductor,
    deleteConductor,
    fetchConductors
  };
}