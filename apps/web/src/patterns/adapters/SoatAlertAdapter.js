import BaseAlertAdapter from './BaseAlertAdapter.js';

const buildVehicleEntity = (soat) => {
  const placa = String(soat.placaVehiculo || soat.vehiculoPlaca || soat.placa || '').trim();
  if (!placa || placa === 'Vehiculo no encontrado') return 'Vehiculo no encontrado';
  return placa ? `Vehiculo ${placa}` : 'Vehiculo no encontrado';
};

// Genera alertas de SOAT usando el mismo contrato que el resto de fuentes documentales.
export default class SoatAlertAdapter extends BaseAlertAdapter {
  adapt(soat) {
    if (soat.estado !== 'rojo' && soat.estado !== 'amarillo') {
      return null;
    }

    return {
      id: `soat-${soat.id}`,
      tipo: 'SOAT',
      categoria: 'vehiculos',
      grupo: 'SOAT',
      entidad: buildVehicleEntity(soat),
      mensaje:
        soat.estado === 'rojo'
          ? 'SOAT Vencido'
          : 'SOAT Proximo a Vencer',
      diasRestantes: soat.diasRestantes,
      prioridad: soat.estado,
      fecha: new Date().toISOString(),
    };
  }
}
