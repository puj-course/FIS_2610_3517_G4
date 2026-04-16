import AlertSortStrategy from './AlertSortStrategy.js';

export default class PriorityAlertSortStrategy extends AlertSortStrategy {
  sort(alerts = []) {
    return [...alerts].sort((a, b) => {
      if (a.prioridad === 'rojo' && b.prioridad !== 'rojo') return -1;
      if (a.prioridad !== 'rojo' && b.prioridad === 'rojo') return 1;
      return a.diasRestantes - b.diasRestantes;
    });
  }
}