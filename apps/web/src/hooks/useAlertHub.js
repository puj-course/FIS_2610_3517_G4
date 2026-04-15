/**
 * Observer pattern central para el sistema de alertas.
 *
 * Subject / Observable:
 *  - Cada hook de dominio (useConductors, useVehicles, useDocuments)
 *    emite sus alertas al hub mediante registerSourceAlerts.
 *
 * ConcreteObserver:
 *  - useAlertHub se suscribe a los cambios del hub y expone la lista
 *    centralizada de alertas para la interfaz (Sidebar, AlertasPage, Header).
 *
 * Esto reduce el acoplamiento entre los hooks de datos y el consumidor
 * de alertas, permitiendo agregar nuevas fuentes de alerta sin tocar
 * el hook central de visualización.
 */
import { useEffect, useState } from 'react';

class AlertHub {
  constructor() {
    this.listeners = new Set();
    this.sourceAlerts = new Map();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  registerSourceAlerts(source, alerts) {
    this.sourceAlerts.set(source, alerts);
    this.notify();
  }

  clearSource(source) {
    this.sourceAlerts.delete(source);
    this.notify();
  }

  getAllAlerts() {
    return Array.from(this.sourceAlerts.values()).flat();
  }
}

// Singleton
const alertHub = new AlertHub();

export function useAlertHub() {
  const [alerts, setAlerts] = useState(alertHub.getAllAlerts());

  useEffect(() => {
    const unsubscribe = alertHub.subscribe(() => {
      setAlerts(alertHub.getAllAlerts());
    });

    return unsubscribe;
  }, []);

  return {
    alerts,
    registerSourceAlerts: alertHub.registerSourceAlerts.bind(alertHub),
    clearSource: alertHub.clearSource.bind(alertHub),
  };
}