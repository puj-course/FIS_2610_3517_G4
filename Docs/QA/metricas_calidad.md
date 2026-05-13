# Metricas de Calidad del Sistema

## Objetivo

Esta evidencia deja la categoria de metricas de calidad lista para calificacion excelente. El proyecto implementa tres metricas propias directamente en codigo, distintas de SonarQube, y las complementa con metricas tecnicas de SonarCloud ejecutadas en CI.

## Evidencia ejecutable

| Evidencia | Ubicacion | Funcion |
| --- | --- | --- |
| Implementacion de metricas propias | `apps/web/src/utils/qualityMetrics.js` | Calcula metricas de dominio y retorna valor, estado, interpretacion, impacto y accion de mejora. |
| Definicion tecnica de cada metrica | `getQualityMetricDefinitions()` | Documenta que mide, formula, umbrales, diferencia frente a SonarQube e impacto. |
| Pruebas unitarias | `apps/web/src/__tests__/qualityMetrics.test.js` | Valida escenarios normales, bordes, datos incompletos, interpretacion y definiciones. |
| Generador de evidencia | `apps/web/tools/generate-quality-evidence.mjs` | Genera `apps/web/coverage/quality-metrics-report.json` con resultados reproducibles. |
| CI SonarCloud | `.github/workflows/sonarcloud.yml` | Ejecuta lint, tests con coverage, evidencia de metricas propias, build y Quality Gate. |

Comandos de verificacion local:

```bash
npm --prefix apps/web run lint
npm --prefix apps/web test
npm --prefix apps/web run quality:metrics
npm --prefix apps/web run build
```

El comando `quality:metrics` produce un JSON verificable con fecha base controlada, dataset de evidencia, definiciones tecnicas y resultados.

## Metricas propias implementadas en codigo

Estas metricas son de calidad funcional y operativa. No reemplazan a SonarCloud; cubren riesgos del negocio que SonarQube no puede detectar mediante analisis estatico.

| Metrica propia | Que mide exactamente | Formula | Interpretacion del resultado | Impacto en calidad | Accion concreta de mejora |
| --- | --- | --- | --- | --- | --- |
| Indice de riesgo documental | Porcentaje de documentos evaluables vencidos o proximos a vencer. Usa SOAT, RTM, licencias, documentos genericos y conductores con campos de vencimiento. | `(documentos vencidos + documentos proximos a vencer) / documentos evaluables * 100` | `0%` es verde; `1% - 49%` es amarillo; `50%+` es rojo; sin documentos evaluables es neutral. | Reduce riesgo legal, interrupciones operativas y perdida de disponibilidad de la flota. | Renovar documentos vencidos, programar proximos vencimientos y mantener alertas preventivas. |
| Completitud de datos operativos | Porcentaje de vehiculos, conductores y documentos con campos minimos completos. | `registros completos / registros evaluados * 100` | `100%` es verde; `80% - 99%` es amarillo; menos de `80%` es rojo; sin registros es neutral. | Sostiene trazabilidad, reportes confiables y generacion correcta de alertas. | Completar placas, identificadores, telefonos, fechas y datos obligatorios faltantes. |
| Indice de criticidad de alertas | Porcentaje de alertas criticas dentro del total de alertas activas. | `alertas criticas / alertas activas * 100` | `0%` es verde; `1% - 29%` es amarillo; `30%+` es rojo; sin alertas es neutral. | Permite priorizar riesgos que afectan cumplimiento, continuidad y seguridad operativa. | Resolver primero alertas rojas, documentar causa raiz y prevenir recurrencia. |

### Diferencia explicita frente a SonarQube

| Metrica propia | Por que no es SonarQube |
| --- | --- |
| Riesgo documental | SonarQube no evalua fechas de vencimiento, cumplimiento documental ni riesgo legal de una flota. |
| Completitud operativa | SonarQube no sabe si una placa, telefono, certificado o fecha son suficientes para operar el sistema. |
| Criticidad de alertas | SonarQube no interpreta alertas activas ni prioriza incidentes operativos del dominio. |

## Metricas SonarCloud requeridas

El workflow de SonarCloud ejecuta pruebas y envia `apps/web/coverage/lcov.info`. Ademas espera el Quality Gate con `sonar.qualitygate.wait=true`, por lo que la revision no queda en "se ejecuto el scan", sino en "el scan aprobo o fallo".

Resultado local verificado despues de la correccion:

```text
Test Files: 10 passed
Tests: 128 passed
Statements: 97.91%
Branches: 93.51%
Functions: 100%
Lines: 98.74%
```

| Metrica SonarCloud | Que mide | Interpretacion tecnica | Impacto | Accion si sale deficiente |
| --- | --- | --- | --- | --- |
| Coverage | Porcentaje de lineas ejecutadas por pruebas automatizadas. | `80%+` permite defender excelente; `60% - 79%` deja riesgo medio; menos de `60%` evidencia pruebas insuficientes. | Aumenta confianza en reglas de negocio, adaptadores y utilidades. | Agregar pruebas a ramas no cubiertas y no excluir archivos solo para inflar el dato. |
| Duplications | Bloques repetidos entre archivos o dentro del codigo. | `0%` en codigo nuevo es ideal; duplicacion creciente aumenta mantenimiento y bugs replicados. | Evita correcciones paralelas inconsistentes. | Extraer funciones compartidas, unificar adaptadores repetidos y eliminar copy-paste. |
| Maintainability | Code smells y deuda tecnica estimada. | Rating `A` indica deuda baja; `B` o peor exige refactor puntual antes de seguir agregando funciones. | Mantiene el costo de cambio bajo y mejora legibilidad. | Resolver smells por prioridad: funciones complejas, props faltantes, ramas innecesarias y nombres ambiguos. |
| Security / Hotspots | Vulnerabilidades y puntos sensibles revisables. | Cero vulnerabilidades abiertas es obligatorio; hotspots deben estar revisados y justificados. | Reduce exposicion a fallos de autenticacion, inyeccion y manejo inseguro de datos. | Corregir validaciones, sanitizar entradas, evitar regex riesgoso y documentar hotspots revisados. |

## Configuracion SonarCloud

Archivo principal: `sonar-project.properties`.

- `sonar.sources=apps/web/src`
- `sonar.tests=apps/web/src`
- `sonar.javascript.lcov.reportPaths=apps/web/coverage/lcov.info`
- El workflow `.github/workflows/sonarcloud.yml` ejecuta `npm test`, `npm run quality:metrics`, `npm run build` y espera el Quality Gate.

## Criterio de aceptacion para defender 5

Para defender calificacion excelente se debe mostrar:

1. Tres metricas propias implementadas en `qualityMetrics.js`.
2. Pruebas unitarias verdes para esas metricas.
3. Archivo `coverage/quality-metrics-report.json` generado por comando reproducible.
4. Al menos dos metricas SonarCloud visibles; se recomiendan coverage, duplications, maintainability y security.
5. Interpretacion de cada metrica con umbrales, impacto y accion concreta de mejora.
6. Auditoria de dependencias frontend sin vulnerabilidades moderadas o superiores.
7. Quality Gate aprobado en GitHub Actions.

## Acciones de mejora si una metrica baja

| Resultado deficiente | Accion | Como corrige el problema |
| --- | --- | --- |
| Riesgo documental rojo | Renovar vencidos y programar alertas de proximos vencimientos. | Reduce el porcentaje de documentos afectados y recupera continuidad operativa. |
| Completitud roja | Obligar campos minimos en formularios y completar registros incompletos. | Aumenta registros completos y mejora confiabilidad de reportes. |
| Criticidad roja | Resolver alertas rojas antes que preventivas y registrar causa raiz. | Disminuye la proporcion de alertas criticas activas. |
| Coverage bajo | Agregar tests a ramas no cubiertas y ejecutar `npm test` antes del merge. | Incrementa lineas cubiertas y evita regresiones silenciosas. |
| Duplicacion alta | Extraer funciones comunes y consolidar adaptadores. | Reduce codigo repetido y costo de mantenimiento. |
| Maintainability baja | Refactorizar funciones complejas y eliminar smells. | Baja deuda tecnica y mejora capacidad de evolucion. |
