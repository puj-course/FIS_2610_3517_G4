# Script de configuracion inicial del proyecto (Windows)
# Corre este script una sola vez despues de clonar el repo

Write-Host "=== Setup del proyecto ===" -ForegroundColor Cyan

# Copiar .env si no existe
if (-Not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "[OK] backend\.env creado desde .env.example" -ForegroundColor Green
} else {
    Write-Host "[INFO] backend\.env ya existe, no se sobreescribe" -ForegroundColor Yellow
}

# Instalar dependencias del backend
Write-Host "Instalando dependencias del backend..."
Set-Location backend; npm install; Set-Location ..

# Instalar dependencias del frontend
Write-Host "Instalando dependencias del frontend..."
Set-Location apps\web; npm install; Set-Location ..\..

Write-Host ""
Write-Host "=== Listo! Para correr la app: ===" -ForegroundColor Cyan
Write-Host "  cd apps\web; npm run dev"
