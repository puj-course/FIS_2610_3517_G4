# 03 - Pruebas unitarias y coverage

Este documento cubre la evidencia de pruebas unitarias y cobertura. La rubrica exige coverage superior al 80% evidenciado en SonarCloud para nivel excelente, pruebas sobre componentes criticos y ejecucion automatizada en pipeline.

## Frameworks y ubicacion

| Capa | Herramienta | Ruta | Comando |
|---|---|---|---|
| Frontend | Vitest + V8 coverage | `apps/web/src/__tests__`, `apps/web/src/test` | `npm --prefix apps/web test` |
| Backend | Node test runner | `backend/test` | `npm --prefix backend test` |
| Coverage frontend | `@vitest/coverage-v8` | `apps/web/coverage` | generado por `npm --prefix apps/web test` |
| CI | GitHub Actions | `.github/workflows/*.yml` | Ejecutado en push/PR segun workflow |

## Comandos reproducibles

```bash
npm --prefix apps/web ci
npm --prefix apps/web test
npm --prefix backend ci
npm --prefix backend test
```

Comando focal para metricas propias:

```bash
npm --prefix apps/web test -- --run src/__tests__/qualityMetrics.test.js
```

Comando focal para SMS:

```bash
npm --prefix backend test
```

## Verificacion local realizada

Fecha: 2026-05-14.

| Area | Comando | Resultado |
|---|---|---|
| Backend SMS | `docker run --rm -v "${PWD}\\backend:/app" -w /app node:20-alpine sh -lc "npm ci && npm test"` | 8 pruebas, 8 exitosas |
| Frontend | `npm --prefix apps/web test -- --run` | No ejecutado: `npm` no esta disponible en el PATH local |
| Frontend en Docker | `docker run --rm -v "${PWD}\\apps\\web:/app" -w /app node:20-alpine sh -lc "npm ci && npm test -- --run"` | No completado: `npm ci` excedio 240 segundos |

Esta verificacion no reemplaza las capturas de coverage ni SonarCloud exigidas por la rubrica. Para defender nivel excelente, el equipo debe adjuntar la salida verde de frontend con coverage y el reporte de SonarCloud.

## Cobertura esperada

La cobertura debe tomarse del reporte generado por Vitest y confirmarse en SonarCloud. No usar valores manuales sin captura.

| Indicador | Fuente | Interpretacion |
|---|---|---|
| Statements | `apps/web/coverage/index.html` o SonarCloud | Lineas/expresiones ejecutadas por tests. |
| Branches | Coverage local o SonarCloud | Caminos condicionales cubiertos. |
| Functions | Coverage local o SonarCloud | Funciones ejercitadas por tests. |
| Lines | Coverage local o SonarCloud | Lineas de codigo ejecutadas. |

## Estado observado y acciones requeridas

| Hallazgo | Impacto | Accion |
|---|---|---|
| Hay tests fuertes para `qualityMetrics.js`, formatos, validacion de email, SOAT, conductor y base adapter. | Buen soporte para la rubrica. | Capturar ejecucion y coverage. |
| `git status` mostro eliminados `RtmAlertAdapter.test.js` y `rtmAlertAdapter.test.js`. | Riesgo para cobertura y evidencia de RTM. | Restaurar un unico archivo RTM, preferiblemente `RtmAlertAdapter.test.js`, y eliminar duplicidad por casing. |
| `VehicleAlertAdapter.js` no aparece cubierto en los tests actuales. | Riesgo en adaptadores criticos de alertas. | Agregar `VehicleAlertAdapter.test.js`. |
| Backend tiene pruebas SMS, pero poca cobertura de endpoints de autenticacion. | Puede ser aceptable para SMS, menos fuerte para backend general. | Agregar pruebas de endpoints con mocks si hay tiempo. |

## Pruebas criticas esperadas

| Modulo | Estado | Evidencia esperada |
|---|---|---|
| `qualityMetrics.js` | Cubierto | `img/quality-metrics-test.png` |
| `colombiaFormats.js` | Cubierto | `img/frontend-tests-coverage.png` |
| `emailValidation.js` | Cubierto | `img/frontend-tests-coverage.png` |
| `BaseAlertAdapter.js` | Cubierto | `img/frontend-tests-coverage.png` |
| `SoatAlertAdapter.js` | Cubierto | `img/frontend-tests-coverage.png` |
| `ConductorAlertAdapter.js` | Cubierto | `img/frontend-tests-coverage.png` |
| `RtmAlertAdapter.js` | Requiere restaurar test unico | `img/rtm-tests.png` |
| `VehicleAlertAdapter.js` | Requiere test | `img/vehicle-alert-tests.png` |
| `smsService.js` | Cubierto con mocks | `img/backend-tests-sms.png` |

## Evidencias pendientes

| Captura | Archivo esperado | Estado |
|---|---|---|
| Tests frontend completos | `img/frontend-tests-coverage.png` | Pendiente |
| Coverage HTML local | `img/frontend-coverage-html.png` | Pendiente |
| Tests backend | `img/backend-tests-sms.png` | Pendiente |
| Pipeline tests | `img/github-actions-tests.png` | Pendiente |
| Sonar coverage | `../sonar/img/sonar-coverage.png` | Pendiente |
| RTM restaurado | `img/rtm-tests.png` | Requiere accion |
| Vehicle adapter | `img/vehicle-alert-tests.png` | Requiere accion |

## Interpretacion para sustentacion

El coverage alto no es el fin; es evidencia de que las reglas criticas del negocio se ejercitan automaticamente. La defensa debe conectar tests con riesgo: vencimientos, alertas, formatos colombianos, validacion de email, SMS y generacion de metricas.

## Acciones para defender 5.0

- [ ] Restaurar un unico test RTM.
- [ ] Agregar test para `VehicleAlertAdapter.js`.
- [ ] Capturar salida de frontend tests con coverage.
- [ ] Capturar salida de backend tests.
- [ ] Capturar SonarCloud con coverage superior a 80%.
- [ ] Mostrar que el pipeline ejecuta tests en push o pull request.
- [ ] No afirmar que todas las funcionalidades tienen pruebas si solo se cubren utilidades/adaptadores.
