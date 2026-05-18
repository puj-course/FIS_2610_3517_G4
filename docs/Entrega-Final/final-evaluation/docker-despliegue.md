# Docker y despliegue reproducible

## Arquitectura de contenedores

| Servicio | Imagen/build | Puerto host | Puerto contenedor | Responsabilidad | Healthcheck |
|---|---|---:|---:|---|---|
| `mongodb` | `mongo:7` | 27017 | 27017 | Base de datos local para Compose. | `db.adminCommand('ping')` |
| `backend` | `Dockerfile` raiz | 5000 | 5000 | API Node/Express, MongoDB, OTP, SMS. | `GET /api/health/db` |
| `frontend` | `apps/web/Dockerfile` | 3000 | 3000 | React/Vite servido por Nginx y proxy `/api`. | `GET /` |

El frontend debe hablar con el backend por el nombre de servicio `backend` desde Nginx, no por `localhost` dentro del contenedor. El backend usa `mongodb://mongodb:27017/logistica_db` por defecto dentro de Compose.

## Red Docker

| Campo | Valor |
|---|---|
| Network key | `drivectrl-net` |
| Nombre explicito | `drivecontrol-net` |
| Driver | `bridge` |
| Subnet | `172.28.0.0/16` |

Se eligio `172.28.0.0/16` porque es un rango privado RFC1918 comun para redes Docker y reduce choques con `172.17.0.0/16`, que Docker usa a menudo por defecto. Si la maquina del evaluador ya usa ese rango, cambiar el subnet en `docker-compose.yml` y documentar el nuevo valor.

## Variables principales

| Variable | Servicio | Uso |
|---|---|---|
| `MONGO_URI` / `DOCKER_MONGO_URI` | backend | Conexion MongoDB. En contenedores se recomienda `mongodb://mongodb:27017/logistica_db`. |
| `JWT_SECRET` | backend | Firma de tokens. Debe ser secreto real fuera del repo. |
| `GOOGLE_CLIENT_ID` / `VITE_GOOGLE_CLIENT_ID` | backend/frontend | Google Auth. |
| `EMAIL_*` | backend | OTP por correo. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | backend | SMS por Twilio. |
| `VITE_API_URL` | frontend | URL/proxy API. Para Docker se usa `/api`. |

## Comandos reproducibles

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
curl http://localhost:5000/api/health/db
curl http://localhost:3000/
curl http://localhost:3000/api/health/db
docker network ls
docker network inspect drivecontrol-net
docker compose down
```

Limpieza con volumen:

```bash
docker compose down -v
docker network prune
```

Validar despliegue desde imagenes publicadas:

```bash
BACKEND_IMAGE=docker.io/<usuario>/drivectrl-backend \
FRONTEND_IMAGE=docker.io/<usuario>/drivectrl-frontend \
IMAGE_TAG=<sha-o-version> \
docker compose -f docker-compose.yml -f docker-compose.prod.yml config
```

## Troubleshooting

| Problema | Diagnostico | Accion |
|---|---|---|
| Conflicto de subnet | `docker network inspect drivecontrol-net` o error de overlap. | Cambiar subnet a otro rango privado no usado, por ejemplo `172.29.0.0/16`. |
| Backend no conecta a Mongo | `docker compose logs backend mongodb`. | Confirmar `MONGO_URI`/`DOCKER_MONGO_URI` y health de `mongodb`. |
| Frontend no proxifica `/api` | `curl http://localhost:3000/api/health/db`. | Revisar `apps/web/nginx.conf` y que backend este healthy. |
| Puerto ocupado | Error al bindear 3000/5000/27017. | Cambiar puerto host o detener proceso local. |
| SMS no funciona | Backend log indica variables faltantes. | Cargar variables Twilio desde `.env` privado o GitHub Secrets. |

## Evidencia para la rubrica

Capturar `docker compose config`, `docker compose ps`, healthchecks, `docker network inspect drivecontrol-net`, workflow Docker en verde y DockerHub tags si se defiende publicacion automatizada.

## Validacion local realizada el 2026-05-15

| Comando | Resultado |
|---|---|
| `docker compose config` | Exitoso. |
| `docker compose build` | Backend y frontend construidos exitosamente. |
| `docker compose up -d` | MongoDB, backend y frontend iniciaron. |
| `docker compose ps` | Tres servicios `healthy`. |
| `curl http://localhost:5000/api/health/db` | `ok: true`, base `logistica_db`, host `mongodb:27017`. |
| `curl -I http://localhost:3000/` | HTTP 200 desde Nginx. |
| `curl http://localhost:3000/api/health/db` | Proxy API funcionando con `ok: true`. |
| `docker network inspect drivecontrol-net` | Subnet `172.28.0.0/16`; contenedores en `172.28.0.2`, `.3`, `.4`. |
| `docker compose down` | Stack apagado y red eliminada. |
