const dns = require('dns').promises;
const https = require('https');
const mongoose = require('mongoose');
const {
  DEFAULT_MONGO_DB_NAME,
  DEFAULT_MONGO_HOST,
  buildMongoUri,
  getMongoConfigErrors,
  hasPlaceholderValue,
} = require('../config/mongo');
const { loadProjectEnv } = require('../config/load-env');

const args = process.argv.slice(2);
// `--no-connect` valida config/DNS sin abrir sesión real con Mongo.
const noConnect = args.includes('--no-connect');
// `--ci` tolera placeholders para que el pipeline no necesite secretos reales.
const ciMode = args.includes('--ci');
const envFileArg = args.find((arg) => arg.startsWith('--env-file='));

const explicitEnvFile = envFileArg ? envFileArg.split('=')[1] : null;
// Reutiliza el mismo cargador de variables del backend para evitar diferencias de entorno.
const loadedEnvSources = loadProjectEnv({ explicitEnvFile });
if (loadedEnvSources.length === 0) {
  console.error('[AUTH-DOCTOR] No se encontro archivo de entorno (.env, backend/.env, apps/web/.env o backend/.env.example).');
  process.exit(1);
}

console.log(`[AUTH-DOCTOR] Variables cargadas desde ${loadedEnvSources.join(', ')}`);

// Estas claves mínimas sostienen auth, OTP y notificaciones.
const requiredKeys = ['PORT', 'EMAIL_HOST', 'EMAIL_PORT', 'OTP_EXPIRACION_MINUTOS', 'OTP_MAX_INTENTOS', 'OTP_COOLDOWN_SEGUNDOS'];
const missing = requiredKeys.filter((key) => !String(process.env[key] || '').trim());

if (missing.length > 0) {
  console.error(`[AUTH-DOCTOR] Faltan variables requeridas: ${missing.join(', ')}`);
  process.exit(1);
}

const mongoErrors = getMongoConfigErrors(process.env);
const isCiOrNoConnect = ciMode || noConnect;
// En CI se ignoran placeholders, pero no errores reales de configuración incompleta.
const nonPlaceholderMongoErrors = mongoErrors.filter((error) => !error.includes('placeholders'));

if (nonPlaceholderMongoErrors.length > 0) {
  console.error(
    `[AUTH-DOCTOR] Configuracion Mongo incompleta. Usa MONGO_URI o define MONGO_USER/MONGO_PASSWORD para ${DEFAULT_MONGO_HOST}/${DEFAULT_MONGO_DB_NAME}.`
  );
  process.exit(1);
}

const mongoUri = buildMongoUri(process.env);
const validMongoPrefix = mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://');
const isSrvUri = mongoUri.startsWith('mongodb+srv://');

if (!validMongoPrefix) {
  console.error('[AUTH-DOCTOR] La configuracion Mongo resultante debe iniciar con mongodb:// o mongodb+srv://');
  process.exit(1);
}

const getHosts = (uri) => {
  // Las URIs SRV contienen un solo host semilla; luego DNS resuelve el resto.
  if (uri.startsWith('mongodb+srv://')) {
    const withoutProtocol = uri.replace('mongodb+srv://', '');
    const afterCreds = withoutProtocol.includes('@') ? withoutProtocol.split('@')[1] : withoutProtocol;
    const host = afterCreds.split('/')[0].split('?')[0];
    return host ? [host] : [];
  }

  // Las URIs directas pueden contener varios hosts separados por coma.
  const withoutProtocol = uri.replace('mongodb://', '');
  const afterCreds = withoutProtocol.includes('@') ? withoutProtocol.split('@')[1] : withoutProtocol;
  const hostSegment = afterCreds.split('/')[0];
  return hostSegment
    .split(',')
    .map((hostPort) => hostPort.split(':')[0].trim())
    .filter(Boolean);
};

const hosts = getHosts(mongoUri);
if (hosts.length === 0) {
  console.error('[AUTH-DOCTOR] No se pudieron extraer hosts de MONGO_URI.');
  process.exit(1);
}

const hasPlaceholderHosts = hosts.some((host) => hasPlaceholderValue(host));
const hasPlaceholderCredentials =
  hasPlaceholderValue(process.env.MONGO_URI) ||
  hasPlaceholderValue(process.env.MONGO_USER) ||
  hasPlaceholderValue(process.env.MONGO_PASSWORD);

const lookupHosts = async () => {
  if (isSrvUri) {
    // Para SRV primero resolvemos `_mongodb._tcp.<host>` y luego cada target resultante.
    console.log(`[AUTH-DOCTOR] Verificando SRV de ${hosts.length} host(s)...`);
    for (const host of hosts) {
      try {
        const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${host}`);
        if (!srvRecords.length) {
          console.error(`[AUTH-DOCTOR] SRV ERROR ${host}: sin registros SRV`);
          process.exit(1);
        }

        for (const record of srvRecords) {
          const result = await dns.lookup(record.name);
          console.log(`[AUTH-DOCTOR] SRV OK ${host} -> ${record.name}:${record.port} (${result.address})`);
        }
      } catch (error) {
        console.error(`[AUTH-DOCTOR] SRV ERROR ${host}: ${error.code || error.message}`);
        if (String(error.code || '').toUpperCase() === 'ECONNREFUSED') {
          console.error('[AUTH-DOCTOR] La red local rechazo la consulta SRV de MongoDB Atlas. Usa una URI directa mongodb:// o ajusta el DNS del equipo.');
        }
        process.exit(1);
      }
    }
    return;
  }

  // En URIs directas basta con resolver cada host declarado.
  console.log(`[AUTH-DOCTOR] Verificando DNS de ${hosts.length} host(s)...`);
  for (const host of hosts) {
    try {
      const result = await dns.lookup(host);
      console.log(`[AUTH-DOCTOR] DNS OK ${host} -> ${result.address}`);
    } catch (error) {
      console.error(`[AUTH-DOCTOR] DNS ERROR ${host}: ${error.code || error.message}`);
      process.exit(1);
    }
  }
};

const getPublicIp = () =>
  new Promise((resolve) => {
    // Se usa ipify solo para ayudar al usuario a whitelistear la IP correcta en Atlas.
    const req = https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data.trim() || 'desconocida');
      });
    });

    req.on('error', () => resolve('desconocida'));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve('desconocida');
    });
  });

const testMongoConnection = async () => {
  console.log('[AUTH-DOCTOR] Probando conexion real a MongoDB Atlas...');
  try {
    // Si conecta aquí, auth y correo ya tienen la base lista para operar.
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[AUTH-DOCTOR] Conexion MongoDB OK');
    await mongoose.disconnect();
  } catch (error) {
    // El diagnóstico muestra además la IP pública para acelerar el ajuste en Network Access.
    const publicIp = await getPublicIp();
    const message = String(error?.message || '').toLowerCase();
    console.error(`[AUTH-DOCTOR] Error de conexion MongoDB: ${error.name}: ${error.message}`);
    console.error(`[AUTH-DOCTOR] IP publica detectada: ${publicIp}`);
    if (
      (String(error?.code || '').toUpperCase() === 'ECONNREFUSED' && message.includes('_mongodb._tcp')) ||
      message.includes('querysrv econnrefused') ||
      message.includes('query srv econnrefused')
    ) {
      console.error('[AUTH-DOCTOR] Accion recomendada: tu red local esta bloqueando consultas SRV. Usa una URI directa mongodb:// con los hosts del replica set o cambia el DNS de la maquina.');
    } else {
      console.error('[AUTH-DOCTOR] Accion recomendada: agrega esa IP en Atlas > Security > Network Access.');
    }
    process.exit(1);
  }
};

(async () => {
  if (hasPlaceholderHosts || hasPlaceholderCredentials) {
    // En CI/no-connect se permite seguir porque el objetivo es validar estructura, no secretos reales.
    if (isCiOrNoConnect) {
      console.log('[AUTH-DOCTOR] Se detectaron placeholders en la configuracion Mongo. Se omite DNS en modo CI/no-connect.');
    } else {
      console.error('[AUTH-DOCTOR] La configuracion Mongo contiene placeholders. Reemplaza las credenciales reales antes de conectar.');
      process.exit(1);
    }
  } else {
    await lookupHosts();
  }

  if (noConnect) {
    // Corta después de validar entorno y DNS.
    console.log('[AUTH-DOCTOR] Modo --no-connect activado. Se omite prueba de conexion Mongo.');
    process.exit(0);
  }

  if (ciMode && mongoErrors.length > 0) {
    console.log('[AUTH-DOCTOR] CI sin MONGO_URI operativo. Se omite prueba de conexion Mongo.');
    process.exit(0);
  }

  await testMongoConnection();
  process.exit(0);
})();
