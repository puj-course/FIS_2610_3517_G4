import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';
import { useRtm } from '@/contexts/RtmContext.jsx';
import { getWorstState } from '@/utils/dateUtils.js';
import { normalizePlate } from '@/utils/colombiaFormats.js';

const VEHICLES_UPDATED_EVENT = 'syntix:vehicles-updated';

// Normaliza el shape de salida del backend para que el resto del frontend trate todos los vehículos igual.
const normalizeVehicle = (vehiculo) => ({
  ...vehiculo,
  id: vehiculo._id || vehiculo.id,
  placa: normalizePlate(vehiculo.placa),
  tipo: vehiculo.tipo || 'Otro',
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
  const { rtms } = useRtm();

  const fetchVehicles = useCallback(async () => {
    if (!user?.email) {
      setVehiculos([]);
      return;
    }

    try {
      const res = await api.get('/vehiculos', {
        params: { email: user.email },
      });

      setVehiculos(res.data.map(normalizeVehicle));
    } catch (err) {
      console.error('Error cargando vehiculos', err);
    }
  }, [user?.email]);

  useEffect(() => {
    // La lista depende del usuario porque el backend filtra por ownerEmail.
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    // Este listener permite refrescar la flota desde cualquier mutación disparada en otro módulo.
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

    const response = await api.post('/vehiculos', {
      ...data,
      placa: normalizePlate(data.placa),
      anio: Number(data.anio),
      tipo: data.tipo || 'Otro',
      conductorId: data.conductorId ?? null,
      ownerEmail: user.email,
      ownerEmpresa: user.empresa || '',
    });

    await fetchVehicles();
    notifyVehiclesUpdated();

    return normalizeVehicle(response.data);
  };

  const updateVehicle = async (id, data) => {
    const response = await api.put(`/vehiculos/${id}`, {
      ...data,
      placa: normalizePlate(data.placa),
      anio: Number(data.anio),
      tipo: data.tipo || 'Otro',
    });

    await fetchVehicles();
    notifyVehiclesUpdated();

    return normalizeVehicle(response.data);
  };

  const deleteVehicle = async (id) => {
    await api.delete(`/vehiculos/${id}`);
    await fetchVehicles();
    notifyVehiclesUpdated();
  };

  const assignConductor = async (vehicleId, conductorId) => {
    const response = await api.put(`/vehiculos/${vehicleId}/conductor`, {
      conductorId: conductorId || null,
    });

    await fetchVehicles();
    notifyVehiclesUpdated();

    return normalizeVehicle(response.data);
  };

  const vehiculosCompletos = useMemo(() => vehiculos.map((vehiculo) => {
    // Aquí se arma la visión "enriquecida" que consumen las pantallas:
    // vehículo + conductor + documentos + severidad consolidada.
    const conductor = conductores.find(
      (item) => String(item.id) === String(vehiculo.conductorId)
    );
    const soat = soats.find((item) => String(item.vehiculoId) === String(vehiculo.id));
    const rtm = rtms.find((item) => String(item.vehiculoId) === String(vehiculo.id));
    const estadoConductor = vehiculo.conductorId ? conductor?.estado || 'rojo' : 'rojo';
    const estadoSoat = soat?.estado || 'rojo';
    const estadoRtm = rtm?.estado || 'rojo';

    return {
      ...vehiculo,
      conductor,
      soat,
      rtm,
      ownerLabel: vehiculo.ownerEmpresa || user?.empresa || vehiculo.ownerEmail || 'Sin dato',
      estadoGeneral: getWorstState(getWorstState(estadoConductor, estadoSoat), estadoRtm),
    };
  }), [vehiculos, conductores, soats, rtms, user?.empresa]);

  return {
    vehiculos: vehiculosCompletos,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    assignConductor,
    fetchVehicles,
  };
}
