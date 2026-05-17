# Milestone 4 - Dashboard, calidad, despliegue y cierre

## Objetivo

Cerrar el proyecto con dashboard/reportes, metricas de calidad, pruebas, SonarCloud, SMS, Docker, CI/CD y evidencia final.

## Alcance planificado

| Elemento | Evidencia |
|---|---|
| Metricas propias | `qualityMetrics.js`, `qualityMetrics.test.js`, `generate-quality-evidence.mjs` |
| SonarCloud | `sonar-project.properties`, `.github/workflows/sonarcloud.yml` |
| Pruebas | `apps/web/src/__tests__/`, `backend/test/smsService.test.js` |
| Docker/CI-CD | Dockerfiles, Compose, `.github/workflows/docker_ci_cd.yml` |
| SMS | `backend/services/smsService.js`, `integracion-sms.md` |
| Postmortem | `postmortem.md` |

## Historias de usuario asociadas

| HU/Issue | Evidencia | Estado a validar |
|---|---|---|
| `#556` Automatizar metricas propias | Codigo, tests, PRs #577-#581 | Validar cierre en GitHub |
| `#557` Implementar metricas propias | `qualityMetrics.js`, `ReportesPage.jsx` | Validar cierre en GitHub |
| `#558` Validar/documentar metricas | Tests y docs | Validar cierre en GitHub |
| `#584` Evidencia Docker/CI-CD | PRs #585/#586, workflows | Validar cierre en GitHub |
| `#611` SMS/Twilio y Docker | Servicio SMS/tests/Compose | Validar cierre en GitHub |

## Riesgos

| Riesgo | Impacto | Accion |
|---|---|---|
| Sin capturas Sonar actuales | Pierde fuerza en calidad/pruebas. | Ejecutar workflow y capturar dashboard. |
| Sin DockerHub real | CI/CD puede quedar parcial. | Configurar secrets y capturar tags. |
| Sin SMS real | Integracion puede quedar como mock. | Probar Twilio y capturar evidencia. |
| Sin release/tag | Control de versiones queda incompleto. | Crear tag/release final o documentar ausencia. |

## Resultado final

La configuracion y la documentacion quedaron preparadas para sustentacion. El equipo debe completar evidencias externas no accesibles desde el entorno local.

## Lecciones aprendidas

La evidencia de cierre debe recolectarse durante cada sprint; dejarla para el final aumenta riesgo aunque el codigo exista.
