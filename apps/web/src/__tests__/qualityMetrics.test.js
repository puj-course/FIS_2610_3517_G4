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

describe('qualityMetrics - metricas propias de calidad Sprint 13', () => {
  it('maneja ausencia de datos sin romper', () => {
    const documentRisk = calculateDocumentRiskMetric({}, { baseDate: BASE_DATE });
    const completeness = calculateOperationalCompletenessMetric({});
    const criticality = calculateAlertCriticalityMetric();

    expect(documentRisk).toMatchObject({
      value: 0,
      percentage: 0,
      total: 0,
      affected: 0,
      status: 'neutral',
    });
    expect(documentRisk.interpretation).toContain('Sin documentos evaluables');

    expect(completeness).toMatchObject({
      value: 0,
      percentage: 0,
      total: 0,
      complete: 0,
      incomplete: 0,
      status: 'neutral',
    });
    expect(completeness.interpretation).toContain('Sin registros operativos');

    expect(criticality).toMatchObject({
      value: 0,
      percentage: 0,
      total: 0,
      critical: 0,
      preventive: 0,
      status: 'neutral',
    });
    expect(criticality.interpretation).toContain('Sin alertas activas');
  });

  it('calcula documentos vigentes con cero riesgo', () => {
    const result = calculateDocumentRiskMetric(
      {
        soats: [{ estado: 'verde' }],
        rtms: [{ fechaVencimiento: '2026-06-20' }],
        conductors: [{ diasRestantes: 20 }],
      },
      { baseDate: BASE_DATE, warningThresholdDays: 15 }
    );

    expect(result).toMatchObject({
      total: 3,
      affected: 0,
      percentage: 0,
      status: 'verde',
    });
    expect(result.interpretation).toContain('Todos los documentos evaluables');
  });

  it('calcula documentos proximos a vencer como riesgo preventivo', () => {
    const result = calculateDocumentRiskMetric(
      {
        soats: [
          { fechaFinVigencia: '2026-05-20' },
          { estado: 'verde' },
          { diasRestantes: 45 },
          { status: 'vigente' },
        ],
      },
      { baseDate: BASE_DATE, warningThresholdDays: 15 }
    );

    expect(result).toMatchObject({
      total: 4,
      affected: 1,
      percentage: 25,
      status: 'amarillo',
    });
    expect(result.interpretation).toContain('1 de 4');
  });

  it('calcula documentos vencidos como riesgo critico', () => {
    const result = calculateDocumentRiskMetric(
      {
        rtms: [
          { fechaVencimiento: '2026-05-01' },
          { estado: 'vencido' },
        ],
      },
      { baseDate: BASE_DATE }
    );

    expect(result).toMatchObject({
      total: 2,
      affected: 2,
      percentage: 100,
      status: 'rojo',
    });
    expect(result.interpretation).toContain('2 de 2');
  });

  it('identifica registros operativos completos', () => {
    const result = calculateOperationalCompletenessMetric({
      vehicles: [completeVehicle],
      conductors: [completeConductor],
      soats: [completeSoat],
      rtms: [completeRtm],
    });

    expect(result).toMatchObject({
      total: 4,
      complete: 4,
      incomplete: 0,
      percentage: 100,
      status: 'verde',
    });
    expect(result.interpretation).toContain('Todos los registros operativos');
  });

  it('identifica registros operativos incompletos', () => {
    const result = calculateOperationalCompletenessMetric({
      vehicles: [{ placa: 'ABC123', modelo: 'Hilux' }],
      conductors: [{ nombre: 'Ana Gomez', documento: '' }],
    });

    expect(result).toMatchObject({
      total: 2,
      complete: 0,
      incomplete: 2,
      percentage: 0,
      status: 'rojo',
    });
    expect(result.interpretation).toContain('2 de 2');
  });

  it('calcula alertas criticas frente al total', () => {
    const result = calculateAlertCriticalityMetric([
      { prioridad: 'rojo' },
      { status: 'critical' },
      { prioridad: 'amarillo' },
    ]);

    expect(result).toMatchObject({
      total: 3,
      critical: 2,
      preventive: 1,
      percentage: 67,
      status: 'rojo',
    });
    expect(result.interpretation).toContain('2 de 3');
  });

  it('distingue alertas preventivas sin marcarlas como criticas', () => {
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

  it('construye un resumen completo con las tres metricas', () => {
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
    result.forEach((metric) => {
      expect(metric).toHaveProperty('name');
      expect(metric).toHaveProperty('percentage');
      expect(metric).toHaveProperty('interpretation');
      expect(metric).toHaveProperty('impact');
      expect(metric).toHaveProperty('improvementAction');
    });
  });
});
