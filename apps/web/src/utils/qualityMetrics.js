const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DEFAULT_WARNING_THRESHOLD_DAYS = 15;

const CRITICAL_STATES = new Set(['rojo', 'red', 'critico', 'critical', 'danger', 'vencido', 'expired']);
const WARNING_STATES = new Set(['amarillo', 'yellow', 'warning', 'por vencer', 'proximo', 'proxima', 'preventiva']);
const HEALTHY_STATES = new Set(['verde', 'green', 'vigente', 'valid', 'ok', 'al dia']);

const DATE_FIELDS = [
  'fechaFinVigencia',
  'fechaVencimiento',
  'expirationDate',
  'expiresAt',
  'vencimiento',
];

const DAY_FIELDS = ['diasRestantes', 'daysRemaining', 'remainingDays'];

const VEHICLE_REQUIRED_FIELDS = [['placa'], ['marca'], ['modelo'], ['anio'], ['tipo']];
const CONDUCTOR_REQUIRED_FIELDS = [['nombre', 'name'], ['documento'], ['telefono'], ['categoria'], ['fechaVencimiento']];
const SOAT_REQUIRED_FIELDS = [
  ['vehiculoId'],
  ['placaVehiculo', 'vehiculoPlaca', 'placa'],
  ['numeroPoliza'],
  ['aseguradora'],
  ['fechaInicioVigencia', 'fechaInicio'],
  ['fechaFinVigencia', 'fechaVencimiento'],
];
const RTM_REQUIRED_FIELDS = [
  ['vehiculoId'],
  ['placaVehiculo', 'vehiculoPlaca', 'placa'],
  ['numeroCertificado', 'numeroRtm'],
  ['cda'],
  ['fechaExpedicion', 'fechaInicio'],
  ['fechaVencimiento'],
  ['resultado'],
];
const GENERIC_DOCUMENT_REQUIRED_FIELDS = [
  ['tipo', 'type', 'grupo'],
  ['vehiculoId', 'conductorId', 'placaVehiculo', 'vehiculoPlaca', 'placa'],
  DATE_FIELDS,
];

const asArray = (items) => (Array.isArray(items) ? items : []);

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  return true;
};

const firstValue = (record, keys) => keys.map((key) => record?.[key]).find(hasValue);

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const parseLocalDate = (value) => {
  if (!hasValue(value)) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const dateText = String(value).trim();
  const isoMatch = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getFullYear() !== Number(year) ||
      parsed.getMonth() !== Number(month) - 1 ||
      parsed.getDate() !== Number(day)
    ) {
      return null;
    }

    return parsed;
  }

  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const calculateDaysRemaining = (targetDate, baseDate) => {
  const target = parseLocalDate(targetDate);
  const current = parseLocalDate(baseDate || new Date());

  if (!target || !current) return null;

  return Math.ceil((target.getTime() - current.getTime()) / MS_PER_DAY);
};

const resolveStateFromDays = (daysRemaining, threshold) => {
  if (!Number.isFinite(daysRemaining) || daysRemaining < 0 || daysRemaining === -999) {
    return 'rojo';
  }

  if (daysRemaining <= threshold) return 'amarillo';

  return 'verde';
};

const normalizeDocumentState = (value) => {
  const state = normalizeText(value);

  if (CRITICAL_STATES.has(state)) return 'rojo';
  if (WARNING_STATES.has(state)) return 'amarillo';
  if (HEALTHY_STATES.has(state)) return 'verde';

  return null;
};

const resolveDocumentState = (document, options = {}) => {
  const explicitState = firstValue(document, ['estado', 'status', 'prioridad', 'severity', 'state']);
  const normalizedState = normalizeDocumentState(explicitState);

  if (normalizedState) return normalizedState;

  const threshold = Number.isFinite(Number(options.warningThresholdDays))
    ? Number(options.warningThresholdDays)
    : DEFAULT_WARNING_THRESHOLD_DAYS;
  const explicitDays = firstValue(document, DAY_FIELDS);

  if (hasValue(explicitDays)) {
    return resolveStateFromDays(Number(explicitDays), threshold);
  }

  const expirationDate = firstValue(document, DATE_FIELDS);
  const daysRemaining = calculateDaysRemaining(expirationDate, options.baseDate);

  if (daysRemaining === null) return null;

  return resolveStateFromDays(daysRemaining, threshold);
};

const calculatePercentage = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);

const buildDocumentRecords = (data = {}) => [
  ...asArray(data.soats),
  ...asArray(data.rtms),
  ...asArray(data.licenses),
  ...asArray(data.licencias),
  ...asArray(data.conductors),
  ...asArray(data.conductores),
  ...asArray(data.documents),
  ...asArray(data.documentos),
];

const hasAnyField = (record, fieldNames) => fieldNames.some((fieldName) => hasValue(record?.[fieldName]));

const isCompleteRecord = (record, requiredFieldGroups) =>
  requiredFieldGroups.every((fieldNames) => hasAnyField(record, fieldNames));

const getDocumentCompletenessFields = (document) => {
  const type = normalizeText(firstValue(document, ['tipo', 'type', 'grupo', 'documentType']));

  if (type.includes('soat')) return SOAT_REQUIRED_FIELDS;
  if (type.includes('rtm') || type.includes('tecnomecanica')) return RTM_REQUIRED_FIELDS;
  if (type.includes('licencia')) return CONDUCTOR_REQUIRED_FIELDS;

  return GENERIC_DOCUMENT_REQUIRED_FIELDS;
};

const buildCompletenessRecords = (data = {}) => [
  ...asArray(data.vehicles).map((record) => ({ record, requiredFields: VEHICLE_REQUIRED_FIELDS })),
  ...asArray(data.vehiculos).map((record) => ({ record, requiredFields: VEHICLE_REQUIRED_FIELDS })),
  ...asArray(data.conductors).map((record) => ({ record, requiredFields: CONDUCTOR_REQUIRED_FIELDS })),
  ...asArray(data.conductores).map((record) => ({ record, requiredFields: CONDUCTOR_REQUIRED_FIELDS })),
  ...asArray(data.soats).map((record) => ({ record, requiredFields: SOAT_REQUIRED_FIELDS })),
  ...asArray(data.rtms).map((record) => ({ record, requiredFields: RTM_REQUIRED_FIELDS })),
  ...asArray(data.documents).map((record) => ({ record, requiredFields: getDocumentCompletenessFields(record) })),
  ...asArray(data.documentos).map((record) => ({ record, requiredFields: getDocumentCompletenessFields(record) })),
];

const resolveRiskStatus = (percentage, total) => {
  if (total === 0) return 'neutral';
  if (percentage === 0) return 'verde';
  if (percentage >= 50) return 'rojo';
  return 'amarillo';
};

const resolveCompletenessStatus = (percentage, total) => {
  if (total === 0) return 'neutral';
  if (percentage === 100) return 'verde';
  if (percentage >= 80) return 'amarillo';
  return 'rojo';
};

const resolveCriticalityStatus = (percentage, total) => {
  if (total === 0) return 'neutral';
  if (percentage === 0) return 'verde';
  if (percentage >= 30) return 'rojo';
  return 'amarillo';
};

export function calculateDocumentRiskMetric(data = {}, options = {}) {
  const states = buildDocumentRecords(data)
    .map((document) => resolveDocumentState(document, options))
    .filter(Boolean);
  const total = states.length;
  const affected = states.filter((state) => state === 'rojo' || state === 'amarillo').length;
  const percentage = calculatePercentage(affected, total);
  const status = resolveRiskStatus(percentage, total);

  return {
    id: 'document-risk',
    name: 'Indice de riesgo documental',
    value: percentage,
    percentage,
    total,
    affected,
    status,
    interpretation: total === 0
      ? 'Sin documentos evaluables para calcular el riesgo documental.'
      : affected === 0
        ? 'Todos los documentos evaluables estan vigentes.'
        : `${affected} de ${total} documentos evaluables estan vencidos o proximos a vencer.`,
    impact: total === 0
      ? 'No hay evidencia documental suficiente para estimar exposicion operativa.'
      : affected === 0
        ? 'La flota mantiene bajo riesgo documental operativo.'
        : 'Los vencimientos pueden afectar continuidad operativa, cumplimiento legal y disponibilidad de la flota.',
    improvementAction: total === 0
      ? 'Registrar SOAT, RTM y licencias para habilitar seguimiento automatizado.'
      : affected === 0
        ? 'Mantener el monitoreo preventivo y revisar los proximos vencimientos periodicamente.'
        : 'Priorizar renovaciones vencidas y programar gestion preventiva de documentos proximos a vencer.',
  };
}

export function calculateOperationalCompletenessMetric(data = {}) {
  const records = buildCompletenessRecords(data);
  const total = records.length;
  const complete = records.filter(({ record, requiredFields }) => isCompleteRecord(record, requiredFields)).length;
  const incomplete = total - complete;
  const percentage = calculatePercentage(complete, total);
  const status = resolveCompletenessStatus(percentage, total);

  return {
    id: 'operational-completeness',
    name: 'Completitud de datos operativos',
    value: percentage,
    percentage,
    total,
    complete,
    incomplete,
    status,
    interpretation: total === 0
      ? 'Sin registros operativos para evaluar completitud.'
      : incomplete === 0
        ? 'Todos los registros operativos evaluados tienen los campos minimos completos.'
        : `${incomplete} de ${total} registros operativos tienen campos minimos pendientes.`,
    impact: total === 0
      ? 'La ausencia de registros limita la trazabilidad de la operacion.'
      : incomplete === 0
        ? 'La informacion disponible soporta reportes y alertas confiables.'
        : 'Los datos incompletos reducen confiabilidad de reportes, alertas y decisiones operativas.',
    improvementAction: total === 0
      ? 'Crear registros base de vehiculos, conductores y documentos.'
      : incomplete === 0
        ? 'Conservar validaciones de captura para evitar deterioro de la calidad de datos.'
        : 'Completar placas, identificadores, fechas y datos obligatorios de los registros pendientes.',
  };
}

export function calculateAlertCriticalityMetric(alerts = []) {
  const safeAlerts = asArray(alerts);
  const total = safeAlerts.length;
  const states = safeAlerts.map((alert) =>
    normalizeDocumentState(firstValue(alert, ['prioridad', 'severity', 'status', 'estado', 'state']))
  );
  const critical = states.filter((state) => state === 'rojo').length;
  const preventive = states.filter((state) => state === 'amarillo').length;
  const percentage = calculatePercentage(critical, total);
  const status = resolveCriticalityStatus(percentage, total);

  return {
    id: 'alert-criticality',
    name: 'Indice de criticidad de alertas',
    value: percentage,
    percentage,
    total,
    critical,
    preventive,
    status,
    interpretation: total === 0
      ? 'Sin alertas activas para evaluar criticidad.'
      : critical === 0
        ? 'No hay alertas criticas dentro del conjunto evaluado.'
        : `${critical} de ${total} alertas activas son criticas.`,
    impact: total === 0
      ? 'No se observan eventos activos que requieran priorizacion.'
      : critical === 0
        ? 'La operacion se mantiene en un nivel preventivo o estable.'
        : 'Las alertas criticas requieren atencion inmediata para reducir riesgo operativo.',
    improvementAction: total === 0
      ? 'Mantener monitoreo continuo de fuentes de alertas.'
      : critical === 0
        ? 'Gestionar alertas preventivas antes de que escalen a estado critico.'
        : 'Atender primero alertas rojas y cerrar las causas documentales u operativas asociadas.',
  };
}

export function buildQualityMetricsSummary(data = {}, options = {}) {
  return [
    calculateDocumentRiskMetric(data, options),
    calculateOperationalCompletenessMetric(data),
    calculateAlertCriticalityMetric(data.alerts || data.alertas),
  ];
}
