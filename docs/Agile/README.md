# Documentación Agile y Postmortem

Esta carpeta centraliza la evidencia de metodología ágil, trazabilidad y postmortem del proyecto DriveControl / AutoMinder Enterprise. El contenido está organizado únicamente en los cuatro milestones funcionales del semestre y en un informe general compilable en LaTeX.

## Estructura

| Ruta | Contenido |
|---|---|
| `milestone-1-base-funcional/` | Base funcional del sistema, autenticación, dashboard inicial y GitFlow. |
| `milestone-2-gestion-basica-flota/` | Gestión básica de flota, patrones, validación RUNT y pruebas de flujos. |
| `milestone-3-gestion-documental-monitoreo/` | Gestión documental, monitoreo, nube, seguridad y QA. |
| `milestone-4-dashboard-alertas-cierre/` | Dashboard, alertas, CI/CD, SMS, SonarCloud y cierre del sistema. |
| `informe-milestones.tex` | Informe general de los cuatro milestones para Overleaf. |
| `reporte_final_sprints.md` | Documento central del semestre con métricas, trazabilidad y postmortem general. |

No se usa ningún milestone de taller como evidencia funcional.

## Documentos por milestone

Cada carpeta de milestone contiene:

- `README.md`: síntesis funcional, issues, HU, PRs, métricas, riesgos y acciones.
- `informe-milestone.tex`: informe LaTeX individual y compilable.
- `postmortem-milestone.md`: postmortem en Markdown con producto, esfuerzo, proceso, causas raíz y Starfish.
- `evidencias.md`: matriz de capturas, enlaces, rutas y pendientes.
- `metricas-milestone.md`: métricas cuantitativas del milestone.

## Archivo general

El archivo general para Overleaf es:

```text
docs/Agile/informe-milestones.tex
```

Compilación local sugerida:

```bash
cd docs/Agile
pdflatex -interaction=nonstopmode -halt-on-error informe-milestones.tex
pdflatex -interaction=nonstopmode -halt-on-error informe-milestones.tex
```

Para compilar un informe individual:

```bash
cd docs/Agile/milestone-1-base-funcional
pdflatex -interaction=nonstopmode -halt-on-error informe-milestone.tex
```

Repetir el comando en cada carpeta de milestone.

## Relación con la rúbrica

Este paquete cubre explícitamente **Metodologías ágiles y postmortem — 30%**:

- Milestones finalizados.
- HU terminadas y trazables.
- HU cerradas por sprint y promedio HU/sprint.
- Commits por sprint y promedio de commits.
- Participación por integrante mediante issues, HU, commits y PRs.
- PRs, revisiones disponibles y control de versiones.
- Ramas y ausencia explícita de releases/tags verificables.
- Trazabilidad por milestone, sprint y versión.
- Postmortem técnico y de proceso.
- Causas raíz, acciones correctivas y acciones preventivas.

También apoya el criterio de trabajo en equipo porque documenta participación resolviendo issues, haciendo commits, abriendo PRs, revisando y cumpliendo roles Scrum.

## Relación con la guía de postmortem

El material del profesor sobre postmortem indica que el reporte debe:

- Evaluar producto, esfuerzo y proceso.
- Revisar datos de calidad.
- Identificar problemas, causas y medidas de prevención.
- Evaluar roles con hechos objetivos.
- Producir un reporte del ciclo.
- Basarse en hechos y datos reales.
- Enfatizar lecciones aprendidas.
- Preparar acciones de mejora.
- Usar retrospectiva estrella de mar: comenzar a hacer, más de, seguir haciendo, menos de y dejar de hacer.

Los informes individuales y el informe general siguen esa estructura.

## Fuentes de datos

| Fuente | Uso |
|---|---|
| GitHub CLI autenticado | Issues, PRs, reviews, milestones. |
| Git local | Commits por sprint y por autor. |
| `docs/Entrega-Final/anexos/issues.json` | Respaldo de issues exportadas. |
| `docs/Entrega-Final/anexos/pull_requests.json` | Respaldo de PRs exportados. |
| `docs/Entrega-Final/anexos/commits_detalle.tsv` | Respaldo de commits. |
| `docs/Entrega-Final/evidencias/` | Capturas de milestones, tablero, contributors, commits, PRs y cierre técnico. |
| `Sesión 2- Postmortem.pdf` | Criterios de postmortem y Starfish del profesor. |

## Métricas principales verificadas

| Métrica | Valor |
|---|---:|
| Issues cerradas M1-M4 | 283 |
| HU cerradas estrictas | 72 |
| Promedio HU/sprint | 5.54 |
| Commits en corte académico | 630 |
| Promedio commits/sprint | 48.46 |
| PRs totales | 161 |
| PRs mergeadas | 134 |
| Reviews detectadas | 8 |
| Releases/tags verificables | 0 |

Las cifras históricas previas de 88 HU, 375 issues y 405 commits quedan marcadas como pendientes de reconciliación por diferencia de criterio de cálculo.

## Regenerar métricas con GitHub CLI

```bash
gh auth status
gh repo set-default puj-course/FIS_2610_3517_G4

gh issue list --state all --limit 1000 \
  --json number,title,state,author,assignees,labels,milestone,createdAt,closedAt,url \
  > docs/Entrega-Final/anexos/issues.json

gh pr list --state all --limit 1000 \
  --json number,title,state,author,assignees,labels,milestone,createdAt,closedAt,mergedAt,url,reviews \
  > docs/Entrega-Final/anexos/pull_requests.json

gh api "repos/puj-course/FIS_2610_3517_G4/milestones?state=all&per_page=100" --paginate \
  > docs/Entrega-Final/anexos/milestones.json

git log --all --pretty=format:"%h%x09%an%x09%ad%x09%s" --date=short \
  > docs/Entrega-Final/anexos/commits_detalle.tsv

git shortlog -sne --all \
  > docs/Entrega-Final/anexos/commits_por_autor.txt
```

## Pendientes declarados

- Reconciliar manualmente las cifras históricas 88 HU, 375 issues y 405 commits contra el criterio live usado en este paquete.
- Exportar reviews completas vía GitHub API/GraphQL si se requiere detalle por cada PR.
- Crear releases/tags solo si el equipo decide versionar formalmente la entrega; actualmente no existen releases/tags verificables.
