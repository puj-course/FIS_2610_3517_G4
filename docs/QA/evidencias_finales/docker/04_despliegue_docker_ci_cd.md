# 04 - Despliegue Docker y CI/CD

Este documento cubre Dockerfile, Docker Compose, networking, GitHub Actions, publicacion en DockerHub y despliegue con Compose desde imagenes versionadas.

## Componentes

| Componente | Ruta | Funcion |
|---|---|---|
| Backend Dockerfile | `Dockerfile` | Construye la API Node/Express. |
| Frontend Dockerfile | `apps/web/Dockerfile` | Construye React/Vite y sirve con Nginx. |
| Compose local | `docker-compose.yml` | Levanta MongoDB, backend, frontend, red y healthchecks. |
| Compose prod | `docker-compose.prod.yml` | Sobrescribe backend/frontend para usar imagenes publicadas. |
| Nginx frontend | `apps/web/nginx.conf` | Sirve estaticos y proxifica `/api` hacia backend. |
| CI/CD Docker | `.github/workflows/docker_ci_cd.yml` | Valida, construye, publica y despliega si hay secretos. |

## Servicios esperados

| Servicio | Puerto | Healthcheck | Red |
|---|---:|---|---|
| `mongodb` | 27017 | `db.adminCommand('ping')` | `drivectrl-net` |
| `backend` | 5000 | `GET /api/health/db` | `drivectrl-net` |
| `frontend` | 3000 | `GET /` | `drivectrl-net` |

## Comandos reproducibles

Validar sintaxis:

```bash
docker compose -f docker-compose.yml config
```

Validar compose de produccion con variables dummy:

```bash
BACKEND_IMAGE=docker.io/usuario/drivectrl-backend \
FRONTEND_IMAGE=docker.io/usuario/drivectrl-frontend \
IMAGE_TAG=tag \
docker compose -f docker-compose.yml -f docker-compose.prod.yml config
```

Levantar stack local:

```bash
docker compose up -d --build
docker compose ps
curl http://localhost:5000/api/health/db
curl http://localhost:3000/
curl http://localhost:3000/api/health/db
docker network inspect fis_2610_3517_g4_drivectrl-net
docker compose down -v
```

Validar imagenes publicadas:

```bash
export BACKEND_IMAGE=usuario/drivectrl-backend
export FRONTEND_IMAGE=usuario/drivectrl-frontend
export IMAGE_TAG=tag-publicado
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull backend frontend
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-build
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

## Pipeline esperado

| Job | Que debe evidenciar | Captura |
|---|---|---|
| `docker-validate` | Lint, audit, tests, build, compose config, build de imagenes y healthchecks. | `img/github-actions-docker-validate.png` |
| `docker-publish` | Publicacion backend/frontend en DockerHub con tags por SHA, corrida y rama. | `img/github-actions-docker-publish.png` |
| `docker-deploy` | Pull de imagenes publicadas y despliegue Compose sin build local. | `img/github-actions-docker-deploy.png` |

No marcar `docker-publish` o `docker-deploy` como ejecutados si no existe run verde en GitHub Actions y repositorio DockerHub con tags visibles.

## Evidencias 

| Captura | Archivo esperado | 
|---|---|
| Compose config | `img/docker-compose-config.png` | 
| Compose ps healthy | `img/docker-compose-ps.png` | 
| Backend health | `img/backend-health-db.png` |
| Frontend HTTP 200 | `img/frontend-http-200.png` | 
| Proxy `/api` | `img/frontend-proxy-api-health.png` | 
| Network inspect | `img/docker-network-inspect.png` | 
| Workflow validate | `img/github-actions-docker-validate.png` |
| Workflow publish | `img/github-actions-docker-publish.png` | 
| Workflow deploy | `img/github-actions-docker-deploy.png` | 
| DockerHub tags | `img/dockerhub-tags.png` | 

## Interpretacion tecnica

Docker Compose demuestra reproducibilidad porque todos los servicios se levantan desde definiciones versionadas. La red Docker demuestra comunicacion entre servicios sin depender de `localhost` dentro de contenedores. El pipeline demuestra integracion continua cuando valida pruebas/builds y entrega continua cuando publica y despliega imagenes versionadas.
| Issue | Branch | Commit | PR | Evidencia |
|---|---|---|---|---|
| `#584` Completar evidencia Docker, Docker Compose y CI/CD | Abierta en GitHub | Ver PR | PR hacia `develop` | Capturas Docker, Actions y DockerHub |
