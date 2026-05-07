import { useLocalStorage } from './useLocalStorage.js';

// Persiste la fecha simulada para que alertas, documentos y licencias compartan el mismo "hoy".
export function useSimulatedDate() {
  const [simulatedDate, setSimulatedDate] = useLocalStorage('syntix_simulated_date', new Date().toISOString().split('T')[0]);

  return {
    simulatedDate,
    setSimulatedDate,
    resetDate: () => setSimulatedDate(new Date().toISOString().split('T')[0])
  };
}
