# Indice de sustentacion 5.0

Este paquete organiza la evidencia final de DriveControl / AutoMinder Enterprise para la sustentacion de Fundamentos de Ingenieria de Software. El objetivo es defender cada criterio de la rubrica con trazabilidad, comandos reproducibles y capturas verificables.

Regla de uso: no afirmar que algo fue publicado, desplegado, recibido por SMS o aprobado por SonarCloud si no existe captura, enlace de GitHub Actions, registro de Twilio, reporte de SonarCloud o salida reproducible que lo respalde.

## Resumen ejecutivo

El repositorio contiene frontend React + Vite en `apps/web`, backend Node.js + Express en `backend`, Dockerfile para backend, Dockerfile para frontend, Docker Compose con MongoDB/backend/frontend, workflows de GitHub Actions, SonarCloud configurado y servicio SMS mediante Twilio en backend.

La documentacion final queda separada por criterio. Cada carpeta `img/` contiene un placeholder para que el equipo agregue capturas manuales antes de sustentar.

## Estado por criterio

| Criterio | Peso | Documento | Evidencia requerida | Estado |
|---|---:|---|---|---|
| Metricas de calidad | 20% | [metricas/01_metricas_propias.md](metricas/01_metricas_propias.md) | Codigo, tests, JSON, UI, Sonar | Pendiente capturas |
| SonarCloud | Parte de calidad/pruebas | [sonar/02_sonarcloud.md](sonar/02_sonarcloud.md) | Quality Gate, coverage, duplicacion, mantenibilidad, seguridad | Pendiente capturas |
| Pruebas unitarias | 20% | [pruebas/03_pruebas_unitarias_coverage.md](pruebas/03_pruebas_unitarias_coverage.md) | Tests, coverage, Sonar, pipeline | Backend verificado; frontend/coverage pendiente |
| Docker/CI-CD | 20% | [docker/04_despliegue_docker_ci_cd.md](docker/04_despliegue_docker_ci_cd.md) | Compose, Actions, DockerHub, networking | Pendiente capturas |
| SMS | 10% | [sms/05_integracion_sms_twilio.md](sms/05_integracion_sms_twilio.md) | SMS real, Twilio, logs, tests | Tests mockeados verificados; SMS real pendiente |
| Seguridad/env | Soporte transversal | [seguridad/06_gestion_secretos_variables_entorno.md](seguridad/06_gestion_secretos_variables_entorno.md) | `.env.example`, GitHub Secrets, anexo privado de credenciales academicas | Requiere revision final |
| Agil/Postmortem | 30% | [../../Agile/evidencias_finales/07_agil_postmortem_trazabilidad.md](../../Agile/evidencias_finales/07_agil_postmortem_trazabilidad.md) | Milestones, issues, commits, PRs, release | Pendiente actualizacion |
| Release final | Soporte de cierre | [release/08_release_final.md](release/08_release_final.md) | Tag, rama, PR, changelog, checks | Pendiente release |
| Trabajo en equipo | Participacion | [trabajo_equipo/09_trabajo_equipo.md](trabajo_equipo/09_trabajo_equipo.md) | Issues, commits, PRs por integrante | Pendiente capturas |
| Guion | Sustentacion | [sustentacion/10_guion_sustentacion.md](sustentacion/10_guion_sustentacion.md) | Orden de presentacion y responsables | Pendiente ensayo |

## Tabla final de evidencias

| Evidencia | Archivo esperado | Donde debe agregarse | Estado |
|---|---|---|---|
| Pantalla de metricas propias en UI | `metricas/img/metricas-ui.png` | `metricas/img/` | Pendiente |
| JSON generado por metricas | `metricas/img/quality-metrics-json.png` | `metricas/img/` | Pendiente |
| Quality Gate SonarCloud | `sonar/img/sonar-quality-gate.png` | `sonar/img/` | Pendiente |
| Coverage SonarCloud | `sonar/img/sonar-coverage.png` | `sonar/img/` | Pendiente |
| Duplications SonarCloud | `sonar/img/sonar-duplications.png` | `sonar/img/` | Pendiente |
| Maintainability SonarCloud | `sonar/img/sonar-maintainability.png` | `sonar/img/` | Pendiente |
| Security Hotspots SonarCloud | `sonar/img/sonar-security-hotspots.png` | `sonar/img/` | Pendiente |
| Tests frontend con coverage | `pruebas/img/frontend-tests-coverage.png` | `pruebas/img/` | Pendiente |
| Tests backend SMS | `pruebas/img/backend-tests-sms.png` | `pruebas/img/` | Verificado por comando; falta captura |
| Workflow CI en verde | `pruebas/img/github-actions-tests.png` | `pruebas/img/` | Pendiente |
| Compose local healthy | `docker/img/docker-compose-ps.png` | `docker/img/` | Pendiente |
| Red Docker | `docker/img/docker-network-inspect.png` | `docker/img/` | Pendiente |
| DockerHub backend/frontend | `docker/img/dockerhub-tags.png` | `docker/img/` | Pendiente |
| Deploy workflow | `docker/img/github-actions-docker-deploy.png` | `docker/img/` | Pendiente |
| Formulario SMS | `sms/img/sms-formulario.png` | `sms/img/` | Pendiente |
| SMS recibido | `sms/img/sms-recibido-redacted.png` | `sms/img/` | Pendiente |
| Dashboard Twilio | `sms/img/twilio-message-status-redacted.png` | `sms/img/` | Pendiente |
| Milestones cerrados | `../../Agile/evidencias_finales/img/milestones-cerrados.png` | `Docs/Agile/evidencias_finales/img/` | Pendiente |
| Board/Issues Sprint 13 | `../../Agile/evidencias_finales/img/issues-sprint-13.png` | `Docs/Agile/evidencias_finales/img/` | Pendiente |
| PR final a develop/main | `release/img/pr-release-final.png` | `release/img/` | Pendiente |
| Tag o release final | `release/img/release-tag.png` | `release/img/` | Pendiente |
| Insights contributors | `trabajo_equipo/img/github-insights-contributors.png` | `trabajo_equipo/img/` | Pendiente |

## Checklist global antes de sustentar

- [ ] Working tree limpio o con cambios documentales controlados.
- [ ] Rama de trabajo `feature-sarm-m`.
- [ ] PR abierto hacia `develop`.
- [ ] Issues relacionadas cerradas con `Closes #ID` cuando aplique.
- [ ] README actualizado al stack real: React + Vite, Node/Express, MongoDB, Docker, SonarCloud y Twilio.
- [ ] No hay credenciales reales en README, docs publicos, capturas ni ejemplos.
- [ ] `.env.example` existe con placeholders.
- [ ] `.gitignore` ignora `.env` reales.
- [ ] Se preparo anexo privado de credenciales academicas para el profesor.
- [ ] Se rotaron credenciales si alguna fue versionada en el historial publico.
- [ ] `npm --prefix apps/web ci` ejecutado por el equipo o en CI.
- [ ] `npm --prefix apps/web test` con coverage capturado.
- [ ] `npm --prefix backend test` capturado.
- [ ] SonarCloud Quality Gate capturado.
- [ ] Docker Compose capturado con servicios healthy.
- [ ] Publicacion DockerHub capturada si se defiende nivel excelente en CI/CD.
- [ ] SMS real capturado si se defiende nivel excelente en integracion SMS.
- [ ] Milestone final cerrado o estado real explicado sin exagerar.
- [ ] Postmortem final actualizado con causa raiz y acciones concretas.
- [ ] Cada integrante tiene aporte defendible: issue, commit, PR y evidencia.

## Trazabilidad base recomendada

| Elemento | Convencion |
|---|---|
| Rama de trabajo | `feature-sarm-m` |
| Rama destino | `develop` |
| Commit | Convencional, claro y con punto final. Ejemplo: `docs: agregar evidencias finales de sustentacion.` |
| PR | Debe incluir resumen, evidencias, comandos ejecutados y `Closes #ID` si cierra issue. |
| Evidencia | Captura en `img/`, enlace a PR, enlace a Actions o salida reproducible. |
