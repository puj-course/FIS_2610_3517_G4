# CI/CD

## Workflows relevantes

| Workflow | Eventos | Que hace | Secrets |
|---|---|---|---|
| `.github/workflows/ci_verificacion.yml` | `push`, `pull_request`, `workflow_dispatch` | Instala frontend, lint, tests. | Ninguno obligatorio. |
| `.github/workflows/sonarcloud.yml` | `push`, `pull_request`, `workflow_dispatch` | Lint, audit, tests con coverage, metricas propias, build y SonarCloud. | `SONAR_TOKEN` |
| `.github/workflows/docker_ci_cd.yml` | `push`, `pull_request`, `workflow_dispatch` con paths Docker/app | Valida frontend/backend, compose config, build imagenes, healthchecks, publica DockerHub y despliega Compose desde imagenes. | `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, opcional `VITE_GOOGLE_CLIENT_ID` |
| `.github/workflows/cd_entrega.yml` | `push` a `main`/`develop` | Build frontend y artefacto descargable. | Opcional `DISCORD_WEBHOOK_URL` por workflow llamado |
| `.github/workflows/pipeline_hu454_auth_ci_cd.yml` | `push`, `pull_request`, `workflow_dispatch` | CI auth frontend/backend y hooks externos opcionales. | Opcional `BACKEND_DEPLOY_HOOK_URL`, `FRONTEND_DEPLOY_HOOK_URL`, `DISCORD_WEBHOOK_URL` |

## Versionamiento de imagenes Docker

`docker_ci_cd.yml` publica backend y frontend con tres tags:

- `${GITHUB_SHA}`
- `${rama}-${GITHUB_RUN_NUMBER}`
- `${rama}-latest`

Esto permite trazar una imagen al commit exacto y tambien tener un alias por rama.

## Evidencia que debe tomar el equipo

| Evidencia | Donde |
|---|---|
| Run verde de `docker-validate` | GitHub Actions |
| Run verde de `docker-publish` | GitHub Actions en `main` o `develop` |
| Run verde de `docker-deploy` | GitHub Actions en `main` o `develop` |
| Tags backend/frontend en DockerHub | DockerHub |
| Artefacto frontend | Workflow `cd_entrega` |
| SonarCloud scan | Workflow `sonarcloud` |

## Si falla Sonar

1. Revisar si `SONAR_TOKEN` existe.
2. Confirmar que `apps/web/coverage/lcov.info` se genero.
3. Revisar issues nuevos en SonarCloud.
4. Corregir code smells/bugs/hotspots.
5. Reejecutar workflow.

## Si falla DockerHub

1. Revisar `DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN`.
2. Confirmar que el token tenga permisos de escritura.
3. Validar tags generados en el job `Definir tags versionados`.
4. Reintentar despues de que `docker-validate` pase.

## Como defenderlo ante el profesor

Mostrar primero el workflow completo, luego abrir un run verde y explicar la secuencia: install -> lint/tests/coverage -> Sonar -> Docker build -> Compose config -> healthchecks -> DockerHub tags -> despliegue desde imagen publicada. No decir que se publico si el job `docker-publish` no corrio en verde.

## Validacion local complementaria

| Validacion local | Resultado |
|---|---|
| YAML `.github/workflows/*.yml` con PyYAML | Sintaxis cargada correctamente. |
| `npm --prefix apps/web audit --audit-level=moderate` | 0 vulnerabilidades. |
| `npm --prefix backend audit --audit-level=moderate` | 0 vulnerabilidades. |

Esto valida sintaxis y dependencias locales, pero no reemplaza un run real de GitHub Actions ni valida secrets.
