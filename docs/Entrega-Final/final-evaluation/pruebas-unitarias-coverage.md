# Pruebas unitarias y coverage

## Comandos

```bash
# Frontend
npm --prefix apps/web ci
npm --prefix apps/web run lint
npm --prefix apps/web test
npm --prefix apps/web run build

# Backend
npm --prefix backend ci
npm --prefix backend test
```

## Componentes criticos cubiertos

| Componente critico | Riesgo que cubre | Test | Estado |
|---|---|---|---|
| `qualityMetrics.js` | Calculo incorrecto de metricas propias de calidad. | `apps/web/src/__tests__/qualityMetrics.test.js` | Implementado |
| `dateUtils.js` | Fechas y vencimientos mal clasificados. | `apps/web/src/__tests__/dateUtils.test.js` | Implementado |
| `emailValidation.js` | Validacion de correo inconsistente. | `apps/web/src/__tests__/emailValidation.test.js` | Implementado |
| `colombiaFormats.js` | Formatos colombianos de placa/documento/telefono. | `apps/web/src/__tests__/colombiaFormats.test.js` | Implementado |
| `BaseAlertAdapter.js` | Contrato base de adaptadores. | `apps/web/src/__tests__/baseAlertAdapter.test.js` | Implementado |
| `SoatAlertAdapter.js` | Alertas SOAT vencido/proximo. | `apps/web/src/__tests__/soatAlertAdapter.test.js` | Implementado |
| `RtmAlertAdapter.js` | Alertas RTM vencida/proxima. | `apps/web/src/__tests__/rtmAlertAdapter.test.js` | Implementado en esta auditoria |
| `ConductorAlertAdapter.js` | Alertas de licencia. | `apps/web/src/__tests__/conductorAlertAdapter.test.js` | Implementado |
| `VehicleAlertAdapter.js` | Documentos/asignaciones faltantes por vehiculo. | `apps/web/src/__tests__/vehicleAlertAdapter.test.js` | Implementado en esta auditoria |
| `useRUNTSimulator.js` | Simulacion RUNT. | `apps/web/src/test/useRUNTSimulator.test.js` | Implementado |
| `smsService.js` | Integracion Twilio, errores y logs seguros. | `backend/test/smsService.test.js` | Implementado |

## Evidencia esperada

| Evidencia | Comando/fuente | Interpretacion |
|---|---|---|
| Tests frontend verdes | `npm --prefix apps/web test` | Debe mostrar tests exitosos y generar coverage. |
| LCOV local | `apps/web/coverage/lcov.info` | Debe existir antes de Sonar. |
| Coverage HTML | `apps/web/coverage/index.html` | Permite revisar archivos con baja cobertura. |
| Tests backend verdes | `npm --prefix backend test` | Valida SMS sin conectar a Twilio real. |
| Pipeline verde | GitHub Actions | Demuestra ejecucion automatica en push/PR. |
| Sonar coverage >80% | SonarCloud | Evidencia oficial para excelente. |

## Relacion con SonarCloud

El workflow `.github/workflows/sonarcloud.yml` ejecuta pruebas antes del scanner. SonarCloud toma el LCOV desde `apps/web/coverage/lcov.info`. Si el coverage de Sonar no coincide con el local, revisar:

- Que `npm test` haya corrido antes del scanner.
- Que `lcov.info` exista en la ruta configurada.
- Que las exclusiones de `sonar.coverage.exclusions` sean defendibles.
- Que el PR no haya cambiado el working directory o la ruta del reporte.

## Que falta si no se alcanza 80%

1. Abrir el reporte HTML y ordenar por menor coverage.
2. Priorizar reglas de negocio, adaptadores, fechas, validaciones y fachadas.
3. Agregar pruebas con aserciones reales para ramas no cubiertas.
4. Evitar inflar coverage con tests que solo importan archivos.
5. Reejecutar local y SonarCloud.

## Validacion local realizada el 2026-05-15

| Comando | Resultado |
|---|---|
| `npm --prefix apps/web run lint` | Exitoso. |
| `npm --prefix apps/web test` | 10 archivos de prueba, 126 tests, todos exitosos. |
| Coverage local frontend | Statements 98.01%, branches 93.31%, functions 100%, lines 98.82%. |
| `npm --prefix apps/web run build` | Build Vite exitoso en `dist/apps/web`. |
| `npm --prefix backend test` | 8 tests SMS, todos exitosos. |

La evidencia oficial de la rubrica sigue siendo SonarCloud; estos resultados locales demuestran que el LCOV y las pruebas estan listos para el pipeline.
