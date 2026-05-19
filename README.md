# DriveControl / AutoMinder Enterprise

DriveControl / AutoMinder Enterprise es una aplicacion academica de SYNTIX TECH para gestionar cumplimiento documental de flotas. El sistema centraliza vehiculos, conductores, documentos, alertas preventivas, validaciones y reportes para reducir riesgo de vencimientos de SOAT, RTM y licencias.

## Equipo

| Miembro | GitHub | Rol |
|---|---|---|
| Sebastian Ramirez Maldonado | [@Sarm-m](https://github.com/Sarm-m) | Scrum Master |
| Samuel Freile | [@samuelfl680](https://github.com/samuelfl680) | Configuration Manager |
| Sebastian Rodriguez Ramirez | [@Juserora](https://github.com/Juserora) | Quality Assurance Lead |
| Solon Losada | [@solonlosada2006](https://github.com/solonlosada2006) | DevOps Engineer |
| Sebastian Vargas | [@juanvargax](https://github.com/juanvargax) | Product Owner y Sprint Planner |

## Stack real del proyecto

| Capa | Tecnologia |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Recharts, Radix UI |
| Backend | Node.js, Express, MongoDB/Mongoose |
| Autenticacion | JWT, Google OAuth, OTP por correo y SMS |
| SMS | Twilio mediante API HTTP con `axios` |
| Pruebas frontend | Vitest + V8 coverage |
| Pruebas backend | Node test runner |
| Calidad | SonarCloud / SonarQube Cloud |
| Contenedores | Docker, Docker Compose, Nginx para frontend |
| CI/CD | GitHub Actions |

## Funcionalidades principales

- Dashboard de cumplimiento documental.
- Gestion de vehiculos.
- Gestion de conductores.
- Gestion de SOAT y RTM.
- Alertas por vencimiento o proximidad.
- Reportes y metricas de calidad funcional.
- Validacion RUNT simulada.
- Registro, login, recuperacion de cuenta y OTP.
- Integracion SMS con Twilio para codigos OTP.

## Estructura del repositorio

```text
apps/web/                   Frontend React + Vite.
backend/                    API Node.js + Express.
docs/                       Documentacion academica, QA, Agile y arquitectura.
docs/QA/evidencias_finales/ Paquete final de sustentacion 5.0.
docs/Agile/evidencias_finales/ Evidencia agil y postmortem.
Dockerfile                  Imagen backend.
apps/web/Dockerfile         Imagen frontend con build Vite + Nginx.
docker-compose.yml          Stack local: MongoDB, backend, frontend.
docker-compose.prod.yml     Override para imagenes publicadas.
sonar-project.properties    Configuracion SonarCloud.
.github/workflows/          Workflows CI/CD y SonarCloud.
```

## Requisitos

- Git.
- Node.js 20 o superior.
- npm.
- Docker Desktop.
- Credenciales para MongoDB, correo, Google OAuth, Twilio, DockerHub y SonarCloud segun el flujo a ejecutar.

## Instalacion local

```bash
git clone https://github.com/puj-course/FIS_2610_3517_G4.git
cd FIS_2610_3517_G4
npm --prefix apps/web ci
npm --prefix backend ci
```

Configurar variables desde los archivos de ejemplo cuando se trabaje en un entorno propio:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

No sobrescribir `apps/web/.env` durante la validacion academica: ese archivo se conserva en el repositorio por decision del equipo para que el profesor pueda ejecutar la entrega con `make build` y `make up`. Los README y el informe no muestran valores reales; en produccion real se usarian GitHub Secrets o variables protegidas.

## Ejecucion en desarrollo

Frontend y backend:

```bash
npm --prefix apps/web run dev
```

Solo frontend:

```bash
npm --prefix apps/web run dev:frontend
```

Solo backend:

```bash
npm --prefix backend start
```

## Ejecucion con Docker

```bash
make build
make up
docker compose ps
```

Servicios expuestos:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:5000>
- Health backend/db: <http://localhost:5000/api/health/db>
- Health por proxy frontend: <http://localhost:3000/api/health/db>

Detener el stack:

```bash
make down
```

## Solución de conflictos Docker

Si al ejecutar `make up` aparece un error indicando que ya existe el contenedor `drivectrl-mongodb`, `drivectrl-backend`, `drivectrl-frontend` o la red `drivecontrol-net`, se puede limpiar el entorno del proyecto con:

```bash
make clean
make build
make up
```

El comando `make clean` elimina contenedores y red asociados al proyecto, pero no elimina volúmenes ni imágenes.

Si se necesita reiniciar completamente el entorno local, incluyendo los datos locales de MongoDB, usar:

```bash
make reset
make build
make up
```

Advertencia: `make reset` elimina volúmenes locales del proyecto, por lo que puede borrar datos almacenados en MongoDB local. Ninguno de estos comandos modifica `apps/web/.env`.

## Entrega final — Evidencia de rubrica

La entrega final del informe academico esta en:

- `docs/Entrega-Final/main.tex`
- `docs/Entrega-Final/README.md`
- `docs/Entrega-Final/evidencias/`

El informe cubre:

- Metricas de calidad propias del sistema.
- SonarCloud.
- Pruebas unitarias y coverage.
- Docker y despliegue reproducible.
- CI/CD.
- SMS/Twilio.
- Metodologia agil y postmortem.
- Trazabilidad issues -> commits -> PRs.

Comandos principales de validacion:

```bash
npm --prefix apps/web test
npm --prefix backend test
make build
make up
docker compose ps
docker network inspect drivecontrol-net
```

Ejecucion principal para el profesor:

```bash
make build
make up
```

`apps/web/.env` se conserva por decision academica para validacion del profesor. No se deben publicar valores reales en documentacion ni capturas; en un entorno productivo real se usarian GitHub Secrets o variables protegidas.

La guia completa para Overleaf, evidencias, capturas pendientes y metricas agiles esta en `docs/Entrega-Final/README.md`.

## Validacion desde imagenes publicadas

Reemplazar `usuario` y `tag-publicado` por valores reales visibles en DockerHub:

```bash
export BACKEND_IMAGE=usuario/drivectrl-backend
export FRONTEND_IMAGE=usuario/drivectrl-frontend
export IMAGE_TAG=tag-publicado
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull backend frontend
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-build
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

No afirmar publicacion o despliegue si no existe evidencia en GitHub Actions y DockerHub.

## Pruebas y calidad

Frontend:

```bash
npm --prefix apps/web run lint
npm --prefix apps/web test
npm --prefix apps/web run quality:metrics
npm --prefix apps/web run build
```

Backend:

```bash
npm --prefix backend test
npm --prefix backend run doctor:auth:ci
```

SonarCloud usa:

- `sonar-project.properties`
- `.github/workflows/sonarcloud.yml`
- `apps/web/coverage/lcov.info`

## Sustentacion final

La evidencia historica del proyecto tambien incluye:

- [Indice de sustentacion 5.0](docs/QA/evidencias_finales/00_indice_sustentacion_5.md)
- [Metricas propias](docs/QA/evidencias_finales/metricas/01_metricas_propias.md)
- [SonarCloud](docs/QA/evidencias_finales/sonar/02_sonarcloud.md)
- [Pruebas y coverage](docs/QA/evidencias_finales/pruebas/03_pruebas_unitarias_coverage.md)
- [Docker y CI/CD](docs/QA/evidencias_finales/docker/04_despliegue_docker_ci_cd.md)
- [SMS Twilio](docs/QA/evidencias_finales/sms/05_integracion_sms_twilio.md)
- [Agil y postmortem](docs/Agile/evidencias_finales/07_agil_postmortem_trazabilidad.md)

Las carpetas `img/` estan reservadas para capturas verificables. No se deben inventar resultados ni reutilizar capturas desactualizadas.

## Licencia y contexto

Proyecto academico desarrollado para la asignatura Fundamentos de Ingenieria de Software, Pontificia Universidad Javeriana, 2026.
