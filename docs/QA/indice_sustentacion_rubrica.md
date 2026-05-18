# Indice de Sustentacion para Rubrica Final

Este documento centraliza la evidencia para defender la entrega. Las evidencias externas deben anexarse con capturas o enlaces verificables; no se deben inventar resultados ni mostrar secretos.

| Criterio de la rubrica | Que exige nivel excelente | Evidencia existente en el repositorio | Archivos relacionados | Comandos de verificacion | Evidencia externa que debe anexar el equipo | Estado actual | Accion final antes de sustentar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Metricas propias de calidad | Minimo 3 metricas en codigo, distintas de SonarCloud, con interpretacion e impacto. | Riesgo documental, completitud operativa y criticidad de alertas. | `qualityMetrics.js`, `qualityMetrics.test.js`, `metricas_calidad.md` | `npm --prefix apps/web run quality:metrics` | Captura de seccion de reportes con metricas. | Defendible como excelente. | Mostrar codigo, tests y JSON de evidencia. |
| Metricas SonarCloud | Minimo 2 metricas SonarCloud interpretadas. | Coverage, duplications, maintainability y security documentadas. | `sonar-project.properties`, `sonarcloud.yml`, `metricas_calidad.md` | `npm --prefix apps/web run test -- --coverage` | Captura de SonarCloud Quality Gate. | Defendible si la captura esta actualizada. | Anexar resultado real de SonarCloud. |
| Coverage superior al 80% | Coverage evidenciado en SonarCloud. | Tests frontend con `lcov.info`. | `apps/web/coverage/lcov.info` | `npm --prefix apps/web run test -- --coverage` | Captura coverage SonarCloud. | Defendible segun Quality Gate reportado. | Confirmar ultima ejecucion en GitHub. |
| Pruebas unitarias frontend | Tests criticos y pipeline automatizado. | Vitest cubre utilidades, metricas, adaptadores y hooks. | `apps/web/src/__tests__`, `apps/web/src/test` | `npm --prefix apps/web run test -- --coverage` | Log de GitHub Actions. | Defendible como excelente frontend. | Mostrar resumen de tests. |
| Pruebas unitarias backend | Tests backend ejecutables. | Pruebas mockeadas del servicio SMS. | `backend/test/smsService.test.js` | `npm --prefix backend test` | Log local o de CI. | Mejorado; foco en SMS. | Mostrar que no envia SMS reales. |
| Integracion SMS/Twilio | Envio funcional y comprobable. | Servicio Twilio HTTP y pruebas mockeadas. | `smsService.js`, `server.js`, `sms_twilio_evidencia.md` | `npm --prefix backend test` | Captura SMS recibido o dashboard Twilio. | Implementado; evidencia real pendiente. | Anexar captura real si existe. |
| Dockerfile backend | Imagen backend funcional. | Dockerfile Node 20 para API. | `Dockerfile` | `docker build -t local/drivectrl-backend:ci -f Dockerfile .` | Log build. | Defendible. | Mostrar build o workflow. |
| Dockerfile frontend | Imagen frontend funcional. | Dockerfile Vite + Nginx. | `apps/web/Dockerfile` | `docker build -t local/drivectrl-frontend:ci -f apps/web/Dockerfile .` | Log build. | Defendible. | Mostrar build o workflow. |
| Docker Compose | Stack reproducible. | MongoDB, backend, frontend, volumen y healthchecks. | `docker-compose.yml` | `docker compose -f docker-compose.yml config` | Captura `docker compose ps`. | Defendible. | Ejecutar stack antes de sustentar. |
| Red Docker | Comunicacion entre servicios. | Red `drivectrl-net`. | `docker-compose.yml`, `nginx.conf` | `docker network inspect drivectrl-net` | Captura red Docker. | Defendible con captura. | Mostrar proxy `/api`. |
| CI/CD GitHub Actions | Validacion automatica. | Workflows de Sonar, CI y Docker. | `.github/workflows/*.yml` | Ver ejecuciones en GitHub Actions | Captura jobs verdes. | Defendible si Actions esta verde. | Reejecutar si hay checks antiguos. |
| Publicacion DockerHub | Imagenes versionadas. | Workflow publica tags SHA, run y rama. | `docker_ci_cd.yml` | Ver job `docker-publish` | Captura DockerHub. | Requiere evidencia externa. | Confirmar secretos DockerHub. |
| Despliegue con Compose | Despliegue usando imagenes publicadas. | Job `docker-deploy`. | `docker_ci_cd.yml`, `docker-compose.prod.yml` | Compose prod con variables dummy | Captura job deploy. | Requiere evidencia externa. | Anexar logs del job. |
| Reporte agil | Reporte cuantitativo. | Tabla de sprints, commits y participacion. | `reporte_final_sprints.md` | Revision documental | Captura tablero GitHub. | Defendible con salvedad Milestone 4. | Actualizar si Milestone 4 cierra. |
| Milestones | Finalizados segun plan. | 3 finalizados y 1 en curso documentado. | `reporte_final_sprints.md` | GitHub Milestones | Captura milestones. | Parcial mientras Milestone 4 siga abierto. | No afirmar cierre sin evidencia. |
| HU por sprint | HU cerradas y promedio. | 88 HU, promedio documentado. | `reporte_final_sprints.md` | Revision documental | Captura issues por sprint. | Defendible. | Anexar tablero. |
| Commits por sprint | Conteo y promedio. | 405 commits en tabla de sprints. | `reporte_final_sprints.md` | `git log` / Insights | Captura Insights. | Defendible. | Normalizar aliases si preguntan. |
| PRs y revisiones | PRs trazables y evidencia de revision. | PRs #569, #572, #576, #578 documentados. | `reporte_final_sprints.md` | GitHub Pull Requests | Captura PRs y checks. | Requiere capturas. | Mostrar PRs cerrados. |
| Postmortem | Causa raiz y acciones. | Postmortem de cierre agregado. | `reporte_final_sprints.md` | Revision documental | Evidencia de acciones cerradas. | Defendible. | Relacionar acciones con PRs. |
| Trabajo en equipo | Participacion y sustentacion individual. | Tabla por integrante y roles. | `reporte_final_sprints.md` | GitHub Insights | Captura commits por integrante. | Defendible con matices. | Cada integrante debe preparar su defensa. |
| Manejo academico de `.env` | Reproducibilidad sin exponer secretos. | Documento de excepcion academica. | `gestion_variables_entorno.md` | Grep de control redacted | No proyectar `.env`. | Documentado como excepcion temporal. | Rotar credenciales tras entrega. |

## Evidencias manuales que el equipo debe anexar antes de la entrega

- Captura de SonarCloud Quality Gate Passed.
- Captura de coverage superior a 80%.
- Captura de duplications en 0.0% o bajo.
- Captura de Security Hotspots en 0 o revisados.
- Captura de GitHub Actions en verde.
- Captura de DockerHub con imagenes publicadas.
- Captura de contenedores corriendo.
- Captura de red Docker.
- Captura de SMS recibido o dashboard Twilio.
- Captura de issues y milestones cerrados.
- Captura de PRs revisadas.
- Captura de commits por integrante.

## Comandos rapidos de sustentacion

```bash
npm --prefix apps/web run lint
npm --prefix apps/web run test -- --coverage
npm --prefix apps/web run build
npm --prefix backend test
npm --prefix backend run doctor:auth:ci
docker compose -f docker-compose.yml config
BACKEND_IMAGE=drivectrl-backend FRONTEND_IMAGE=drivectrl-frontend IMAGE_TAG=test docker compose -f docker-compose.yml -f docker-compose.prod.yml config
```
