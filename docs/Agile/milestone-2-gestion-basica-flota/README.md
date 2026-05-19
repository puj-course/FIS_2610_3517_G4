# Milestone 2 - Gestión básica de flota

## 1. Objetivo del milestone

Consolidar la gestión básica de flota mediante interfaces de conductores y vehículos, validación RUNT, patrones de diseño y pruebas de flujos críticos.

## 2. Alcance funcional

- Implementar flujos de registro y consulta de conductores.
- Implementar interfaces de gestión de vehículos.
- Integrar validaciones RUNT simuladas.
- Aplicar separación de responsabilidades con patrones de diseño.
- Fortalecer pruebas funcionales y seguimiento por issues.

## 3. Historias de usuario asociadas

GitHub live reporta 14 HU cerradas trazables dentro de este milestone.

| HU / issue | Referencia |
|---|---|
| `#403` HU-403 Definición y Ejecución de Casos de Prueba para Flujos Críticos | <https://github.com/puj-course/FIS_2610_3517_G4/issues/403> |
| `#350` HU-S9-01 Habilitar el flujo de registro de conductores desde el dashboard | <https://github.com/puj-course/FIS_2610_3517_G4/issues/350> |
| HU de gestión de flota, validaciones y componentes de UI | Ver export completo de GitHub CLI |

## 4. Issues asociadas

| Métrica | Valor |
|---|---:|
| Issues cerradas | 37 |
| Issues abiertas | 0 |
| HU cerradas estrictas | 14 |

## 5. PRs relacionados

| PR | Estado | Enlace |
|---|---|---|
| `#233` Feature samuelfl680 | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/233> |

## 6. Commits relevantes

| Sprints | Commits |
|---|---:|
| S5-S8 | 164 |

El detalle por commit puede regenerarse con `git log --all --since="2026-03-16" --until="2026-04-12 23:59:59"`.

## 7. Evidencias disponibles

- Captura general de milestones: `docs/Entrega-Final/evidencias/01_agile_milestones_semestre.png`.
- Captura de tablero: `docs/Entrega-Final/evidencias/02_agile_project_board.png`.
- Capturas de contributors y commits: `docs/Entrega-Final/evidencias/03_github_contributors_semestre.png`, `docs/Entrega-Final/evidencias/04_github_commits_por_integrante.png`.
- Postmortem migrado: `postmortem-milestone.md`.

## 8. Métricas

| Métrica | Valor |
|---|---:|
| HU cerradas | 14 |
| Issues cerradas | 37 |
| Commits asociados por ventana de sprint | 164 |
| PRs asociados por milestone GitHub | 1 |
| PRs mergeadas | 1 |

Participación por asignación de issues:

| Integrante | Issues | HU |
|---|---:|---:|
| `solonlosada2006` | 18 | 6 |
| `Sarm-m` | 9 | 4 |
| `Juserora` | 6 | 1 |
| `juanvargax` | 5 | 1 |
| `samuelfl680` | 3 | 2 |

## 9. Estado final

Finalizado. Las issues funcionales del milestone aparecen cerradas en GitHub live.

## 10. Riesgos detectados

- Ambigüedad en nombres de archivos y rutas.
- Diferencias entre entornos Windows/Linux.
- Componentes visuales construidos antes de infraestructura común.
- Poca evidencia granular recolectada durante el sprint.

## 11. Lecciones aprendidas

- Definir convenciones de nombres evita bugs silenciosos.
- Homogeneizar entorno es una necesidad del equipo, no un detalle individual.
- Los patrones de diseño ayudan si se acompañan con integración y QA.
- La evidencia debe recolectarse durante el desarrollo, no al cierre.

## 12. Acciones de mejora

| Acción | Responsable sugerido | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Estandarizar nombres e importaciones | Configuration Manager | Reglas de lint documentadas | Menos errores por alias o casing |
| Mapear dependencias antes de construir UI | QA Lead | Checklist de dependencias | Menos retrabajo por infraestructura ausente |
| Revisar interoperabilidad de entornos | DevOps Engineer | Guía de entorno | Mismo resultado en Windows/Linux |
| Mantener sub-issues atómicas | Scrum Master | Issues enlazadas | Mejor trazabilidad del sprint |
