import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const webDir = process.cwd();
const backendDir = path.resolve(webDir, '../../backend');
const envPath = path.join(backendDir, '.env');
const backendNodeModulesPath = path.join(backendDir, 'node_modules');
const backendPackageJsonPath = path.join(backendDir, 'package.json');

const shouldInstallBackendDeps = () => {
  if (!fs.existsSync(backendNodeModulesPath)) {
    return true;
  }

  if (!fs.existsSync(backendPackageJsonPath)) {
    console.error('[prepare-dev] Falta backend/package.json.');
    process.exit(1);
  }

  const backendPkg = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
  const dependencyNames = Object.keys(backendPkg.dependencies || {});

  for (const depName of dependencyNames) {
    const depPath = path.join(backendNodeModulesPath, depName);
    if (!fs.existsSync(depPath)) {
      return true;
    }
  }

  return false;
};

if (!fs.existsSync(envPath)) {
  console.error('[prepare-dev] Falta backend/.env.');
  console.error('[prepare-dev] Crea backend/.env con las variables reales compartidas por el equipo.');
  console.error('[prepare-dev] No copies backend/.env.example sin reemplazar MONGO_URI, EMAIL_USER y EMAIL_PASS.');
  process.exit(1);
}

if (shouldInstallBackendDeps()) {
  console.log('[prepare-dev] Dependencias faltantes en backend. Instalando...');
  const installResult = spawnSync('npm', ['install'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (installResult.status !== 0) {
    process.exit(installResult.status ?? 1);
  }

  console.log('[prepare-dev] Dependencias del backend instaladas.');
}
