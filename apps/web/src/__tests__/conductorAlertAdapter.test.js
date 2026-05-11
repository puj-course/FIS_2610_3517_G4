import { describe, expect, it } from 'vitest';
import ConductorAlertAdapter from '../patterns/adapters/ConductorAlertAdapter.js';

describe('ConductorAlertAdapter - validacion de vigencia de licencia', () => {
  const adapter = new ConductorAlertAdapter();

  it('CP-LIC-01 licencia vigente no genera alerta', () => {
    const result = adapter.adapt({
      id: 1,
      nombre: 'Laura Perez',
      estado: 'verde',
      diasRestantes: 90,
    });

    expect(result).toBeNull();
  });

  it('CP-LIC-02 licencia vencida genera alerta roja con nombre del conductor', () => {
    const result = adapter.adapt({
      id: 2,
      nombre: 'Juan Perez',
      estado: 'rojo',
      diasRestantes: -10,
    });

    expect(result).toMatchObject({
      id: 'lic-2',
      tipo: 'Licencia',
      categoria: 'conductores',
      grupo: 'Licencias',
      entidad: 'Juan Perez',
      mensaje: 'Licencia Vencida',
      diasRestantes: -10,
      prioridad: 'rojo',
    });
    expect(Number.isNaN(Date.parse(result.fecha))).toBe(false);
  });

  it('CP-LIC-03 licencia proxima genera alerta amarilla con nombre del conductor', () => {
    const result = adapter.adapt({
      id: 3,
      nombre: 'Maria Gomez',
      estado: 'amarillo',
      diasRestantes: 8,
    });

    expect(result).toMatchObject({
      id: 'lic-3',
      entidad: 'Maria Gomez',
      mensaje: 'Licencia Proxima a Vencer',
      prioridad: 'amarillo',
      diasRestantes: 8,
    });
  });

  it('CP-LIC-04 licencia sin nombre mantiene alerta con fallback', () => {
    const result = adapter.adapt({
      id: 4,
      estado: 'rojo',
      diasRestantes: -1,
    });

    expect(result).toMatchObject({
      id: 'lic-4',
      entidad: 'Conductor no identificado',
      mensaje: 'Licencia Vencida',
      prioridad: 'rojo',
    });
  });
});
