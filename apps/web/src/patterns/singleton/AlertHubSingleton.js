import PriorityAlertSortStrategy from '@/patterns/strategy/PriorityAlertSortStrategy.js';

export default class AlertHubSingleton {
  static instance = null;

  constructor() {
    if (AlertHubSingleton.instance) {
      return AlertHubSingleton.instance;
    }

    this.listeners = new Set();
    this.sourceAlerts = new Map();
    this.currentAlerts = [];
    this.sortStrategy = new PriorityAlertSortStrategy();

    AlertHubSingleton.instance = this;
  }

  static getInstance() {
    if (!AlertHubSingleton.instance) {
      AlertHubSingleton.instance = new AlertHubSingleton();
    }

    return AlertHubSingleton.instance;
  }

  setSortStrategy(strategy) {
    this.sortStrategy = strategy;
    this.notifyListeners();
  }

  buildAlerts() {
    const merged = [];
    const seen = new Set();

    Array.from(this.sourceAlerts.values())
      .flat()
      .forEach((alert) => {
        if (!alert || !alert.id) return;
        if (seen.has(alert.id)) return;

        seen.add(alert.id);
        merged.push(alert);
      });

    return this.sortStrategy.sort(merged);
  }

  notifyListeners() {
    this.currentAlerts = this.buildAlerts();
    this.listeners.forEach((listener) => listener(this.currentAlerts));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.currentAlerts);
    return () => this.listeners.delete(listener);
  }

  registerSourceAlerts(sourceKey, alerts = []) {
    this.sourceAlerts.set(sourceKey, Array.isArray(alerts) ? alerts : []);
    this.notifyListeners();
  }

  clearSourceAlerts(sourceKey) {
    this.sourceAlerts.delete(sourceKey);
    this.notifyListeners();
  }

  getAllAlerts() {
    return this.currentAlerts;
  }
}