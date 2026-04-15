import BaseAlertAdapter from './BaseAlertAdapter.js';

export default class SoatAlertAdapter extends BaseAlertAdapter {
  adapt(soat) {
    if (soat.estado !== 'rojo' && soat.estado !== 'amarillo') {
      return null;
    }

    return {
      id: `soat-${soat.id}`,
      tipo: 'SOAT',
      entidad: `Vehículo ${soat.vehiculoId}`,
      mensaje:
        soat.estado === 'rojo'
          ? 'SOAT Vencido'
          : 'SOAT Próximo a Vencer',
      diasRestantes: soat.diasRestantes,
      prioridad: soat.estado,
      fecha: new Date().toISOString()
    };
  }
}