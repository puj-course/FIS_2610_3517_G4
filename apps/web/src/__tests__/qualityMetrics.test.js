import { describe, expect, it } from 'vitest';
import {
  buildQualityMetricsSummary,
  calculateAlertCriticalityMetric,
  calculateDocumentRiskMetric,
  calculateOperationalCompletenessMetric,
  getQualityMetricDefinitions,
} from '../utils/qualityMetrics.js';

const BASE_DATE = '2026-05-12';

const completeVehicle = {
  placa: 'SYN106',
  marca: 'Toyota',
  modelo: 'Hilux',
  anio: 2024,
  tipo: 'Pickup',
};

const completeConductor = {
  nombre: 'Laura Perez',
  documento: '1234567890',
  telefono: '3001234567',
  categoria: 'B1',
  fechaVencimiento: '2026-12-20',
};

const completeSoat = {
  vehiculoId: 'vehicle-1',
  placaVehiculo: 'SYN106',
  numeroPoliza: 'SOAT20260001',
  aseguradora: 'SURA',
  fechaInicioVigencia: '2026-01-01',
  fechaFinVigencia: '2026-12-31',
};

const completeRtm = {
  vehiculoId: 'vehicle-1',
  placaVehiculo: 'SYN106',
  numeroCertificado: 'RTM20260001',
  cda: 'CDA Bogota Norte',
  fechaExpedicion: '2026-01-01',
  fechaVencimiento: '2026-12-31',
  resultado: 'Aprobado',
};

const expectMetricRenderShape = (metric) => {
  expect(metric).toEqual(expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    value: expect.any(Number),
    percentage: expect.any(Number),
    total: expect.any(Number),
    status: expect.any(String),
    interpretation: expect.any(String),
    impact: expect.any(String),
    improvementAction: expect.any(String),
    definition: expect.objectContaining({
      type: 'Metrica propia de dominio',
      sonarEquivalent: expect.stringContaining('Sonar'),
      whatItMeasures: expect.any(String),
      formula: expect.any(String),
      interpretationGuide: expect.any(String),
      qualityImpact: expect.any(String),
      improvementProtocol: expect.any(String),
      thresholds: expect.any(Object),
    }),
  }));
};

describe('calculateDocumentRiskMetric', () => {
  it('retorna estado neutral cuando no hay datos', () => {
    const result = calculateDocumentRiskMetric({}, { baseDate: BASE_DATE });

    expect(result).toMatchObject({
      value: 0,
      percentage: 0,
      total: 0,
      affected: 0,
      status: 'neutral',
    });
    expect(result.interpretation).toContain('Sin documentos evaluables');
  });

  it('maneja data null como conjunto vacio', () => {
    const result = calculateDocumentRiskMetric(null, { baseDate: BASE_DATE });

    expect(result).toMatchObject({
      total: 0,
      affected: 0,
      status: 'neutral',
    });
  });

  it('calcula todos los documentos vigentes con cero riesgo', () => {
    const result = calculateDocumentRiskMetric(
      {
        soats: [{ estado: 'verde' }],
        rtms: [{ fechaVencimiento: '2026-06-20' }],
        conductors: [{ diasRestantes: 20 }],
        documents: [{ status: 'valid' }],
      },
      { baseDate: BASE_DATE, warningThresholdDays: 15 }
    );

    expect(result).toMatchObject({
      total: 4,
      affected: 0,
      percentage: 0,
      status: 'verde',
    });
    expect(result.interpretation).toContain('Todos los documentos evaluables');
  });

  it('calcula documentos proximos a vencer usando fechas y dias restantes', () => {
    const result = calculateDocumentRiskMetric(
      {
        soats: [
          { fechaFinVigencia: '2026-05-20' },
          { daysRemaining: 12 },
          { remainingDays: 45 },
          { status: 'vigente' },
        ],
      },
      { baseDate: BASE_DATE, warningThresholdDays: 15 }
    );

    expect(result).toMatchObject({
      total: 4,
      affected: 2,
      percentage: 50,
      status: 'rojo',
    });
    expect(result.interpretation).toContain('2 de 4');
  });

  it('calcula documentos vencidos como riesgo critico', () => {
    const result = calculateDocumentRiskMetric(
      {
        rtms: [
          { fechaVencimiento: '2026-05-01' },
          { estado: 'vencido' },
          { diasRestantes: -999 },
        ],
      },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 3,
      affected: 3,
      percentage: 100,
      status: 'rojo',
    });
    expect(result.interpretation).toContain('3 de 3');
  });

  it.each([
    ['verde', { estado: 'verde' }, { affected: 0, status: 'verde' }],
    ['amarillo', { status: 'amarillo' }, { affected: 1, status: 'rojo' }],
    ['rojo', { prioridad: 'rojo' }, { affected: 1, status: 'rojo' }],
  ])('interpreta el estado directo %s', (_caseName, document, expected) => {
    const result = calculateDocumentRiskMetric(
      { documentos: [document] },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 1,
      percentage: expected.affected * 100,
      ...expected,
    });
  });

  it('reconoce alias de estados documentales reales', () => {
    const result = calculateDocumentRiskMetric(
      {
        documents: [
          { status: 'vigente' },
          { estado: 'por vencer' },
          { prioridad: 'vencido' },
          { severity: 'warning' },
          { state: 'critical' },
          { status: 'danger' },
        ],
      },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 6,
      affected: 5,
      percentage: 83,
      status: 'rojo',
    });
  });

  it('usa options.baseDate para clasificar vencimientos de forma determinista', () => {
    const document = { fechaVencimiento: '2026-05-20' };

    const nearExpiration = calculateDocumentRiskMetric(
      { soats: [document] },
      { baseDate: BASE_DATE, warningThresholdDays: 15 }
    );
    const stillHealthy = calculateDocumentRiskMetric(
      { soats: [document] },
      { baseDate: '2026-04-01', warningThresholdDays: 15 }
    );

    expect(nearExpiration).toMatchObject({
      total: 1,
      affected: 1,
      status: 'rojo',
    });
    expect(stillHealthy).toMatchObject({
      total: 1,
      affected: 0,
      status: 'verde',
    });
  });

  it('ignora fechas invalidas al construir documentos evaluables', () => {
    const result = calculateDocumentRiskMetric(
      { licencias: [{ fechaVencimiento: '2026-02-30' }] },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 0,
      affected: 0,
      status: 'neutral',
    });
  });

  it('ignora documentos sin fecha, dias o estado reconocible', () => {
    const result = calculateDocumentRiskMetric(
      { documents: [{ tipo: 'SOAT', placa: 'SYN106' }] },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 0,
      affected: 0,
      status: 'neutral',
    });
  });

  it('interpreta diasRestantes como string numerico', () => {
    const result = calculateDocumentRiskMetric(
      { documentos: [{ diasRestantes: '10' }] },
      { baseDate: BASE_DATE, warningThresholdDays: 15 }
    );

    expect(result).toMatchObject({
      total: 1,
      affected: 1,
      percentage: 100,
      status: 'rojo',
    });
  });

  it('normaliza estados con mayusculas, minusculas y espacios', () => {
    const result = calculateDocumentRiskMetric(
      {
        documents: [
          { estado: '  VERDE  ' },
          { status: 'AmArIlLo' },
          { prioridad: 'RoJo' },
        ],
      },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 3,
      affected: 2,
      percentage: 67,
      status: 'rojo',
    });
  });

  it('ignora estados desconocidos sin respaldo de fecha o dias', () => {
    const result = calculateDocumentRiskMetric(
      { documents: [{ estado: 'sin clasificar' }] },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 0,
      status: 'neutral',
    });
  });

  it('clasifica fechas Date y fechas de texto no ISO con baseDate controlado', () => {
    const result = calculateDocumentRiskMetric(
      {
        documents: [
          { fechaVencimiento: new Date(2026, 4, 20) },
          { expirationDate: 'May 30, 2026' },
          { expiresAt: new Date('fecha invalida') },
          { vencimiento: 'fecha invalida' },
        ],
      },
      { baseDate: new Date(2026, 4, 12), warningThresholdDays: 15 }
    );

    expect(result).toMatchObject({
      total: 2,
      affected: 1,
      percentage: 50,
      status: 'rojo',
    });
  });

  it('mantiene estado amarillo de riesgo cuando menos de la mitad esta afectada', () => {
    const result = calculateDocumentRiskMetric(
      {
        soats: [
          { estado: 'warning' },
          { estado: 'verde' },
          { estado: 'vigente' },
          { diasRestantes: '90' },
        ],
      },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 4,
      affected: 1,
      percentage: 25,
      status: 'amarillo',
    });
  });
});

describe('getQualityMetricDefinitions', () => {
  it('documenta tres metricas propias sin equivalente directo en SonarQube', () => {
    const definitions = getQualityMetricDefinitions();

    expect(definitions).toHaveLength(3);
    expect(definitions.map((definition) => definition.id)).toEqual([
      'document-risk',
      'operational-completeness',
      'alert-criticality',
    ]);

    definitions.forEach((definition) => {
      expect(definition.type).toBe('Metrica propia de dominio');
      expect(definition.sonarEquivalent).toContain('Sonar');
      expect(definition.whatItMeasures).toBeTruthy();
      expect(definition.formula).toContain('* 100');
      expect(definition.interpretationGuide).toBeTruthy();
      expect(definition.qualityImpact).toBeTruthy();
      expect(definition.improvementProtocol).toBeTruthy();
      expect(definition.thresholds).toEqual(expect.objectContaining({
        verde: expect.any(String),
        amarillo: expect.any(String),
        rojo: expect.any(String),
        neutral: expect.any(String),
      }));
    });
  });

  it('retorna copias defensivas de los umbrales', () => {
    const [firstDefinition] = getQualityMetricDefinitions();
    firstDefinition.thresholds.verde = 'mutado';

    const [freshDefinition] = getQualityMetricDefinitions();

    expect(freshDefinition.thresholds.verde).not.toBe('mutado');
  });
});

describe('calculateOperationalCompletenessMetric', () => {
  it('retorna estado neutral cuando no hay datos', () => {
    const result = calculateOperationalCompletenessMetric({});

    expect(result).toMatchObject({
      value: 0,
      percentage: 0,
      total: 0,
      complete: 0,
      incomplete: 0,
      status: 'neutral',
    });
    expect(result.interpretation).toContain('Sin registros operativos');
  });

  it('maneja data null como conjunto vacio', () => {
    const result = calculateOperationalCompletenessMetric(null);

    expect(result).toMatchObject({
      total: 0,
      incomplete: 0,
      status: 'neutral',
    });
  });

  it('identifica vehiculos completos', () => {
    const result = calculateOperationalCompletenessMetric({
      vehicles: [completeVehicle],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 1,
      incomplete: 0,
      percentage: 100,
      status: 'verde',
    });
  });

  it('identifica vehiculos incompletos', () => {
    const result = calculateOperationalCompletenessMetric({
      vehiculos: [{ placa: 'ABC123', marca: 'Toyota', modelo: 'Hilux' }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 0,
      incomplete: 1,
      percentage: 0,
      status: 'rojo',
    });
  });

  it('acepta vehiculos con campo año en vez de anio', () => {
    const result = calculateOperationalCompletenessMetric({
      vehicles: [{ placa: 'ABC123', marca: 'Toyota', modelo: 'Hilux', año: 2026, tipo: 'Camioneta' }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 1,
      incomplete: 0,
      status: 'verde',
    });
  });

  it('trata campos vacios o con espacios como incompletos', () => {
    const result = calculateOperationalCompletenessMetric({
      vehicles: [{ placa: '   ', marca: 'Toyota', modelo: 'Hilux', anio: 2026, tipo: '' }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 0,
      incomplete: 1,
      status: 'rojo',
    });
  });

  it('identifica conductores completos', () => {
    const result = calculateOperationalCompletenessMetric({
      conductors: [completeConductor],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 1,
      status: 'verde',
    });
  });

  it('identifica conductores incompletos', () => {
    const result = calculateOperationalCompletenessMetric({
      conductores: [{ nombre: 'Ana Gomez', documento: '9876543210', categoria: 'B1' }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 0,
      incomplete: 1,
      status: 'rojo',
    });
  });

  it('marca conductores sin categoria o sin fechaVencimiento como incompletos', () => {
    const result = calculateOperationalCompletenessMetric({
      conductors: [
        { ...completeConductor, categoria: '' },
        { ...completeConductor, fechaVencimiento: undefined },
      ],
    });

    expect(result).toMatchObject({
      total: 2,
      complete: 0,
      incomplete: 2,
      status: 'rojo',
    });
  });

  it('identifica SOAT completos', () => {
    const result = calculateOperationalCompletenessMetric({
      soats: [completeSoat],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 1,
      status: 'verde',
    });
  });

  it('identifica SOAT incompletos', () => {
    const result = calculateOperationalCompletenessMetric({
      soats: [{ ...completeSoat, numeroPoliza: '' }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 0,
      incomplete: 1,
      status: 'rojo',
    });
  });

  it('marca SOAT con placa pero sin vehiculoId como incompleto', () => {
    const result = calculateOperationalCompletenessMetric({
      soats: [{ ...completeSoat, vehiculoId: undefined, placaVehiculo: 'SYN106' }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 0,
      incomplete: 1,
      status: 'rojo',
    });
  });

  it('identifica RTM completos', () => {
    const result = calculateOperationalCompletenessMetric({
      rtms: [completeRtm],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 1,
      status: 'verde',
    });
  });

  it('acepta RTM con numeroRtm en vez de numeroCertificado', () => {
    const result = calculateOperationalCompletenessMetric({
      rtms: [{ ...completeRtm, numeroCertificado: undefined, numeroRtm: 'RTM-ALT-2026' }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 1,
      incomplete: 0,
      status: 'verde',
    });
  });

  it('identifica RTM incompletos', () => {
    const result = calculateOperationalCompletenessMetric({
      rtms: [{ ...completeRtm, resultado: null }],
    });

    expect(result).toMatchObject({
      total: 1,
      complete: 0,
      incomplete: 1,
      status: 'rojo',
    });
  });

  it('mantiene estado amarillo cuando la completitud alcanza el umbral preventivo', () => {
    const result = calculateOperationalCompletenessMetric({
      vehicles: [
        completeVehicle,
        { ...completeVehicle, placa: 'SYN107' },
        { ...completeVehicle, placa: 'SYN108' },
        { ...completeVehicle, placa: 'SYN109' },
        { placa: 'SYN110', marca: 'Toyota' },
      ],
    });

    expect(result).toMatchObject({
      total: 5,
      complete: 4,
      incomplete: 1,
      percentage: 80,
      status: 'amarillo',
    });
  });

  it('evalua documentos genericos segun su tipo', () => {
    const result = calculateOperationalCompletenessMetric({
      documents: [
        { tipo: 'SOAT', ...completeSoat },
        { type: 'RTM', ...completeRtm },
        { grupo: 'Licencia', ...completeConductor },
        { documentType: 'Tecnómecanica', ...completeRtm },
        { tipo: 'Permiso especial', placa: 'SYN106', fechaVencimiento: '2026-12-31' },
      ],
    });

    expect(result).toMatchObject({
      total: 5,
      complete: 5,
      incomplete: 0,
      status: 'verde',
    });
  });

  it('evalua documentos desde la clave documentos', () => {
    const result = calculateOperationalCompletenessMetric({
      documentos: [
        { tipo: 'Permiso especial', conductorId: 'driver-1', fechaVencimiento: '2026-12-31' },
        { tipo: 'Permiso especial', placa: 'SYN106' },
      ],
    });

    expect(result).toMatchObject({
      total: 2,
      complete: 1,
      incomplete: 1,
      percentage: 50,
      status: 'rojo',
    });
  });
});

describe('calculateAlertCriticalityMetric', () => {
  it('retorna estado neutral cuando no hay alertas', () => {
    const result = calculateAlertCriticalityMetric();

    expect(result).toMatchObject({
      value: 0,
      percentage: 0,
      total: 0,
      critical: 0,
      preventive: 0,
      status: 'neutral',
    });
    expect(result.interpretation).toContain('Sin alertas activas');
  });

  it('calcula alertas criticas frente al total', () => {
    const result = calculateAlertCriticalityMetric([
      { prioridad: 'rojo' },
      { status: 'critical' },
      { estado: 'danger' },
      { prioridad: 'amarillo' },
    ]);

    expect(result).toMatchObject({
      total: 4,
      critical: 3,
      preventive: 1,
      percentage: 75,
      status: 'rojo',
    });
    expect(result.interpretation).toContain('3 de 4');
  });

  it('calcula alertas preventivas sin marcarlas como criticas', () => {
    const result = calculateAlertCriticalityMetric([
      { prioridad: 'amarillo' },
      { status: 'warning' },
      { prioridad: 'verde' },
    ]);

    expect(result).toMatchObject({
      total: 3,
      critical: 0,
      preventive: 2,
      percentage: 0,
      status: 'verde',
    });
    expect(result.interpretation).toContain('No hay alertas criticas');
  });

  it('maneja mezcla de estados criticos, preventivos y neutrales', () => {
    const result = calculateAlertCriticalityMetric([
      { severity: 'critical' },
      { status: 'warning' },
      { estado: 'por vencer' },
      { prioridad: 'verde' },
      { state: 'informativa' },
    ]);

    expect(result).toMatchObject({
      total: 5,
      critical: 1,
      preventive: 2,
      percentage: 20,
      status: 'amarillo',
    });
  });

  it('usa severidad, estado, tipo o prioridad cuando contienen estados reales', () => {
    const result = calculateAlertCriticalityMetric([
      { prioridad: 'sin clasificar', severity: 'critical' },
      { estado: 'warning' },
      { tipo: 'danger' },
      { prioridad: 'verde' },
    ]);

    expect(result).toMatchObject({
      total: 4,
      critical: 2,
      preventive: 1,
      percentage: 50,
      status: 'rojo',
    });
  });

  it('mantiene estados desconocidos como neutrales para criticidad', () => {
    const result = calculateAlertCriticalityMetric([
      { prioridad: 'informativa' },
      { severity: 'baja' },
      { tipo: 'Documento Faltante' },
    ]);

    expect(result).toMatchObject({
      total: 3,
      critical: 0,
      preventive: 0,
      percentage: 0,
      status: 'verde',
    });
  });
});

describe('buildQualityMetricsSummary', () => {
  it('retorna exactamente tres metricas', () => {
    const result = buildQualityMetricsSummary(
      {
        vehicles: [completeVehicle],
        conductors: [completeConductor],
        soats: [{ ...completeSoat, estado: 'verde' }],
        rtms: [{ ...completeRtm, estado: 'verde' }],
        alerts: [{ prioridad: 'amarillo' }],
      },
      { baseDate: BASE_DATE }
    );

    expect(result).toHaveLength(3);
    expect(result.map((metric) => metric.id)).toEqual([
      'document-risk',
      'operational-completeness',
      'alert-criticality',
    ]);
  });

  it('maneja datos undefined y null', () => {
    const fromUndefined = buildQualityMetricsSummary(undefined, { baseDate: BASE_DATE });
    const fromNull = buildQualityMetricsSummary(null, { baseDate: BASE_DATE });

    expect(fromUndefined).toHaveLength(3);
    expect(fromNull).toHaveLength(3);
    expect(fromUndefined.every((metric) => metric.status === 'neutral')).toBe(true);
    expect(fromNull.every((metric) => metric.status === 'neutral')).toBe(true);
  });

  it('respeta la estructura esperada para renderizado', () => {
    const result = buildQualityMetricsSummary(
      {
        vehicles: [completeVehicle],
        soats: [{ ...completeSoat, estado: 'verde' }],
        alertas: [{ estado: 'warning' }],
      },
      { baseDate: BASE_DATE }
    );

    result.forEach((metric) => expectMetricRenderShape(metric));
  });

  it.each([
    ['solo vehicles', { vehicles: [completeVehicle] }],
    ['solo conductors', { conductors: [completeConductor] }],
    ['solo alerts', { alerts: [{ prioridad: 'critical' }] }],
  ])('construye resumen con datos parciales: %s', (_caseName, data) => {
    const result = buildQualityMetricsSummary(data, { baseDate: BASE_DATE });

    expect(result).toHaveLength(3);
    result.forEach(expectMetricRenderShape);
  });
});
