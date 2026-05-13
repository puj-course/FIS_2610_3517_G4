import { describe, expect, it } from 'vitest';
import {
  getVehicleOptionLabel,
  isDateRangeValid,
  isValidCedula,
  isValidColombianMobile,
  isValidDateValue,
  isValidDocumentCode,
  isValidPlate,
  normalizeDocumentCode,
  normalizePlate,
  sanitizeDocument,
  sanitizePhone,
  sanitizePlate,
} from '../utils/colombiaFormats.js';

describe('colombiaFormats - normalizacion y validacion', () => {
  describe('normalizePlate', () => {
    it('normaliza placas removiendo separadores y mayusculizando', () => {
      expect(normalizePlate('abc-123')).toBe('ABC123');
      expect(normalizePlate(' abc.123 ')).toBe('ABC123');
    });

    it('maneja null o undefined como string vacio', () => {
      expect(normalizePlate(null)).toBe('');
      expect(normalizePlate(undefined)).toBe('');
    });
  });

  describe('isValidPlate', () => {
    it('valida placas colombianas luego de normalizar', () => {
      expect(isValidPlate('ABC123')).toBe(true);
      expect(isValidPlate('abc-123')).toBe(true);
    });

    it('rechaza placas con patron invalido o vacias', () => {
      expect(isValidPlate('AB1234')).toBe(false);
      expect(isValidPlate('')).toBe(false);
    });
  });

  describe('normalizeDocumentCode', () => {
    it('convierte a mayusculas y elimina espacios externos', () => {
      expect(normalizeDocumentCode('  soat-ab12  ')).toBe('SOAT-AB12');
    });

    it('maneja null o undefined como string vacio', () => {
      expect(normalizeDocumentCode(null)).toBe('');
      expect(normalizeDocumentCode(undefined)).toBe('');
    });
  });

  describe('isValidDocumentCode', () => {
    it('acepta codigos alfanumericos y con guion', () => {
      expect(isValidDocumentCode('SOAT123456')).toBe(true);
      expect(isValidDocumentCode('RTM-2026-ABC')).toBe(true);
    });

    it('rechaza codigos muy cortos o con caracteres especiales', () => {
      expect(isValidDocumentCode('A12')).toBe(false);
      expect(isValidDocumentCode('SOAT#123')).toBe(false);
    });
  });

  describe('isValidCedula', () => {
    it('acepta cedulas de 10 digitos', () => {
      expect(isValidCedula('1234567890')).toBe(true);
    });

    it('rechaza cedulas incompletas, con letras o null', () => {
      expect(isValidCedula('123456789')).toBe(false);
      expect(isValidCedula('12345ABCDE')).toBe(false);
      expect(isValidCedula(null)).toBe(false);
    });
  });

  describe('isValidColombianMobile', () => {
    it('acepta celulares de 10 digitos que empiezan por 3', () => {
      expect(isValidColombianMobile('3001234567')).toBe(true);
    });

    it('rechaza celulares que no empiezan por 3, incompletos o null', () => {
      expect(isValidColombianMobile('2001234567')).toBe(false);
      expect(isValidColombianMobile('300123456')).toBe(false);
      expect(isValidColombianMobile(null)).toBe(false);
    });
  });

  describe('isValidDateValue', () => {
    it('acepta fechas validas en formato YYYY-MM-DD', () => {
      expect(isValidDateValue('2026-05-12')).toBe(true);
    });

    it('rechaza fechas por formato, calendario o valores vacios', () => {
      expect(isValidDateValue('12/05/2026')).toBe(false);
      expect(isValidDateValue('2026-02-30')).toBe(false);
      expect(isValidDateValue('2026-13-12')).toBe(false);
      expect(isValidDateValue('2026-05-32')).toBe(false);
      expect(isValidDateValue('')).toBe(false);
      expect(isValidDateValue(null)).toBe(false);
    });
  });

  describe('isDateRangeValid', () => {
    it('acepta fecha fin mayor o igual a fecha inicio', () => {
      expect(isDateRangeValid('2026-05-12', '2026-05-12')).toBe(true);
      expect(isDateRangeValid('2026-05-12', '2026-06-01')).toBe(true);
    });

    it('rechaza fecha fin menor o fechas invalidas', () => {
      expect(isDateRangeValid('2026-05-12', '2026-05-11')).toBe(false);
      expect(isDateRangeValid('2026-02-30', '2026-06-01')).toBe(false);
      expect(isDateRangeValid('2026-05-12', '2026-13-01')).toBe(false);
    });
  });
});

describe('colombiaFormats - sanitizadores y etiquetas', () => {
  it('sanitizePlate limpia caracteres especiales, mayusculiza y limita a 6 caracteres', () => {
    expect(sanitizePlate('ab*c-12345')).toBe('ABC123');
    expect(sanitizePlate(null)).toBe('');
    expect(sanitizePlate(undefined)).toBe('');
  });

  it('sanitizeDocument conserva solo digitos y limita a 10 caracteres', () => {
    expect(sanitizeDocument('a1.234-567.890xyz')).toBe('1234567890');
    expect(sanitizeDocument(null)).toBe('');
    expect(sanitizeDocument(undefined)).toBe('');
  });

  it('sanitizePhone elimina prefijo +57, espacios y guiones, y limita a 10 digitos', () => {
    expect(sanitizePhone('+57 300-123-4567')).toBe('3001234567');
    expect(sanitizePhone('300-123-4567')).toBe('3001234567');
    expect(sanitizePhone(null)).toBe('');
    expect(sanitizePhone(undefined)).toBe('');
  });

  it('getVehicleOptionLabel arma etiqueta con placa, marca, modelo y tipo', () => {
    expect(getVehicleOptionLabel({
      placa: 'ABC123',
      marca: 'Toyota',
      modelo: 'Hilux',
      tipo: 'Pickup',
    })).toBe('ABC123 · Toyota Hilux · Pickup');
  });

  it('getVehicleOptionLabel maneja vehiculo sin tipo', () => {
    expect(getVehicleOptionLabel({
      placa: 'ABC123',
      marca: 'Toyota',
      modelo: 'Hilux',
    })).toBe('ABC123 · Toyota Hilux');
  });

  it('getVehicleOptionLabel maneja vehiculo sin marca o modelo', () => {
    expect(getVehicleOptionLabel({
      placa: 'ABC123',
      tipo: 'Camion',
    })).toBe('ABC123 · Modelo no registrado · Camion');
  });

  it('getVehicleOptionLabel usa placaVehiculo cuando no hay placa', () => {
    expect(getVehicleOptionLabel({
      placaVehiculo: 'XYZ987',
      marca: 'Chevrolet',
      modelo: 'NPR',
      tipo: 'Camion',
    })).toBe('XYZ987 · Chevrolet NPR · Camion');
  });

  it('getVehicleOptionLabel usa textos por defecto con objeto vacio o null', () => {
    expect(getVehicleOptionLabel({})).toBe('Vehículo sin placa · Modelo no registrado');
    expect(getVehicleOptionLabel(null)).toBe('Vehículo sin placa · Modelo no registrado');
  });
});
