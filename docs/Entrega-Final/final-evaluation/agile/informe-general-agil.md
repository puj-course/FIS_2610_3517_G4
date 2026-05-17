# Informe general agil

## Metodologia usada

El proyecto combina Scrum academico por sprints/milestones con tablero Kanban en GitHub Issues. La evidencia debe presentarse como trazabilidad de HU, issues, ramas, commits, PRs y milestones.

## Roles del equipo

| Rol | Responsabilidad defendible | Evidencia |
|---|---|---|
| Scrum Master academico | Gestion de sprints, ceremonias, reporte, postmortem y metricas. | `Docs/Agile/`, issues de sprint, reportes finales |
| DevOps engineer | Docker, CI/CD, SonarCloud, DockerHub y despliegue. | `.github/workflows/`, `docker-compose.yml`, Dockerfiles |
| QA lead | Pruebas, coverage, Sonar, metricas propias y evidencias. | `apps/web/src/__tests__/`, `backend/test/`, docs QA |
| Backend developer | API, autenticacion, MongoDB, OTP, SMS. | `backend/` |
| Frontend developer | React/Vite, vistas, adaptadores, reportes y experiencia de usuario. | `apps/web/src/` |

## Flujo Scrum/Kanban

1. Sprint planning: convertir HU en issues con criterios de aceptacion.
2. Desarrollo: rama `feature-*` o `feature/<tema>`.
3. Integracion: commits con referencia `Refs #ID` o `Closes #ID`.
4. Pull Request: descripcion, validaciones y evidencia.
5. Review/CI: lint, tests, build, Sonar/Docker si aplica.
6. Cierre: merge a `develop`/`main`, actualizacion de milestone y evidencias.

## Definition of Ready

| Criterio | Requisito |
|---|---|
| Valor | La HU explica usuario, necesidad y beneficio. |
| Alcance | Lista lo incluido y lo excluido. |
| Criterios | Tiene criterios verificables. |
| Datos | Identifica dependencias, variables o fixtures. |
| Trazabilidad | Define milestone/sprint y responsable. |

## Definition of Done

| Criterio | Requisito |
|---|---|
| Codigo | Lint/build sin errores. |
| Pruebas | Tests relevantes agregados o justificacion si no aplica. |
| Coverage | LCOV generado cuando toca frontend. |
| Seguridad | Sin secretos ni logs sensibles. |
| CI | Workflow verde o evidencia local documentada. |
| Documentacion | README/docs actualizados si cambia despliegue, QA o arquitectura. |
| Trazabilidad | Issue, branch, commit y PR conectados. |

## Convenciones

| Elemento | Convencion |
|---|---|
| Ramas | `feature-sarm-m`, `feature-Slosada`, `feature-Vargas-J`, `feature/docker-deploy`, etc. |
| Commits | Verbo claro, referencia a issue cuando aplica: `feat(metrics): ... Closes #557`. |
| PR | Resumen, cambios, validaciones, evidencia y issues relacionadas. |
| Releases | Crear tag/release final si se defiende control de versiones excelente. |

## Trazabilidad Issue -> Branch -> Commit -> PR -> Milestone

| Ejemplo real observado | Evidencia |
|---|---|
| `#556`, `#557`, `#558` conectan metricas propias con commits `Closes` y PRs de calidad. | Git log, PRs #577-#581, docs de metricas |
| `#584` conecta despliegue Docker/CI-CD con PRs #585/#586. | Conector GitHub y docs Docker |
| `#611`, `#612`, `#613` documentan SMS/Twilio y variables Docker. | Conector GitHub |

Los estados finales de cada issue/milestone deben exportarse con `scripts/agile/export_github_data.sh`, porque este entorno no tiene `gh`.

## Control del avance y cierre de HU

El avance se controla por:

- Issues por sprint/milestone.
- Commits por fecha y por integrante.
- PRs hacia `develop`/`main`.
- Workflows de CI/CD.
- Evidencias en docs.

Para validar cierre de HU, el equipo debe mostrar la issue cerrada, el PR mergeado, los commits referenciados y la evidencia funcional o tecnica.
