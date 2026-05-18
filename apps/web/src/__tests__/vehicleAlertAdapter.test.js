import { describe, expect, it } from 'vitest';
import VehicleAlertAdapter from '../patterns/adapters/VehicleAlertAdapter.js';

describe('VehicleAlertAdapter - brechas estructurales del vehiculo', () => {
  const adapter = new VehicleAlertAdapter();

  it('CP-VH-01 vehiculo completo no genera alertas estructurales', () => {
    const result = adapter.adapt({
      id: 'veh-1',
      placa: 'SYN106',
      conductorId: 'cond-1',
      soat: { id: 'soat-1' },
      rtm: { id: 'rtm-1' },
    });

    expect(result).toEqual([]);
  });

  it('CP-VH-02 vehiculo sin conductor, SOAT ni RTM genera tres alertas rojas', () => {
    const result = adapter.adapt({
      id: 'veh-2',
      placa: 'ABC123',
    });

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      expect.objectContaining({
        id: 'missing-cond-veh-2',
        tipo: 'Asignacion',
        categoria: 'conductores',
        grupo: 'Licencias',
        entidad: 'Vehiculo ABC123',
        mensaje: 'Sin conductor asignado',
        prioridad: 'rojo',
        diasRestantes: 0,
      }),
      expect.objectContaining({
        id: 'missing-soat-veh-2',
        tipo: 'Documento Faltante',
        categoria: 'vehiculos',
        grupo: 'SOAT',
        mensaje: 'Sin SOAT registrado',
        prioridad: 'rojo',
      }),
      expect.objectContaining({
        id: 'missing-rtm-veh-2',
        tipo: 'Documento Faltante',
        categoria: 'vehiculos',
        grupo: 'RTM',
        mensaje: 'Sin RTM registrada',
        prioridad: 'rojo',
      }),
    ]);
    result.forEach((alert) => {
      expect(Number.isNaN(Date.parse(alert.fecha))).toBe(false);
    });
  });

  it('CP-VH-03 vehiculo con SOAT y RTM pero sin conductor solo alerta asignacion', () => {
    const result = adapter.adapt({
      id: 'veh-3',
      placa: 'QRS654',
      soat: { id: 'soat-3' },
      rtm: { id: 'rtm-3' },
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'missing-cond-veh-3',
      entidad: 'Vehiculo QRS654',
      mensaje: 'Sin conductor asignado',
      prioridad: 'rojo',
    });
  });

  it('CP-VH-04 adaptMany aplana alertas de multiples vehiculos', () => {
    const result = adapter.adaptMany([
      {
        id: 'veh-ok',
        placa: 'OKA123',
        conductorId: 'cond-ok',
        soat: { id: 'soat-ok' },
        rtm: { id: 'rtm-ok' },
      },
      {
        id: 'veh-risk',
        placa: 'BAD123',
        conductorId: 'cond-risk',
        soat: { id: 'soat-risk' },
      },
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        id: 'missing-rtm-veh-risk',
        entidad: 'Vehiculo BAD123',
        grupo: 'RTM',
      }),
    ]);
  });
});
