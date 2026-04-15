export default class AlertSortStrategy {
  sort(alerts) {
    throw new Error('La estrategia de ordenamiento debe implementar sort().');
  }
}