import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';
import { getWorstState } from '@/utils/dateUtils.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/vehiculos`;
const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

const normalizeVehicle = (vehiculo) => ({
  ...vehiculo,
  id: vehiculo._id || vehiculo.id,
});

const notifyVehiclesUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(VEHICLES_UPDATED_EVENT));
  }
};

export function useVehicles() {
  const [vehiculos, setVehiculos] = useState([]);
  const { user } = useAuth();
  const { conductores } = useConductors();
  const { soats } = useDocuments();

  const fetchVehicles = useCallback(async () => {
    if (!user?.email) {
      setVehiculos([]);
      return;
    }

    try {
      const res = await axios.get(API_URL, {
        params: { email: user.email },
      });

      setVehiculos(res.data.map(normalizeVehicle));
    } catch (err) {
      console.error('Error cargando vehiculos', err);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleVehiclesUpdated = () => {
      fetchVehicles();
    };

    window.addEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
    return () => window.removeEventListener(VEHICLES_UPDATED_EVENT, handleVehiclesUpdated);
  }, [fetchVehicles]);

  const addVehicle = async (data) => {
    if (!user?.email) {
      throw new Error('No hay usuario autenticado');
    }

    const response = await axios.post(API_URL, {
      ...data,
      placa: String(data.placa ?? '').trim().toUpperCase(),
      anio: Number(data.anio),
      conductorId: data.conductorId ?? null,
      ownerEmail: user.email,
      ownerEmpresa: user.empresa || '',
    });

    await fetchVehicles();
    notifyVehiclesUpdated();

    return normalizeVehicle(response.data);
  };

  const deleteVehicle = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    await fetchVehicles();
    notifyVehiclesUpdated();
  };

  const assignConductor = async (vehicleId, conductorId) => {
    const response = await axios.put(`${API_URL}/${vehicleId}/conductor`, {
      conductorId: conductorId || null,
    });

    await fetchVehicles();
    notifyVehiclesUpdated();

    return normalizeVehicle(response.data);
  };

  const vehiculosCompletos = vehiculos.map((vehiculo) => {
    const conductor = conductores.find(
      (item) => String(item.id) === String(vehiculo.conductorId)
    );
    const soat = soats.find((item) => String(item.vehiculoId) === String(vehiculo.id));
    const estadoConductor = vehiculo.conductorId ? conductor?.estado || 'rojo' : 'rojo';
    const estadoSoat = soat?.estado || 'rojo';

    return {
      ...vehiculo,
      conductor,
      soat,
      ownerLabel: vehiculo.ownerEmpresa || user?.empresa || vehiculo.ownerEmail || 'Sin dato',
      estadoGeneral: getWorstState(estadoConductor, estadoSoat),
    };
  });

  return {
    vehiculos: vehiculosCompletos,
    addVehicle,
    deleteVehicle,
    assignConductor,
    fetchVehicles,
  };
}
