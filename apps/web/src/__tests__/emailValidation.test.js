import { describe, expect, it } from 'vitest';
import { isValidEmailFormat } from '../utils/emailValidation.js';

describe('isValidEmailFormat', () => {
  it('acepta correos validos y aplica trim sin alterar casing requerido por el consumidor', () => {
    expect(isValidEmailFormat('admin@empresa.com')).toBe(true);
    expect(isValidEmailFormat('  Admin.User@Empresa.COM  ')).toBe(true);
  });

  it('rechaza valores vacios o nulos', () => {
    expect(isValidEmailFormat('')).toBe(false);
    expect(isValidEmailFormat('   ')).toBe(false);
    expect(isValidEmailFormat(null)).toBe(false);
    expect(isValidEmailFormat(undefined)).toBe(false);
  });

  it('rechaza correos con multiples arrobas o sin dominio completo', () => {
    expect(isValidEmailFormat('admin@@empresa.com')).toBe(false);
    expect(isValidEmailFormat('admin@empresa')).toBe(false);
    expect(isValidEmailFormat('@empresa.com')).toBe(false);
    expect(isValidEmailFormat('admin@')).toBe(false);
    expect(isValidEmailFormat('admin user@empresa.com')).toBe(false);
  });

  it('rechaza dominios con punto inicial, final o labels vacios', () => {
    expect(isValidEmailFormat('admin@.empresa.com')).toBe(false);
    expect(isValidEmailFormat('admin@empresa.com.')).toBe(false);
    expect(isValidEmailFormat('admin@empresa..com')).toBe(false);
  });

  it('rechaza local, email o labels de dominio demasiado largos', () => {
    const longLocal = 'a'.repeat(65);
    const longLabel = 'b'.repeat(64);
    const longDomain = `${'c'.repeat(250)}.com`;

    expect(isValidEmailFormat(`${longLocal}@empresa.com`)).toBe(false);
    expect(isValidEmailFormat(`admin@${longLabel}.com`)).toBe(false);
    expect(isValidEmailFormat(`admin@${longDomain}`)).toBe(false);
  });

  it('rechaza emails con longitud total mayor a 254 caracteres', () => {
    const local = 'a'.repeat(64);
    const label = 'b'.repeat(63);
    const email = `${local}@${label}.${label}.${label}.${label}.com`;

    expect(email.length).toBeGreaterThan(254);
    expect(isValidEmailFormat(email)).toBe(false);
  });
});
