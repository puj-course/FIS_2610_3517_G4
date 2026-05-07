import { describe, expect, it } from 'vitest';
import SoatAlertAdapter from '../patterns/adapters/SoatAlertAdapter.js';

describe('SoatAlertAdapter - validacion de vigencia SOAT', () => {
  const adapter = new SoatAlertAdapter();

  it('CP-SF-01 SOAT vigente no genera alerta critica', () => {
    const result = adapter.adapt({
      id: 1,
      vehiculoId: 'ABC123',
      estado: 'verde',
      diasRestantes: 45,
    });

    expect(result).toBeNull();
  });

  it('CP-SF-02 SOAT vencido genera alerta roja', () => {
    const result = adapter.adapt({
      id: 2,
      vehiculoId: 'XYZ987',
      estado: 'rojo',
      diasRestantes: -1,
    });

    expect(result).toMatchObject({
      id: 'soat-2',
      tipo: 'SOAT',
      entidad: 'Vehículo XYZ987',
      mensaje: 'SOAT Vencido',
      diasRestantes: -1,
      prioridad: 'rojo',
    });
    expect(Number.isNaN(Date.parse(result.fecha))).toBe(false);
  });

  it('CP-SF-03 SOAT sin fecha genera estado invalido o alerta de vencido', () => {
    const result = adapter.adapt({
      id: 3,
      vehiculoId: 'JKL456',
      estado: 'rojo',
      diasRestantes: -999,
    });

    expect(result).toMatchObject({
      id: 'soat-3',
      mensaje: 'SOAT Vencido',
      prioridad: 'rojo',
      diasRestantes: -999,
    });
  });

  it('CP-SF-04 SOAT vence hoy', () => {
    const result = adapter.adapt({
      id: 4,
      vehiculoId: 'MNO321',
      estado: 'amarillo',
      diasRestantes: 0,
    });

    expect(result).toMatchObject({
      id: 'soat-4',
      mensaje: 'SOAT Próximo a Vencer',
      prioridad: 'amarillo',
      diasRestantes: 0,
    });
  });

  it('CP-SF-05 SOAT vence dentro del rango de advertencia', () => {
    const result = adapter.adapt({
      id: 5,
      vehiculoId: 'QRS654',
      estado: 'amarillo',
      diasRestantes: 5,
    });

    expect(result).toMatchObject({
      id: 'soat-5',
      mensaje: 'SOAT Próximo a Vencer',
      prioridad: 'amarillo',
      diasRestantes: 5,
    });
  });
});