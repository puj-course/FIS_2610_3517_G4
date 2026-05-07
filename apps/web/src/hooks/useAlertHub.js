import { useState, useEffect, useCallback } from 'react';
import AlertHubSingleton from '@/patterns/singleton/AlertHubSingleton.js';

const alertHub = AlertHubSingleton.getInstance();

// Hook fino para observar y mutar el hub global sin exponer la implementación singleton a las vistas.
export function useAlertHub() {
  const [alerts, setAlerts] = useState(alertHub.getAllAlerts());

  useEffect(() => {
    // La suscripción mantiene el estado React alineado con cualquier fuente que publique alertas.
    return alertHub.subscribe(setAlerts);
  }, []);

  const registerSourceAlerts = useCallback((sourceKey, nextAlerts = []) => {
    alertHub.registerSourceAlerts(sourceKey, nextAlerts);
  }, []);

  const clearSourceAlerts = useCallback((sourceKey) => {
    alertHub.clearSourceAlerts(sourceKey);
  }, []);

  const setSortStrategy = useCallback((strategy) => {
    alertHub.setSortStrategy(strategy);
  }, []);

  return {
    alerts,
    registerSourceAlerts,
    clearSourceAlerts,
    setSortStrategy,
  };
}

export const registerSourceAlerts = (sourceKey, alerts = []) =>
  alertHub.registerSourceAlerts(sourceKey, alerts);

export const clearSourceAlerts = (sourceKey) =>
  alertHub.clearSourceAlerts(sourceKey);
