import { useEffect, useMemo } from 'react';
import { useAlertHub } from './useAlertHub.js';
import { useVehicles } from './useVehicles.js';
import PriorityAlertSortStrategy from '@/patterns/strategy/PriorityAlertSortStrategy.js';
import UrgencyAlertSortStrategy from '@/patterns/strategy/UrgencyAlertSortStrategy.js';

export function useAlertsFacade(sortMode = 'priority') {
  // Activa las fuentes del sistema de alertas
  useVehicles();

  const { alerts, setSortStrategy } = useAlertHub();

  useEffect(() => {
    const strategy =
      sortMode === 'urgency'
        ? new UrgencyAlertSortStrategy()
        : new PriorityAlertSortStrategy();

    setSortStrategy(strategy);
  }, [sortMode, setSortStrategy]);

  const criticalAlerts = useMemo(
    () => alerts.filter((alert) => alert.prioridad === 'rojo'),
    [alerts]
  );

  const warningAlerts = useMemo(
    () => alerts.filter((alert) => alert.prioridad === 'amarillo'),
    [alerts]
  );

  return {
    alerts,
    totalAlerts: alerts.length,
    criticalAlerts,
    warningAlerts,
  };
}