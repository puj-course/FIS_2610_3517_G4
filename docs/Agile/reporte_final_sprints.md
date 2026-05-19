# Reporte final de sprints, milestones y postmortem

Proyecto: DriveControl / AutoMinder Enterprise
Equipo: SYNTIX TECH
Curso: Fundamentos de Ingeniería de Software
Profesor: Luis Gabriel Moreno Sandoval
Fecha de consolidación: 19 de mayo de 2026
Repositorio: <https://github.com/puj-course/FIS_2610_3517_G4>

## 1. Resumen ejecutivo

Este documento es la fuente central de la evidencia ágil del semestre. Consolida Scrum académico, GitHub Issues, milestones, Pull Requests, ramas, commits, revisiones disponibles, trazabilidad y postmortem técnico/de proceso para cubrir explícitamente el criterio **Metodologías ágiles y postmortem — 30%**.

La fuente principal para las métricas nuevas es GitHub live mediante `gh`, complementada por Git local y anexos versionados en `docs/Entrega-Final/anexos/`. Las cifras antiguas del reporte previo se conservan como histórico cuando no coinciden con GitHub live; no se usan para inflar artificialmente el desempeño.

## 2. Fuentes de datos usadas

| Fuente | Uso | Estado |
|---|---|---|
| GitHub CLI autenticado sobre `puj-course/FIS_2610_3517_G4` | Issues, PRs, reviews, milestones | Verificado |
| Git local `git log --all` | Commits por sprint y por integrante | Verificado |
| `docs/Entrega-Final/anexos/issues.json` | Respaldo de issues exportadas | Disponible |
| `docs/Entrega-Final/anexos/pull_requests.json` | Respaldo de PRs exportados | Disponible |
| `docs/Entrega-Final/anexos/commits_detalle.tsv` | Respaldo de commits exportados | Disponible |
| `docs/Entrega-Final/evidencias/` | Capturas de milestones, tablero, contributors, PRs y commits | Disponible parcialmente |
| `Sesión 2- Postmortem.pdf` | Guía del profesor sobre producto, esfuerzo, proceso, datos de calidad, roles y Starfish | Verificado |

## 3. Milestones válidos del semestre

Solo se usan estos cuatro milestones. Se ignora explícitamente el milestone de taller `Taller, para aprender github`.

| Milestone | Objetivo | Issues cerradas | HU cerradas trazables | PRs con milestone GitHub | Estado |
|---|---|---:|---:|---:|---|
| Milestone 1 - Base funcional del sistema | Establecer base MERN, autenticación, dashboard inicial y GitFlow. | 76 | 24 | 9 | Finalizado |
| Milestone 2 - Gestión básica de flota | Consolidar gestión de flota, patrones y validación RUNT. | 37 | 14 | 1 | Finalizado |
| Milestone 3 - Gestión documental y monitoreo | Integrar documentos, persistencia, monitoreo y controles de seguridad. | 38 | 14 | 0 | Finalizado |
| Milestone 4 - Dashboard, alertas y cierre del sistema | Cerrar dashboard, alertas, CI/CD, SMS, calidad y entrega final. | 132 | 20 | 3 | Finalizado con PR abierto de cierre |

Lectura para la rúbrica: los 4 milestones funcionales aparecen cerrados en GitHub para issues. El único elemento abierto asociado a M4 es el PR `#628`, por lo que se reporta como pendiente de integración y no como issue funcional abierta.

## 4. Métricas consolidadas

| Métrica | Valor verificado | Interpretación |
|---|---:|---|
| Sprints académicos revisados | 13 | Cobertura del semestre completo, no solo Sprint 13. |
| Issues cerradas en M1-M4 | 283 | Issues con milestone funcional válido y estado cerrado. |
| HU cerradas trazables | 72 | Conteo estricto por patrón `HU-`, `HU `, `[HU-...]` o `Historia de usuario`. |
| Promedio HU/sprint | 5.54 | 72 HU / 13 sprints. |
| Commits en corte académico | 630 | `git log --all` entre 2026-02-16 y 2026-05-17 23:59:59. |
| Promedio commits/sprint | 48.46 | 630 commits / 13 sprints. |
| Pull Requests totales | 161 | PRs en todos los estados. |
| Pull Requests mergeadas | 134 | Evidencia de integración continua por PR. |
| Pull Requests abiertas | 1 | PR `#628`, asociado a M4. |
| Pull Requests cerradas sin merge | 26 | Trabajo descartado, reemplazado o no integrado. |
| Reviews detectadas | 8 | Dato disponible desde `gh pr list --json reviews`. |
| Tags/releases verificables | 0 | No existen releases/tags verificables en GitHub local/live. |

## 5. Cifras históricas pendientes de reconciliación

El reporte anterior contenía 88 HU, 375 issues y 405 commits. Esas cifras se conservan como histórico del documento previo, pero quedan marcadas como **pendientes de reconciliación** porque el cálculo live con GitHub y Git local arroja 72 HU estrictas, 283 issues cerradas en M1-M4 y 630 commits en el corte académico. La diferencia puede explicarse por criterios distintos: conteo manual, issues sin milestone, issues de taller, commits filtrados por rama o exclusión de merges.

## 6. Trazabilidad por sprint

| Sprint | Periodo | Issues cerradas M1-M4 | HU cerradas estrictas | Commits Git local | Lectura |
|---|---|---:|---:|---:|---|
| S1 | 2026-02-16 a 2026-02-22 | 0 | 0 | 30 | Inicio técnico y preparación de base. |
| S2 | 2026-02-23 a 2026-03-01 | 4 | 0 | 14 | Primer cierre verificable de issues. |
| S3 | 2026-03-02 a 2026-03-08 | 16 | 7 | 33 | Consolidación inicial de HU. |
| S4 | 2026-03-09 a 2026-03-15 | 25 | 7 | 30 | Cierre funcional de M1. |
| S5 | 2026-03-16 a 2026-03-22 | 11 | 2 | 30 | Arranque de gestión de flota. |
| S6 | 2026-03-23 a 2026-03-29 | 10 | 2 | 26 | Avance incremental de flota. |
| S7 | 2026-03-30 a 2026-04-05 | 16 | 6 | 14 | Integración de validaciones. |
| S8 | 2026-04-06 a 2026-04-12 | 36 | 10 | 94 | Cierre fuerte de M2 y deuda técnica. |
| S9 | 2026-04-13 a 2026-04-19 | 42 | 14 | 76 | Mayor cierre funcional de M3. |
| S10 | 2026-04-20 a 2026-04-26 | 9 | 2 | 6 | Cierre documental y monitoreo. |
| S11 | 2026-04-27 a 2026-05-03 | 40 | 5 | 81 | Inicio del cierre técnico. |
| S12 | 2026-05-04 a 2026-05-10 | 2 | 2 | 61 | Preparación CI/CD, QA y evidencia. |
| S13 | 2026-05-11 a 2026-05-17 | 72 | 15 | 135 | Cierre de rúbrica, Docker, SonarCloud, SMS y documentación. |

## 7. Trazabilidad por milestone

| Milestone | Sprints asociados | Commits por ventana de sprint | Issues cerradas | HU cerradas | PRs destacados |
|---|---|---:|---:|---:|---|
| M1 | S1-S4 | 107 | 76 | 24 | `#130`, `#168`, `#170`, `#171`, `#172`, `#173`, `#174`, `#177`, `#208` |
| M2 | S5-S8 | 164 | 37 | 14 | `#233` |
| M3 | S9-S10 | 82 | 38 | 14 | Sin PR con milestone asignado en GitHub |
| M4 | S11-S13 | 277 | 132 | 20 | `#232`, `#488`, `#628` |

Los commits por milestone se calculan por ventana de sprint, no por enlace directo issue-commit. Cuando no hay PR con milestone asignado, se deja explícito para no inventar trazabilidad.

## 8. Participación por integrante

### Issues asignadas en M1-M4

Las issues pueden tener más de una persona asignada; por eso la suma de asignaciones puede superar el total de issues.

| Integrante | M1 issues/HU | M2 issues/HU | M3 issues/HU | M4 issues/HU | Lectura |
|---|---:|---:|---:|---:|---|
| `Sarm-m` | 21 / 5 | 9 / 4 | 5 / 1 | 43 / 3 | Alta participación en coordinación, evidencia y cierre. |
| `samuelfl680` | 16 / 2 | 3 / 2 | 11 / 5 | 56 / 10 | Alta carga en configuración, pruebas y cierre técnico. |
| `juanvargax` | 42 / 12 | 5 / 1 | 10 / 2 | 22 / 2 | Alta participación en backlog, producto y planeación. |
| `solonlosada2006` | 11 / 1 | 18 / 6 | 14 / 3 | 30 / 4 | Participación sostenida en DevOps, CI/CD y flota. |
| `Juserora` | 21 / 4 | 6 / 1 | 11 / 3 | 17 / 2 | Participación en QA, pruebas, hallazgos y validación. |

### Commits por integrante

| Integrante normalizado | Commits en corte académico | Lectura |
|---|---:|---|
| `Sarm-m` | 233 | Mayor volumen de commits, especialmente documentación, cierre y coordinación técnica. |
| `samuelfl680` | 136 | Participación fuerte en configuración, pruebas y soporte técnico. |
| `juanvargax / juansebastianvd` | 114 | Participación funcional y de producto con alias normalizados. |
| `solonlosada2006` | 72 | Aportes asociados a DevOps, pipelines y despliegue. |
| `juserora` | 51 | Aportes de QA, pruebas y ajustes funcionales. |
| Otros autores/bots | 24 | Cuentas de laboratorio, bot y autores sin normalización completa. |

## 9. Pull Requests y revisiones

| Métrica PR | Valor | Observación |
|---|---:|---|
| PRs totales | 161 | Incluye todo el repositorio. |
| PRs mergeadas | 134 | Evidencia de integración por ramas. |
| PRs abiertas | 1 | `#628`, M4, pendiente de integración. |
| PRs cerradas sin merge | 26 | Trabajo no integrado o reemplazado. |
| Reviews detectadas | 8 | Dato disponible desde `gh`; no se inventan revisiones faltantes. |

Reviews detectadas:

| Reviewer | Reviews |
|---|---:|
| `juanvargax` | 3 |
| `samuelfl680` | 2 |
| `copilot-pull-request-reviewer` | 2 |
| `copilot-swe-agent` | 1 |

## 10. Control de versiones, ramas y releases

Ramas verificadas:

`develop`, `feature-Slosada`, `feature-sarm-m`, `main`, `origin/copilot/check-web-functionality-errors`, `origin/develop`, `origin/feature-Slosada`, `origin/feature-Vargas-J`, `origin/feature-juserora`, `origin/feature-samuelfl680`, `origin/feature-sarm-m`, `origin/feature/docker-deploy`, `origin/feature/pipelines`, `origin/main`, `origin/revert-422-feature-Slosada`.

No existen tags/releases verificables. La trazabilidad por versión se sustenta con ramas, PRs, merges, capturas de GitHub, commits y milestones cerrados.

## 11. Postmortem general del semestre

### Producto

Se produjo una plataforma MERN para gestión de flota, autenticación, documentos, alertas, métricas de calidad, SMS/Twilio, Docker Compose y CI/CD. El producto evolucionó desde una base funcional inicial hacia un sistema desplegable con evidencia de pruebas, SonarCloud, DockerHub y GitHub Actions.

### Esfuerzo

El esfuerzo fue medible por issues, HU, commits, PRs y roles. La participación no fue idéntica por volumen, pero sí tuvo contribuciones claras por especialidad: Scrum, producto, configuración, DevOps y QA.

### Proceso

El proceso mejoró de forma incremental: GitFlow y autonomía en M1, issues atómicas en M2, QA y Scrum Poker en M3, y cierre con CI/CD, SonarCloud y evidencia en M4.

### Roles

La guía del profesor pide evaluar roles con hechos objetivos. Por eso los documentos de milestone conectan cada rol con evidencia: issues asignadas, commits, PRs, hallazgos de QA, configuración, CI/CD y seguimiento de riesgos.

## 12. Causas raíz principales

| Problema | Causa raíz técnica | Causa raíz de proceso | Acción de mejora |
|---|---|---|---|
| Integraciones con fallos iniciales | Falta de validación local antes de merge | Definition of Done incompleto | Exigir build local y checklist antes de PR. |
| Retrabajo por entornos distintos | Rutas, alias e infraestructura no homogéneos | Riesgo técnico no identificado al planear | Usar Docker Compose y reglas de naming desde el inicio. |
| Credenciales expuestas temporalmente | Variables `.env` configuradas tarde | Gestión de secretos tardía | Definir `.env.example`, secrets y revisión de seguridad desde día 1. |
| Quality Gate bajo presión | Cobertura y hotspots tratados tarde | Calidad vista como cierre, no como práctica continua | Incrementar pruebas durante cada sprint. |
| Evidencia incompleta o tardía | Capturas y anexos no recolectados al cerrar HU | Evidencia no estaba en el DoD | Incorporar evidencia requerida antes de cerrar issues. |

## 13. Retrospectiva estrella de mar general

### Comenzar a hacer

- Definir un Definition of Done con evidencia, build local, revisión y captura mínima antes de cerrar cada HU.
- Registrar datos de métricas ágiles al cierre de cada sprint para evitar reconciliaciones tardías.
- Automatizar exportaciones con `gh` y anexarlas al repositorio después de cada milestone.

### Más de

- Revisar PRs con foco funcional y no solo con foco de compilación.
- Usar Scrum Poker cuando haya historias con incertidumbre técnica.
- Capturar evidencia visual en el mismo momento en que se valida una funcionalidad.

### Seguir haciendo

- Mantener issues, PRs y commits trazables para sustentar trabajo individual y de equipo.
- Conservar postmortems por milestone con causas raíz y acciones concretas.
- Usar GitHub como fuente objetiva de seguimiento académico.

### Menos de

- Depender de cierres masivos al final del sprint.
- Usar métricas manuales sin explicar su criterio de cálculo.
- Abrir PRs de cierre sin validación funcional local previa.

### Dejar de hacer

- Contar milestones de taller como evidencia funcional del producto.
- Presentar cifras sin separar issues, HU, PRs y milestone items.
- Postergar seguridad, QA y evidencia para los últimos días.

## 14. Relación explícita con la rúbrica

| Criterio de la rúbrica Agile/Postmortem | Evidencia en este paquete |
|---|---|
| Milestones finalizados | M1-M4 documentados y cerrados en issues. |
| HU terminadas y trazables | 72 HU estrictas cerradas, con desglose por sprint y milestone. |
| HU por sprint y promedio | Tabla de 13 sprints y promedio 5.54 HU/sprint. |
| Commits por sprint y promedio | Tabla de 13 sprints y promedio 48.46 commits/sprint. |
| Distribución de participación | Issues/HU por integrante y commits normalizados. |
| PRs y revisiones | 161 PRs, 134 mergeadas, 8 reviews detectadas. |
| Control de versiones | Ramas, PRs, merges y ausencia explícita de releases/tags. |
| Trazabilidad por versión | PRs, ramas y evidencias de cierre; releases no verificables. |
| Postmortem profundo | Producto, esfuerzo, proceso, roles, causas raíz y acciones. |
| Acciones concretas | Planes de mejora por milestone y plan general. |

## 15. Métricas pendientes

| Dato | Estado |
|---|---|
| Reconciliación final entre 88 HU históricas y 72 HU estrictas | Pendiente de auditoría manual del criterio original. |
| Reconciliación entre 375 issues históricas y 283 issues cerradas M1-M4 | Pendiente de auditoría de issues sin milestone o no funcionales. |
| Reviews completas por PR vía GraphQL | Pendiente de exportación desde GitHub API si se requiere mayor detalle. |
| Releases/tags | No existen releases/tags verificables. |

## 16. Conclusión

El semestre evidencia una aplicación rigurosa y cuantitativa de Scrum académico. Los documentos nuevos en `docs/Agile/` separan los datos verificables de los pendientes, eliminan milestones de taller, fortalecen el postmortem con la guía del profesor y dejan trazabilidad defendible para la rúbrica final.
