import { describe, it, expect } from 'vitest';
import { useRUNTSimulator } from '../hooks/useRUNTSimulator.js';

describe('useRUNTSimulator - Pruebas de validación RUNT', () => {

  // CP-SL-01: Normal
  it('CP-SL-01: placa válida existente retorna datos del vehículo', () => {
    // Arrange
    const { searchByPlaca } = useRUNTSimulator();
    const placa = 'ABC-123';

    // Act
    const resultado = searchByPlaca(placa);

    // Assert
    expect(resultado.encontrado).toBe(true);
    expect(resultado.data.placa).toBe('ABC-123');
    expect(resultado.data.marca).toBe('Volkswagen');
  });

  // CP-SL-02: Negativa - placa inexistente
  it('CP-SL-02: placa inexistente retorna encontrado false con mensaje de error', () => {
    // Arrange
    const { searchByPlaca } = useRUNTSimulator();
    const placa = 'ZZZ-999';

    // Act
    const resultado = searchByPlaca(placa);

    // Assert
    expect(resultado.encontrado).toBe(false);
    expect(resultado.error).toBe('Vehículo no encontrado en RUNT');
  });

  // CP-SL-03: Negativa - placa vacía
  it('CP-SL-03: placa vacía retorna error de validación', () => {
    // Arrange
    const { searchByPlaca } = useRUNTSimulator();
    const placa = '';

    // Act
    const resultado = searchByPlaca(placa);

    // Assert
    expect(resultado.encontrado).toBe(false);
    expect(resultado.error).toBe('Placa vacía');
  });

  // CP-SL-04: Borde - placa en minúscula se normaliza
  it('CP-SL-04: placa en minúscula se normaliza y encuentra el vehículo correctamente', () => {
    // Arrange
    const { searchByPlaca } = useRUNTSimulator();
    const placa = 'abc-123'; // minúscula

    // Act
    const resultado = searchByPlaca(placa);

    // Assert
    expect(resultado.encontrado).toBe(true);
    expect(resultado.data.placa).toBe('ABC-123');
  });

  // CP-SL-05: Borde - VIN con formato inválido (menos de 17 caracteres)
  it('CP-SL-05: VIN con formato inválido retorna error por longitud incorrecta', () => {
    // Arrange
    const { searchByVIN } = useRUNTSimulator();
    const vin = '1234'; // solo 4 caracteres, debe tener 17

    // Act
    const resultado = searchByVIN(vin);

    // Assert
    expect(resultado.encontrado).toBe(false);
    expect(resultado.error).toBe('VIN debe tener 17 caracteres');
  });

  it('CP-SL-06: VIN vacío retorna error de validación', () => {
    const { searchByVIN } = useRUNTSimulator();

    const resultado = searchByVIN('   ');

    expect(resultado.encontrado).toBe(false);
    expect(resultado.error).toBe('VIN vacío');
  });

  it('CP-SL-07: VIN existente retorna vehículo con SOAT y RTM', () => {
    const { searchByVIN } = useRUNTSimulator();

    const resultado = searchByVIN('WVWZZZ3CZ9E123456');

    expect(resultado.encontrado).toBe(true);
    expect(resultado.data).toMatchObject({
      placa: 'ABC-123',
      vin: 'WVWZZZ3CZ9E123456',
      marca: 'Volkswagen',
      soat: expect.objectContaining({
        vigente: true,
        numero: 'SOAT-VW-001-2025',
        diasRestantes: expect.any(Number),
      }),
      rtm: expect.objectContaining({
        vigente: true,
        numero: 'RTM-2025-00123',
        diasRestantes: expect.any(Number),
      }),
    });
  });

  it('CP-SL-08: VIN acepta minúsculas y espacios al normalizar', () => {
    const { searchByVIN } = useRUNTSimulator();

    const resultado = searchByVIN('  cheuuzz7gh1234567  ');

    expect(resultado.encontrado).toBe(true);
    expect(resultado.data).toMatchObject({
      placa: 'XYZ-987',
      vin: 'CHEUUZZ7GH1234567',
      marca: 'Chevrolet',
      soat: expect.objectContaining({ vigente: false }),
      rtm: expect.objectContaining({ vigente: true }),
    });
  });

  it('CP-SL-09: VIN inexistente de 17 caracteres retorna vehículo no encontrado', () => {
    const { searchByVIN } = useRUNTSimulator();

    const resultado = searchByVIN('AAAAAAAAAAAAAAAAA');

    expect(resultado.encontrado).toBe(false);
    expect(resultado.error).toBe('Vehículo no encontrado en RUNT');
  });

  it('CP-SL-10: getAllVehiculos retorna arreglo con vehículos resumidos', () => {
    const { getAllVehiculos } = useRUNTSimulator();

    const vehiculos = getAllVehiculos();

    expect(Array.isArray(vehiculos)).toBe(true);
    expect(vehiculos.length).toBeGreaterThan(0);
    expect(vehiculos[0]).toEqual({
      placa: 'ABC-123',
      marca: 'Volkswagen',
      modelo: '2022',
      soatVigente: true,
      rtmVigente: true,
    });
  });

  it('CP-SL-11: getAllVehiculos expone campos resumidos esperados para cada vehículo', () => {
    const { getAllVehiculos } = useRUNTSimulator();

    const vehiculos = getAllVehiculos();

    vehiculos.forEach((vehiculo) => {
      expect(vehiculo).toEqual({
        placa: expect.any(String),
        marca: expect.any(String),
        modelo: expect.any(String),
        soatVigente: expect.any(Boolean),
        rtmVigente: expect.any(Boolean),
      });
    });
  });

});
