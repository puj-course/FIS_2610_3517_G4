# Postmortem — Milestone 1 - Base funcional del sistema

## 1. Resumen del ciclo

El Milestone 1 estableció la base técnica y metodológica del proyecto: stack MERN, autenticación inicial, dashboard base, GitFlow y primeras prácticas Scrum. El ciclo fue exitoso en entregar una base funcional, pero reveló falta de Definition of Done, validación local incompleta y estimaciones optimistas.

## 2. Evaluación del producto

- Qué se produjo: base funcional, autenticación, dashboard inicial, componentes base y estructura de ramas.
- Qué se validó: capacidad del equipo para integrar cambios mediante PRs y cerrar issues funcionales.
- Qué quedó incompleto: evidencias específicas por HU y criterios uniformes de aceptación.
- Calidad del resultado: funcional para el arranque, con deuda metodológica en validación y cierre.

## 3. Evaluación del esfuerzo

- Participación: los cinco integrantes aparecen con issues asignadas.
- Distribución: `juanvargax`, `Sarm-m` y `Juserora` concentraron buena parte de la carga inicial.
- Commits: 107 commits por ventana de sprint S1-S4.
- Issues: 76 issues cerradas y 24 HU cerradas estrictas.
- PRs: 9 PRs asociados; 8 mergeados y 1 cerrado sin merge.

## 4. Evaluación del proceso

- Planeación: inició con alcance ambicioso frente a la capacidad real.
- Seguimiento: GitHub Issues permitió trazabilidad, aunque no todos los commits quedaron enlazados.
- Comunicación: Discord ayudó a desbloquear dudas, pero faltó ritmo estable de Daily.
- Uso de GitHub: GitFlow evitó conflictos mayores.
- Uso de Scrum: el equipo aplicó ceremonias de forma parcial y aprendió la necesidad de DoD.

Evaluación por roles con hechos objetivos:

| Rol | Hecho observado | Mejora |
|---|---|---|
| Scrum Master | Coordinó el arranque y sostuvo GitFlow como práctica base. | Formalizar Daily y escalamiento de impedimentos. |
| Product Owner / Sprint Planner | Priorizó autenticación y dashboard base. | Planear capacidad real con carga académica. |
| Configuration Manager | Acompañó ramas y merges iniciales. | Exigir checklist pre-merge. |
| QA Lead | Detectó ausencia de DoD como riesgo de calidad. | Definir criterios verificables antes de cerrar HU. |
| DevOps Engineer | Preparó entorno inicial sin CI/CD activo. | Introducir build check temprano. |

## 5. Qué salió bien

- Se consolidó la base técnica del producto.
- Se adoptó GitFlow desde el inicio.
- Se cerraron issues funcionales del milestone.
- Se activó una dinámica de trabajo autónoma.

## 6. Qué salió mal

- Se integró código sin validación local suficiente.
- Se cerraron algunas tareas sin criterios de aceptación homogéneos.
- Se subestimó la carga académica del equipo.
- Se recolectó evidencia tarde.

## 7. Causas raíz

| Problema | Causa raíz | Impacto |
|---|---|---|
| Integraciones con fallos | Ausencia de DoD verificable | Retrabajo y bloqueo de rutas |
| Cierres ambiguos | Criterios de aceptación no compartidos | Diferentes interpretaciones de terminado |
| Estimaciones optimistas | Capacidad académica no considerada | Arrastre de tareas |

## 8. Acciones correctivas

- Definir DoD del equipo antes del siguiente sprint.
- Exigir validación local antes de PR.
- Documentar criterios de aceptación por HU.
- Registrar evidencia mínima al cerrar cada issue.

## 9. Acciones preventivas

- Mantener checklist de pre-merge.
- Revisar capacidad real en Sprint Planning.
- Vincular commits y PRs con issues.
- Programar revisión semanal de riesgos.

## 10. Retrospectiva estrella de mar

### Comenzar a hacer

- Definir un Definition of Done verificable antes de iniciar cada sprint.
- Validar la compilación local antes de abrir un Pull Request.
- Registrar evidencia mínima al cerrar cada historia de usuario.

### Más de

- Revisar criterios de aceptación con el Product Owner antes de implementar.
- Generar trazabilidad issue-commit-PR en cambios funcionales.
- Sincronizar impedimentos técnicos antes de que bloqueen a otros integrantes.

### Seguir haciendo

- Mantener GitFlow como base de control de versiones.
- Usar GitHub Issues para dividir el trabajo.
- Comunicar bloqueos por Discord cuando no se requiera reunión formal.

### Menos de

- Aplazar tareas sin analizar impacto.
- Depender de reuniones sincrónicas para desbloqueos simples.
- Estimar historias sin considerar carga académica.

### Dejar de hacer

- Integrar código sin validación local.
- Cerrar HU sin criterios de aceptación explícitos.
- Postergar la creación de issues hasta después de desarrollar.

## 11. Plan de mejora

| Acción | Responsable | Evidencia esperada | Criterio de éxito |
|---|---|---|---|
| Definir DoD común | QA Lead | Checklist versionada | Toda HU cerrada referencia DoD |
| Validar build local antes de PR | Configuration Manager | Comentario o captura en PR | Menos fallos triviales en integración |
| Planear capacidad real | Product Owner | Tabla de disponibilidad | Menos arrastre al siguiente sprint |
| Reforzar trazabilidad | Scrum Master | Issues enlazadas con PRs | Cada cambio relevante tiene issue |

## 12. Conclusión

M1 fue finalizado y entregó la base funcional del sistema. Su principal aprendizaje fue que la calidad del proceso debía formalizarse desde el inicio para que la velocidad técnica no produjera deuda metodológica.
