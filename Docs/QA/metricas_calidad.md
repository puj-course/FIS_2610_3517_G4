# Métricas de Calidad del Sistema

## Objetivo

Estas métricas evalúan la calidad funcional y operativa del sistema DriveControl / AutoMinder Enterprise a partir de datos del dominio: documentos, vehículos, conductores y alertas. Son métricas propias del comportamiento del producto y son distintas a las métricas estáticas de SonarCloud.

## Relación con Sprint 13

Esta evidencia corresponde a:

- HU #556: Automatizar métricas propias de calidad del sistema.
- Sub-issue de implementación #557: Implementar métricas propias e integrarlas en reportes.
- Sub-issue de pruebas y documentación #558: Validar y documentar métricas propias de calidad.
- Rama de trabajo: `feature-sarm-m`.

## Métricas propias implementadas en código

| Métrica | Qué mide | Fuente de datos | Forma de cálculo | Interpretación | Impacto en calidad | Acción de mejora |
| --- | --- | --- | --- | --- | --- | --- |
| Índice de riesgo documental | Porcentaje de documentos vencidos o próximos a vencer. | SOAT, RTM y licencias de conducción disponibles en el frontend. | `(documentos vencidos + documentos próximos a vencer) / documentos evaluables * 100`. | 0% indica documentos evaluables vigentes; porcentajes mayores indican exposición documental. | Ayuda a anticipar incumplimientos legales y fallas de continuidad operativa. | Renovar documentos vencidos y programar gestión preventiva para próximos vencimientos. |
| Completitud de datos operativos | Porcentaje de registros con campos mínimos completos. | Vehículos, conductores, SOAT y RTM. | `registros completos / registros evaluados * 100`. | 100% indica datos suficientes para reportes y alertas confiables; valores menores indican datos pendientes. | Mejora trazabilidad, calidad de reportes y confiabilidad de alertas. | Completar placas, identificadores, fechas, datos de conductor y datos documentales obligatorios. |
| Índice de criticidad de alertas | Porcentaje de alertas críticas frente al total de alertas activas. | Alertas generadas por el sistema. | `alertas críticas / total de alertas * 100`. | 0% indica ausencia de alertas críticas; porcentajes mayores priorizan atención inmediata. | Permite enfocar operación en riesgos urgentes antes de que afecten la flota. | Atender primero alertas rojas y cerrar causas documentales u operativas asociadas. |

## Umbrales e interpretación semafórica

### Índice de Riesgo Documental

| Rango | Estado | Color | Significado operativo |
|-------|--------|-------|-----------------------|
| 0% | Verde | 🟢 | Todos los documentos evaluables están vigentes |
| 1% – 49% | Amarillo | 🟡 | Hay documentos próximos a vencer; gestión preventiva requerida |
| ≥ 50% | Rojo | 🔴 | Más de la mitad de los documentos están en riesgo; atención inmediata |
| Sin datos | Neutro | ⚪ | No hay documentos evaluables registrados |

**Ejemplo de cálculo con datos reales del seed:**  
Flota demo: 12 SOAT + 12 RTM = 24 documentos evaluables.  
Si 2 SOAT vencidos + 3 RTM próximos a vencer = 5 afectados.  
`Índice = 5 / 24 × 100 = 20.8%` → Estado: **Amarillo** ⚠️

### Completitud de Datos Operativos

| Rango | Estado | Color | Significado operativo |
|-------|--------|-------|-----------------------|
| 100% | Verde | 🟢 | Todos los registros tienen campos mínimos completos |
| 80% – 99% | Amarillo | 🟡 | Algunos registros tienen datos pendientes |
| < 80% | Rojo | 🔴 | Más del 20% de registros incompletos; reportes poco confiables |
| Sin datos | Neutro | ⚪ | No hay registros evaluables |

**Campos mínimos requeridos por tipo de registro:**

| Tipo | Campos obligatorios |
|------|---------------------|
| Vehículo | placa, marca, modelo, año, tipo |
| Conductor | nombre, documento, teléfono, categoría, fechaVencimiento |
| SOAT | vehiculoId, placaVehiculo, numeroPoliza, aseguradora, fechaInicioVigencia, fechaFinVigencia |
| RTM | vehiculoId, placaVehiculo, numeroCertificado, cda, fechaExpedicion, fechaVencimiento, resultado |

### Índice de Criticidad de Alertas

| Rango | Estado | Color | Significado operativo |
|-------|--------|-------|-----------------------|
| 0% | Verde | 🟢 | Sin alertas críticas activas |
| 1% – 29% | Amarillo | 🟡 | Hay alertas críticas; priorizar sobre las preventivas |
| ≥ 30% | Rojo | 🔴 | Alta proporción de alertas críticas; riesgo operativo elevado |
| Sin alertas | Neutro | ⚪ | No hay alertas activas para evaluar |

## Implementación en código

Las tres métricas están implementadas en `apps/web/src/utils/qualityMetrics.js` y expuestas mediante:

```js
import { buildQualityMetricsSummary } from '@/utils/qualityMetrics.js';

const metricas = buildQualityMetricsSummary({
  soats, rtms, conductores, vehiculos, alertas
});
// Retorna: [documentRisk, operationalCompleteness, alertCriticality]
```

Cada métrica retorna un objeto con: `{ id, name, value, percentage, status, interpretation, impact, improvementAction }`.

La suite de pruebas unitarias en `apps/web/src/__tests__/qualityMetrics.test.js` (736 líneas) valida el comportamiento correcto de las tres funciones exportadas con más de 30 casos de prueba incluyendo datos nulos, undefined, fechas inválidas y estados mixtos.

## Diferencia frente a SonarCloud

Estas métricas son propias del dominio funcional del sistema. Evalúan el estado real de operación que ve el usuario en reportes: riesgo documental, completitud de datos y criticidad de alertas. No reemplazan SonarCloud; lo complementan con evidencia de calidad funcional mientras SonarCloud evalúa calidad técnica del código.

## Métricas SonarCloud

- PR #564: Quality Gate aprobado. Coverage on New Code: 83.7%. Duplication on New Code: 0.0%.
- Maintainability: se priorizaron los code smells reportados en New Code para `qualityMetrics.js`, `ReportesPage.jsx`, `useValidationHistory.js` y `ValidacionRUNTPage.jsx`.
- Duplications y Security Hotspots: sin fallas reportadas en la evidencia visual del PR #564.
<img width="1904" height="940" alt="image" src="https://github.com/user-attachments/assets/c3f124b8-be26-4238-bef1-4f26529a8fb5" />

## Alcance de cobertura SonarCloud

La cobertura automatizada se enfoca en lógica de dominio, utilidades, hooks con lógica pura y adaptadores. En este alcance se mantienen medidos archivos como métricas de calidad, formatos colombianos, fechas, simulación RUNT y adaptadores de alertas.

Las páginas, layouts, contextos, componentes visuales y hooks de integración se validan mediante lint, build, revisión funcional/manual y análisis estático de SonarCloud. Por eso `sonar.coverage.exclusions` evita mezclar cobertura unitaria de lógica con superficies visuales o de integración que no se prueban de forma aislada.

Los archivos excluidos del cálculo de coverage siguen dentro de `sonar.sources`; por tanto SonarCloud los continúa analizando para mantenibilidad, confiabilidad, seguridad y hotspots.

## Corrección de Security Hotspots

Se reemplazaron expresiones regulares sensibles por funciones deterministas sin backtracking riesgoso. Las validaciones de correo ahora separan local y dominio con operaciones de string y límites explícitos de longitud.

La normalización de la URL base de la API dejó de usar regex para remover slashes finales y usa una función iterativa con `endsWith` y `slice`, manteniendo el mismo comportamiento funcional.


## Pendientes SonarCloud

Se priorizó New Code del PR #564 para recuperar el Quality Gate sin bajar umbrales, excluir archivos ni cerrar issues manualmente. Los issues legacy de Overall Code deben abordarse por tandas seguras, empezando por validación de props en componentes pequeños, variables no usadas, asignaciones inútiles, ternarios anidados simples, reemplazos `replace` a `replaceAll` equivalentes y `catch` sin manejo claro.

## Evidencia requerida

Comandos para validar la evidencia local:

```bash
npm --prefix apps/web run lint
npm --prefix apps/web run build
npm --prefix apps/web run test -- --coverage
```

## Acciones de mejora

- Índice de riesgo documental: priorizar documentos vencidos, revisar documentos próximos a vencer y mantener alertas preventivas activas.
- Completitud de datos operativos: corregir registros incompletos de vehículos, conductores, SOAT y RTM para sostener trazabilidad y reportes confiables.
- Índice de criticidad de alertas: resolver alertas críticas antes de las preventivas y revisar causas raíz para evitar recurrencia.
