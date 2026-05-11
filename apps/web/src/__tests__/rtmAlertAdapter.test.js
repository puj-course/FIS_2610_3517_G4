import { describe, expect, it } from 'vitest';
import RtmAlertAdapter from '../patterns/adapters/RtmAlertAdapter.js';

describe('RtmAlertAdapter - validacion de vigencia RTM', () => {
  const adapter = new RtmAlertAdapter();

  it('CP-RTM-01 RTM vigente no genera alerta', () => {
    const result = adapter.adapt({
      id: 1,
      placaVehiculo: 'SYN101',
      estado: 'verde',
      diasRestantes: 60,
    });

    expect(result).toBeNull();
  });

  it('CP-RTM-02 RTM vencida genera alerta roja con placa del vehiculo', () => {
    const result = adapter.adapt({
      id: 2,
      vehiculoId: '665200000000000000000006',
      placaVehiculo: 'SYN106',
      estado: 'rojo',
      diasRestantes: -3,
      fechaVencimiento: '2025-11-10',
    });

    expect(result).toMatchObject({
      id: 'rtm-2',
      tipo: 'RTM',
      categoria: 'vehiculos',
      grupo: 'RTM',
      entidad: 'Vehiculo SYN106',
      mensaje: 'Tecnomecanica Vencida',
      diasRestantes: -3,
      fechaVencimiento: '2025-11-10',
      prioridad: 'rojo',
    });
    expect(Number.isNaN(Date.parse(result.fecha))).toBe(false);
  });

  it('CP-RTM-03 RTM sin placa visible mantiene alerta con fallback', () => {
    const result = adapter.adapt({
      id: 3,
      vehiculoId: '665200000000000000000099',
      placaVehiculo: 'Vehiculo no encontrado',
      estado: 'amarillo',
      diasRestantes: 5,
    });

    expect(result).toMatchObject({
      id: 'rtm-3',
      entidad: 'Vehiculo no encontrado',
      mensaje: 'Tecnomecanica Proxima a Vencer',
      prioridad: 'amarillo',
      diasRestantes: 5,
    });
  });
});
