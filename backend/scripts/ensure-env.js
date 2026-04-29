const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '..');
const envPath = path.join(backendDir, '.env');
const envExamplePath = path.join(backendDir, '.env.example');

if (fs.existsSync(envPath)) {
  console.log('[ENV] backend/.env ya existe.');
  process.exit(0);
}

if (!fs.existsSync(envExamplePath)) {
  console.error('[ENV] No se encontro backend/.env.example para crear backend/.env automaticamente.');
  process.exit(1);
}

fs.copyFileSync(envExamplePath, envPath);
console.log('[ENV] Se creo backend/.env automaticamente desde backend/.env.example.');
