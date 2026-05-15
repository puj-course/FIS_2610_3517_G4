# SonarQube / SonarCloud: configuracion e interpretacion

## Configuracion revisada

| Elemento | Estado | Evidencia |
|---|---|---|
| Proyecto | Configurado con `sonar.organization=puj-course` y `sonar.projectKey=puj-course_FIS_2610_3517_G4`. | `sonar-project.properties` |
| Fuentes | Sonar analiza `apps/web/src`. | `sonar.sources=apps/web/src` |
| Tests | Tests frontend incluidos por patron `apps/web/src/**/*.test.js`. | `sonar.test.inclusions` |
| Coverage | Vitest genera `apps/web/coverage/lcov.info` y Sonar lo importa. | `sonar.javascript.lcov.reportPaths` |
| Workflow | Ejecuta install, lint, audit, tests con coverage, metricas propias, build y scanner. | `.github/workflows/sonarcloud.yml` |
| Secret | Requiere `SONAR_TOKEN`. | GitHub Secrets, no versionar valor |

El backend no esta en `sonar.sources`; por tanto, al sustentar, el equipo debe decir que la evidencia Sonar corresponde al frontend configurado. El backend se valida con tests Node y Docker healthchecks.

## Interpretacion por metrica

| Metrica | Que significa | Calificacion baja | Acciones correctivas |
|---|---|---|---|
| Coverage | Porcentaje de codigo medido ejecutado por pruebas. | Coverage del 50% significa que una parte grande del codigo puede romperse sin que CI lo detecte. | Agregar tests a adaptadores, utilidades, hooks y reglas de negocio; evitar tests vacios. |
| Duplicidad | Codigo repetido detectado por Sonar. | Duplicidad alta sube costo de mantenimiento y puede duplicar bugs. | Extraer funciones, componentes o estrategias compartidas. |
| Mantenibilidad | Deuda tecnica y code smells. | Rating B/C implica esfuerzo creciente para cambiar el sistema. | Corregir smells, reducir complejidad, mejorar nombres y contratos. |
| Seguridad | Vulnerabilidades detectadas. | Vulnerabilidades abiertas pueden invalidar una entrega excelente. | Corregir validaciones, sanitizacion, manejo de secretos y dependencias. |
| Bugs/Reliability | Posibles defectos funcionales por analisis estatico. | Rating bajo indica riesgo de fallos reales. | Corregir bugs y cubrir con prueba de regresion. |
| Security Hotspots | Puntos sensibles que requieren revision humana. | Hotspots sin revisar no prueban explotabilidad, pero si falta de control. | Revisar cada hotspot, marcar decision y corregir si hay riesgo. |

## Relacion coverage local vs Sonar

1. `npm --prefix apps/web test` genera `apps/web/coverage/lcov.info`.
2. GitHub Actions sube ese archivo como artefacto y luego ejecuta Sonar.
3. Sonar importa el LCOV segun `sonar.javascript.lcov.reportPaths`.
4. Si Sonar muestra 0% o un valor inesperado, revisar ruta del LCOV, working directory y exclusiones.

## Comandos y evidencia

```bash
npm --prefix apps/web ci
npm --prefix apps/web test
test -f apps/web/coverage/lcov.info && echo "LCOV generado"
```

Evidencia que debe capturar el equipo:

| Captura | Uso en sustentacion |
|---|---|
| Quality Gate Passed | Demuestra que el analisis no quedo solo configurado. |
| Coverage | Sustenta el criterio de pruebas >80%. |
| Duplications | Sustenta una de las metricas Sonar. |
| Maintainability/Reliability | Explica deuda y bugs. |
| Security/Hotspots | Explica gestion de riesgos de seguridad. |

No completar valores numericos aqui sin captura actual del dashboard.
