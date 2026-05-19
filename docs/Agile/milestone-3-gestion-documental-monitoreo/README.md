# Milestone 3 - Gestión documental y monitoreo

## 1. Objetivo del milestone

Consolidar gestión documental, monitoreo, persistencia en nube, aislamiento de datos y proceso de QA para preparar el cierre técnico del sistema.

## 2. Alcance funcional

- Integrar gestión de documentos SOAT y RTM.
- Fortalecer autenticación y seguridad del backend.
- Validar persistencia y aislamiento por usuario.
- Mejorar monitoreo, navegación y componentes responsivos.
- Formalizar reportes QA y revisión de riesgos.

## 3. Historias de usuario asociadas

GitHub live reporta 14 HU cerradas trazables dentro de este milestone.

| HU / issue | Referencia |
|---|---|
| `#460` HU-460 Blindaje de Autenticación y Seguridad Industrial del Backend | <https://github.com/puj-course/FIS_2610_3517_G4/issues/460> |
| `#438` HU-S10-03 navegación de campanita y logout | <https://github.com/puj-course/FIS_2610_3517_G4/issues/438> |
| `#429` HU-429 Optimización responsiva | <https://github.com/puj-course/FIS_2610_3517_G4/issues/429> |
| `#413` HU gestión documental SOAT | <https://github.com/puj-course/FIS_2610_3517_G4/issues/413> |

## 4. Issues asociadas

| Métrica | Valor |
|---|---:|
| Issues cerradas | 38 |
| Issues abiertas | 0 |
| HU cerradas estrictas | 14 |

## 5. PRs relacionados

GitHub live no reporta PRs con este milestone asignado. La trazabilidad de M3 se sustenta con issues cerradas, commits por ventana de sprint y postmortem. No se inventan PRs asociados.

## 6. Commits relevantes

| Sprints | Commits |
|---|---:|
| S9-S10 | 82 |

El detalle por commit puede regenerarse con `git log --all --since="2026-04-13" --until="2026-04-26 23:59:59"`.

## 7. Evidencias disponibles

- Captura general de milestones: `docs/Entrega-Final/evidencias/01_agile_milestones_semestre.png`.
- Captura de tablero: `docs/Entrega-Final/evidencias/02_agile_project_board.png`.
- Capturas de contributors y commits: `docs/Entrega-Final/evidencias/03_github_contributors_semestre.png`, `docs/Entrega-Final/evidencias/04_github_commits_por_integrante.png`.
- Postmortem migrado: `postmortem-milestone.md`.

## 8. Métricas

| Métrica | Valor |
|---|---:|
| HU cerradas | 14 |
| Issues cerradas | 38 |
| Commits asociados por ventana de sprint | 82 |
| PRs asociados por milestone GitHub | 0 |

Participación por asignación de issues:

| Integrante | Issues | HU |
|---|---:|---:|
| `solonlosada2006` | 14 | 3 |
| `samuelfl680` | 11 | 5 |
| `Juserora` | 11 | 3 |
| `juanvargax` | 10 | 2 |
| `Sarm-m` | 5 | 1 |

## 9. Estado final

Finalizado. Las issues del milestone aparecen cerradas en GitHub live.

## 10. Riesgos detectados

- Gestión tardía de variables de entorno.
- Riesgo de credenciales hardcodeadas.
- Criterios de responsividad no siempre explícitos.
- PRs sin milestone asignado para reconstrucción directa.

## 11. Lecciones aprendidas

- La configuración `.env` debe planearse desde el día 1.
- SonarCloud y QA no deben activarse solo al final.
- Las HU visuales deben incluir criterios de responsividad.
- Los reportes QA con pasos de reproducción reducen retrabajo.

## 12. Acciones de mejora

| Acción | Responsable sugerido | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Configurar variables de entorno al inicio | Configuration Manager | `.env.example` y guía | Cero secretos hardcodeados |
| Incorporar revisión de seguridad en planning | Scrum Master | Checklist de riesgos | Riesgos tratados antes del cierre |
| Agregar criterios mobile a HU visuales | Product Owner | Criterios de aceptación | Menos hallazgos tardíos |
| Reportar QA con pasos reproducibles | QA Lead | Issues con template | Correcciones más rápidas |
