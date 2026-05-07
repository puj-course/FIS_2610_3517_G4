import { useAlertsFacade } from './useAlertsFacade.js';

// Alias semántico para consumir el flujo de alertas sin obligar a conocer la fachada concreta.
export function useAlerts() {
  return useAlertsFacade();
}
