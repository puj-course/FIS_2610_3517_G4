export default class SoatAlertAdapter {
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
          ? 'SOAT vencido'
          : 'SOAT próximo a vencer',
      diasRestantes: soat.diasRestantes,
      prioridad: soat.estado,
      fecha: new Date().toISOString(),
    };
  }

  adaptMany(soats = []) {
    return soats.map((soat) => this.adapt(soat)).filter(Boolean);
  }
}