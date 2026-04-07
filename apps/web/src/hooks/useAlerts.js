import { useAlertsFacade } from './useAlertsFacade.js';

export function useAlerts() {
  const { alerts } = useAlertsFacade();

  return { alerts };
}