import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '../utils/dateUtils.js';
import { useSimulatedDate } from './useSimulatedDate.js';
import { registerSourceAlerts, clearSourceAlerts } from './useAlertHub.js';
import ConductorAlertAdapter from '@/patterns/adapters/ConductorAlertAdapter.js';

const initialConductors = [
  { id: 'c1', nombre: 'Juan Pérez', documento: '10203040', telefono: '3001234567', categoria: 'C2', fechaVencimiento: '2026-12-31' },
  { id: 'c2', nombre: 'María Gómez', documento: '50607080', telefono: '3109876543', categoria: 'C1', fechaVencimiento: '2026-03-01' },
  { id: 'c3', nombre: 'Carlos Ruiz', documento: '90102030', telefono: '3205554444', categoria: 'C3', fechaVencimiento: '2026-02-25' },
];

export function useConductors() {
  const [conductores, setConductores] = useLocalStorage('syntix_conductores', initialConductors);
  const { simulatedDate } = useSimulatedDate();
  const [threshold] = useLocalStorage('syntix_threshold', 15);

  const getConductorsWithState = () => {
    return conductores.map((c) => {
      const days = calculateDaysRemaining(c.fechaVencimiento, simulatedDate);
      return {
        ...c,
        diasRestantes: days,
        estado: calculateDocumentState(days, threshold)
      };
    });
  };

  const addConductor = (conductor) => {
    setConductores([...conductores, { ...conductor, id: Date.now().toString() }]);
  };

  const updateConductor = (id, data) => {
    setConductores(conductores.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteConductor = (id) => {
    setConductores(conductores.filter((c) => c.id !== id));
  };

  const conductoresWithState = getConductorsWithState();
  const conductorAlertAdapter = new ConductorAlertAdapter();

  useEffect(() => {
    const alerts = conductorAlertAdapter.adaptMany(conductoresWithState);
    registerSourceAlerts('conductores', alerts);
    return () => clearSourceAlerts('conductores');
  }, [conductoresWithState]);

  return {
    conductores: conductoresWithState,
    addConductor,
    updateConductor,
    deleteConductor
  };
}