// Contrato base para cambiar la prioridad visual de alertas sin tocar el hub ni las vistas.
export default class AlertSortStrategy {
  sort() {
    throw new Error('La estrategia de ordenamiento debe implementar sort().');
  }
}
