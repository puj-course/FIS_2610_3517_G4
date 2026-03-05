export function useDocumentStatus() {
  const getStatus = (expirationDate, simulatedToday = new Date()) => {
    if (!expirationDate) return 'rojo';
    
    const expDate = new Date(expirationDate);
    const today = new Date(simulatedToday);
    
    // Reset times to compare just dates
    expDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'rojo'; // Vencido
    if (diffDays <= 30) return 'amarillo'; // Próximo a vencer
    return 'verde'; // Vigente
  };

  return { getStatus };
}