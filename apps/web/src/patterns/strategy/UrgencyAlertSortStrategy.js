import AlertSortStrategy from './AlertSortStrategy.js';

// Esta estrategia ignora el tipo de alerta y ordena solo por cuán cerca está el vencimiento.
export default class UrgencyAlertSortStrategy extends AlertSortStrategy {
  sort(alerts = []) {
    return [...alerts].sort((a, b) => a.diasRestantes - b.diasRestantes);
  }
}
