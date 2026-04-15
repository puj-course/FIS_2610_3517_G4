export default class ConductorAlertAdapter {
  adapt(conductor) {
    if (conductor.estado !== 'rojo' && conductor.estado !== 'amarillo') {
      return null;
    }

    return {
      id: `lic-${conductor.id}`,
      tipo: 'Licencia',
      entidad: `Conductor ${conductor.nombre}`,
      mensaje:
        conductor.estado === 'rojo'
          ? 'Licencia Vencida'
          : 'Licencia Próxima a Vencer',
      diasRestantes: conductor.diasRestantes,
      prioridad: conductor.estado,
      fecha: new Date().toISOString()
    };
  }

  adaptMany(conductores = []) {
    return conductores.map((conductor) => this.adapt(conductor)).filter(Boolean);
  }
}