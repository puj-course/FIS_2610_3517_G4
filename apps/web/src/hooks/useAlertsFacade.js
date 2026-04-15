import { useMemo } from 'react';
import { useVehicles } from './useVehicles.js';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';

function buildSoatAlerts(soats, vehiculos) {
  const currentDate = new Date().toISOString();

  return soats
    .filter((soat) => soat.estado === 'rojo' || soat.estado === 'amarillo')
    .map((soat) => {
      const vehiculo = vehiculos.find((v) => v.id === soat.vehiculoId);

      return {
        id: `soat-${soat.id}`,
        tipo: 'SOAT',
        entidad: vehiculo ? `Vehículo ${vehiculo.placa}` : 'Vehículo desconocido',
        mensaje: soat.estado === 'rojo' ? 'SOAT vencido' : 'SOAT próximo a vencer',
        diasRestantes: soat.diasRestantes,
        prioridad: soat.estado,
        fecha: currentDate
      };
    });
}

function buildLicenseAlerts(conductores) {
  const currentDate = new Date().toISOString();

  return conductores
    .filter((conductor) => conductor.estado === 'rojo' || conductor.estado === 'amarillo')
    .map((conductor) => ({
      id: `lic-${conductor.id}`,
      tipo: 'Licencia',
      entidad: `Conductor ${conductor.nombre}`,
      mensaje: conductor.estado === 'rojo' ? 'Licencia vencida' : 'Licencia próxima a vencer',
      diasRestantes: conductor.diasRestantes,
      prioridad: conductor.estado,
      fecha: currentDate
    }));
}

function buildMissingAssignmentAlerts(vehiculos) {
  const currentDate = new Date().toISOString();
  const alerts = [];

  vehiculos.forEach((vehiculo) => {
    if (!vehiculo.conductorId) {
      alerts.push({
        id: `missing-cond-${vehiculo.id}`,
        tipo: 'Asignación',
        entidad: `Vehículo ${vehiculo.placa}`,
        mensaje: 'Sin conductor asignado',
        diasRestantes: 0,
        prioridad: 'rojo',
        fecha: currentDate
      });
    }

    if (!vehiculo.soat) {
      alerts.push({
        id: `missing-soat-${vehiculo.id}`,
        tipo: 'Documento faltante',
        entidad: `Vehículo ${vehiculo.placa}`,
        mensaje: 'Sin SOAT registrado',
        diasRestantes: 0,
        prioridad: 'rojo',
        fecha: currentDate
      });
    }
  });

  return alerts;
}

function sortAlertsByPriority(alerts) {
  return [...alerts].sort((a, b) => {
    if (a.prioridad === 'rojo' && b.prioridad !== 'rojo') return -1;
    if (a.prioridad !== 'rojo' && b.prioridad === 'rojo') return 1;
    return a.diasRestantes - b.diasRestantes;
  });
}

function buildAllAlerts({ vehiculos, conductores, soats }) {
  const soatAlerts = buildSoatAlerts(soats, vehiculos);
  const licenseAlerts = buildLicenseAlerts(conductores);
  const missingAssignmentAlerts = buildMissingAssignmentAlerts(vehiculos);

  return sortAlertsByPriority([
    ...soatAlerts,
    ...licenseAlerts,
    ...missingAssignmentAlerts
  ]);
}

export function useAlertsFacade() {
  const { vehiculos } = useVehicles();
  const { conductores } = useConductors();
  const { soats } = useDocuments();

  const alerts = useMemo(() => {
    return buildAllAlerts({
      vehiculos,
      conductores,
      soats
    });
  }, [vehiculos, conductores, soats]);

  const criticalAlerts = useMemo(
    () => alerts.filter((alert) => alert.prioridad === 'rojo'),
    [alerts]
  );

  const warningAlerts = useMemo(
    () => alerts.filter((alert) => alert.prioridad === 'amarillo'),
    [alerts]
  );

  return {
    alerts,
    totalAlerts: alerts.length,
    criticalAlerts,
    warningAlerts
  };
}