export const calculateDaysRemaining = (targetDateStr, simulatedDateStr) => {
  if (!targetDateStr) return -999;
  const target = new Date(targetDateStr);
  const current = simulatedDateStr ? new Date(simulatedDateStr) : new Date();
  
  target.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - current.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateDocumentState = (daysRemaining, threshold = 15) => {
  if (daysRemaining < 0 || daysRemaining === -999) return 'rojo';
  if (daysRemaining <= threshold) return 'amarillo';
  return 'verde';
};

export const getWorstState = (state1, state2) => {
  const priority = { rojo: 3, amarillo: 2, verde: 1 };
  const p1 = priority[state1] || 3;
  const p2 = priority[state2] || 3;
  
  if (p1 >= p2) return state1 || 'rojo';
  return state2 || 'rojo';
};