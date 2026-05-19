# Postmortem — Milestone 3 - Gestión documental y monitoreo

## 1. Resumen del ciclo

El Milestone 3 fortaleció la madurez técnica del proyecto con gestión documental, persistencia, monitoreo, seguridad y QA. El avance fue claro en issues cerradas y formalización del proceso, pero el ciclo expuso una causa raíz crítica: variables de entorno y secretos tratados demasiado tarde.

## 2. Evaluación del producto

- Qué se produjo: gestión SOAT/RTM, validaciones de autenticación, mejoras responsivas y monitoreo.
- Qué se validó: persistencia, aislamiento de datos y flujos documentales.
- Qué quedó incompleto: PRs con milestone asignado para trazabilidad directa.
- Calidad del resultado: mayor madurez técnica, con aprendizaje fuerte en seguridad.

## 3. Evaluación del esfuerzo

- Participación: todos los integrantes aparecen en issues asignadas.
- Distribución: `samuelfl680`, `solonlosada2006` y `Juserora` concentran soporte técnico y QA.
- Commits: 82 commits por ventana de sprint S9-S10.
- Issues: 38 issues cerradas y 14 HU cerradas estrictas.
- PRs: 0 PRs con milestone asignado; se declara el dato como no disponible.

## 4. Evaluación del proceso

- Planeación: mejoró con estimación y QA más formal.
- Seguimiento: issues cerradas documentan avance del ciclo.
- Comunicación: los reportes QA redujeron ambigüedad.
- Uso de GitHub: suficiente para issues; incompleto para PRs con milestone.
- Uso de Scrum: se fortaleció con Scrum Poker y revisión de riesgos.

Evaluación por roles con hechos objetivos:

| Rol | Hecho observado | Mejora |
|---|---|---|
| Scrum Master | Lideró mayor disciplina de estimación y seguimiento. | Incluir seguridad como punto fijo de planning. |
| Product Owner / Sprint Planner | Priorizó documentos y coherencia de dominio. | Agregar criterios responsive a HU visuales. |
| Configuration Manager | Identificó riesgo de secretos y variables tardías. | Definir `.env.example` desde día 1. |
| QA Lead | Formalizó reportes con pasos reproducibles. | Mantener pruebas mobile como criterio de cierre. |
| DevOps Engineer | Usó pipeline/SonarCloud como alerta de seguridad. | Añadir prevención local antes del pipeline. |

## 5. Qué salió bien

- Se formalizó el rol QA.
- Se documentaron hallazgos con pasos de reproducción.
- Se avanzó en persistencia y seguridad.
- Se cerraron todas las issues del milestone.

## 6. Qué salió mal

- La gestión de secretos se postergó.
- SonarCloud detectó problemas bajo presión.
- Algunas HU visuales no tenían criterios mobile explícitos.
- La trazabilidad PR por milestone quedó incompleta.

## 7. Causas raíz

| Problema | Causa raíz | Impacto |
|---|---|---|
| Secretos hardcodeados o tardíos | Variables de entorno configuradas al final | Riesgo de seguridad y retrasos |
| Hallazgos responsivos tardíos | Criterios mobile no explícitos | Retrabajo en UI |
| PRs sin milestone | Disciplina incompleta de metadatos GitHub | Menor trazabilidad directa |

## 8. Acciones correctivas

- Configurar variables desde el día 1.
- Agregar criterios mobile a HU visuales.
- Registrar PRs con milestone cuando correspondan.
- Revisar riesgos de seguridad en Sprint Planning.

## 9. Acciones preventivas

- Mantener `.env.example` sin valores reales.
- Usar secretos de GitHub y no credenciales en documentación.
- Aplicar checklist de seguridad antes de integración.
- Mantener reportes QA reproducibles.

## 10. Retrospectiva estrella de mar

### Comenzar a hacer

- Configurar variables de entorno desde el primer día del sprint.
- Incluir criterios responsivos en HU con componentes visuales.
- Registrar milestone en PRs relevantes para trazabilidad.

### Más de

- Aplicar Scrum Poker en historias con incertidumbre técnica.
- Comunicar bloqueos de seguridad en cuanto aparezcan.
- Validar flujos críticos antes de construir presentación encima.

### Seguir haciendo

- Documentar reportes QA con pasos de reproducción.
- Usar MongoDB Atlas para persistencia real.
- Mantener trazabilidad por issues y sub-issues.

### Menos de

- Posponer configuración de entornos.
- Redactar hallazgos sin evidencia.
- Depender de datos residuales en pruebas.

### Dejar de hacer

- Incluir credenciales hardcodeadas.
- Tratar seguridad como actividad de cierre.
- Cerrar HU visuales sin prueba responsive.

## 11. Plan de mejora

| Acción | Responsable | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Configurar entorno desde día 1 | Configuration Manager | Guía de variables | Sin secretos en código |
| Revisar riesgos de seguridad | Scrum Master | Checklist en planning | Riesgos tratados antes de implementar |
| Agregar criterios mobile | Product Owner | HU con criterios responsive | Menos bugs visuales tardíos |
| Formalizar QA reproducible | QA Lead | Issues con template | Corrección más rápida |

## 12. Conclusión

M3 fue finalizado y elevó la madurez de seguridad, monitoreo y QA. El aprendizaje central fue que la calidad y la seguridad son parte del proceso diario, no tareas finales.
