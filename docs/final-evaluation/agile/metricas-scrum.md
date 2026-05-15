# Metricas Scrum

## Como generar datos reales

```bash
scripts/agile/export_github_data.sh puj-course/FIS_2610_3517_G4
python3 scripts/agile/generate_agile_report.py
```

Salida esperada:

- `docs/final-evaluation/agile/data/issues.json`
- `docs/final-evaluation/agile/data/pull_requests.json`
- `docs/final-evaluation/agile/data/milestones.json`
- `docs/final-evaluation/agile/data/commits.tsv`
- `docs/final-evaluation/agile/data/metricas_scrum_generadas.md`

## Indicadores requeridos por rubrica

| Indicador | Fuente | Formula | Estado |
|---|---|---|---|
| HU cerradas por sprint | GitHub Issues cerradas por fecha/milestone | Conteo por sprint | Requiere `gh` |
| Promedio HU por sprint | Issues cerradas / numero de sprints | Total / 13 | Requiere `gh` |
| Commits por sprint | `git log --all` | Conteo por fecha | Disponible localmente |
| Promedio commits por sprint | Commits / 13 | Total / 13 | Disponible con script |
| Commits por integrante | `git shortlog -sne --all` | Conteo normalizado | Disponible localmente |
| Issues cerradas por integrante | GitHub Issues + assignees | Conteo por asignado | Requiere `gh` |
| PRs por integrante | GitHub PRs + author | Conteo por autor | Requiere `gh` |
| Revisiones por integrante | GitHub reviews | Export adicional con GraphQL/gh | Pendiente si se exige |

## Participacion observada localmente

`git shortlog -sn --all` muestra commits de varios integrantes, con aliases que deben normalizarse antes de presentar porcentajes. No usar estos conteos como participacion final individual sin limpiar aliases y contrastar issues/PRs.

## Tabla de participacion a completar

| Integrante | Commits normalizados | Issues cerradas | PRs | Revisiones | Interpretacion | Accion de mejora |
|---|---:|---:|---:|---:|---|---|
| Sarm-m | Completar con script | Completar con `gh` | Completar con `gh` | Completar | Alta si mantiene commits + issues + PRs. | Preparar ficha individual. |
| samuelfl680 | Completar con script | Completar con `gh` | Completar con `gh` | Completar | Alta si mantiene commits + issues + PRs. | Preparar ficha individual. |
| solonlosada2006 | Completar con script | Completar con `gh` | Completar con `gh` | Completar | Evaluar balance. | Preparar ficha individual. |
| juansebastianvd | Completar con script | Completar con `gh` | Completar con `gh` | Completar | Evaluar balance. | Preparar ficha individual. |
| juserora | Completar con script | Completar con `gh` | Completar con `gh` | Completar | Evaluar balance. | Preparar ficha individual. |

## Interpretacion

Una participacion equilibrada no exige el mismo numero exacto de commits, sino evidencia regular y defendible: issues resueltas, commits significativos, PRs, revisiones o responsabilidad clara. Si alguien tiene pocos commits, debe sustentar aportes con issues, revisiones, documentacion, pruebas o evidencias de trabajo no reflejadas en git.
