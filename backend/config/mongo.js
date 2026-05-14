const DEFAULT_MONGO_PROTOCOL = 'mongodb+srv';
const DEFAULT_MONGO_HOST = 'cluster0.45cqzzh.mongodb.net';
const DEFAULT_MONGO_DB_NAME = 'logistica_db';
const DEFAULT_MONGO_OPTIONS = 'retryWrites=true&w=majority&authSource=admin';

// Normaliza strings de entorno y evita nulos/undefined en toda la composición de URI.
const normalizeText = (value) => String(value ?? '').trim();

const hasPlaceholderValue = (value = '') => {
  // Detecta valores tipo <usuario> o <password> que aún no fueron reemplazados.
  const normalized = normalizeText(value);
  return normalized.includes('<') || normalized.includes('>');
};

const redactMongoUri = (value = '') => {
  const mongoUri = String(value);

  try {
    // Si la URI es válida, usamos el parser estándar para ocultar credenciales.
    const parsedUri = new URL(mongoUri);
    if (parsedUri.username) parsedUri.username = '***';
    if (parsedUri.password) parsedUri.password = '***';
    return parsedUri.toString();
  } catch {
    // Fallback simple por regex para URIs que el parser no soporte por completo.
    return mongoUri.replace(/\/\/([^@/]+)@/, '//***:***@');
  }
};

const buildMongoUri = (env = process.env) => {
  const explicitUri = normalizeText(env.MONGO_URI);
  if (explicitUri) {
    // Si ya existe URI completa, no se reconstruye nada.
    return explicitUri;
  }

  const protocol = normalizeText(env.MONGO_PROTOCOL) || DEFAULT_MONGO_PROTOCOL;
  const host = normalizeText(env.MONGO_HOST) || DEFAULT_MONGO_HOST;
  const dbName = normalizeText(env.MONGO_DB_NAME) || DEFAULT_MONGO_DB_NAME;
  const options = normalizeText(env.MONGO_OPTIONS) || DEFAULT_MONGO_OPTIONS;
  const user = normalizeText(env.MONGO_USER);
  const password = normalizeText(env.MONGO_PASSWORD);

  const credentials =
    user && password
      // Credenciales se codifican para soportar caracteres especiales.
      ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}@`
      : '';

  const baseUri = `${protocol}://${credentials}${host}/${dbName}`;
  return options ? `${baseUri}?${options}` : baseUri;
};

const getMongoConfigErrors = (env = process.env) => {
  const explicitUri = normalizeText(env.MONGO_URI);

  if (explicitUri) {
    // Cuando hay URI explícita solo se valida forma básica y placeholders.
    if (hasPlaceholderValue(explicitUri)) {
      return ['MONGO_URI contiene placeholders'];
    }

    if (!/^mongodb(\+srv)?:\/\//.test(explicitUri)) {
      return ['MONGO_URI debe iniciar con mongodb:// o mongodb+srv://'];
    }

    return [];
  }

  const host = normalizeText(env.MONGO_HOST) || DEFAULT_MONGO_HOST;
  const dbName = normalizeText(env.MONGO_DB_NAME) || DEFAULT_MONGO_DB_NAME;
  const user = normalizeText(env.MONGO_USER);
  const password = normalizeText(env.MONGO_PASSWORD);
  const errors = [];

  // A partir de aquí validamos la configuración compuesta por partes.
  if (hasPlaceholderValue(host)) {
    errors.push('MONGO_HOST contiene placeholders');
  }

  if (!host) {
    errors.push('Falta MONGO_HOST');
  }

  if (!dbName) {
    errors.push('Falta MONGO_DB_NAME');
  }

  if (!user) {
    errors.push('Falta MONGO_USER');
  }

  if (!password) {
    errors.push('Falta MONGO_PASSWORD');
  }

  if (hasPlaceholderValue(user)) {
    errors.push('MONGO_USER contiene placeholders');
  }

  if (hasPlaceholderValue(password)) {
    errors.push('MONGO_PASSWORD contiene placeholders');
  }

  return errors;
};

module.exports = {
  DEFAULT_MONGO_PROTOCOL,
  DEFAULT_MONGO_HOST,
  DEFAULT_MONGO_DB_NAME,
  DEFAULT_MONGO_OPTIONS,
  buildMongoUri,
  getMongoConfigErrors,
  hasPlaceholderValue,
  redactMongoUri,
};
