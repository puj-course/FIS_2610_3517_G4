const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const backendDir = path.resolve(__dirname, '..');
const envPath = path.join(backendDir, '.env');

const hasPlaceholderValue = (value = '') => String(value).includes('<') || String(value).includes('>');

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

if (!fs.existsSync(envPath)) {
  console.error('[ENV] Falta backend/.env. Crea el archivo con la MONGO_URI real de MongoDB Atlas.');
  process.exit(1);
}

const env = dotenv.parse(fs.readFileSync(envPath));
const mongoUri = String(env.MONGO_URI || '').trim();

if (!mongoUri) {
  console.error('[ENV] Falta MONGO_URI en backend/.env.');
  process.exit(1);
}

if (hasPlaceholderValue(mongoUri)) {
  console.error('[ENV] MONGO_URI contiene placeholders. Reemplazala por el connection string real compartido por el equipo.');
  process.exit(1);
}

if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
  console.error('[ENV] MONGO_URI debe iniciar con mongodb:// o mongodb+srv://.');
  process.exit(1);
}

console.log(`[ENV] backend/.env validado. MONGO_URI=${redactMongoUri(mongoUri)}`);
