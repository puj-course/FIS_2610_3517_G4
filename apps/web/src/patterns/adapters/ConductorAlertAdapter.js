import BaseAlertAdapter from './BaseAlertAdapter.js';

const resolveConductorLabel = (conductor) =>
  String(conductor.nombre || conductor.name || '').trim() ||
  'Conductor no identificado';

// Traduce el estado documental de la licencia del conductor al lenguaje comun de alertas.
export default class ConductorAlertAdapter extends BaseAlertAdapter {
  adapt(conductor) {
    if (conductor.estado !== 'rojo' && conductor.estado !== 'amarillo') {
      return null;
    }

    return {
      id: `lic-${conductor.id}`,
      tipo: 'Licencia',
      categoria: 'conductores',
      grupo: 'Licencias',
      entidad: resolveConductorLabel(conductor),
      mensaje:
        conductor.estado === 'rojo'
          ? 'Licencia Vencida'
          : 'Licencia Proxima a Vencer',
      diasRestantes: conductor.diasRestantes,
      fechaVencimiento: conductor.fechaVencimiento || null,
      prioridad: conductor.estado,
      fecha: new Date().toISOString(),
    };
  }
}
