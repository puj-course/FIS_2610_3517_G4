import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useConductors } from './useConductors.js';

const API_URL = 'http://localhost:5000/api/vehiculos';

export function useVehicles() {
  const [vehiculos, setVehiculos] = useState([]);
  const { user } = useAuth();
  const { conductores } = useConductors();

  const fetchVehicles = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`${API_URL}?email=${user.email}`);
      setVehiculos(res.data.map(v => ({ ...v, id: v._id })));
    } catch (err) {
      console.error('Error cargando vehículos', err);
    }
  }, [user]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = async (data) => {
    await axios.post(API_URL, { ...data, ownerEmail: user.email });
    await fetchVehicles();
  };

  const deleteVehicle = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    await fetchVehicles();
  };

  const assignConductor = async (vehicleId, conductorId) => {
    await axios.put(`${API_URL}/${vehicleId}/conductor`, { conductorId });
    await fetchVehicles();
  };

  const vehiculosCompletos = vehiculos.map(v => ({
    ...v,
    conductor: conductores.find(c => c.id === v.conductorId)
  }));

  return {
    vehiculos: vehiculosCompletos,
    addVehicle,
    deleteVehicle,
    assignConductor,
    fetchVehicles
  };
}