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

});