const MS_PER_DAY = 1000 * 60 * 60 * 24;

const isInvalidDate = (date) => Number.isNaN(date.getTime());

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;

  const value = String(dateStr).trim();
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      isInvalidDate(date) ||
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return null;
    }

    return date;
  }

  const date = new Date(value);
  return isInvalidDate(date) ? null : date;
};

const pluralizeDays = (days) => (Math.abs(days) === 1 ? 'd\u00eda' : 'd\u00edas');

export const formatColombianDate = (dateStr) => {
  const date = parseLocalDate(dateStr);
  if (!date) return 'Fecha no disponible';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getExpirationAlertText = (daysRemaining, expirationDate) => {
  const formattedDate = formatColombianDate(expirationDate);

  if (formattedDate === 'Fecha no disponible') {
    return {
      primaryText: 'Fecha no disponible',
      dateText: 'Fecha no disponible',
      fullText: 'Fecha no disponible',
    };
  }

  if (!Number.isFinite(daysRemaining) || daysRemaining === -999) {
    return {
      primaryText: 'Fecha no disponible',
      dateText: formattedDate,
      fullText: `Fecha no disponible \u00b7 ${formattedDate}`,
    };
  }

  if (daysRemaining < 0) {
    const expiredDays = Math.abs(daysRemaining);
    const primaryText = `Vencido hace ${expiredDays} ${pluralizeDays(expiredDays)}`;
    const dateText = `Venci\u00f3 el ${formattedDate}`;

    return {
      primaryText,
      dateText,
      fullText: `${primaryText} \u00b7 ${dateText}`,
    };
  }

  if (daysRemaining === 0) {
    const primaryText = 'Vence hoy';

    return {
      primaryText,
      dateText: formattedDate,
      fullText: `${primaryText} \u00b7 ${formattedDate}`,
    };
  }

  const primaryText = `Faltan ${daysRemaining} ${pluralizeDays(daysRemaining)}`;
  const dateText = `Vence el ${formattedDate}`;

  return {
    primaryText,
    dateText,
    fullText: `${primaryText} \u00b7 ${dateText}`,
  };
};

// Calcula diferencia en dias normalizando ambas fechas a medianoche para evitar desfases por hora.
export const calculateDaysRemaining = (targetDateStr, simulatedDateStr) => {
  if (!targetDateStr) return -999;

  const target = parseLocalDate(targetDateStr);
  const current = simulatedDateStr ? parseLocalDate(simulatedDateStr) : new Date();

  if (!target || !current || isInvalidDate(current)) return -999;

  target.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - current.getTime();
  return Math.ceil(diffTime / MS_PER_DAY);
};

// Convierte dias restantes en el semaforo documental que usan paginas, hooks y alertas.
export const calculateDocumentState = (daysRemaining, threshold = 15) => {
  if (!Number.isFinite(daysRemaining) || daysRemaining < 0 || daysRemaining === -999) {
    return 'rojo';
  }
  if (daysRemaining <= threshold) return 'amarillo';

  return 'verde';
};

// Cuando un vehiculo combina varios documentos, siempre manda el estado mas critico.
export const getWorstState = (state1, state2) => {
  const priority = { rojo: 3, amarillo: 2, verde: 1 };
  const p1 = priority[state1] || 3;
  const p2 = priority[state2] || 3;

  if (p1 >= p2) return state1 || 'rojo';
  return state2 || 'rojo';
};
