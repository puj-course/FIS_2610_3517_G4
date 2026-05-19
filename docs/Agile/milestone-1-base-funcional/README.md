# Milestone 1 - Base funcional del sistema

## 1. Objetivo del milestone

Establecer la base funcional de DriveControl / AutoMinder Enterprise con stack MERN, autenticación inicial, dashboard base, estructura de navegación y flujo de trabajo colaborativo con GitFlow.

## 2. Alcance funcional

- Crear la estructura inicial del sistema.
- Implementar autenticación, registro y rutas protegidas.
- Construir el dashboard base y componentes iniciales de estado.
- Definir ramas de trabajo, merges y PRs iniciales.
- Establecer primeras prácticas de Scrum académico y seguimiento por GitHub Issues.

## 3. Historias de usuario asociadas

GitHub live reporta 24 HU cerradas trazables con patrón estricto dentro de este milestone. Ejemplos:

| HU / issue | Referencia |
|---|---|
| `#204` HU-204 Implementación de Interfaces de Gestión de Conductores y Vehículos | <https://github.com/puj-course/FIS_2610_3517_G4/issues/204> |
| `#158` Integración final asociada a HU-158 | Referenciada por PRs `#172`, `#173`, `#174` |
| HU de autenticación, dashboard base y rutas protegidas | Ver export completo de GitHub CLI |

## 4. Issues asociadas

| Métrica | Valor |
|---|---:|
| Issues cerradas | 76 |
| Issues abiertas | 0 |
| HU cerradas estrictas | 24 |

## 5. PRs relacionados

| PR | Estado | Enlace |
|---|---|---|
| `#130` Hacer merge de develop a main | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/130> |
| `#168` Feature sarm m | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/168> |
| `#170` Integracion al main de AlertCard.jsx | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/170> |
| `#171` Integracion de componentes AddConductorModal y AddVehicleModal | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/171> |
| `#172`, `#173`, `#174` Integraciones HU-158 | Mergeadas | GitHub PRs |
| `#177` StatusBadge | Cerrada sin merge | <https://github.com/puj-course/FIS_2610_3517_G4/pull/177> |
| `#208` Interfaces de Gestión de Conductores y Vehículos | Mergeada | <https://github.com/puj-course/FIS_2610_3517_G4/pull/208> |

## 6. Commits relevantes

Los commits se asocian por ventana de sprint:

| Sprints | Commits |
|---|---:|
| S1-S4 | 107 |

El detalle por commit puede regenerarse con `git log --all --since="2026-02-16" --until="2026-03-15 23:59:59"`.

## 7. Evidencias disponibles

- Captura general de milestones: `docs/Entrega-Final/evidencias/01_agile_milestones_semestre.png`.
- Captura de tablero: `docs/Entrega-Final/evidencias/02_agile_project_board.png`.
- Capturas de contributors y commits: `docs/Entrega-Final/evidencias/03_github_contributors_semestre.png`, `docs/Entrega-Final/evidencias/04_github_commits_por_integrante.png`.
- Postmortem migrado: `postmortem-milestone.md`.

## 8. Métricas

| Métrica | Valor |
|---|---:|
| HU cerradas | 24 |
| Issues cerradas | 76 |
| Commits asociados por ventana de sprint | 107 |
| PRs asociados por milestone GitHub | 9 |
| PRs mergeadas | 8 |
| PRs cerradas sin merge | 1 |

Participación por asignación de issues:

| Integrante | Issues | HU |
|---|---:|---:|
| `juanvargax` | 42 | 12 |
| `Sarm-m` | 21 | 5 |
| `Juserora` | 21 | 4 |
| `samuelfl680` | 16 | 2 |
| `solonlosada2006` | 11 | 1 |

## 9. Estado final

Finalizado. Todas las issues funcionales del milestone aparecen cerradas en GitHub live.

## 10. Riesgos detectados

- Integración temprana sin Definition of Done uniforme.
- Validación local insuficiente antes de algunos merges.
- Estimaciones optimistas frente a carga académica.
- Evidencia recolectada de forma tardía.

## 11. Lecciones aprendidas

- Definir terminado con criterios verificables antes de cerrar HU.
- Validar compilación local antes de abrir o mergear PRs.
- Planear capacidad real del equipo y no solo intención.
- Mantener GitFlow, porque redujo conflictos mayores.

## 12. Acciones de mejora

| Acción | Responsable sugerido | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Definir Definition of Done del equipo | QA Lead | Checklist versionada | Ninguna HU se cierra sin checklist |
| Exigir build local antes de PR | Configuration Manager | Captura o comentario en PR | PRs sin fallos básicos de compilación |
| Planear capacidad con carga académica | Product Owner | Tabla de disponibilidad | Menos arrastre entre sprints |
| Mantener trazabilidad issue-commit-PR | Scrum Master | Issues enlazadas | Cada cambio importante referencia issue |
