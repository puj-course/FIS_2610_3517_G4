import { useAlertHub } from './useAlertHub.js';

export function useAlerts() {
  const { alerts } = useAlertHub();

  return { alerts };
}