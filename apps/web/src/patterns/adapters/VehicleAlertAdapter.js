import BaseAlertAdapter from './BaseAlertAdapter.js';

// Detecta huecos estructurales del vehiculo que afectan la Regla de Oro.
export default class VehicleAlertAdapter extends BaseAlertAdapter {
  adapt(vehiculo) {
    const alerts = [];
    const currentDate = new Date().toISOString();
    const vehicleLabel = `Vehiculo ${vehiculo.placa}`;

    if (!vehiculo.conductorId) {
      alerts.push({
        id: `missing-cond-${vehiculo.id}`,
        tipo: 'Asignacion',
        categoria: 'conductores',
        grupo: 'Licencias',
        entidad: vehicleLabel,
        mensaje: 'Sin conductor asignado',
        diasRestantes: 0,
        prioridad: 'rojo',
        fecha: currentDate,
      });
    }

    if (!vehiculo.soat) {
      alerts.push({
        id: `missing-soat-${vehiculo.id}`,
        tipo: 'Documento Faltante',
        categoria: 'vehiculos',
        grupo: 'SOAT',
        entidad: vehicleLabel,
        mensaje: 'Sin SOAT registrado',
        diasRestantes: 0,
        prioridad: 'rojo',
        fecha: currentDate,
      });
    }

    if (!vehiculo.rtm) {
      alerts.push({
        id: `missing-rtm-${vehiculo.id}`,
        tipo: 'Documento Faltante',
        categoria: 'vehiculos',
        grupo: 'RTM',
        entidad: vehicleLabel,
        mensaje: 'Sin RTM registrada',
        diasRestantes: 0,
        prioridad: 'rojo',
        fecha: currentDate,
      });
    }

    return alerts;
  }
}
