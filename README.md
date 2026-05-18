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
Docs/                       Documentacion academica, QA, Agile y arquitectura.
Docs/QA/evidencias_finales/ Paquete final de sustentacion 5.0.
Docs/Agile/evidencias_finales/ Evidencia agil y postmortem.
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

Configurar variables desde los archivos de ejemplo:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp apps/web/.env.example apps/web/.env
```

Por requerimiento academico, el profesor puede recibir credenciales reales para reproducir la demo. Esas credenciales se entregan por anexo privado o se cargan como GitHub Secrets; no deben quedar publicadas en commits, issues, README ni capturas.

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
docker compose up -d --build
docker compose ps
```

Servicios expuestos:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:5000>
- Health backend/db: <http://localhost:5000/api/health/db>
- Health por proxy frontend: <http://localhost:3000/api/health/db>

Detener y limpiar:

```bash
docker compose down -v
```

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

La evidencia final esta organizada en:

- [Indice de sustentacion 5.0](Docs/QA/evidencias_finales/00_indice_sustentacion_5.md)
- [Metricas propias](Docs/QA/evidencias_finales/metricas/01_metricas_propias.md)
- [SonarCloud](Docs/QA/evidencias_finales/sonar/02_sonarcloud.md)
- [Pruebas y coverage](Docs/QA/evidencias_finales/pruebas/03_pruebas_unitarias_coverage.md)
- [Docker y CI/CD](Docs/QA/evidencias_finales/docker/04_despliegue_docker_ci_cd.md)
- [SMS Twilio](Docs/QA/evidencias_finales/sms/05_integracion_sms_twilio.md)
- [Agil y postmortem](Docs/Agile/evidencias_finales/07_agil_postmortem_trazabilidad.md)

Las carpetas `img/` estan reservadas para capturas verificables. No se deben inventar resultados ni reutilizar capturas desactualizadas.

## Licencia y contexto

Proyecto academico desarrollado para la asignatura Fundamentos de Ingenieria de Software, Pontificia Universidad Javeriana, 2026.
