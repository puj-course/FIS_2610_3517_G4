import BaseAlertAdapter from './BaseAlertAdapter.js';

const buildVehicleEntity = (rtm) => {
  const placa = String(rtm.placaVehiculo || rtm.vehiculoPlaca || rtm.placa || '').trim();
  if (!placa || placa === 'Vehiculo no encontrado') return 'Vehiculo no encontrado';
  return placa ? `Vehiculo ${placa}` : 'Vehiculo no encontrado';
};

// Genera alertas a partir de vencimientos o proximidad de la tecnomecanica.
export default class RtmAlertAdapter extends BaseAlertAdapter {
  adapt(rtm) {
    if (rtm.estado !== 'rojo' && rtm.estado !== 'amarillo') {
      return null;
    }

    return {
      id: `rtm-${rtm.id}`,
      tipo: 'RTM',
      categoria: 'vehiculos',
      grupo: 'RTM',
      entidad: buildVehicleEntity(rtm),
      mensaje:
        rtm.estado === 'rojo'
          ? 'Tecnomecanica Vencida'
          : 'Tecnomecanica Proxima a Vencer',
      diasRestantes: rtm.diasRestantes,
      fechaVencimiento: rtm.fechaVencimiento || null,
      prioridad: rtm.estado,
      fecha: new Date().toISOString(),
    };
  }
}
