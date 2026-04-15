export default class VehicleAlertAdapter {
  adapt(vehiculo) {
    const alerts = [];
    const currentDate = new Date().toISOString();

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
        tipo: 'Documento Faltante',
        entidad: `Vehículo ${vehiculo.placa}`,
        mensaje: 'Sin SOAT registrado',
        diasRestantes: 0,
        prioridad: 'rojo',
        fecha: currentDate
      });
    }

    return alerts;
  }

  adaptMany(vehiculos = []) {
    return vehiculos.flatMap((vehiculo) => this.adapt(vehiculo));
  }
}