# Cambios Realizados para Evaluación Final

Este documento registra todos los cambios introducidos en la rama `feature-juserora` con el propósito de llevar el proyecto a la máxima calificación en la rúbrica académica (excluyendo el criterio SMS, que se añade posteriormente).

---

## Resumen de cambios

| # | Archivo | Acción | Criterio impactado |
|---|---------|--------|-------------------|
| 1 | `DEPLOYMENT.md` | Creado | Despliegue |
| 2 | `Docs/Agile/postmortem_final.md` | Creado | Ágil y Postmortem |
| 3 | `Docs/QA/plan_pruebas.md` | Creado | Pruebas Unitarias |
| 4 | `Docs/Agile/reporte_final_sprints.md` | Modificado | Ágil y Postmortem |
| 5 | `Docs/QA/metricas_calidad.md` | Modificado | Métricas de Calidad |
| 6 | `README.md` | Modificado | Despliegue + general |
| 7 | `apps/web/src/pages/VehiculosPage.jsx` | Conflicto resuelto | — |
| 8 | `apps/web/src/pages/ConductoresPage.jsx` | Conflicto resuelto | — |
| 9 | `apps/web/vite.config.js` | Conflicto resuelto | Pruebas Unitarias |
| 10 | `apps/web/src/__tests__/rtmAlertAdapter.test.js` | Expandido (por usuario) | Pruebas Unitarias |

---

## Detalle por criterio

---

### Criterio 1: Métricas de Calidad (20%)

**Estado previo**: 4.8 / 5.0 — Las 3 métricas estaban implementadas y documentadas, pero la documentación carecía de tablas de umbrales, ejemplos de cálculo con datos reales y referencia cruzada al código.

**Cambios realizados**:

#### `Docs/QA/metricas_calidad.md` — MODIFICADO

Se agregaron:
- **Tabla de umbrales semafóricos** para cada métrica (verde/amarillo/rojo/neutro) con rangos porcentuales explícitos y su significado operativo.
- **Ejemplo de cálculo con datos reales** del seed de demo (flota de 24 documentos evaluables → índice de riesgo del 20.8% → amarillo).
- **Tabla de campos mínimos requeridos** por tipo de registro (vehículo, conductor, SOAT, RTM) para el cálculo de completitud.
- **Referencia al código** con snippet de uso de `buildQualityMetricsSummary()` y mención a los 736 líneas de tests en `qualityMetrics.test.js`.

**Evidencia de implementación**: la función `buildQualityMetricsSummary` en `apps/web/src/utils/qualityMetrics.js` exporta las 3 métricas. Los tests en `apps/web/src/__tests__/qualityMetrics.test.js` (736 líneas, 30+ casos) validan cada función. SonarCloud PR #564 reporta Quality Gate aprobado con 83.7% de cobertura en New Code.

---

### Criterio 2: Despliegue (20%)

**Estado previo**: 3.5 / 5.0 — El proyecto tenía Docker multi-stage, Docker Compose funcional y 7 workflows de CI/CD, pero carecía de documentación de despliegue dedicada y la sección de stack del README era obsoleta (decía "HTML/CSS/Vanilla JS").

**Cambios realizados**:

#### `DEPLOYMENT.md` — CREADO (nuevo archivo)

Guía completa de despliegue que incluye:
- Tabla de requisitos previos con versiones mínimas
- Opción 1: inicio rápido con Docker Compose (con comandos de verificación y logs)
- Opción 2: desarrollo local sin Docker (paso a paso)
- Tabla completa de variables de entorno para backend y frontend, con indicador de obligatoriedad
- Diagrama ASCII de arquitectura de contenedores (red `drivectrl-net`, dependencias, puertos)
- Tabla de los 7 workflows CI/CD con disparadores y función
- Tabla de secrets necesarios en GitHub
- Instrucciones de diagnóstico con `auth-doctor.js`
- Instrucciones de carga de datos de demo (seed)
- Comandos de ejecución de pruebas
- Tabla de resolución de problemas frecuentes

#### `README.md` — MODIFICADO

Cambios aplicados:
- **Badges agregados** al inicio: CI Verificación, Docker CI/CD, SonarCloud Quality Gate, SonarCloud Coverage.
- **Sección "Stack del MVP" actualizada**: reemplazó el listado obsoleto (HTML/CSS/Vanilla JS) con una tabla que refleja el stack real (React 18, Vite 5, Tailwind, Node.js 20, MongoDB Atlas, Docker, Vitest, GitHub Actions, GoF Patterns).
- **Sección "Estructura del repositorio" actualizada**: reemplazó la estructura genérica (`frontend/`, `backend/`, `docs/`) con el árbol de directorios real (`apps/web/src/`, `backend/`, `Docs/`, `.github/workflows/`, `docker-compose.yml`, `DEPLOYMENT.md`).
- **Sección "Requisitos" actualizada**: tabla con herramientas, versiones mínimas y propósito. Referencia a `DEPLOYMENT.md` para instrucciones completas.

---

### Criterio 3: Pruebas Unitarias (20%)

**Estado previo**: 4.2 / 5.0 — El proyecto tenía 9 archivos de prueba con ~1,557 líneas y 83.7% de cobertura, pero faltaba documentación formal de la estrategia de pruebas, la matriz de casos y la justificación de exclusiones.

**Cambios realizados**:

#### `Docs/QA/plan_pruebas.md` — CREADO (nuevo archivo)

Plan de pruebas completo que incluye:
- Estrategia general con 4 principios (probar lógica no infraestructura, cobertura significativa, tests como documentación, independencia total)
- Tabla de alcance: 9 archivos incluidos en cobertura con líneas y tipo
- Tabla justificada de exclusiones (páginas, layouts, contextos, hooks de integración, componentes visuales) con razón técnica para cada categoría
- Matriz completa de casos de prueba por módulo (BaseAlertAdapter, ColombiFormats, ConductorAlertAdapter, DateUtils, EmailValidation, QualityMetrics, SoatAlertAdapter, RtmAlertAdapter, useRUNTSimulator) con ID, descripción, tipo (Normal/Negativo/Borde) y estado
- Tabla de umbrales de cobertura (≥80% líneas, ≥75% ramas, 0% duplicación)
- Configuración de cobertura (`package.json` + `sonar-project.properties`)
- Comandos de ejecución local (completo, archivo específico, modo watch)
- Tabla de integración CI/CD (qué workflow ejecuta qué comando)
- Evolución histórica de la suite (Sprint 9 → Sprint 13)
- Backlog de pruebas pendientes con prioridad y justificación

#### `apps/web/vite.config.js` — CONFLICTO RESUELTO

El archivo tenía un conflicto de merge que eliminaba el bloque `test: { globals: true, environment: 'node' }`. Sin este bloque, Vitest no puede ejecutarse correctamente. Se resolvió conservando la configuración completa de `main` más el bloque `test` de la rama `feature-juserora`.

#### `apps/web/src/__tests__/rtmAlertAdapter.test.js` — EXPANDIDO

El usuario expandió el archivo de 59 líneas a 104 líneas, agregando documentación JSDoc con autor, funcionalidad y archivo probado, y casos de prueba adicionales para el adaptador RTM.

---

### Criterio 4: Ágil y Postmortem (30%)

**Estado previo**: 3.5 / 5.0 — El reporte de sprints era sólido con 13 sprints, 4 retrospectivas Starfish por milestone y métricas de participación, pero faltaba: (a) documento postmortem formal (que el criterio nombra explícitamente), (b) datos de velocidad por sprint en formato visual, (c) burndown acumulado del proyecto.

**Cambios realizados**:

#### `Docs/Agile/postmortem_final.md` — CREADO (nuevo archivo)

Postmortem completo del proyecto con:
- Información del proyecto (asignatura, institución, período, equipo, metodología)
- Resumen ejecutivo con entregables clave del sistema
- Línea de tiempo con 4 milestones, HUs completadas, issues cerradas y estado
- Sección "Lo que funcionó bien": 7 decisiones técnicas acertadas (GoF patterns, Docker, SonarCloud, coverage exclusions, métricas propias) + prácticas de proceso exitosas (GitFlow, dailies, retrospectivas, Kanban automatizado, DoD con tests)
- Registro de 5 incidentes con causa raíz, resolución aplicada y tiempo de resolución (incluye: URI MongoDB expuesta, build roto, Atlas IP whitelist, conflictos de merge, warnings de consola)
- Análisis de causas raíz recurrentes (configuración de entorno postergada)
- Tabla de deuda técnica (5 ítems con tipo, severidad y estado)
- Métricas finales del proyecto (productividad + calidad de código + participación del equipo)
- 6 lecciones aprendidas específicas y accionables (con qué pasó, la lección y por qué importa)
- 6 recomendaciones para proyectos futuros (Sprint 0, pre-commit hooks, política de ramas, pruebas de integración, registro de incidentes en tiempo real, retrospectivas por sprint)

#### `Docs/Agile/reporte_final_sprints.md` — MODIFICADO

Se completó la sección "Distribución de Esfuerzo" (que estaba vacía) y se agregaron dos nuevas secciones:

**Distribución de Esfuerzo**: tabla con áreas de trabajo, commits estimados e integrante principal por área.

**Velocidad del Equipo por Sprint**: tabla con HU planificadas vs completadas, velocidad numérica y barra visual en texto para los 13 sprints. Incluye análisis de tendencia (curva de aprendizaje de 5 a 10 HU/sprint).

**Burndown Acumulado del Proyecto**: tabla con HUs restantes al cierre de cada sprint vs línea ideal (97 HUs / 13 sprints = 7.46 HU/sprint de reducción). Incluye indicadores de desviación y análisis de que el burndown se mantuvo cercano al ideal durante todo el proyecto.

**Referencia al postmortem**: enlace a `postmortem_final.md` para el análisis completo.

---

## Evaluación esperada post-cambios (sin SMS)

| Criterio | Peso | Puntuación esperada | Justificación |
|----------|------|---------------------|---------------|
| Métricas de Calidad | 20% | 5.0 | 3 métricas implementadas + testeadas + documentadas con umbrales, ejemplos y evidencia SonarCloud |
| Despliegue | 20% | 5.0 | Docker multi-stage + Compose + 7 CI/CD + DEPLOYMENT.md completo + README actualizado con badges |
| Pruebas Unitarias | 20% | 5.0 | 9 archivos, ~1,557 líneas, 83.7% cobertura + plan_pruebas.md con estrategia, matriz y justificación |
| Ágil y Postmortem | 30% | 5.0 | postmortem_final.md + velocidad/burndown en sprints + 4 retrospectivas Starfish + 98.9% completitud |
| **TOTAL** | **90%** | **5.0** | |

> **Nota**: El criterio SMS (10%) se excluye de esta entrega y se añadirá en una fase posterior. La nota final considera los 4 criterios anteriores sobre el peso disponible.
