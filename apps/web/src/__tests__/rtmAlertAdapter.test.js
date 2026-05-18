import { describe, expect, it } from 'vitest';
import RtmAlertAdapter from '../patterns/adapters/RtmAlertAdapter.js';

describe('RtmAlertAdapter - validacion tecnico mecanica', () => {
  const adapter = new RtmAlertAdapter();

  it('CP-RTM-01 RTM vigente no genera alerta', () => {
    const result = adapter.adapt({
      id: 1,
      placaVehiculo: 'SYN106',
      estado: 'verde',
      diasRestantes: 90,
    });

    expect(result).toBeNull();
  });

  it('CP-RTM-02 RTM vencida genera alerta roja con placa normalizada', () => {
    const result = adapter.adapt({
      id: 2,
      placaVehiculo: 'syn-106',
      estado: 'rojo',
      diasRestantes: -3,
      fechaVencimiento: '2026-05-01',
    });

    expect(result).toMatchObject({
      id: 'rtm-2',
      tipo: 'RTM',
      categoria: 'vehiculos',
      grupo: 'RTM',
      entidad: 'Vehiculo SYN106',
      mensaje: 'RTM vencida',
      diasRestantes: -3,
      fechaVencimiento: '2026-05-01',
      prioridad: 'rojo',
    });
    expect(Number.isNaN(Date.parse(result.fecha))).toBe(false);
  });

  it('CP-RTM-03 RTM proxima a vencer genera alerta preventiva', () => {
    const result = adapter.adapt({
      id: 3,
      vehiculoPlaca: 'ABC123',
      estado: 'amarillo',
      diasRestantes: 8,
    });

    expect(result).toMatchObject({
      id: 'rtm-3',
      entidad: 'Vehiculo ABC123',
      mensaje: 'RTM proxima a vencer',
      prioridad: 'amarillo',
      diasRestantes: 8,
      fechaVencimiento: null,
    });
  });

  it('CP-RTM-04 RTM sin placa valida mantiene fallback defendible', () => {
    const result = adapter.adapt({
      id: 4,
      placa: 'sin-placa',
      estado: 'rojo',
      diasRestantes: -999,
    });

    expect(result).toMatchObject({
      id: 'rtm-4',
      entidad: 'Vehiculo no encontrado',
      mensaje: 'RTM vencida',
      prioridad: 'rojo',
    });
  });
});
