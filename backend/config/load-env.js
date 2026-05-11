const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const backendDir = path.resolve(__dirname, '..');
const repoRootDir = path.resolve(backendDir, '..');
const backendEnvPath = path.join(backendDir, '.env');
const backendEnvExamplePath = path.join(backendDir, '.env.example');
const rootEnvPath = path.join(repoRootDir, '.env');

const labelForPath = (filePath) => {
  if (filePath === backendEnvPath) return 'backend/.env';
  if (filePath === backendEnvExamplePath) return 'backend/.env.example';
  if (filePath === rootEnvPath) return '.env';
  return path.basename(filePath);
};

const loadEnvFile = (filePath, { override }) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  dotenv.config({ path: filePath, override });
  return labelForPath(filePath);
};

const loadProjectEnv = ({ explicitEnvFile = null } = {}) => {
  const loadedFrom = [];

  if (explicitEnvFile) {
    const envPath = path.resolve(backendDir, explicitEnvFile);
    const label = loadEnvFile(envPath, { override: true });
    return label ? [label] : [];
  }

  const fallbackLabel = loadEnvFile(backendEnvExamplePath, { override: false });
  if (fallbackLabel) {
    loadedFrom.push(fallbackLabel);
  }

  const backendLabel = loadEnvFile(backendEnvPath, { override: true });
  if (backendLabel) {
    loadedFrom.push(backendLabel);
  }

  const rootLabel = loadEnvFile(rootEnvPath, { override: true });
  if (rootLabel) {
    loadedFrom.push(rootLabel);
  }

  return loadedFrom;
};

module.exports = {
  backendDir,
  backendEnvExamplePath,
  backendEnvPath,
  rootEnvPath,
  loadProjectEnv,
};
