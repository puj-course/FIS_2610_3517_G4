# Postmortem — Milestone 4 - Dashboard, alertas y cierre del sistema

## 1. Resumen del ciclo

El Milestone 4 cerró el proyecto con dashboard, alertas, Docker, CI/CD, SonarCloud, SMS/Twilio, métricas de calidad y evidencia final. El ciclo demostró mayor madurez técnica, pero también expuso riesgos de cierre: dependencia excesiva del pipeline, PR pendiente y ausencia de releases/tags.

## 2. Evaluación del producto

- Qué se produjo: cierre funcional, evidencia técnica, CI/CD, Docker, SMS y documentación final.
- Qué se validó: despliegue, pruebas, SonarCloud, SMS y trazabilidad de issues finales.
- Qué quedó incompleto: PR `#628` abierto y releases/tags no verificables.
- Calidad del resultado: defendible con evidencia, aunque con pendientes explícitos de integración y versionamiento formal.

## 3. Evaluación del esfuerzo

- Participación: los cinco integrantes aparecen en issues asignadas.
- Distribución: `samuelfl680`, `Sarm-m` y `solonlosada2006` concentran alta carga de cierre.
- Commits: 277 commits por ventana de sprint S11-S13.
- Issues: 132 issues cerradas y 20 HU cerradas estrictas.
- PRs: 3 PRs con milestone; 2 mergeadas y 1 abierta.

## 4. Evaluación del proceso

- Planeación: orientada a cierre de rúbrica y evidencia.
- Seguimiento: issues `#618` a `#622` documentan cierre técnico.
- Comunicación: mejoró la respuesta asíncrona ante bloqueos.
- Uso de GitHub: PRs, issues y capturas sostienen la evidencia.
- Uso de Scrum: el postmortem integra producto, esfuerzo, proceso y roles.

Evaluación por roles con hechos objetivos:

| Rol | Hecho observado | Mejora |
|---|---|---|
| Scrum Master | Coordinó cierre de evidencia, trazabilidad y respuesta a bloqueos. | Automatizar exportes al cierre de cada sprint. |
| Product Owner / Sprint Planner | Priorizó alertas, datos demo y valor de cierre. | Documentar datos demo desde planning. |
| Configuration Manager | Sostuvo ramas, PRs y configuración de cierre. | Definir política de tags/releases. |
| QA Lead | Validó pruebas, responsividad y hallazgos finales. | Exigir prueba funcional local antes de PR. |
| DevOps Engineer | Documentó CI/CD, Docker y SonarCloud. | Monitorear quality gate antes del cierre. |

## 5. Qué salió bien

- Se centralizó evidencia final de la rúbrica.
- Se documentó CI/CD, Docker, SonarCloud y SMS.
- Se resolvieron issues críticas de cierre.
- Se logró trazabilidad fuerte de Sprint 13.

## 6. Qué salió mal

- El PR `#628` quedó abierto.
- No se crearon releases/tags verificables.
- Se confió demasiado en CI como sustituto de validación funcional.
- Parte de la evidencia se recolectó bajo presión final.

## 7. Causas raíz

| Problema | Causa raíz | Impacto |
|---|---|---|
| PR pendiente | Cierre tardío de cambios QA/documentación | Integración incompleta |
| Sin releases/tags | Versionamiento formal no se planificó | Trazabilidad por versión limitada |
| Regresiones no capturadas por CI | Falta de prueba funcional local obligatoria | Retrabajo de cierre |
| Datos demo inconsistentes | Guía de datos no formalizada | Alertas confusas |

## 8. Acciones correctivas

- Resolver o justificar PR `#628`.
- Documentar ausencia de releases/tags.
- Exigir prueba funcional local antes de PR.
- Normalizar datos demo por usuario.

## 9. Acciones preventivas

- Crear política de tags desde el primer release académico.
- Añadir pruebas E2E a flujos críticos.
- Incluir captura de evidencia en el DoD.
- Revisar Quality Gate antes de la semana de cierre.

## 10. Retrospectiva estrella de mar

### Comenzar a hacer

- Definir política de releases o justificar formalmente su ausencia.
- Ejecutar pruebas funcionales locales antes de abrir PRs de cierre.
- Documentar datos demo coherentes con el usuario activo.

### Más de

- Monitorear SonarCloud durante todo el sprint.
- Revisar PRs con criterio funcional y no solo técnico.
- Capturar evidencia al momento de validar cada flujo.

### Seguir haciendo

- Mantener trazabilidad entre issues, PRs, commits y capturas.
- Usar Docker Compose para reproducibilidad.
- Responder de forma colaborativa ante bloqueos de cierre.

### Menos de

- Acumular evidencia para los últimos días.
- Depender del pipeline como única validación.
- Usar datos demo sin reglas de consistencia.

### Dejar de hacer

- Abrir PRs de cierre sin validación funcional.
- Ignorar hotspots o coverage hasta el final.
- Presentar releases/tags si no son verificables.

## 11. Plan de mejora

| Acción | Responsable | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Resolver PR pendiente | QA Lead / equipo | PR cerrado o justificado | Cierre sin ambigüedad |
| Definir política de versión | Configuration Manager | Tag/release o decisión documentada | Trazabilidad por versión clara |
| Validar funcionalmente antes de PR | QA Lead | Checklist en PR | Menos regresiones |
| Documentar datos demo | Product Owner | Guía de datos | Alertas reproducibles |

## 12. Conclusión

M4 cerró el sistema con evidencia técnica y metodológica suficiente para la rúbrica. Sus pendientes se declaran sin inventar datos: PR `#628` abierto y ausencia de releases/tags verificables.
