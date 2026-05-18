# Milestone 2 - Gestion basica de flota

## Objetivo

Construir funcionalidades de vehiculos, conductores y datos operativos base para que el sistema soporte alertas y reportes.

## Alcance planificado

| Elemento | Evidencia |
|---|---|
| Gestion de vehiculos | `apps/web/src/pages/VehiculosPage.jsx`, rutas backend relacionadas |
| Gestion de conductores | `apps/web/src/pages/ConductoresPage.jsx`, `backend/models/Conductor.js` |
| Validaciones de formatos | `apps/web/src/utils/colombiaFormats.js`, tests asociados |
| Integracion API frontend/backend | `apps/web/src/services/api.js`, `backend/server.js` |

## Historias de usuario asociadas

Identificar desde GitHub Issues por milestone/sprint. No marcar HU como cerrada hasta ver estado real exportado.

## Issues, commits y PRs relacionados

| Evidencia observada en historial | Relacion |
|---|---|
| Commits con `Closes #489`, `#492`, `#510`, `#512` | Funciones de flota, validaciones y RUNT en historial local. |
| PRs hacia `feature-Slosada`, `feature-sarm-m`, `feature-Vargas-J` | Integraciones de funcionalidades por rama. |

## Riesgos

| Riesgo | Mitigacion |
|---|---|
| Datos incompletos afectan alertas | Metrica `operational-completeness`. |
| Validaciones inconsistentes | Tests de formatos y adaptadores. |

## Resultado final

La gestion de flota existe en frontend/backend y se conecta con metricas/alertas. Falta anexar tabla real issue -> PR -> commit desde export GitHub.

## Lecciones aprendidas

Las reglas de formato colombiano deben vivir en utilidades testeadas, no repetidas en vistas.
