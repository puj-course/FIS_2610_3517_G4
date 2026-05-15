# Milestone 1 - Base funcional del sistema

## Objetivo

Establecer base del proyecto: repositorio, entorno, estructura frontend/backend, autenticacion inicial, layout y convenciones de trabajo.

## Alcance planificado

| Elemento | Estado documental |
|---|---|
| Estructura React/Vite | Evidencia en `apps/web/` |
| Backend Express/Mongo | Evidencia en `backend/` |
| Variables de entorno ejemplo | `apps/web/.env.example`, `backend/.env.example` |
| Primeras convenciones de colaboracion | `CONTRIBUTING.md`, workflows de issues |

## Historias de usuario asociadas

Validar con export GitHub. Este informe no inventa estados. Usar:

```bash
scripts/agile/export_github_data.sh
python3 scripts/agile/generate_agile_report.py
```

## Issues, commits y PRs relacionados

| Tipo | Evidencia base | Nota |
|---|---|---|
| Issues | Export `issues.json` | Pendiente de captura GitHub. |
| Commits | `git log --all --since="2026-02-16"` | Historial local disponible. |
| PRs | Export `pull_requests.json` | Pendiente de captura GitHub. |

## Riesgos y decisiones tecnicas

| Riesgo | Decision |
|---|---|
| Configuracion local inconsistente | Usar `.env.example` y scripts de setup. |
| Secretos en repo | Debe rotarse cualquier secreto versionado y mantener `.env` fuera de futuros commits. |

## Resultado final

La base tecnica existe y permite construir sobre React/Vite y Node/Express. Falta completar evidencia GitHub final del milestone con estado real.

## Lecciones aprendidas

Definir politicas de secretos y DoD de pruebas desde el primer sprint evita deuda de cierre.
