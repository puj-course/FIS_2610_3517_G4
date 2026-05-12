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

## Diferencia frente a SonarCloud

Estas métricas son propias del dominio funcional del sistema. Evalúan el estado real de operación que ve el usuario en reportes: riesgo documental, completitud de datos y criticidad de alertas. No reemplazan SonarCloud; lo complementan con evidencia de calidad funcional mientras SonarCloud evalúa calidad técnica del código.

## Métricas SonarCloud

- Coverage: Pendiente de completar con evidencia real de SonarCloud.
- Maintainability, Security o Duplications: Pendiente de completar con evidencia real de SonarCloud.

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
