import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  buildQualityMetricsSummary,
  getQualityMetricDefinitions,
} from '../src/utils/qualityMetrics.js';

const BASE_DATE = '2026-05-13';
const outputPath = resolve('coverage/quality-metrics-report.json');

const evidenceDataset = {
  vehicles: [
    { placa: 'SYN106', marca: 'Toyota', modelo: 'Hilux', anio: 2024, tipo: 'Pickup' },
    { placa: 'SYN107', marca: 'Renault', modelo: 'Kangoo', anio: 2022, tipo: 'Van' },
    { placa: 'SYN108', marca: 'Chevrolet', modelo: 'NHR', anio: 2021, tipo: 'Camion' },
  ],
  conductors: [
    { nombre: 'Laura Perez', documento: '1234567890', telefono: '3001234567', categoria: 'B1', fechaVencimiento: '2026-12-20' },
    { nombre: 'Andres Rojas', documento: '9876543210', telefono: '3009876543', categoria: 'C1', fechaVencimiento: '2026-05-20' },
  ],
  soats: [
    {
      vehiculoId: 'vehicle-1',
      placaVehiculo: 'SYN106',
      numeroPoliza: 'SOAT20260001',
      aseguradora: 'SURA',
      fechaInicioVigencia: '2026-01-01',
      fechaFinVigencia: '2026-12-31',
    },
    {
      vehiculoId: 'vehicle-2',
      placaVehiculo: 'SYN107',
      numeroPoliza: 'SOAT20260002',
      aseguradora: 'Bolivar',
      fechaInicioVigencia: '2025-05-01',
      fechaFinVigencia: '2026-05-18',
    },
  ],
  rtms: [
    {
      vehiculoId: 'vehicle-1',
      placaVehiculo: 'SYN106',
      numeroCertificado: 'RTM20260001',
      cda: 'CDA Bogota Norte',
      fechaExpedicion: '2026-01-01',
      fechaVencimiento: '2026-12-31',
      resultado: 'Aprobado',
    },
    {
      vehiculoId: 'vehicle-3',
      placaVehiculo: 'SYN108',
      numeroCertificado: 'RTM20250003',
      cda: 'CDA Occidente',
      fechaExpedicion: '2025-01-01',
      fechaVencimiento: '2026-05-01',
      resultado: 'Aprobado',
    },
  ],
  alerts: [
    { prioridad: 'rojo', mensaje: 'RTM vencida' },
    { prioridad: 'amarillo', mensaje: 'SOAT proximo a vencer' },
    { prioridad: 'verde', mensaje: 'Sin accion inmediata' },
  ],
};

const definitions = getQualityMetricDefinitions();
const metrics = buildQualityMetricsSummary(evidenceDataset, { baseDate: BASE_DATE });

const report = {
  generatedAt: new Date().toISOString(),
  baseDate: BASE_DATE,
  purpose: 'Evidencia reproducible de metricas propias distintas de SonarQube.',
  ownMetricsCount: metrics.length,
  sonarMetricsRequired: [
    {
      name: 'Coverage',
      source: 'SonarCloud + apps/web/coverage/lcov.info',
      interpretation: 'Mide el porcentaje de lineas de codigo ejecutadas por pruebas automatizadas.',
    },
    {
      name: 'Duplications',
      source: 'SonarCloud',
      interpretation: 'Mide bloques repetidos que aumentan costo de mantenimiento y riesgo de defectos paralelos.',
    },
    {
      name: 'Maintainability',
      source: 'SonarCloud',
      interpretation: 'Mide deuda tecnica, code smells y esfuerzo estimado para mantener el codigo.',
    },
  ],
  definitions,
  metrics,
};

if (metrics.length < 3) {
  throw new Error('La rubrica exige al menos tres metricas propias implementadas en codigo.');
}

for (const metric of metrics) {
  if (!metric.definition?.sonarEquivalent?.includes('Sonar')) {
    throw new Error(`La metrica ${metric.id} no documenta su diferencia frente a SonarQube.`);
  }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.table(metrics.map((metric) => ({
  id: metric.id,
  valor: `${metric.percentage}%`,
  estado: metric.status,
  total: metric.total,
  interpretacion: metric.interpretation,
})));
console.log(`Evidencia de metricas generada en ${outputPath}`);
