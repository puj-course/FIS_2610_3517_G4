import { describe, expect, it } from 'vitest';
import {
  buildQualityMetricsSummary,
  calculateAlertCriticalityMetric,
  calculateDocumentRiskMetric,
  calculateOperationalCompletenessMetric,
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

    result.forEach(expectMetricRenderShape);
  });
});
