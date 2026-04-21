import AlertSortStrategy from './AlertSortStrategy.js';

export default class UrgencyAlertSortStrategy extends AlertSortStrategy {
  sort(alerts = []) {
    return [...alerts].sort((a, b) => a.diasRestantes - b.diasRestantes);
  }
}