const fs = require('fs');
const {
  DEFAULT_MONGO_DB_NAME,
  DEFAULT_MONGO_HOST,
  buildMongoUri,
  getMongoConfigErrors,
  redactMongoUri,
} = require('../config/mongo');
const {
  appsWebEnvPath,
  backendEnvPath,
  loadProjectEnv,
  rootEnvPath,
} = require('../config/load-env');

// El script falla temprano si no existe ningún archivo de entorno conocido.
if (!fs.existsSync(backendEnvPath) && !fs.existsSync(rootEnvPath) && !fs.existsSync(appsWebEnvPath)) {
  console.error('[ENV] Falta configuracion. Crea backend/.env, apps/web/.env o .env en la raiz con MONGO_URI o con MONGO_USER/MONGO_PASSWORD.');
  process.exit(1);
}

// Carga variables siguiendo la misma estrategia que usa el servidor.
const loadedEnvSources = loadProjectEnv();
const mongoErrors = getMongoConfigErrors(process.env);
if (mongoErrors.length > 0) {
  console.error(
    `[ENV] Configuracion Mongo invalida. Usa MONGO_URI o define MONGO_USER/MONGO_PASSWORD para ${DEFAULT_MONGO_HOST}/${DEFAULT_MONGO_DB_NAME}.`
  );
  process.exit(1);
}

// Se imprime la URI redactada para confirmar el destino sin exponer secretos.
const mongoUri = buildMongoUri(process.env);
console.log(`[ENV] Configuracion validada desde ${loadedEnvSources.join(', ')}. MONGO_URI=${redactMongoUri(mongoUri)}`);
