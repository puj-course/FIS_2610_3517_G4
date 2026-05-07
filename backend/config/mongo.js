const DEFAULT_MONGO_PROTOCOL = 'mongodb+srv';
const DEFAULT_MONGO_HOST = 'cluster0.45cqzzh.mongodb.net';
const DEFAULT_MONGO_DB_NAME = 'logistica_db';
const DEFAULT_MONGO_OPTIONS = 'retryWrites=true&w=majority&authSource=admin';

const normalizeText = (value) => String(value ?? '').trim();

const hasPlaceholderValue = (value = '') => {
  const normalized = normalizeText(value);
  return normalized.includes('<') || normalized.includes('>');
};

const redactMongoUri = (value = '') => {
  const mongoUri = String(value);

  try {
    const parsedUri = new URL(mongoUri);
    if (parsedUri.username) parsedUri.username = '***';
    if (parsedUri.password) parsedUri.password = '***';
    return parsedUri.toString();
  } catch {
    return mongoUri.replace(/\/\/([^@/]+)@/, '//***:***@');
  }
};

const buildMongoUri = (env = process.env) => {
  const explicitUri = normalizeText(env.MONGO_URI);
  if (explicitUri) {
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
      ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}@`
      : '';

  const baseUri = `${protocol}://${credentials}${host}/${dbName}`;
  return options ? `${baseUri}?${options}` : baseUri;
};

const getMongoConfigErrors = (env = process.env) => {
  const explicitUri = normalizeText(env.MONGO_URI);

  if (explicitUri) {
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
