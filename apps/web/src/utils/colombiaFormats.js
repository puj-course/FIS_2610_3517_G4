export const PLATE_REGEX = /^[A-Z]{3}\d{3}$/;
export const CEDULA_REGEX = /^\d{10}$/;
export const COLOMBIAN_MOBILE_REGEX = /^3\d{9}$/;
export const DOCUMENT_CODE_REGEX = /^[A-Z\d-]{6,30}$/;

export const normalizePlate = (value) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s.-]+/g, '');

export const isValidPlate = (value) => PLATE_REGEX.test(normalizePlate(value));

export const normalizeDocumentCode = (value) =>
  String(value ?? '').trim().toUpperCase();

export const isValidDocumentCode = (value) =>
  DOCUMENT_CODE_REGEX.test(normalizeDocumentCode(value));

export const isValidCedula = (value) =>
  CEDULA_REGEX.test(String(value ?? '').trim());

export const isValidColombianMobile = (value) =>
  COLOMBIAN_MOBILE_REGEX.test(String(value ?? '').trim());

export const isValidDateValue = (value) => {
  const dateText = String(value ?? '').trim();
  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() === Number(month) - 1 &&
    parsed.getDate() === Number(day)
  );
};

export const isDateRangeValid = (startDate, endDate) => {
  if (!isValidDateValue(startDate) || !isValidDateValue(endDate)) return false;
  return new Date(endDate).getTime() >= new Date(startDate).getTime();
};

/**
 * Sanitizadores para usar en onChange de inputs
 * Permiten escribir limpieza en tiempo real mientras el usuario digita
 */

/**
 * Sanitiza placa: limpia caracteres especiales, convierte a mayúsculas y limita a 6 caracteres
 * Uso: onChange={(e) => setPlaca(sanitizePlate(e.target.value))}
 * Resultado: "abc-123" => "ABC123", "jdu230312312" => "JDU230"
 */
export const sanitizePlate = (value) => {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^A-Z\d]/g, '')
    .slice(0, 6);
};

/**
 * Sanitiza documento/cédula: solo números y máximo 10 dígitos
 * Uso: onChange={(e) => setDocumento(sanitizeDocument(e.target.value))}
 * Resultado: "a213213123213213123213" => "2132131232", "1.234.567.890" => "1234567890"
 */
export const sanitizeDocument = (value) => {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, 10);
};

/**
 * Sanitiza teléfono: solo números y máximo 10 dígitos
 * Uso: onChange={(e) => setTelefono(sanitizePhone(e.target.value))}
 * Resultado: "+573001234567" => "3001234567", "300-123-4567" => "3001234567"
 */
export const sanitizePhone = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '');

  return digits
    .replace(/^57(?=3\d{9})/, '')
    .slice(0, 10);
};

/**
 * Helper para generar etiqueta de vehículo asignado en select
 * Formato: "ABC123 · Toyota Hilux" o "ABC123 · Toyota Hilux · Van de soporte"
 * Uso: <option>{getVehicleOptionLabel(vehicle)}</option>
 */
export const getVehicleOptionLabel = (vehicle) => {
  const placa = vehicle?.placa || vehicle?.placaVehiculo || 'Vehículo sin placa';
  const marca = vehicle?.marca || '';
  const modelo = vehicle?.modelo || '';
  const tipo = vehicle?.tipo || '';
  
  const marcaModelo = [marca, modelo]
    .filter(Boolean)
    .join(' ');
  
  const partes = [
    placa,
    marcaModelo || 'Modelo no registrado',
    tipo
  ].filter(Boolean);
  
  return partes.join(' · ');
};
