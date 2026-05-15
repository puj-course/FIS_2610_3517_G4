const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const backendDir = path.resolve(__dirname, '..');
const repoRootDir = path.resolve(backendDir, '..');
const backendEnvPath = path.join(backendDir, '.env');
const backendEnvExamplePath = path.join(backendDir, '.env.example');
const appsWebEnvPath = path.join(repoRootDir, 'apps', 'web', '.env');
const rootEnvPath = path.join(repoRootDir, '.env');

const labelForPath = (filePath) => {
  // Se devuelven etiquetas legibles para logs de diagnóstico.
  if (filePath === backendEnvPath) return 'backend/.env';
  if (filePath === backendEnvExamplePath) return 'backend/.env.example';
  if (filePath === appsWebEnvPath) return 'apps/web/.env';
  if (filePath === rootEnvPath) return '.env';
  return path.basename(filePath);
};

const loadEnvFile = (filePath, { override }) => {
  // Si el archivo no existe, se omite sin fallar para permitir múltiples combinaciones.
  if (!fs.existsSync(filePath)) {
    return null;
  }

  // `override` decide si ese archivo pisa variables cargadas antes.
  dotenv.config({ path: filePath, override });
  return labelForPath(filePath);
};

const loadProjectEnv = ({ explicitEnvFile = null } = {}) => {
  const loadedFrom = [];

  if (explicitEnvFile) {
    // En modo explícito solo se carga ese archivo, útil para scripts de diagnóstico.
    const envPath = path.resolve(backendDir, explicitEnvFile);
    const label = loadEnvFile(envPath, { override: true });
    return label ? [label] : [];
  }

  const fallbackLabel = loadEnvFile(backendEnvExamplePath, { override: false });
  if (fallbackLabel) {
    // `.env.example` aporta defaults seguros si aún no existe `.env` real.
    loadedFrom.push(fallbackLabel);
  }

  const appsWebLabel = loadEnvFile(appsWebEnvPath, { override: true });
  if (appsWebLabel) {
    // El proyecto academico conserva variables compartidas en apps/web/.env.
    // Se carga sin imprimir valores para que backend local pueda leer Twilio/Mongo/SMTP.
    loadedFrom.push(appsWebLabel);
  }

  const backendLabel = loadEnvFile(backendEnvPath, { override: true });
  if (backendLabel) {
    // `backend/.env` tiene prioridad sobre el example.
    loadedFrom.push(backendLabel);
  }

  const rootLabel = loadEnvFile(rootEnvPath, { override: true });
  if (rootLabel) {
    // El `.env` raíz se carga al final para facilitar despliegues desde la raíz del repo.
    loadedFrom.push(rootLabel);
  }

  return loadedFrom;
};

module.exports = {
  backendDir,
  appsWebEnvPath,
  backendEnvExamplePath,
  backendEnvPath,
  rootEnvPath,
  loadProjectEnv,
};
