# 02 - SonarCloud / SonarQube

Este documento cubre las metricas tecnicas medidas por SonarCloud. Para defender nivel excelente se deben presentar al menos dos metricas de SonarCloud interpretadas tecnicamente. Se recomiendan coverage, duplications, maintainability y security hotspots.

## Configuracion

| Elemento | Ruta | Observacion |
|---|---|---|
| Proyecto Sonar | `sonar-project.properties` | Define `sonar.organization` y `sonar.projectKey`. |
| Fuentes | `apps/web/src` | Sonar analiza el frontend. |
| Reporte coverage | `apps/web/coverage/lcov.info` | Generado por Vitest. |
| Workflow | `.github/workflows/sonarcloud.yml` | Ejecuta lint, audit, tests, metricas propias, build y scan. |

Importante: el backend no esta incluido en `sonar.sources` actualmente. Si se defiende coverage global del sistema, aclarar que la cobertura Sonar corresponde al frontend configurado.

## Comandos reproducibles

```bash
npm --prefix apps/web ci
npm --prefix apps/web run lint
npm --prefix apps/web audit --audit-level=moderate
npm --prefix apps/web test
npm --prefix apps/web run quality:metrics
npm --prefix apps/web run build
```

El analisis SonarCloud requiere `SONAR_TOKEN` configurado en GitHub Secrets. No documentar el valor del token.

## Metricas SonarCloud a sustentar

| Metrica | Que mide | Interpretacion | Impacto | Accion si falla |
|---|---|---|---|---|
| Coverage | Porcentaje de lineas o ramas ejecutadas por pruebas automatizadas. | `80%+` soporta nivel excelente; menos indica rutas sin pruebas. | Reduce regresiones y aumenta confianza en cambios. | Agregar pruebas deterministas a ramas no cubiertas. |
| Duplications | Porcentaje de codigo repetido. | `0%` o bajo reduce costo de mantenimiento. | Evita bugs replicados y correcciones inconsistentes. | Extraer helpers, consolidar adaptadores y eliminar copy-paste. |
| Maintainability | Code smells y deuda tecnica. | Rating `A` indica deuda baja; `B` o peor exige refactor. | Mantiene bajo el costo de evolucion. | Resolver smells por prioridad y evitar funciones complejas. |
| Security / Hotspots | Vulnerabilidades y puntos sensibles revisables. | Cero vulnerabilidades abiertas y hotspots revisados es lo deseable. | Reduce exposicion a fallos de seguridad. | Sanitizar entradas, evitar secretos y revisar configuracion sensible. |
| Reliability | Bugs detectados por analisis estatico. | Rating `A` indica bajo riesgo de defectos tecnicos. | Evita fallos funcionales en ejecucion. | Corregir bugs reportados antes de merge. |

## Evidencias pendientes

| Captura | Archivo esperado | Estado |
|---|---|---|
| Quality Gate | `img/sonar-quality-gate.png` | Pendiente |
| Coverage | `img/sonar-coverage.png` | Pendiente |
| Duplications | `img/sonar-duplications.png` | Pendiente |
| Maintainability | `img/sonar-maintainability.png` | Pendiente |
| Security Hotspots | `img/sonar-security-hotspots.png` | Pendiente |
| Reliability | `img/sonar-reliability.png` | Pendiente |
| Comentario del bot en PR | `img/sonar-pr-comment.png` | Pendiente |

## Trazabilidad

| Issue | Branch | Commit | PR | Evidencia |
|---|---|---|---|---|
| `#556` | `feature-sarm-m` | Ver PR | PR de calidad | SonarCloud y coverage |
| Ajustes Sonar | `feature-sarm-m` / `develop` | Ver PRs | PRs de calidad hacia `develop` o `main` | Quality Gate |

## Acciones para defender 5.0

- [ ] Capturar Quality Gate actual, no uno antiguo.
- [ ] Capturar coverage superior a 80% si se defiende excelente.
- [ ] Capturar duplicacion baja o 0%.
- [ ] Capturar maintainability y reliability.
- [ ] Capturar security hotspots.
- [ ] Explicar las exclusiones de coverage de forma transparente.
- [ ] No decir que el backend esta cubierto por Sonar si no fue agregado a `sonar.sources`.

