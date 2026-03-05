import { useVehicles } from './useVehicles.js';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';

export function useAlerts() {
  const { vehiculos } = useVehicles();
  const { conductores } = useConductors();
  const { soats } = useDocuments();

  const getAlerts = () => {
    const alerts = [];

    // SOAT Alerts
    soats.forEach(soat => {
      if (soat.estado === 'rojo' || soat.estado === 'amarillo') {
        const vehiculo = vehiculos.find(v => v.id === soat.vehiculoId);
        alerts.push({
          id: `soat-${soat.id}`,
          tipo: 'SOAT',
          entidad: vehiculo ? `Vehículo ${vehiculo.placa}` : 'Vehículo Desconocido',
          mensaje: soat.estado === 'rojo' ? 'SOAT Vencido' : 'SOAT Próximo a Vencer',
          diasRestantes: soat.diasRestantes,
          prioridad: soat.estado,
          fecha: new Date().toISOString()
        });
      }
    });

    // License Alerts
    conductores.forEach(conductor => {
      if (conductor.estado === 'rojo' || conductor.estado === 'amarillo') {
        alerts.push({
          id: `lic-${conductor.id}`,
          tipo: 'Licencia',
          entidad: `Conductor ${conductor.nombre}`,
          mensaje: conductor.estado === 'rojo' ? 'Licencia Vencida' : 'Licencia Próxima a Vencer',
          diasRestantes: conductor.diasRestantes,
          prioridad: conductor.estado,
          fecha: new Date().toISOString()
        });
      }
    });

    // Missing assignments
    vehiculos.forEach(vehiculo => {
      if (!vehiculo.conductorId) {
        alerts.push({
          id: `missing-cond-${vehiculo.id}`,
          tipo: 'Asignación',
          entidad: `Vehículo ${vehiculo.placa}`,
          mensaje: 'Sin conductor asignado',
          diasRestantes: 0,
          prioridad: 'rojo',
          fecha: new Date().toISOString()
        });
      }
      if (!vehiculo.soat) {
        alerts.push({
          id: `missing-soat-${vehiculo.id}`,
          tipo: 'Documento Faltante',
          entidad: `Vehículo ${vehiculo.placa}`,
          mensaje: 'Sin SOAT registrado',
          diasRestantes: 0,
          prioridad: 'rojo',
          fecha: new Date().toISOString()
        });
      }
    });

    // Sort by priority (rojo first, then amarillo)
    return alerts.sort((a, b) => {
      if (a.prioridad === 'rojo' && b.prioridad !== 'rojo') return -1;
      if (a.prioridad !== 'rojo' && b.prioridad === 'rojo') return 1;
      return a.diasRestantes - b.diasRestantes;
    });
  };

  return { alerts: getAlerts() };
}