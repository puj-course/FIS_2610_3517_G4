import { describe, expect, it } from 'vitest';
import {
  calculateDaysRemaining,
  calculateDocumentState,
  getWorstState,
} from '../utils/dateUtils.js';

describe('dateUtils - validacion de fechas y estados documentales', () => {
  it('CP-SRM-01 calcula los dias restantes para una fecha futura valida', () => {
    const result = calculateDaysRemaining('2026-05-10', '2026-05-01');

    expect(result).toBe(9);
  });

  it('CP-SRM-02 retorna estado rojo cuando la fecha del documento esta vacia', () => {
    const daysRemaining = calculateDaysRemaining('', '2026-05-01');
    const state = calculateDocumentState(daysRemaining);

    expect(daysRemaining).toBe(-999);
    expect(state).toBe('rojo');
  });

  it('CP-SRM-03 retorna estado rojo cuando la fecha del documento es invalida', () => {
    const daysRemaining = calculateDaysRemaining('fecha-invalida', '2026-05-01');
    const state = calculateDocumentState(daysRemaining);

    expect(daysRemaining).toBe(-999);
    expect(state).toBe('rojo');
  });

  it('CP-SRM-04 clasifica como amarillo un documento que vence exactamente hoy', () => {
    const daysRemaining = calculateDaysRemaining('2026-05-01', '2026-05-01');
    const state = calculateDocumentState(daysRemaining);

    expect(daysRemaining).toBe(0);
    expect(state).toBe('amarillo');
  });

  it('CP-SRM-05 clasifica como amarillo un documento en el limite de alerta', () => {
    const daysRemaining = calculateDaysRemaining('2026-05-16', '2026-05-01');
    const state = calculateDocumentState(daysRemaining, 15);

    expect(daysRemaining).toBe(15);
    expect(state).toBe('amarillo');
  });

  it('CP-SRM-06 obtiene el peor estado documental entre dos documentos', () => {
    const result = getWorstState('verde', 'rojo');

    expect(result).toBe('rojo');
  });
    it('CP-SRM-07 obtiene el peor estado cuando el segundo estado es mas critico', () => {
    const result = getWorstState('verde', 'amarillo');

    expect(result).toBe('amarillo');
  });
});