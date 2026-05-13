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

const VEHICLE_REQUIRED_FIELDS = [['placa'], ['marca'], ['modelo'], ['anio', 'año'], ['tipo']];
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

const OWN_METRIC_TYPE = 'Metrica propia de dominio';
const DEFINITION_SEPARATOR = '|';
const THRESHOLD_SEPARATOR = ';';

const QUALITY_METRIC_DEFINITION_TEXT = `
document-risk|No existe equivalente directo en SonarQube; Sonar no evalua vigencia legal de documentos.|Porcentaje de documentos evaluables que estan vencidos o proximos a vencer.|SOAT, RTM, licencias, documentos genericos y conductores con campos de vencimiento.|(documentos vencidos + documentos proximos a vencer) / documentos evaluables * 100|0% es saludable; 1% a 49% requiere gestion preventiva; 50% o mas es riesgo critico.|Reduce riesgo legal, interrupciones operativas y perdida de disponibilidad de la flota.|Renovar documentos vencidos, agendar proximos vencimientos y mantener alertas preventivas.|0% de documentos afectados;1% a 49% de documentos afectados;50% o mas de documentos afectados;No hay documentos evaluables
operational-completeness|No existe equivalente directo en SonarQube; Sonar no valida completitud de datos de negocio.|Porcentaje de vehiculos, conductores y documentos con campos minimos completos.|Vehiculos, conductores, SOAT, RTM y documentos genericos registrados por el usuario.|registros completos / registros evaluados * 100|100% es saludable; 80% a 99% es aceptable con deuda; menos de 80% compromete reportes.|Sostiene trazabilidad, reportes confiables y generacion correcta de alertas.|Completar placas, identificadores, telefonos, fechas y datos obligatorios pendientes.|100% de registros completos;80% a 99% de registros completos;Menos de 80% de registros completos;No hay registros evaluables
alert-criticality|No existe equivalente directo en SonarQube; Sonar no prioriza alertas operativas activas.|Porcentaje de alertas criticas dentro del total de alertas activas.|Alertas publicadas por adaptadores de SOAT, RTM, licencias, vehiculos y reglas operativas.|alertas criticas / alertas activas * 100|0% es saludable; 1% a 29% requiere seguimiento; 30% o mas exige atencion inmediata.|Permite priorizar riesgos que afectan cumplimiento, continuidad y seguridad operativa.|Resolver primero alertas rojas, documentar causa raiz y prevenir recurrencia.|0% de alertas criticas;1% a 29% de alertas criticas;30% o mas de alertas criticas;No hay alertas activas
`;

const buildThresholds = (thresholdText) => {
  const [verde, amarillo, rojo, neutral] = thresholdText.split(THRESHOLD_SEPARATOR);
  return { verde, amarillo, rojo, neutral };
};

const buildMetricDefinition = (definitionLine) => {
  const [
    id,
    sonarEquivalent,
    whatItMeasures,
    dataSource,
    formula,
    interpretationGuide,
    qualityImpact,
    improvementProtocol,
    thresholdText,
  ] = definitionLine.split(DEFINITION_SEPARATOR);

  return {
    id,
    type: OWN_METRIC_TYPE,
    sonarEquivalent,
    whatItMeasures,
    dataSource,
    formula,
    interpretationGuide,
    qualityImpact,
    improvementProtocol,
    thresholds: buildThresholds(thresholdText),
  };
};

const QUALITY_METRIC_DEFINITIONS = QUALITY_METRIC_DEFINITION_TEXT
  .trim()
  .split('\n')
  .map(buildMetricDefinition);

const QUALITY_METRIC_DEFINITION_BY_ID = Object.fromEntries(
  QUALITY_METRIC_DEFINITIONS.map((definition) => [definition.id, definition])
);

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
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateText);

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

const normalizeFirstKnownState = (record, keys) =>
  keys.map((key) => normalizeDocumentState(record?.[key])).find(Boolean) ?? null;

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

const buildDocumentRecords = (data = {}) => {
  const source = data ?? {};

  return [
    ...asArray(source.soats),
    ...asArray(source.rtms),
    ...asArray(source.licenses),
    ...asArray(source.licencias),
    ...asArray(source.conductors),
    ...asArray(source.conductores),
    ...asArray(source.documents),
    ...asArray(source.documentos),
  ];
};

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

const buildCompletenessRecords = (data = {}) => {
  const source = data ?? {};

  return [
    ...asArray(source.vehicles).map((record) => ({ record, requiredFields: VEHICLE_REQUIRED_FIELDS })),
    ...asArray(source.vehiculos).map((record) => ({ record, requiredFields: VEHICLE_REQUIRED_FIELDS })),
    ...asArray(source.conductors).map((record) => ({ record, requiredFields: CONDUCTOR_REQUIRED_FIELDS })),
    ...asArray(source.conductores).map((record) => ({ record, requiredFields: CONDUCTOR_REQUIRED_FIELDS })),
    ...asArray(source.soats).map((record) => ({ record, requiredFields: SOAT_REQUIRED_FIELDS })),
    ...asArray(source.rtms).map((record) => ({ record, requiredFields: RTM_REQUIRED_FIELDS })),
    ...asArray(source.documents).map((record) => ({ record, requiredFields: getDocumentCompletenessFields(record) })),
    ...asArray(source.documentos).map((record) => ({ record, requiredFields: getDocumentCompletenessFields(record) })),
  ];
};

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

const getDocumentRiskMessages = (total, affected) => {
  if (total === 0) {
    return {
      interpretation: 'Sin documentos evaluables para calcular el riesgo documental.',
      impact: 'No hay evidencia documental suficiente para estimar exposicion operativa.',
      improvementAction: 'Registrar SOAT, RTM y licencias para habilitar seguimiento automatizado.',
    };
  }

  if (affected === 0) {
    return {
      interpretation: 'Todos los documentos evaluables estan vigentes.',
      impact: 'La flota mantiene bajo riesgo documental operativo.',
      improvementAction: 'Mantener el monitoreo preventivo y revisar los proximos vencimientos periodicamente.',
    };
  }

  return {
    interpretation: `${affected} de ${total} documentos evaluables estan vencidos o proximos a vencer.`,
    impact: 'Los vencimientos pueden afectar continuidad operativa, cumplimiento legal y disponibilidad de la flota.',
    improvementAction: 'Priorizar renovaciones vencidas y programar gestion preventiva de documentos proximos a vencer.',
  };
};

const getCompletenessMessages = (total, incomplete) => {
  if (total === 0) {
    return {
      interpretation: 'Sin registros operativos para evaluar completitud.',
      impact: 'La ausencia de registros limita la trazabilidad de la operacion.',
      improvementAction: 'Crear registros base de vehiculos, conductores y documentos.',
    };
  }

  if (incomplete === 0) {
    return {
      interpretation: 'Todos los registros operativos evaluados tienen los campos minimos completos.',
      impact: 'La informacion disponible soporta reportes y alertas confiables.',
      improvementAction: 'Conservar validaciones de captura para evitar deterioro de la calidad de datos.',
    };
  }

  return {
    interpretation: `${incomplete} de ${total} registros operativos tienen campos minimos pendientes.`,
    impact: 'Los datos incompletos reducen confiabilidad de reportes, alertas y decisiones operativas.',
    improvementAction: 'Completar placas, identificadores, fechas y datos obligatorios de los registros pendientes.',
  };
};

const getAlertCriticalityMessages = (total, critical) => {
  if (total === 0) {
    return {
      interpretation: 'Sin alertas activas para evaluar criticidad.',
      impact: 'No se observan eventos activos que requieran priorizacion.',
      improvementAction: 'Mantener monitoreo continuo de fuentes de alertas.',
    };
  }

  if (critical === 0) {
    return {
      interpretation: 'No hay alertas criticas dentro del conjunto evaluado.',
      impact: 'La operacion se mantiene en un nivel preventivo o estable.',
      improvementAction: 'Gestionar alertas preventivas antes de que escalen a estado critico.',
    };
  }

  return {
    interpretation: `${critical} de ${total} alertas activas son criticas.`,
    impact: 'Las alertas criticas requieren atencion inmediata para reducir riesgo operativo.',
    improvementAction: 'Atender primero alertas rojas y cerrar las causas documentales u operativas asociadas.',
  };
};

const enrichMetric = (metric) => ({
  ...metric,
  definition: QUALITY_METRIC_DEFINITION_BY_ID[metric.id],
});

export function getQualityMetricDefinitions() {
  return QUALITY_METRIC_DEFINITIONS.map((definition) => ({
    ...definition,
    thresholds: { ...definition.thresholds },
  }));
}

export function calculateDocumentRiskMetric(data = {}, options = {}) {
  const states = buildDocumentRecords(data)
    .map((document) => resolveDocumentState(document, options))
    .filter(Boolean);
  const total = states.length;
  const affected = states.filter((state) => state === 'rojo' || state === 'amarillo').length;
  const percentage = calculatePercentage(affected, total);
  const status = resolveRiskStatus(percentage, total);
  const messages = getDocumentRiskMessages(total, affected);

  return enrichMetric({
    id: 'document-risk',
    name: 'Indice de riesgo documental',
    value: percentage,
    percentage,
    total,
    affected,
    status,
    interpretation: messages.interpretation,
    impact: messages.impact,
    improvementAction: messages.improvementAction,
  });
}

export function calculateOperationalCompletenessMetric(data = {}) {
  const records = buildCompletenessRecords(data);
  const total = records.length;
  const complete = records.filter(({ record, requiredFields }) => isCompleteRecord(record, requiredFields)).length;
  const incomplete = total - complete;
  const percentage = calculatePercentage(complete, total);
  const status = resolveCompletenessStatus(percentage, total);
  const messages = getCompletenessMessages(total, incomplete);

  return enrichMetric({
    id: 'operational-completeness',
    name: 'Completitud de datos operativos',
    value: percentage,
    percentage,
    total,
    complete,
    incomplete,
    status,
    interpretation: messages.interpretation,
    impact: messages.impact,
    improvementAction: messages.improvementAction,
  });
}

export function calculateAlertCriticalityMetric(alerts = []) {
  const safeAlerts = asArray(alerts);
  const total = safeAlerts.length;
  const states = safeAlerts.map((alert) =>
    normalizeFirstKnownState(alert, ['prioridad', 'severity', 'status', 'estado', 'state', 'tipo'])
  );
  const critical = states.filter((state) => state === 'rojo').length;
  const preventive = states.filter((state) => state === 'amarillo').length;
  const percentage = calculatePercentage(critical, total);
  const status = resolveCriticalityStatus(percentage, total);
  const messages = getAlertCriticalityMessages(total, critical);

  return enrichMetric({
    id: 'alert-criticality',
    name: 'Indice de criticidad de alertas',
    value: percentage,
    percentage,
    total,
    critical,
    preventive,
    status,
    interpretation: messages.interpretation,
    impact: messages.impact,
    improvementAction: messages.improvementAction,
  });
}

export function buildQualityMetricsSummary(data = {}, options = {}) {
  const source = data ?? {};

  return [
    calculateDocumentRiskMetric(source, options),
    calculateOperationalCompletenessMetric(source),
    calculateAlertCriticalityMetric(source.alerts || source.alertas),
  ];
}
