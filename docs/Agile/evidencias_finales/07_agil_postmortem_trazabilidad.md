# 07 - Metodologias agiles, postmortem y trazabilidad

Este documento cubre la evidencia agil requerida para la rubrica: milestones, historias de usuario, issues, commits por sprint, participacion, ramas, PRs, release y postmortem.

## Estado actual a verificar

No afirmar cierre total hasta capturar GitHub con milestones e issues cerradas. Si hay issues abiertas de ceremonias, evidencia Docker o Sprint 13, deben cerrarse o justificarse antes de sustentar.

## Evidencia requerida por la rubrica

| Requisito | Evidencia esperada | Estado |
|---|---|---|
| Milestones finalizados segun lo planificado | Captura de GitHub Milestones | Pendiente |
| Todas las HU terminadas y trazables | Issues cerradas por sprint | Pendiente |
| HU cerradas por sprint | Tabla y captura de filtros GitHub | Pendiente |
| Promedio HU por sprint | Calculo documentado | Pendiente validar |
| Commits por sprint | Tabla con comando o Insights | Pendiente validar |
| Distribucion por integrantes | GitHub Insights normalizado | Pendiente capturas |
| PRs y revisiones | Capturas de PRs y comentarios | Pendiente |
| Control de versiones | Branches, PR final, release/tag | Pendiente |
| Postmortem profundo | Causa raiz, impacto, accion, prevencion | Documentar y actualizar |

## Comandos reproducibles

Commits por autor:

```bash
git shortlog -sne --all
```

Commits por fecha:

```bash
git log --all --since="2026-02-16" --until="2026-05-17 23:59:59" --format="%ad" --date=short
```

Commits detallados:

```bash
git log --all --since="2026-02-16" --until="2026-05-17 23:59:59" --format="%h %ad %an %s" --date=short
```

## Matriz de trazabilidad esperada

| Sprint | HU/Issue | Branch | Commit | PR | Estado | Evidencia |
|---|---|---|---|---|---|---|
| Sprint 13 | `#556` Metricas propias | `feature-sarm-m` | Ver PR | PR hacia `develop`/`main` | Cerrada en GitHub | Capturas Sonar/tests |
| Sprint 13 | `#557` Integracion metricas en reportes | `feature-sarm-m` | Ver PR | PR hacia `develop`/`main` | Cerrada en GitHub | Captura UI reportes |
| Sprint 13 | `#558` Validacion metricas | `feature-sarm-m` | Ver PR | PR hacia `develop`/`main` | Cerrada si GitHub lo confirma | Tests metricas |
| Sprint 13 | `#584` Docker/CI-CD evidencia | Rama DevOps o `feature-sarm-m` | Ver PR | PR hacia `develop` | Abierta en GitHub | Capturas Docker/Actions |

## Postmortem final

| Problema | Causa raiz tecnica | Causa raiz de proceso | Impacto | Accion correctiva | Evidencia de cierre | Prevencion |
|---|---|---|---|---|---|---|
| Coverage insuficiente en algun PR | Codigo nuevo sin pruebas de ramas criticas | Se integro antes de completar DoD | Riesgo de fallar Quality Gate | Agregar tests deterministas y revisar `lcov.info` antes de PR | Captura tests + Sonar | DoD con coverage local |
| Evidencia Docker incompleta | Pipeline/documentacion no estaban sincronizados | Evidencias se dejaron para el cierre | Riesgo de perder puntos CI/CD | Capturar compose, Actions, DockerHub y networking | Capturas `docker/img/` | Checklist por release |
| SMS sin evidencia real | Credenciales/proveedor dependen de entorno externo | Prueba manual no se anexo con el codigo | Riesgo de calificar como parcial | Capturar SMS y Twilio redacted | Capturas `sms/img/` | Evidencia manual obligatoria por release |
| Secretos versionados o expuestos | `.env` agregado al repo o historial | Falta de politica temprana de secretos | Riesgo de seguridad | Reemplazar por placeholders y rotar credenciales | Capturas seguridad/env | GitHub Secrets + `.env.example` |
| README desactualizado | Cambio de stack no reflejado | Documentacion actualizada tarde | Confusion en reproducibilidad | Actualizar README a React/Vite + Node/Express | README actualizado | Revision docs en cada sprint |

## Evidencias pendientes

| Captura | Archivo esperado | Estado |
|---|---|---|
| Milestones cerrados | `img/milestones-cerrados.png` | Pendiente |
| Issues Sprint 13 | `img/issues-sprint-13.png` | Pendiente |
| Board/Project | `img/project-board-final.png` | Pendiente |
| Commits por sprint | `img/commits-por-sprint.png` | Pendiente |
| Contributors Insights | `img/contributors-insights.png` | Pendiente |
| PRs cerrados | `img/prs-cerrados.png` | Pendiente |
| Release/tag final | `img/release-final.png` | Pendiente |

## Acciones para defender 5.0

- [ ] Cerrar o justificar todas las issues abiertas relacionadas con la entrega final.
- [ ] Actualizar `Docs/Agile/reporte_final_sprints.md` con el estado real final.
- [ ] Normalizar aliases de autores antes de presentar porcentajes.
- [ ] Capturar GitHub Milestones, Issues, PRs e Insights.
- [ ] Crear tag/release final y relacionarlo con el PR final.
- [ ] Cada integrante prepara su aporte individual con issue, commit, PR y evidencia.
