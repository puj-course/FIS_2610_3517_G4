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
import { useState, useEffect, useCallback } from 'react';

const listeners = new Set();
const sourceAlerts = new Map();
let currentAlerts = [];

function sortAlerts(alerts) {
  return [...alerts].sort((a, b) => {
    if (a.prioridad === 'rojo' && b.prioridad !== 'rojo') return -1;
    if (a.prioridad !== 'rojo' && b.prioridad === 'rojo') return 1;
    return a.diasRestantes - b.diasRestantes;
  });
}

function buildAlerts() {
  const merged = [];
  const seen = new Set();

  Array.from(sourceAlerts.values()).flat().forEach((alert) => {
    if (!alert || !alert.id) return;
    if (!seen.has(alert.id)) {
      seen.add(alert.id);
      merged.push(alert);
    }
  });

  return sortAlerts(merged);
}

function notifyListeners() {
  currentAlerts = buildAlerts();
  listeners.forEach((listener) => listener(currentAlerts));
}

const alertHub = {
  subscribe(listener) {
    listeners.add(listener);
    listener(currentAlerts);
    return () => listeners.delete(listener);
  },

  registerSourceAlerts(sourceKey, alerts = []) {
    sourceAlerts.set(sourceKey, Array.isArray(alerts) ? alerts : []);
    notifyListeners();
  },

  clearSourceAlerts(sourceKey) {
    sourceAlerts.delete(sourceKey);
    notifyListeners();
  }
};

export function useAlertHub() {
  const [alerts, setAlerts] = useState(currentAlerts);

  useEffect(() => {
    return alertHub.subscribe(setAlerts);
  }, []);

  const registerSourceAlerts = useCallback((sourceKey, alerts = []) => {
    alertHub.registerSourceAlerts(sourceKey, alerts);
  }, []);

  const clearSourceAlerts = useCallback((sourceKey) => {
    alertHub.clearSourceAlerts(sourceKey);
  }, []);

  return {
    alerts,
    registerSourceAlerts,
    clearSourceAlerts
  };
}

export const registerSourceAlerts = alertHub.registerSourceAlerts;
export const clearSourceAlerts = alertHub.clearSourceAlerts;
