/**
 * Pruebas unitarias para el adaptador de alertas de Tecnomecánica.
 *
 * Autor: Sebastian Rodríguez Ramirez (@juserora)
 * Funcionalidad: RTM / Revisión Técnico-Mecánica
 * Archivo probado: src/patterns/adapters/RtmAlertAdapter.js
 */

import { describe, expect, test } from 'vitest';
import RtmAlertAdapter from '../patterns/adapters/RtmAlertAdapter.js';

const adapter = new RtmAlertAdapter();

// CP-SRR-01: Normal — RTM vigente no genera alerta
describe('CP-SRR-01 | RTM vigente mantiene estado correcto', () => {
  test('RTM con estado verde debe retornar null (sin alerta)', () => {
    const rtm = {
      id: 'rtm-001',
      vehiculoId: 'veh-001',
      estado: 'verde',
      diasRestantes: 60,
    };
    const result = adapter.adapt(rtm);
    expect(result).toBeNull();
  });
});

// CP-SRR-02: Negativo — RTM vencida genera alerta critica
describe('CP-SRR-02 | RTM vencida genera alerta critica', () => {
  test('RTM con estado rojo genera alerta con prioridad rojo y mensaje correcto', () => {
    const rtm = {
      id: 'rtm-002',
      vehiculoId: 'veh-002',
      estado: 'rojo',
      diasRestantes: -15,
    };
    const result = adapter.adapt(rtm);
    expect(result).not.toBeNull();
    expect(result.prioridad).toBe('rojo');
    expect(result.tipo).toBe('RTM');
    expect(result.mensaje).toBe('RTM vencida');
    expect(result.diasRestantes).toBe(-15);
  });
});

// CP-SRR-03: Negativo — RTM sin datos no rompe el sistema
describe('CP-SRR-03 | RTM sin datos genera estado incompleto o invalido', () => {
  test('adaptMany con lista vacia retorna array vacio sin lanzar error', () => {
    expect(() => adapter.adaptMany([])).not.toThrow();
    expect(adapter.adaptMany([])).toEqual([]);
  });

  test('adaptMany filtra todos los verdes correctamente', () => {
    const rtms = [
      { id: 'r1', vehiculoId: 'v1', estado: 'verde', diasRestantes: 60 },
      { id: 'r2', vehiculoId: 'v2', estado: 'verde', diasRestantes: 200 },
    ];
    expect(adapter.adaptMany(rtms)).toHaveLength(0);
  });
});

// CP-SRR-04: Borde — RTM vence exactamente hoy
describe('CP-SRR-04 | RTM vence exactamente hoy', () => {
  test('diasRestantes=0 con estado amarillo debe generar alerta amarilla', () => {
    const rtm = {
      id: 'rtm-004',
      vehiculoId: 'veh-004',
      estado: 'amarillo',
      diasRestantes: 0,
    };
    const result = adapter.adapt(rtm);
    expect(result).not.toBeNull();
    expect(result.prioridad).toBe('amarillo');
    expect(result.diasRestantes).toBe(0);
    expect(result.mensaje).toBe('RTM proxima a vencer');
  });
});

// CP-SRR-05: Borde — RTM vence cerca del limite
describe('CP-SRR-05 | RTM vence cerca del limite definido', () => {
  test('estado amarillo conserva diasRestantes y genera entidad correcta', () => {
    const rtm = {
      id: 'rtm-005',
      vehiculoId: 'veh-005',
      estado: 'amarillo',
      diasRestantes: 14,
    };
    const result = adapter.adapt(rtm);
    expect(result.diasRestantes).toBe(14);
    expect(result.prioridad).toBe('amarillo');
    expect(result.entidad).toBe('Vehiculo no encontrado');
  });

  test('adaptMany retorna solo rojos y amarillos, descarta verdes', () => {
    const rtms = [
      { id: 'r1', vehiculoId: 'v1', estado: 'verde',    diasRestantes: 60 },
      { id: 'r2', vehiculoId: 'v2', estado: 'amarillo', diasRestantes: 10 },
      { id: 'r3', vehiculoId: 'v3', estado: 'rojo',     diasRestantes: -5 },
    ];
    const alerts = adapter.adaptMany(rtms);
    expect(alerts).toHaveLength(2);
    expect(alerts.some(a => a.prioridad === 'amarillo')).toBe(true);
    expect(alerts.some(a => a.prioridad === 'rojo')).toBe(true);
  });
});
