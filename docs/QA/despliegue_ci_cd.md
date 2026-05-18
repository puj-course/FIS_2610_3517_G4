# Despliegue y Configuracion CI/CD

## Objetivo

Esta evidencia deja la categoria de despliegue lista para calificacion excelente: el proyecto construye, valida, versiona, publica en DockerHub y despliega con Docker Compose de forma automatizada.

## Componentes de despliegue

| Componente | Archivo | Funcion |
| --- | --- | --- |
| Imagen backend | `Dockerfile` | Construye API Node/Express en modo produccion. |
| Imagen frontend | `apps/web/Dockerfile` | Construye React/Vite y sirve estaticos con Nginx. |
| Stack local | `docker-compose.yml` | Levanta MongoDB, backend, frontend, red, healthchecks y volumen. |
| Stack con imagenes publicadas | `docker-compose.prod.yml` | Sobrescribe backend/frontend para usar imagenes versionadas de DockerHub. |
| Pipeline CI/CD | `.github/workflows/docker_ci_cd.yml` | Ejecuta pruebas, builds, publicacion versionada y despliegue Compose. |

## Servicios Docker

| Servicio | Puerto | Funcion | Healthcheck |
| --- | --- | --- | --- |
| `mongodb` | `27017` | Persistencia principal con MongoDB 7 y volumen `mongo_data`. | `db.adminCommand('ping')` |
| `backend` | `5000` | API Express con autenticacion, documentos, alertas y healthchecks. | `GET /api/health/db` |
| `frontend` | `3000` | Aplicacion React servida por Nginx. | `GET /` |

## Red entre servicios

El stack usa la red bridge `drivectrl-net`.

- `backend` se conecta a MongoDB usando `mongodb:27017` cuando no se inyecta `DOCKER_MONGO_URI`.
- `frontend` usa `VITE_API_URL=/api`.
- `apps/web/nginx.conf` resuelve `/api` hacia `backend:5000`.
- `depends_on` con `condition: service_healthy` ordena el arranque:
  - `backend` espera a `mongodb`.
  - `frontend` espera a `backend`.

## Flujo CI/CD automatizado

El workflow `.github/workflows/docker_ci_cd.yml` tiene tres etapas.

### 1. Build, pruebas y validacion Docker

Se ejecuta en pull requests, pushes a ramas feature, `develop`, `main` y ejecucion manual.

Tareas:

1. Instala dependencias frontend.
2. Ejecuta `npm run lint`.
3. Audita dependencias frontend con `npm audit --audit-level=moderate`.
4. Ejecuta `npm test` con coverage.
5. Ejecuta `npm run quality:metrics` para dejar evidencia de metricas propias.
6. Ejecuta `npm run build`.
7. Instala dependencias backend.
8. Audita dependencias backend con `npm audit --audit-level=moderate`.
9. Ejecuta pruebas backend con `npm test`.
10. Valida sintaxis backend con `node --check server.js`.
11. Ejecuta preflight de autenticacion con `npm run doctor:auth:ci`.
12. Valida `docker compose config`.
13. Valida `docker-compose.prod.yml` con variables de imagen.
14. Construye imagen backend.
15. Construye imagen frontend.
16. Levanta `docker compose up -d --build`.
17. Valida backend, frontend y proxy `/api`.
18. Muestra `docker compose ps`.
19. Limpia el stack.

### 2. Publicacion versionada en DockerHub

Se ejecuta solo en `push` a `main` o `develop`, despues de pasar toda la validacion.

Secretos requeridos:

| Secreto | Uso |
| --- | --- |
| `DOCKERHUB_USERNAME` | Namespace de DockerHub. |
| `DOCKERHUB_TOKEN` | Token de publicacion. |
| `VITE_GOOGLE_CLIENT_ID` | Build arg publico del frontend cuando aplique. |

Si faltan `DOCKERHUB_USERNAME` o `DOCKERHUB_TOKEN`, el job falla. Esto es intencional: la rubrica pide publicacion real, no omision silenciosa.

Tags publicados:

```text
${DOCKERHUB_USERNAME}/drivectrl-backend:${GITHUB_SHA}
${DOCKERHUB_USERNAME}/drivectrl-backend:${GITHUB_REF_NAME}-${GITHUB_RUN_NUMBER}
${DOCKERHUB_USERNAME}/drivectrl-backend:${GITHUB_REF_NAME}-latest

${DOCKERHUB_USERNAME}/drivectrl-frontend:${GITHUB_SHA}
${DOCKERHUB_USERNAME}/drivectrl-frontend:${GITHUB_REF_NAME}-${GITHUB_RUN_NUMBER}
${DOCKERHUB_USERNAME}/drivectrl-frontend:${GITHUB_REF_NAME}-latest
```

Con esto hay versionamiento por commit, por corrida y por rama.

### 3. Despliegue con Docker Compose desde DockerHub

Se ejecuta despues de publicar imagenes.

Tareas:

1. Hace login en DockerHub.
2. Define `BACKEND_IMAGE`, `FRONTEND_IMAGE` e `IMAGE_TAG=${GITHUB_SHA}`.
3. Valida `docker compose -f docker-compose.yml -f docker-compose.prod.yml config`.
4. Descarga imagenes publicadas con `docker compose pull backend frontend`.
5. Despliega con `docker compose up -d --no-build`.
6. Valida:
   - `http://localhost:5000/api/health/db`
   - `http://localhost:3000/`
   - `http://localhost:3000/api/health/db`
7. Muestra `docker compose ps`.
8. Limpia el entorno con `docker compose down -v`.

Este despliegue prueba la imagen publicada, no una imagen local construida dentro del mismo job.

## Reproduccion local

### Stack local desde codigo fuente

```bash
docker compose up -d --build
docker compose ps
curl http://localhost:5000/api/health/db
curl http://localhost:3000/
curl http://localhost:3000/api/health/db
docker compose down -v
```

Resultado local verificado:

```text
backend: healthy
frontend: respondio HTTP 200
mongodb: healthy
GET /api/health/db: {"ok":true,"database":"logistica_db","source":"local-compose"}
GET /api por proxy frontend: {"ok":true,"database":"logistica_db","source":"local-compose"}
```

### Stack desde imagenes DockerHub

Reemplazar `usuario` y `tag` por los valores publicados por el workflow.

```bash
export BACKEND_IMAGE=usuario/drivectrl-backend
export FRONTEND_IMAGE=usuario/drivectrl-frontend
export IMAGE_TAG=tag
export VITE_API_URL=/api

docker compose -f docker-compose.yml -f docker-compose.prod.yml pull backend frontend
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-build
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
curl http://localhost:5000/api/health/db
curl http://localhost:3000/
curl http://localhost:3000/api/health/db
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

## Evidencia que debe mostrarse en sustentacion

| Evidencia | Donde se obtiene | Que demuestra |
| --- | --- | --- |
| Job `docker-validate` en verde | GitHub Actions | Pruebas, build, Compose local y healthchecks pasaron. |
| Job `docker-publish` en verde | GitHub Actions | Imagenes publicadas en DockerHub con tags versionados. |
| Job `docker-deploy` en verde | GitHub Actions | Despliegue Compose usando imagenes publicadas. |
| Repositorios DockerHub | DockerHub | Backend y frontend existen con tags SHA, run y branch-latest. |
| Logs de healthcheck | GitHub Actions | Backend, frontend y proxy `/api` respondieron correctamente. |
| `docker compose ps` | GitHub Actions o local | Servicios activos sobre la red `drivectrl-net`. |

## Criterio de aceptacion para defender 5

1. Dockerfile backend funcional.
2. Dockerfile frontend funcional.
3. Docker Compose levanta MongoDB, backend y frontend con red definida.
4. Pipeline ejecuta lint, auditoria de dependencias, tests, coverage, build y validaciones backend.
5. Pipeline construye imagen backend y frontend.
6. Pipeline publica imagenes en DockerHub con versionamiento claro.
7. Pipeline despliega la nueva imagen usando Docker Compose.
8. Pipeline valida healthchecks de backend, frontend y proxy.
9. Documentacion explica comandos, secretos, variables y reproduccion.

## Variables de entorno relevantes

| Variable | Uso |
| --- | --- |
| `MONGO_URI` / `DOCKER_MONGO_URI` | Conexion MongoDB del backend. |
| `JWT_SECRET` | Firma de tokens. |
| `GOOGLE_CLIENT_ID` | Validacion Google Auth backend. |
| `VITE_GOOGLE_CLIENT_ID` | Build frontend. |
| `VITE_API_URL` | Ruta base de API para frontend. |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` | Envio de correo. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | Fallback SMS cuando aplique. |
| `BACKEND_IMAGE`, `FRONTEND_IMAGE`, `IMAGE_TAG` | Despliegue Compose desde DockerHub. |

## Estado final de despliegue

- [x] Dockerfile backend.
- [x] Dockerfile frontend.
- [x] Docker Compose local.
- [x] Docker Compose con imagenes publicadas.
- [x] Red Docker definida.
- [x] Healthchecks por servicio.
- [x] Pipeline con lint, tests, coverage y build.
- [x] Publicacion DockerHub obligatoria en `main` y `develop`.
- [x] Versionamiento por SHA, run number y rama.
- [x] Despliegue Docker Compose desde imagenes publicadas.
- [x] Documentacion reproducible.

## Troubleshooting de sustentacion

| Situacion | Revision recomendada | Accion segura |
| --- | --- | --- |
| `docker-compose.prod.yml` falla por variables requeridas | Confirmar `BACKEND_IMAGE`, `FRONTEND_IMAGE` e `IMAGE_TAG`. | Exportar variables sin incluir credenciales y repetir `docker compose -f docker-compose.yml -f docker-compose.prod.yml config`. |
| Backend no queda healthy | Revisar `MONGO_URI` o `DOCKER_MONGO_URI`, healthcheck `/api/health/db` y logs del contenedor. | Validar conectividad a MongoDB y reiniciar el stack con `docker compose down -v && docker compose up -d --build`. |
| Frontend no responde | Revisar build de Vite, `apps/web/nginx.conf` y puerto `3000`. | Ejecutar `npm --prefix apps/web run build` y reconstruir la imagen frontend. |
| Proxy `/api` falla desde frontend | Confirmar que `frontend` y `backend` estan en `drivectrl-net`. | Revisar `docker compose ps`, `docker network inspect drivectrl-net` y health del backend. |
| Publicacion DockerHub no ocurre | Confirmar secretos `DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN` en GitHub Actions. | Reejecutar workflow despues de configurar secretos protegidos. |

## Evidencias manuales pendientes

Antes de sustentar, el equipo debe anexar capturas o enlaces verificables de:

- GitHub Actions con `docker-validate`, `docker-publish` y `docker-deploy` en verde.
- Repositorios DockerHub `drivectrl-backend` y `drivectrl-frontend` con tags por SHA, numero de corrida y rama.
- `docker compose ps` mostrando `mongodb`, `backend` y `frontend`.
- `docker network ls` o `docker network inspect drivectrl-net`.
- Frontend respondiendo en `http://localhost:3000/`.
- Backend respondiendo en `http://localhost:5000/api/health/db`.
- Proxy del frontend respondiendo en `http://localhost:3000/api/health/db`.
