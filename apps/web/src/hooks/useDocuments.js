import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { calculateDaysRemaining, calculateDocumentState } from '../utils/dateUtils.js';
import { useSimulatedDate } from './useSimulatedDate.js';
import { registerSourceAlerts, clearSourceAlerts } from './useAlertHub.js';

const initialSoats = [
  { id: 's1', vehiculoId: 'v1', numeroPoliza: 'SOAT-1001', fechaInicio: '2025-01-01', fechaVencimiento: '2026-01-01' },
  { id: 's2', vehiculoId: 'v2', numeroPoliza: 'SOAT-1002', fechaInicio: '2025-02-15', fechaVencimiento: '2026-02-28' },
  { id: 's3', vehiculoId: 'v3', numeroPoliza: 'SOAT-1003', fechaInicio: '2024-06-10', fechaVencimiento: '2025-06-10' },
];

export function useDocuments() {
  const [soats, setSoats] = useLocalStorage('syntix_soats', initialSoats);
  const { simulatedDate } = useSimulatedDate();
  const [threshold] = useLocalStorage('syntix_threshold', 15);

  const getSoatsWithState = () => {
    return soats.map(s => {
      const days = calculateDaysRemaining(s.fechaVencimiento, simulatedDate);
      return {
        ...s,
        diasRestantes: days,
        estado: calculateDocumentState(days, threshold)
      };
    });
  };

  const addSoat = (soat) => {
    // Remove existing SOAT for this vehicle if any
    const filtered = soats.filter(s => s.vehiculoId !== soat.vehiculoId);
    setSoats([...filtered, { ...soat, id: Date.now().toString() }]);
  };

  const deleteSoat = (id) => {
    setSoats(soats.filter(s => s.id !== id));
  };

  const soatsWithState = getSoatsWithState();

  useEffect(() => {
    const alerts = soatsWithState
      .filter((soat) => soat.estado === 'rojo' || soat.estado === 'amarillo')
      .map((soat) => ({
        id: `soat-${soat.id}`,
        tipo: 'SOAT',
        entidad: `Vehículo ${soat.vehiculoId}`,
        mensaje: soat.estado === 'rojo' ? 'SOAT Vencido' : 'SOAT Próximo a Vencer',
        diasRestantes: soat.diasRestantes,
        prioridad: soat.estado,
        fecha: new Date().toISOString()
      }));

    registerSourceAlerts('documentos', alerts);
    return () => clearSourceAlerts('documentos');
  }, [soats, simulatedDate, threshold]);

  return {
    soats: soatsWithState,
    addSoat,
    deleteSoat
  };
}