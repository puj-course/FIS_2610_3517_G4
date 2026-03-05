import { useLocalStorage } from './useLocalStorage.js';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';
import { getWorstState } from '../utils/dateUtils.js';

const initialVehicles = [
  { id: 'v1', placa: 'ABC-123', marca: 'Toyota', modelo: 'Hilux', anio: 2022, tipo: 'Camioneta', conductorId: 'c1' },
  { id: 'v2', placa: 'XYZ-987', marca: 'Chevrolet', modelo: 'NPR', anio: 2020, tipo: 'Camión', conductorId: 'c2' },
  { id: 'v3', placa: 'DEF-456', marca: 'Ford', modelo: 'Ranger', anio: 2019, tipo: 'Camioneta', conductorId: null },
  { id: 'v4', placa: 'GHI-789', marca: 'Renault', modelo: 'Kangoo', anio: 2021, tipo: 'Furgón', conductorId: 'c3' },
];

export function useVehicles() {
  const [vehiculos, setVehiculos] = useLocalStorage('syntix_vehiculos', initialVehicles);
  const { conductores } = useConductors();
  const { soats } = useDocuments();

  const getVehiclesWithState = () => {
    return vehiculos.map(v => {
      const conductor = conductores.find(c => c.id === v.conductorId);
      const soat = soats.find(s => s.vehiculoId === v.id);
      
      const estadoLicencia = conductor ? conductor.estado : 'rojo'; // Missing conductor = rojo
      const estadoSoat = soat ? soat.estado : 'rojo'; // Missing SOAT = rojo
      
      // REGLA DE ORO
      const estadoGeneral = getWorstState(estadoLicencia, estadoSoat);

      return {
        ...v,
        conductor,
        soat,
        estadoLicencia,
        estadoSoat,
        estadoGeneral
      };
    });
  };

  const addVehicle = (vehiculo) => {
    setVehiculos([...vehiculos, { ...vehiculo, id: Date.now().toString() }]);
  };

  const updateVehicle = (id, data) => {
    setVehiculos(vehiculos.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteVehicle = (id) => {
    setVehiculos(vehiculos.filter(v => v.id !== id));
  };

  const assignConductor = (vehiculoId, conductorId) => {
    updateVehicle(vehiculoId, { conductorId });
  };

  return {
    vehiculos: getVehiclesWithState(),
    addVehicle,
    updateVehicle,
    deleteVehicle,
    assignConductor
  };
}