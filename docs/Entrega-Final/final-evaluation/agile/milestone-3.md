# Milestone 3 - Gestion documental y monitoreo

## Objetivo

Agregar gestion documental de SOAT, RTM, licencias, alertas por vencimiento y monitoreo de riesgos.

## Alcance planificado

| Elemento | Evidencia |
|---|---|
| SOAT | `SoatAlertAdapter.js`, `soatAlertAdapter.test.js`, modelos/rutas en backend |
| RTM | `RtmAlertAdapter.js`, `rtmAlertAdapter.test.js` |
| Licencias | `ConductorAlertAdapter.js`, `conductorAlertAdapter.test.js` |
| Alertas | `useAlerts.js`, `useAlertsFacade.js`, `AlertHubSingleton.js` |
| Reportes | `ReportesPage.jsx`, `qualityMetrics.js` |

## Historias de usuario asociadas

| HU/Issue observada | Evidencia |
|---|---|
| `#413`, `#414`, `#435`, `#436`, `#437` | Commits locales mencionan gestion documental y endpoints. |
| `#490`, `#491`, `#492` | Commits locales mencionan alertas, fechas y validaciones. |

## Estado de cada HU

Debe completarse con `issues.json`. Si GitHub muestra alguna HU abierta, marcarla como pendiente o justificar alcance.

## Riesgos y decisiones tecnicas

| Riesgo | Decision |
|---|---|
| Vencimientos mal calculados | Tests de fechas, SOAT, RTM, licencias. |
| Alertas duplicadas o incoherentes | Patron Adapter/Facade/Singleton documentado en `Docs/Arquitectura/patrones/`. |

## Resultado final

El sistema tiene base documental y alertas testeadas. Se reforzo RTM en esta auditoria con un test dedicado.

## Lecciones aprendidas

Las alertas son mejor defendibles cuando cada fuente documental tiene adapter y pruebas propias.
