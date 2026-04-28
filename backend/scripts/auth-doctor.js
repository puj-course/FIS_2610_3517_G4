const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const https = require('https');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const args = process.argv.slice(2);
const noConnect = args.includes('--no-connect');
const ciMode = args.includes('--ci');
const envFileArg = args.find((arg) => arg.startsWith('--env-file='));

const explicitEnvFile = envFileArg ? envFileArg.split('=')[1] : null;
const backendDir = path.resolve(__dirname, '..');

const resolveEnvPath = () => {
  if (explicitEnvFile) {
    return path.resolve(backendDir, explicitEnvFile);
  }

  const defaultPath = path.resolve(backendDir, '.env');
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }

  return path.resolve(backendDir, '.env.example');
};

const envPath = resolveEnvPath();
if (!fs.existsSync(envPath)) {
  console.error('[AUTH-DOCTOR] No se encontro archivo de entorno (.env o .env.example).');
  process.exit(1);
}

dotenv.config({ path: envPath });
console.log(`[AUTH-DOCTOR] Variables cargadas desde ${path.basename(envPath)}`);

const requiredKeys = ['MONGO_URI', 'PORT', 'EMAIL_HOST', 'EMAIL_PORT', 'OTP_EXPIRACION_MINUTOS', 'OTP_MAX_INTENTOS', 'OTP_COOLDOWN_SEGUNDOS'];
const missing = requiredKeys.filter((key) => !String(process.env[key] || '').trim());

if (missing.length > 0) {
  console.error(`[AUTH-DOCTOR] Faltan variables requeridas: ${missing.join(', ')}`);
  process.exit(1);
}

const mongoUri = String(process.env.MONGO_URI || '').trim();
const validMongoPrefix = mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://');

if (!validMongoPrefix) {
  console.error('[AUTH-DOCTOR] MONGO_URI debe iniciar con mongodb:// o mongodb+srv://');
  process.exit(1);
}

const getHosts = (uri) => {
  if (uri.startsWith('mongodb+srv://')) {
    const withoutProtocol = uri.replace('mongodb+srv://', '');
    const afterCreds = withoutProtocol.includes('@') ? withoutProtocol.split('@')[1] : withoutProtocol;
    const host = afterCreds.split('/')[0].split('?')[0];
    return host ? [host] : [];
  }

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

const hasPlaceholderHosts = hosts.some((host) => host.includes('<') || host.includes('>'));

const lookupHosts = async () => {
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
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[AUTH-DOCTOR] Conexion MongoDB OK');
    await mongoose.disconnect();
  } catch (error) {
    const publicIp = await getPublicIp();
    console.error(`[AUTH-DOCTOR] Error de conexion MongoDB: ${error.name}: ${error.message}`);
    console.error(`[AUTH-DOCTOR] IP publica detectada: ${publicIp}`);
    console.error('[AUTH-DOCTOR] Accion recomendada: agrega esa IP en Atlas > Security > Network Access.');
    process.exit(1);
  }
};

(async () => {
  if (hasPlaceholderHosts) {
    if (ciMode || noConnect) {
      console.log('[AUTH-DOCTOR] Se detectaron hosts placeholder en MONGO_URI. Se omite DNS en modo CI/no-connect.');
    } else {
      console.error('[AUTH-DOCTOR] MONGO_URI contiene placeholders. Reemplaza <usuario>, <password> y <cluster-host>.');
      process.exit(1);
    }
  } else {
    await lookupHosts();
  }

  if (noConnect) {
    console.log('[AUTH-DOCTOR] Modo --no-connect activado. Se omite prueba de conexion Mongo.');
    process.exit(0);
  }

  if (ciMode && !process.env.MONGO_URI) {
    console.log('[AUTH-DOCTOR] CI sin MONGO_URI operativo. Se omite prueba de conexion Mongo.');
    process.exit(0);
  }

  await testMongoConnection();
  process.exit(0);
})();
