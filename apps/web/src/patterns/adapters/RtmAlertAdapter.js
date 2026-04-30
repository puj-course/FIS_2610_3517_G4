import BaseAlertAdapter from './BaseAlertAdapter.js';

export default class RtmAlertAdapter extends BaseAlertAdapter {
  adapt(rtm) {
    if (rtm.estado !== 'rojo' && rtm.estado !== 'amarillo') {
      return null;
    }

    return {
      id: `rtm-${rtm.id}`,
      tipo: 'RTM',
      entidad: `Vehículo ${rtm.vehiculoId}`,
      mensaje:
        rtm.estado === 'rojo'
          ? 'Tecnomecánica Vencida'
          : 'Tecnomecánica Próxima a Vencer',
      diasRestantes: rtm.diasRestantes,
      prioridad: rtm.estado,
      fecha: new Date().toISOString(),
    };
  }
}
