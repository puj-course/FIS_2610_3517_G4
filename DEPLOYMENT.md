# Guía de Despliegue — DriveControl / AutoMinder Enterprise

## Descripción general

El sistema DriveControl consta de tres componentes desplegados en contenedores:

| Componente | Tecnología | Puerto |
|-----------|------------|--------|
| Frontend | React 18 + Vite → Nginx | 3000 |
| Backend | Node.js 20 + Express | 5000 |
| Base de datos | MongoDB (Atlas en prod / local en dev) | 27017 (interno) |

---

## Requisitos previos

| Herramienta | Versión mínima | Uso |
|------------|----------------|-----|
| Git | 2.x | Clonar el repositorio |
| Docker | 24.x | Contenedores y Compose |
| Docker Compose | 2.x | Orquestación multi-servicio |
| Node.js | 20 LTS | Desarrollo local sin Docker |
| npm | 10.x | Gestión de dependencias |

---

## Opción 1 — Inicio rápido con Docker Compose (recomendado)

### 1. Clonar y configurar variables de entorno

```bash
git clone https://github.com/puj-course/FIS_2610_3517_G4.git
cd FIS_2610_3517_G4
cp backend/.env.example backend/.env
# Editar backend/.env con los valores reales del equipo
```

### 2. Levantar el stack completo

```bash
docker compose up -d --build
```

Docker construye dos imágenes multi-stage y levanta tres servicios:
- `mongodb` — base de datos local (volumen persistente `mongo_data`)
- `backend` — API REST con healthcheck en `/api/health/db`
- `frontend` — SPA servida por Nginx, hace proxy de `/api` al backend

### 3. Verificar el despliegue

```bash
# Estado de contenedores y healthchecks
docker compose ps

# Endpoints de salud
curl http://localhost:5000/api/health/db    # backend directo
curl http://localhost:3000/api/health/db   # frontend → proxy → backend

# Logs en tiempo real
docker compose logs -f backend
docker compose logs -f frontend
```

### 4. Detener servicios

```bash
docker compose down          # detiene (conserva el volumen)
docker compose down -v       # detiene y elimina el volumen de datos
```

---

## Opción 2 — Desarrollo local (sin Docker)

### 1. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
# Editar: MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS

cp apps/web/.env.example apps/web/.env.local
# Editar: VITE_API_URL (default /api), VITE_GOOGLE_CLIENT_ID
```

### 2. Instalar dependencias

```bash
# Backend
npm --prefix backend install

# Frontend
npm --prefix apps/web install
```

### 3. Levantar en paralelo

```bash
# Desde apps/web — lanza backend + frontend con concurrently
npm --prefix apps/web run dev
```

O en terminales separadas:

```bash
# Terminal 1
npm --prefix backend start

# Terminal 2
npm --prefix apps/web run dev -- --host
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `MONGO_URI` | ✅ | URI de MongoDB Atlas o `mongodb://localhost:27017/drivecontrol` |
| `PORT` | ❌ | Puerto del backend (default: `5000`) |
| `JWT_SECRET` | ✅ | Clave secreta para firmar tokens JWT |
| `GOOGLE_CLIENT_ID` | ❌ | ID de cliente para Google OAuth |
| `EMAIL_HOST` | ✅ | Host SMTP para envío de OTP (ej: `smtp.gmail.com`) |
| `EMAIL_PORT` | ✅ | Puerto SMTP (generalmente `587`) |
| `EMAIL_USER` | ✅ | Usuario SMTP |
| `EMAIL_PASS` | ✅ | Contraseña o app-password SMTP |
| `OTP_EXPIRACION_MINUTOS` | ❌ | Tiempo de vida del OTP (default: `10`) |
| `OTP_MAX_INTENTOS` | ❌ | Intentos máximos antes de bloqueo (default: `5`) |
| `OTP_COOLDOWN_SEGUNDOS` | ❌ | Espera entre reenvíos (default: `60`) |
| `TWILIO_ACCOUNT_SID` | ❌ | SID de cuenta Twilio — obtener en console.twilio.com |
| `TWILIO_AUTH_TOKEN` | ❌ | Auth Token de Twilio (visible en el dashboard de la cuenta) |
| `TWILIO_PHONE_NUMBER` | ❌ | Número de origen Twilio en formato E.164 (ej: `+15551234567`) |

### Frontend (`apps/web/.env.local`)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `VITE_API_URL` | ❌ | URL base de la API (default: `/api`, el proxy de Vite lo resuelve) |
| `VITE_GOOGLE_CLIENT_ID` | ❌ | ID de cliente Google para el botón OAuth en la UI |

---

## Arquitectura de contenedores

```
┌──────────────────────────────────────────────┐
│              Red: drivectrl-net              │
│                                              │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐  │
│  │ mongodb │◄──│ backend  │◄──│ frontend │  │
│  │  :27017 │   │  :5000   │   │  :3000   │  │
│  └─────────┘   └──────────┘   └──────────┘  │
│       │              │              │        │
│   mongo_data    /api/health/db  proxy /api   │
└──────────────────────────────────────────────┘
```

- `frontend` depende de `backend` (healthcheck aprobado antes de arrancar).
- `backend` depende de `mongodb` (healthcheck aprobado antes de arrancar).
- El proxy Nginx en el frontend redirige `/api/*` al backend sin exponer CORS al browser.

---

## Pipeline CI/CD (GitHub Actions)

El repositorio incluye 7 workflows automatizados:

| Workflow | Disparador | Función |
|----------|-----------|---------|
| `ci_verificacion.yml` | PR → develop / main | Lint + pruebas + build |
| `sonarcloud.yml` | Push/PR a ramas principales | Análisis estático + cobertura SonarCloud |
| `cd_entrega.yml` | Push → main / develop | Build y artefacto de entrega (7 días) |
| `docker_ci_cd.yml` | PR/push + archivos Docker | Build imágenes, health check, push a DockerHub |
| `pipeline_hu454_auth_ci_cd.yml` | PR/push | Preflight de autenticación Atlas + CI separado FE/BE |
| `Estándares_de_calidad.yml` | Issue abierta | Comenta criterios INVEST y Definition of Done |
| `Flujo y asignación dinámica.yml` | Issue abierta | Auto-asigna el creador y confirma el flujo |

### Secrets necesarios en GitHub

| Secret | Workflow | Descripción |
|--------|---------|-------------|
| `DOCKERHUB_USERNAME` | `docker_ci_cd.yml` | Usuario de DockerHub para publicar imágenes |
| `DOCKERHUB_TOKEN` | `docker_ci_cd.yml` | Token de acceso de DockerHub |
| `SONAR_TOKEN` | `sonarcloud.yml` | Token de la organización `puj-course` en SonarCloud |

---

## Diagnóstico de conectividad con MongoDB Atlas

Si el backend no conecta con Atlas, ejecutar el script de diagnóstico:

```bash
npm --prefix backend run doctor:auth
```

Valida: conectividad TCP, autenticación con credenciales del `.env`, listado de colecciones. Diseñado para diagnosticar el error de IP no registrada en el whitelist de Atlas (ver `Docs/QA/issue_auth_registro_mongo_atlas.md`).

---

## Carga de datos de demo (seed)

Para poblar la base con datos de ejemplo (14 vehículos, 12 conductores, 12 SOAT, 12 RTM):

```bash
MONGO_URI=$(grep '^MONGO_URI=' backend/.env | cut -d= -f2-)
docker run --rm \
  -e OWNER_EMAIL="tu@email.com" \
  -e OWNER_EMPRESA="Demo Corp" \
  -v "$PWD/Docs/QA/datos_mongo_seed:/seed" \
  mongo:7 \
  mongosh "$MONGO_URI" /seed/seed_drivecontrol_demo.mongosh.js
```

Ver instrucciones completas en [Docs/QA/datos_mongo_seed/README_importacion.md](Docs/QA/datos_mongo_seed/README_importacion.md).

---

## Ejecución de pruebas

### Frontend

```bash
# Pruebas unitarias con cobertura
npm --prefix apps/web run test -- --coverage

# Lint
npm --prefix apps/web run lint

# Build de producción
npm --prefix apps/web run build
```

Cobertura actual en New Code: **83.7%** (PR #564, SonarCloud Quality Gate aprobado).  
Informe HTML generado en: `apps/web/coverage/index.html`.

### Backend

```bash
# Instalar dependencias (incluye jest como devDependency)
npm --prefix backend install

# Pruebas unitarias
npm --prefix backend test

# Pruebas con reporte de cobertura
npm --prefix backend run test:coverage
```

Los tests del backend cubren `emailService.js` y `smsService.js`. No requieren conexión a red ni credenciales reales — todas las dependencias externas (nodemailer, axios) están mockeadas con Jest.

El plan de pruebas manuales para flujos críticos (autenticación, CRUD, documentos y alertas) está en [`Docs/QA/plan_pruebas_manuales.md`](Docs/QA/plan_pruebas_manuales.md).

### Activar el servicio SMS (Twilio)

Para habilitar el fallback de recuperación de contraseña por SMS:

1. Crear una cuenta en [console.twilio.com](https://console.twilio.com) (la cuenta trial es suficiente para pruebas).
2. Obtener: **Account SID**, **Auth Token** y un **número de teléfono Twilio**.
3. Agregar al `backend/.env`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567
```

4. En despliegue Docker, las mismas variables se pasan al contenedor `backend` desde el `.env` del host gracias a la configuración de `docker-compose.yml`.

Con las tres variables presentes, `SMS_ENABLED` se activa automáticamente y el backend intentará enviar el OTP por SMS como fallback del correo.

---

## Resolución de problemas frecuentes

| Problema | Causa probable | Solución |
|---------|---------------|---------|
| `backend` no arranca | `MONGO_URI` inválida o vacía | Verificar `backend/.env` y ejecutar `doctor:auth` |
| `frontend` muestra errores de API | Backend no levantado o proxy mal configurado | Verificar `docker compose ps`, revisar `vite.config.js` proxy |
| Health check falla en CI | IP local no en whitelist de Atlas | Usar la URI del `.env.example` del equipo en CI |
| Conflictos de merge | Rama muy desactualizada respecto a `main` | Ejecutar `git merge main` o `git rebase main` frecuentemente |
