# Milestone 4 - Dashboard, alertas y cierre del sistema

## 1. Objetivo del milestone

Cerrar el sistema con dashboard consolidado, alertas documentales, CI/CD, Docker, SonarCloud, SMS/Twilio, métricas de calidad y paquete final de evidencia para la rúbrica.

## 2. Alcance funcional

- Consolidar dashboard y alertas.
- Validar métricas propias y SonarCloud.
- Documentar y evidenciar Docker Compose, red y despliegue.
- Integrar SMS/Twilio y pruebas asociadas.
- Centralizar evidencia final y cierre metodológico.

## 3. Historias de usuario asociadas

GitHub live reporta 20 HU cerradas trazables dentro de este milestone.

| HU / issue | Referencia |
|---|---|
| `#618` Consolidar entrega técnica final según rúbrica | <https://github.com/puj-course/FIS_2610_3517_G4/issues/618> |
| `#619` Consolidar métricas de calidad, SonarCloud y coverage | <https://github.com/puj-course/FIS_2610_3517_G4/issues/619> |
| `#620` Validar Docker Compose, red Docker y despliegue local | <https://github.com/puj-course/FIS_2610_3517_G4/issues/620> |
| `#621` Documentar CI/CD, DockerHub y workflows | <https://github.com/puj-course/FIS_2610_3517_G4/issues/621> |
| `#622` Consolidar SMS, seguridad de entorno y evidencia | <https://github.com/puj-course/FIS_2610_3517_G4/issues/622> |

## 4. Issues asociadas

| Métrica | Valor |
|---|---:|
| Issues cerradas | 132 |
| Issues abiertas | 0 |
| HU cerradas estrictas | 20 |

## 5. PRs relacionados

| PR | Estado | Enlace |
|---|---|---|
| `#232` Feature sarm m | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/232> |
| `#488` Feature sarm m | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/488> |
| `#628` pruebas backend, dark mode, responsividad y documentación QA | Abierta | <https://github.com/puj-course/FIS_2610_3517_G4/pull/628> |

## 6. Commits relevantes

| Sprints | Commits |
|---|---:|
| S11-S13 | 277 |

El detalle por commit puede regenerarse con `git log --all --since="2026-04-27" --until="2026-05-17 23:59:59"`.

## 7. Evidencias disponibles

- Capturas Agile: `01_agile_milestones_semestre.png`, `02_agile_project_board.png`, `03_github_contributors_semestre.png`, `04_github_commits_por_integrante.png`.
- Capturas de cierre técnico: issues `#618` a `#622`, PRs finales, Docker, SonarCloud, SMS.
- Postmortem migrado: `postmortem-milestone.md`.

## 8. Métricas

| Métrica | Valor |
|---|---:|
| HU cerradas | 20 |
| Issues cerradas | 132 |
| Commits asociados por ventana de sprint | 277 |
| PRs asociados por milestone GitHub | 3 |
| PRs mergeadas | 2 |
| PRs abiertas | 1 |

Participación por asignación de issues:

| Integrante | Issues | HU |
|---|---:|---:|
| `samuelfl680` | 56 | 10 |
| `Sarm-m` | 43 | 3 |
| `solonlosada2006` | 30 | 4 |
| `juanvargax` | 22 | 2 |
| `Juserora` | 17 | 2 |

## 9. Estado final

Finalizado para issues funcionales. El PR `#628` permanece abierto y se reporta explícitamente como integración pendiente.

## 10. Riesgos detectados

- Quality Gate y coverage tratados bajo presión de cierre.
- Confianza excesiva en CI sin validación funcional local.
- Datos demo con `OWNER_EMAIL` inconsistente.
- Ausencia de releases/tags verificables.

## 11. Lecciones aprendidas

- El pipeline es necesario, pero no sustituye validación funcional humana.
- Los datos demo deben tener reglas claras.
- La evidencia debe estar versionada antes de sustentar.
- Releases/tags deben planearse si se quieren defender como versionamiento formal.

## 12. Acciones de mejora

| Acción | Responsable sugerido | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Exigir prueba funcional local antes de PR | QA Lead | Checklist en PR | Menos regresiones no capturadas por CI |
| Documentar datos demo | Product Owner | Guía de datos | Alertas coherentes por usuario |
| Monitorear SonarCloud antes del cierre | DevOps Engineer | Capturas de quality gate | Menos remediación tardía |
| Definir política de releases | Configuration Manager | Tag/release o decisión documentada | Trazabilidad por versión clara |
