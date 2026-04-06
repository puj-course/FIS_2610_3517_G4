import { useState, useCallback } from 'react';

export function useAlert() {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return { alerts, addAlert, removeAlert };
}