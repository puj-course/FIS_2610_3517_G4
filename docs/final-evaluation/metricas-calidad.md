# Metricas de calidad

Este documento diferencia metricas propias del sistema frente a metricas de SonarQube/SonarCloud. Las propias miden calidad funcional y riesgo operativo; Sonar mide calidad estatica del codigo.

## Metricas propias del sistema

| Metrica | Tipo | Que mide | Como se calcula | Resultado esperado | Como se interpreta | Impacto en calidad | Accion de mejora |
|---|---|---|---|---|---|---|---|
| Indice de riesgo documental (`document-risk`) | Propia de dominio | Documentos evaluables vencidos o proximos a vencer. | `(vencidos + proximos) / documentos evaluables * 100`. | 0%. | 0% verde; 1%-49% amarillo; 50%+ rojo; sin documentos neutral. | Reduce riesgo legal, interrupciones y perdida de disponibilidad de flota. | Renovar documentos vencidos, agendar proximos vencimientos y revisar alertas preventivas. |
| Completitud de datos operativos (`operational-completeness`) | Propia de dominio | Registros de vehiculos, conductores y documentos con campos minimos completos. | `registros completos / registros evaluados * 100`. | 100%. | 100% verde; 80%-99% amarillo; <80% rojo; sin registros neutral. | Mejora trazabilidad, reportes, alertas y decisiones operativas. | Completar placas, identificadores, telefonos, fechas, certificados y datos obligatorios. |
| Indice de criticidad de alertas (`alert-criticality`) | Propia de dominio | Alertas criticas frente al total de alertas activas. | `alertas criticas / alertas activas * 100`. | 0%. | 0% verde; 1%-29% amarillo; 30%+ rojo; sin alertas neutral. | Permite priorizar riesgos que afectan continuidad, cumplimiento y seguridad. | Resolver alertas rojas, documentar causa raiz y prevenir recurrencias. |

Evidencia de implementacion:

- Codigo: `apps/web/src/utils/qualityMetrics.js`
- Tests: `apps/web/src/__tests__/qualityMetrics.test.js`
- Generador: `apps/web/tools/generate-quality-evidence.mjs`
- Comando: `npm --prefix apps/web run quality:metrics`
- Salida esperada: `apps/web/coverage/quality-metrics-report.json`

## Metricas de SonarQube/SonarCloud

| Metrica | Tipo | Que mide | Como se calcula | Resultado esperado | Como se interpreta | Impacto en calidad | Accion de mejora |
|---|---|---|---|---|---|---|---|
| Coverage | SonarCloud | Porcentaje de lineas/ramas ejecutadas por pruebas. | Sonar importa `apps/web/coverage/lcov.info`. | >80% para nivel excelente. | 50% implica que la mitad del codigo medido no fue ejecutado por tests; >80% da confianza razonable. | Reduce regresiones en reglas criticas. | Agregar pruebas a ramas no cubiertas y revisar exclusiones. |
| Duplications | SonarCloud | Bloques duplicados. | Analisis CPD de Sonar sobre fuentes no excluidas. | 0% o muy bajo. | Duplicidad alta aumenta deuda y bugs repetidos. | Mejora mantenibilidad y consistencia de cambios. | Extraer helpers, consolidar adaptadores y eliminar copy-paste. |
| Maintainability | SonarCloud | Code smells y deuda tecnica. | Rating Sonar por deuda estimada. | A. | B o peor implica refactor pendiente antes de crecer. | Reduce costo de evolucion. | Resolver smells priorizados y simplificar funciones. |
| Reliability/Bugs | SonarCloud | Bugs potenciales. | Reglas estaticas de Sonar. | A y 0 bugs abiertos. | Rating bajo implica fallos probables en ejecucion. | Mejora estabilidad. | Corregir bugs antes de merge y agregar prueba de regresion. |
| Security/Hotspots | SonarCloud | Vulnerabilidades y puntos sensibles revisables. | Reglas de seguridad y hotspots. | 0 vulnerabilidades; hotspots revisados. | Hotspot sin revisar no siempre es bug, pero requiere decision documentada. | Reduce exposicion a fallos de seguridad. | Sanitizar entradas, retirar secretos y revisar autenticacion/configuracion. |

No se colocan valores actuales de SonarCloud porque deben capturarse desde el dashboard o desde el run mas reciente de GitHub Actions.

## Comandos

```bash
npm --prefix apps/web ci
npm --prefix apps/web run lint
npm --prefix apps/web test
npm --prefix apps/web run quality:metrics
npm --prefix apps/web run build
```

## Evidencia pendiente de captura

| Evidencia | Archivo sugerido | Observacion |
|---|---|---|
| JSON de metricas propias | `docs/final-evaluation/img/quality-metrics-report.png` | No contiene secretos. |
| UI de reportes | `docs/final-evaluation/img/metricas-ui.png` | Mostrar interpretacion y accion de mejora. |
| Sonar coverage | `docs/final-evaluation/img/sonar-coverage.png` | Debe ser del analisis actual. |
| Sonar duplicidad/mantenibilidad/seguridad | `docs/final-evaluation/img/sonar-quality.png` | Ocultar datos privados si aplica. |

## Validacion local realizada el 2026-05-15

| Comando | Resultado |
|---|---|
| `npm --prefix apps/web run quality:metrics` | Genero `apps/web/coverage/quality-metrics-report.json`. |
| `document-risk` con dataset de evidencia | 50%, estado rojo, 3 de 6 documentos evaluables afectados. |
| `operational-completeness` con dataset de evidencia | 100%, estado verde, 9 de 9 registros completos. |
| `alert-criticality` con dataset de evidencia | 33%, estado rojo, 1 de 3 alertas activas criticas. |

Estos valores son de un dataset controlado para demostrar calculo e interpretacion; no deben presentarse como medicion productiva real.
