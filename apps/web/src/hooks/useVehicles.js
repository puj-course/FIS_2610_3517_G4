import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getWorstState } from '../utils/dateUtils.js';
import { registerSourceAlerts, clearSourceAlerts } from './useAlertHub.js';
import VehicleAlertAdapter from '@/patterns/adapters/VehicleAlertAdapter.js';

const initialVehicles = [
  {
    id: 'v1',
    placa: 'ABC-123',
    marca: 'Toyota',
    modelo: 'Hilux',
    anio: 2022,
    tipo: 'Camioneta',
    conductorId: 'c1',
    ownerEmail: 'admin@syntix.tech',
    ownerEmpresa: 'SYNTIX Demo'
  },
  {
    id: 'v2',
    placa: 'XYZ-987',
    marca: 'Chevrolet',
    modelo: 'NPR',
    anio: 2020,
    tipo: 'Camión',
    conductorId: 'c2',
    ownerEmail: 'admin@syntix.tech',
    ownerEmpresa: 'SYNTIX Demo'
  },
  {
    id: 'v3',
    placa: 'DEF-456',
    marca: 'Ford',
    modelo: 'Ranger',
    anio: 2019,
    tipo: 'Camioneta',
    conductorId: null,
    ownerEmail: 'admin@syntix.tech',
    ownerEmpresa: 'SYNTIX Demo'
  },
  {
    id: 'v4',
    placa: 'GHI-789',
    marca: 'Renault',
    modelo: 'Kangoo',
    anio: 2021,
    tipo: 'Furgón',
    conductorId: 'c3',
    ownerEmail: 'admin@syntix.tech',
    ownerEmpresa: 'SYNTIX Demo'
  },
];

export function useVehicles() {
  const [vehiculos, setVehiculos] = useLocalStorage('syntix_vehiculos', initialVehicles);
  const { conductores } = useConductors();
  const { soats } = useDocuments();
  const { user } = useAuth();

  const getVehiclesWithState = () => {
    return vehiculos.map((v) => {
      const conductor = conductores.find((c) => c.id === v.conductorId);
      const soat = soats.find((s) => s.vehiculoId === v.id);

      const estadoLicencia = conductor ? conductor.estado : 'rojo';
      const estadoSoat = soat ? soat.estado : 'rojo';
      const estadoGeneral = getWorstState(estadoLicencia, estadoSoat);

      return {
        ...v,
        conductor,
        soat,
        estadoLicencia,
        estadoSoat,
        estadoGeneral,
        ownerLabel: v.ownerEmpresa || v.ownerEmail || 'Sin usuario asociado'
      };
    });
  };

  const addVehicle = (vehiculo) => {
    const newVehicle = {
      ...vehiculo,
      id: Date.now().toString(),
      ownerEmail: user?.email || vehiculo.ownerEmail || null,
      ownerEmpresa: user?.empresa || vehiculo.ownerEmpresa || null,
    };

    setVehiculos([...vehiculos, newVehicle]);
    return newVehicle;
  };

  const updateVehicle = (id, data) => {
    setVehiculos(vehiculos.map((v) => (v.id === id ? { ...v, ...data } : v)));
  };

  const deleteVehicle = (id) => {
    setVehiculos(vehiculos.filter((v) => v.id !== id));
  };

  const vehiculosWithState = getVehiclesWithState();
  const vehicleAlertAdapter = new VehicleAlertAdapter();

  useEffect(() => {
    const alerts = vehicleAlertAdapter.adaptMany(vehiculosWithState);
    registerSourceAlerts('vehiculos', alerts);
    return () => clearSourceAlerts('vehiculos');
  }, [vehiculosWithState]);

  const assignConductor = (vehiculoId, conductorId) => {
    updateVehicle(vehiculoId, { conductorId });
  };

  const getVehiclesByUser = (email) => {
    if (!email) return [];
    return getVehiclesWithState().filter((v) => v.ownerEmail === email);
  };

  return {
    vehiculos: vehiculosWithState,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    assignConductor,
    getVehiclesByUser
  };
}