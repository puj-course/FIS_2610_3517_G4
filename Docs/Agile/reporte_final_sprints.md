# Reporte final de sprints

Este reporte resume la evidencia agil del equipo. La matriz final para sustentacion esta en:

- [Agil, postmortem y trazabilidad](evidencias_finales/07_agil_postmortem_trazabilidad.md)

## Advertencia de integridad

Los datos finales deben validarse contra GitHub antes de sustentar. No presentar un milestone como cerrado si GitHub aun muestra issues abiertas. No presentar conteos de commits sin normalizar aliases de autor.

## Cuadro de control de milestones

| Milestone | Descripcion | Estado a sustentar | Evidencia requerida |
|---|---|---|---|
| 1. Base funcional del sistema | Entorno, repositorio, autenticacion y layout base. | Verificar en GitHub | `evidencias_finales/img/milestones-cerrados.png` |
| 2. Gestion basica de flota | CRUD de vehiculos, filtros e integracion de datos. | Verificar en GitHub | `evidencias_finales/img/milestones-cerrados.png` |
| 3. Gestion documental y monitoreo | SOAT, RTM, licencias, semaforizacion y reportes. | Verificar en GitHub | `evidencias_finales/img/milestones-cerrados.png` |
| 4. Dashboard, alertas y cierre | Dashboard, calidad, pruebas, despliegue y cierre. | Debe cerrarse o justificarse | `evidencias_finales/img/issues-sprint-13.png` |

## Metricas agiles a presentar

| Indicador | Como obtenerlo | Evidencia |
|---|---|---|
| HU cerradas por sprint | GitHub Issues filtrado por milestone/sprint | Captura de issues |
| Promedio HU por sprint | Total HU cerradas / numero de sprints | Tabla calculada |
| Commits por sprint | `git log` por rango de fechas | Captura o tabla |
| Promedio commits por sprint | Total commits / numero de sprints | Tabla calculada |
| Participacion por integrante | GitHub Insights + normalizacion de aliases | Captura contributors |
| PRs y revisiones | GitHub Pull Requests | Captura PRs |
| Release final | GitHub Releases/tags | Captura release |

## Comandos utiles

```bash
git shortlog -sne --all
git log --all --format="%an <%ae>" | sort | uniq
git log --all --since="2026-02-16" --until="2026-05-17 23:59:59" --format="%h %ad %an %s" --date=short
```

En PowerShell:

```powershell
git shortlog -sne --all
git log --all --format="%an <%ae>" | Sort-Object | Get-Unique
git log --all --since="2026-02-16" --until="2026-05-17 23:59:59" --format="%h %ad %an %s" --date=short
```

## Trazabilidad minima

| Sprint | Issue/HU | Branch | Commit | PR | Evidencia |
|---|---|---|---|---|---|
| Sprint 13 | `#556` Metricas propias | `feature-sarm-m` | Ver PR | PR hacia `develop`/`main` | Tests, Sonar, docs |
| Sprint 13 | `#557` Integracion metricas | `feature-sarm-m` | Ver PR | PR hacia `develop`/`main` | UI reportes |
| Sprint 13 | `#558` Validacion metricas | `feature-sarm-m` | Ver PR | PR hacia `develop`/`main` | `qualityMetrics.test.js` |
| Sprint 13 | `#584` Evidencia Docker/CI-CD | Rama de DevOps o `feature-sarm-m` | Ver PR | PR hacia `develop` | Capturas Docker/Actions |

## Postmortem

| Problema | Causa raiz | Impacto | Accion correctiva | Evidencia requerida |
|---|---|---|---|---|
| Coverage insuficiente en algun PR | Pruebas tardias para codigo nuevo. | Riesgo de Quality Gate fallido. | Agregar tests antes del merge. | Captura tests + Sonar. |
| Evidencia Docker incompleta | Capturas no anexadas al cierre. | Riesgo de calificacion parcial en CI/CD. | Capturar Compose, Actions, DockerHub y red. | `Docs/QA/evidencias_finales/docker/img/`. |
| SMS sin evidencia real | Prueba depende de Twilio y telefono receptor. | Riesgo de quedar en integracion parcial. | Capturar SMS real y dashboard Twilio. | `Docs/QA/evidencias_finales/sms/img/`. |
| Secretos versionados | `.env` o valores reales en historial. | Riesgo de seguridad. | Reemplazar por placeholders y rotar credenciales. | `Docs/QA/evidencias_finales/seguridad/img/`. |
| README desactualizado | Evolucion del stack no documentada. | Confusion para reproducir. | Actualizar README al stack real. | README actualizado. |

## Checklist antes de sustentar

- [ ] Milestone final cerrado o estado real justificado.
- [ ] Issues de evidencia cerradas o marcadas como pendientes con razon.
- [ ] Capturas en `Docs/Agile/evidencias_finales/img/`.
- [ ] Autores normalizados.
- [ ] Cada integrante tiene issue, commit, PR y evidencia.
- [ ] Postmortem conectado con acciones verificables.
