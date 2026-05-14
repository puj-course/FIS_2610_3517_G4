# Metricas de calidad

Este documento resume la evidencia de calidad del sistema y apunta al paquete final de sustentacion. No reemplaza las capturas ni los reportes verificables.

Documento principal de defensa:

- [Metricas propias finales](evidencias_finales/metricas/01_metricas_propias.md)
- [SonarCloud](evidencias_finales/sonar/02_sonarcloud.md)
- [Pruebas y coverage](evidencias_finales/pruebas/03_pruebas_unitarias_coverage.md)

## Metricas propias implementadas

| Metrica | Implementacion | Pruebas | Diferencia frente a SonarCloud |
|---|---|---|---|
| Indice de riesgo documental | `apps/web/src/utils/qualityMetrics.js` | `apps/web/src/__tests__/qualityMetrics.test.js` | Sonar no mide vigencia legal ni vencimientos de flota. |
| Completitud de datos operativos | `apps/web/src/utils/qualityMetrics.js` | `apps/web/src/__tests__/qualityMetrics.test.js` | Sonar no valida si un registro tiene datos de negocio suficientes. |
| Indice de criticidad de alertas | `apps/web/src/utils/qualityMetrics.js` | `apps/web/src/__tests__/qualityMetrics.test.js` | Sonar no interpreta alertas activas ni prioridades operativas. |

## Comandos reproducibles

```bash
npm --prefix apps/web ci
npm --prefix apps/web run lint
npm --prefix apps/web test
npm --prefix apps/web run quality:metrics
npm --prefix apps/web run build
```

## SonarCloud

El analisis esta configurado en:

- `sonar-project.properties`
- `.github/workflows/sonarcloud.yml`

Metricas a sustentar con capturas:

| Metrica | Que mide | Interpretacion |
|---|---|---|
| Coverage | Codigo ejecutado por pruebas. | `80%+` respalda nivel excelente si corresponde al alcance configurado. |
| Duplications | Codigo repetido. | Bajo o `0%` reduce deuda y riesgo de bugs duplicados. |
| Maintainability | Code smells/deuda tecnica. | Rating `A` indica bajo costo de mantenimiento. |
| Security Hotspots | Puntos sensibles de seguridad. | Deben estar en cero o revisados y justificados. |

## Evidencia pendiente

No registrar como evidencia un resultado no capturado. Agregar capturas en:

- `Docs/QA/evidencias_finales/metricas/img/`
- `Docs/QA/evidencias_finales/sonar/img/`
- `Docs/QA/evidencias_finales/pruebas/img/`

## Acciones para 5.0

- [ ] Capturar `quality:metrics`.
- [ ] Capturar JSON generado.
- [ ] Capturar UI de reportes con metricas.
- [ ] Capturar SonarCloud actual.
- [ ] Confirmar que tests de frontend y backend pasan.
- [ ] Restaurar o consolidar tests RTM si aparecen eliminados en `git status`.
- [ ] Explicar las exclusiones de coverage de forma transparente.

