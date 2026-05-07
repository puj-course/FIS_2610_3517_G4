const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const {
  DEFAULT_MONGO_DB_NAME,
  DEFAULT_MONGO_HOST,
  buildMongoUri,
  getMongoConfigErrors,
  redactMongoUri,
} = require('../config/mongo');

const backendDir = path.resolve(__dirname, '..');
const envPath = path.join(backendDir, '.env');

if (!fs.existsSync(envPath)) {
  console.error('[ENV] Falta backend/.env. Crea el archivo con MONGO_URI o con MONGO_USER/MONGO_PASSWORD.');
  process.exit(1);
}

const env = dotenv.parse(fs.readFileSync(envPath));
const mongoErrors = getMongoConfigErrors(env);
if (mongoErrors.length > 0) {
  console.error(
    `[ENV] Configuracion Mongo invalida. Usa MONGO_URI o define MONGO_USER/MONGO_PASSWORD para ${DEFAULT_MONGO_HOST}/${DEFAULT_MONGO_DB_NAME}.`
  );
  process.exit(1);
}

const mongoUri = buildMongoUri(env);
console.log(`[ENV] backend/.env validado. MONGO_URI=${redactMongoUri(mongoUri)}`);
