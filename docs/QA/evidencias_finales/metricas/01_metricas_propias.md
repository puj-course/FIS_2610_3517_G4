# 01 - Metricas propias de calidad

Este documento cubre las metricas de calidad implementadas directamente en codigo. Son metricas de dominio y no sustituyen a SonarCloud; lo complementan con informacion funcional que el analisis estatico no puede conocer.

## Evidencia en codigo

| Evidencia | Ruta | Estado |
|---|---|---|
| Implementacion | `apps/web/src/utils/qualityMetrics.js` | Existe |
| Pruebas unitarias | `apps/web/src/__tests__/qualityMetrics.test.js` | Existe |
| Generador de reporte | `apps/web/tools/generate-quality-evidence.mjs` | Existe |
| Reporte JSON generado | `apps/web/coverage/quality-metrics-report.json` | Se genera con comando; adjuntar captura |
| Vista de reportes | `apps/web/src/pages/ReportesPage.jsx` | Adjuntar captura UI |

## Comandos reproducibles

```bash
npm --prefix apps/web ci
npm --prefix apps/web run quality:metrics
npm --prefix apps/web test -- --run src/__tests__/qualityMetrics.test.js
```

Si el entorno local no tiene Node/NPM, ejecutar dentro de un contenedor Node o usar GitHub Actions. No registrar como ejecutado hasta tener salida o captura.

## Metrica 1: Indice de riesgo documental

| Aspecto | Detalle |
|---|---|
| Nombre en codigo | `calculateDocumentRiskMetric` |
| Que mide | Porcentaje de documentos evaluables vencidos o proximos a vencer. |
| Fuentes | SOAT, RTM, licencias, documentos genericos y conductores con fechas de vencimiento. |
| Formula | `(documentos vencidos + documentos proximos a vencer) / documentos evaluables * 100` |
| Resultado esperado | Bajo cuando no hay documentos vencidos ni proximos a vencer. |
| Interpretacion | `0%` verde; `1%-49%` amarillo; `50%+` rojo; sin documentos evaluables neutral. |
| Por que Sonar no lo mide | SonarCloud no interpreta fechas legales, vigencia documental ni riesgo operativo de flota. |
| Impacto en calidad | Reduce riesgo legal, interrupciones operativas, multas e inmovilizaciones. |
| Accion de mejora | Renovar documentos vencidos, programar gestion preventiva y mantener alertas activas. |

## Metrica 2: Completitud de datos operativos

| Aspecto | Detalle |
|---|---|
| Nombre en codigo | `calculateOperationalCompletenessMetric` |
| Que mide | Porcentaje de vehiculos, conductores y documentos con campos minimos completos. |
| Fuentes | Vehiculos, conductores, SOAT, RTM y documentos genericos. |
| Formula | `registros completos / registros evaluados * 100` |
| Resultado esperado | `100%` cuando los registros tienen datos obligatorios suficientes. |
| Interpretacion | `100%` verde; `80%-99%` amarillo; `<80%` rojo; sin registros neutral. |
| Por que Sonar no lo mide | SonarCloud no sabe si una placa, telefono, certificado o fecha soportan la operacion real. |
| Impacto en calidad | Mejora trazabilidad, reportes, alertas y confianza en decisiones operativas. |
| Accion de mejora | Completar placas, identificadores, telefonos, fechas, certificados y datos obligatorios. |

## Metrica 3: Indice de criticidad de alertas

| Aspecto | Detalle |
|---|---|
| Nombre en codigo | `calculateAlertCriticalityMetric` |
| Que mide | Porcentaje de alertas criticas frente al total de alertas activas. |
| Fuentes | Alertas publicadas por adaptadores de SOAT, RTM, licencias, vehiculos y reglas operativas. |
| Formula | `alertas criticas / alertas activas * 100` |
| Resultado esperado | `0%` si no hay alertas criticas activas. |
| Interpretacion | `0%` verde; `1%-29%` amarillo; `30%+` rojo; sin alertas neutral. |
| Por que Sonar no lo mide | SonarCloud no evalua eventos operativos activos ni prioridades de negocio. |
| Impacto en calidad | Permite priorizar riesgos que afectan continuidad, cumplimiento y seguridad operativa. |
| Accion de mejora | Atender alertas rojas, cerrar causa raiz y prevenir recurrencia. |

## Interpretacion tecnica esperada

Estas metricas demuestran calidad funcional. Un resultado rojo no significa que el codigo este mal escrito; significa que el sistema detecto un riesgo de negocio que debe gestionarse. La calidad se evidencia porque el sistema mide, interpreta y propone accion correctiva.

## Evidencias pendientes

| Captura | Archivo esperado | Estado |
|---|---|---|
| Ejecucion `quality:metrics` | `img/quality-metrics-command.png` | Pendiente |
| JSON generado | `img/quality-metrics-json.png` | Pendiente |
| Test de metricas | `img/quality-metrics-test.png` | Pendiente |
| Vista UI de reportes | `img/metricas-ui.png` | Pendiente |

## Trazabilidad

| Issue | Branch | Commit | PR | Evidencia |
|---|---|---|---|---|
| `#556` Automatizar metricas propias | `feature-sarm-m` | Cerrada en GitHub | PR relacionado a develop/main | Codigo, tests, JSON, capturas |
| `#557` Implementar metricas propias e integrarlas | `feature-sarm-m` | Cerrada en GitHub | PR relacionado a develop/main | `ReportesPage.jsx`, `qualityMetrics.js` |
| `#558` Validar y documentar metricas | `feature-sarm-m` | Ver historial de PR | PR relacionado a develop/main | Tests y docs |

## Acciones para defender 5.0

- [ ] Adjuntar capturas de comando, JSON y UI.
- [ ] Confirmar que los tests de metricas pasan en CI.
- [ ] Explicar que son metricas de dominio, no metricas Sonar.
- [ ] Mostrar acciones de mejora para resultados rojo/amarillo.
- [ ] Evitar afirmar resultados de produccion si solo se usaron datos de evidencia.
