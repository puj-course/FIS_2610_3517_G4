export const PLATE_REGEX = /^[A-Z]{3}[0-9]{3}$/;
export const CEDULA_REGEX = /^[0-9]{10}$/;
export const COLOMBIAN_MOBILE_REGEX = /^3[0-9]{9}$/;
export const DOCUMENT_CODE_REGEX = /^[A-Z0-9-]{6,30}$/;

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
