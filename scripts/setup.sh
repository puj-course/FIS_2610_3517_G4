#!/bin/bash
# Script de configuracion inicial del proyecto
# Corre este script una sola vez despues de clonar el repo

echo "=== Setup del proyecto ==="

# Copiar .env si no existe
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "[OK] backend/.env creado desde .env.example"
else
  echo "[INFO] backend/.env ya existe, no se sobreescribe"
fi

# Instalar dependencias del backend
echo "Instalando dependencias del backend..."
cd backend && npm install
cd ..

# Instalar dependencias del frontend
echo "Instalando dependencias del frontend..."
cd apps/web && npm install
cd ../..

echo ""
echo "=== Listo! Para correr la app: ==="
echo "  cd apps/web && npm run dev"
