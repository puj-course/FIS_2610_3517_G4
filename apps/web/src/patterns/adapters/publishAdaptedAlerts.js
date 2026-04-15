import BaseAlertAdapter from './BaseAlertAdapter.js';
import { registerSourceAlerts } from '@/hooks/useAlertHub.js';

export function publishAdaptedAlerts(adapter, sourceKey, items = []) {
  if (!(adapter instanceof BaseAlertAdapter)) {
    throw new Error('El adapter debe extender BaseAlertAdapter.');
  }

  const alerts = adapter.adaptMany(items);
  registerSourceAlerts(sourceKey, alerts);
  return alerts;
}