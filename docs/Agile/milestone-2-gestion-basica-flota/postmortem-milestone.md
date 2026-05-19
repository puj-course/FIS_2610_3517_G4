# Postmortem — Milestone 2 - Gestión básica de flota

## 1. Resumen del ciclo

El Milestone 2 consolidó la gestión básica de flota y permitió al equipo avanzar hacia una arquitectura más mantenible. Se trabajó con interfaces de conductores y vehículos, validación RUNT, patrones de diseño y pruebas de flujos críticos. El ciclo dejó avances funcionales claros y expuso riesgos de interoperabilidad entre entornos.

## 2. Evaluación del producto

- Qué se produjo: interfaces de gestión de flota, flujos de validación y soporte de pruebas críticas.
- Qué se validó: gestión de conductores, vehículos y escenarios de validación.
- Qué quedó incompleto: evidencia granular por captura de cada flujo.
- Calidad del resultado: funcional, con mejora arquitectónica, pero con riesgos por convenciones y entornos.

## 3. Evaluación del esfuerzo

- Participación: los cinco integrantes aparecen en issues asignadas.
- Distribución: `solonlosada2006` y `Sarm-m` concentran HU asignadas; `samuelfl680` aporta PR mergeado.
- Commits: 164 commits por ventana de sprint S5-S8.
- Issues: 37 issues cerradas y 14 HU cerradas estrictas.
- PRs: 1 PR asociado y mergeado.

## 4. Evaluación del proceso

- Planeación: mejoró la división en sub-issues, pero faltó mapa de dependencias.
- Seguimiento: GitHub permitió trazabilidad por issue.
- Comunicación: hubo más autonomía, pero menor visibilidad de integración.
- Uso de GitHub: las issues cerradas sostienen el avance del milestone.
- Uso de Scrum: se avanzó en trazabilidad, aunque faltó anticipar riesgos técnicos de entorno.

Evaluación por roles con hechos objetivos:

| Rol | Hecho observado | Mejora |
|---|---|---|
| Scrum Master | Impulsó sub-issues atómicas para mejorar seguimiento. | Aumentar visibilidad colectiva de integración. |
| Product Owner / Sprint Planner | Mantuvo foco en gestión de flota y RUNT. | Definir rutas y menús antes del desarrollo. |
| Configuration Manager | Identificó conflictos por alias y nombres. | Estandarizar naming e importaciones. |
| QA Lead | Detectó dependencias visuales construidas fuera de orden. | Mapear dependencias antes de implementar. |
| DevOps Engineer | Señaló deuda de entorno homogéneo. | Formalizar Docker Compose como base reproducible. |

## 5. Qué salió bien

- Se dividió el trabajo en issues más pequeñas.
- Se fortaleció la arquitectura con separación de responsabilidades.
- Se cerraron todas las issues del milestone.
- Se validaron flujos críticos de flota.

## 6. Qué salió mal

- Se detectaron problemas por nombres de archivos y alias.
- Se asumió que el código funcionaría igual en todos los entornos.
- Se construyeron componentes dependientes antes de tener infraestructura base.
- Se dejó evidencia visual para etapas tardías.

## 7. Causas raíz

| Problema | Causa raíz | Impacto |
|---|---|---|
| Fallos por imports y alias | Convenciones de nombres incompletas | Retrabajo e integración lenta |
| Diferencias Windows/Linux | Entorno no homogeneizado | Bugs que aparecían solo en algunos equipos |
| Componentes dependientes prematuros | Dependencias no mapeadas al planear | Rehacer trabajo visual |

## 8. Acciones correctivas

- Estandarizar nombres, rutas e importaciones.
- Validar flujos en más de un entorno.
- Mapear dependencias de UI antes de implementar.
- Documentar evidencia al cerrar cada HU.

## 9. Acciones preventivas

- Definir interoperabilidad como requisito del sprint.
- Usar checklist de integración del dashboard.
- Revisar cambios de esquema con todo el equipo.
- Mantener sub-issues atómicas enlazadas a PRs.

## 10. Retrospectiva estrella de mar

### Comenzar a hacer

- Estandarizar convenciones de nombres mediante reglas compartidas.
- Definir rutas y menús antes de construir componentes dependientes.
- Recolectar evidencia técnica durante el sprint.

### Más de

- Comunicar cambios en esquemas y contratos antes de integrarlos.
- Revisar dependencias técnicas en sesión de kick-off.
- Realizar commits frecuentes para reducir conflictos.

### Seguir haciendo

- Dividir el trabajo en sub-issues atómicas.
- Aplicar patrones de diseño cuando reduzcan deuda real.
- Usar pruebas de flujos críticos para validar valor funcional.

### Menos de

- Asumir compatibilidad entre entornos sin verificación.
- Posponer feedback visual hasta el cierre.
- Depender de datos manuales no reproducibles.

### Dejar de hacer

- Construir componentes sobre infraestructura inexistente.
- Duplicar archivos sin revisar componentes existentes.
- Ignorar conflictos de alias como problemas individuales.

## 11. Plan de mejora

| Acción | Responsable | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Definir convenciones de nombres | Configuration Manager | Documento o regla lint | Menos errores de importación |
| Mapear dependencias de UI | QA Lead | Checklist del sprint | Menos retrabajo por infraestructura ausente |
| Validar entornos | DevOps Engineer | Guía reproducible | Mismo resultado en máquinas distintas |
| Mantener sub-issues | Scrum Master | Issues enlazadas | Trazabilidad más clara |

## 12. Conclusión

M2 fue finalizado y fortaleció la gestión de flota. Su mayor aprendizaje fue que la arquitectura necesita acompañarse de convenciones, entornos homogéneos y evidencia recolectada a tiempo.
