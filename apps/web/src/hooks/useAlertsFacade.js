import { useMemo } from 'react';
import { useAlertHub } from './useAlertHub.js';
import { useVehicles } from './useVehicles.js';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';

export function useAlertsFacade() {
  // Activan las fuentes para que publiquen alertas al hub
  useVehicles();
  useConductors();
  useDocuments();

  // La fachada consume el resultado centralizado del observer
  const { alerts } = useAlertHub();

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
    warningAlerts
  };
}