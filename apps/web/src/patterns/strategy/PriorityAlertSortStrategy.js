import AlertSortStrategy from './AlertSortStrategy.js';

// Prioriza primero severidad y luego cercanía temporal cuando varias alertas compiten por atención.
export default class PriorityAlertSortStrategy extends AlertSortStrategy {
  sort(alerts = []) {
    return [...alerts].sort((a, b) => {
      if (a.prioridad === 'rojo' && b.prioridad !== 'rojo') return -1;
      if (a.prioridad !== 'rojo' && b.prioridad === 'rojo') return 1;
      return a.diasRestantes - b.diasRestantes;
    });
  }
}
