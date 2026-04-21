import { useState, useEffect, useCallback } from 'react';
import AlertHubSingleton from '@/patterns/singleton/AlertHubSingleton.js';

const alertHub = AlertHubSingleton.getInstance();

export function useAlertHub() {
  const [alerts, setAlerts] = useState(alertHub.getAllAlerts());

  useEffect(() => {
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