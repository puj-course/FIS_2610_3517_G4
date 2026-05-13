# Reporte Final de Sprints - Trazabilidad y Métricas

## 📊 Cuadro de Control de Milestones

| Milestone | Descripción | Progreso | Issues (Abiertos/Cerrados) | Estado | Fecha Límite |
|-----------|-------------|----------|----------------------------|--------|--------------|
| **1. Base funcional del sistema** | Implementación del entorno, repositorio, despliegue inicial, Login/Registro y diseño base (Navbar/Sidebar). | 100% | 0 / 144 | ✅ Finalizado | 15/03/2026 |
| **2. Gestión básica de flota** | CRUD completo de vehículos (placas, modelo, marca), filtros de búsqueda e integración de base de datos. | 100% | 0 / 133 | ✅ Finalizado | 12/04/2026 |
| **3. Gestión documental y monitoreo** | Motor de vigilancia de vencimientos (SOAT, RTM, Licencias), semaforización y exportación de reportes PDF/Excel. | 100% | 0 / 57 | ✅ Finalizado | 26/04/2026 |
| **4. Dashboard, alertas y cierre del sistema** | Dashboard resumen de flota, validación de integridad de datos y pruebas finales en el sistema. | 99% | 1 / 40 | 🔄 En Curso | 19/05/2026 |

---

## 📈 Métricas de Historias de Usuario

### Resumen de Planificación vs Ejecución

| Sprint | Periodo | Objetivo Principal | HU Completadas | Issues Cerradas | Commits | Milestone Relacionado |
|--------|---------|--------------------|----------------|-----------------|---------|-----------------------|
| Sprint 1 | 16/02 - 22/02 | - | 5 | 44 | 20 | Milestone 1 |
| Sprint 2 | 23/02 - 01/03 | - | 2 | 12 | 7 | Milestone 1 |
| Sprint 3 | 02/03 - 08/03 | Módulo de Login y Registro (Frontend y Backend base) | 12 | 31 | 20 | Milestone 1 |
| Sprint 4 | 09/03 - 15/03 | - | 18 | 57 | ~38 | Milestone 1 |
| Sprint 5 | 16/03 - 22/03 | - | 6 | 33 | 22 | Milestone 2 |
| Sprint 6 | 23/03 - 29/03 | Visualización y baja de vehículos | 6 | 30 | 17 | Milestone 2 |
| Sprint 7 | 30/03 - 05/04 | - | 4 | 28 | 10 | Milestone 2 |
| Sprint 8 | 06/04 - 12/04 | - | 5 | 42 | 55 | Milestone 2 |
| Sprint 9 | 13/04 - 19/04 | - | 7 | 31 | 54 | Milestone 3 |
| Sprint 10 | 20/04 - 26/04 | - | 5 | 26 | 15 | Milestone 3 |
| Sprint 11 | 27/04 - 03/05 | - | 5 | 23 | 41 | Milestone 4 |
| Sprint 12 | 04/05 - 11/05 | - | 6 | 10 | 47 | Milestone 4 |
| Sprint 13 | 12/05 - 17/05 | Métricas de calidad, navegación, modo oscuro | 7 de 8 planeadas | 7 | 59 | Milestone 4 |
| **TOTAL** | | | **88** | **374** | **405** | - |

---

## 👥 Participación y Contribuciones (Datos Reales del Repositorio)

Para cumplir con el criterio de distribución equilibrada, se presenta el análisis de actividad extraído directamente de los **Insights de GitHub (Período: Enero 2026 - Mayo 2026)**:

### Resumen de Participación

| Integrante | Commits | % Participación | Líneas Agregadas (++) | Rol Estratégico |
|------------|---------|-----------------|-----------------------|-----------------|
| **Sarm-m** | 150 | 34.0% | 47,144 | Scrum Master |
| **samuelfl680** | 99 | 22.4% | 7,672 | Configuration Manager |
| **solonlosada2006** | 87 | 19.7% | 10,567 | DevOps Engineer |
| **juanvargax** | 52 | 11.8% | 14,526 | Product Owner y Sprint Planner |
| **jSebastianRR / Juserora** | 29 | 6.6% | 2,085 | Quality Assurance Lead (QA Lead) |
| **Otros / Bots (Copilot, etc.)** | 24 | 5.5% | 1,985 | Automatización y Soporte |
| **TOTAL** | **441** | **100%** | **84,137** | - |


## 🎯 Análisis de Productividad

*   **Promedio de commits por desarrollador principal**: ~97 commits.
*   **Volumen total de código gestionado**: +84,000 líneas de código implementadas.
*   **Tasa de merging**: 85% de integración exitosa.
*   **Consistencia**: Actividad sostenida sin brechas prolongadas desde el 25 de enero hasta el 10 de mayo de 2026.

---

## 🌟 Retrospectiva Evolutiva (Dinámica Estrella de Mar)

Siguiendo la instrucción de realizar el ejercicio por cada Milestone, a continuación se detallan las retrospectivas que permitieron la mejora continua del equipo.

### Milestone 1: Base funcional del sistema

| Eje | Acción | Ejemplo / Justificación |
|-----|--------------------------|-------------------------|
| **Seguir haciendo** | 1. Mantener flujo GitFlow estricto.<br>2. Realizar Dailies cortos.<br>3. Usar carpetas modulares en React. | Evitó conflictos mayores en la base.<br>Sincronización rápida de tareas.<br>Facilitó encontrar componentes de UI. |
| **Empezar a hacer** | 1. Definir estándar Tailwind.<br>2. Crear un `.env.example`.<br>3. Usar Conventional Commits. | Corregir desorden visual inicial.<br>Saber qué variables de entorno faltan.<br>Mejorar la lectura del historial. |
| **Más de** | 1. Comunicación por Discord.<br>2. Pair Programming en Backend.<br>3. Revisión de requisitos. | Samuel y Ramirez unificaron la DB.<br>Resolución rápida de bugs de Auth.<br>Evitar HU mal redactadas. |
| **Menos de** | 1. Mensajes de commit tipo "fix".<br>2. Reuniones de más de 1 hora.<br>3. Cambios directos en `main`. | Dificultó rastrear cambios en Auth.<br>Pérdida de foco y productividad.<br>Riesgo de romper la versión estable. |
| **Dejar de hacer** | 1. Commits sin prueba local.<br>2. Ignorar el linter de VSCode.<br>3. Tareas sin Issue asociada. | Rompimos el build una vez.<br>Código con inconsistencias de estilo.<br>Falta de trazabilidad en el tablero. |

### Milestone 2: Gestión básica de flota

| Eje | Acción | Ejemplo / Justificación |
|-----|--------------------------|-------------------------|
| **Seguir haciendo** | 1. Validar datos en el Backend.<br>2. Usar Express Validator.<br>3. Mantener Pull Requests. | Aseguró integridad en placas.<br>Evitó inyección de datos basura.<br>Ningún código entró sin revisión. |
| **Empezar a hacer** | 1. Documentar con JSDoc.<br>2. Implementar logs de error.<br>3. Usar Postman Collections. | Solon pudo entender el código ajeno.<br>Saber por qué fallaba Mongo en nube.<br>Pruebas consistentes entre miembros. |
| **Más de** | 1. Pruebas de integración.<br>2. Feedback temprano del PO.<br>3. Uso de librerías de fechas. | Filtros de búsqueda ahora funcionan.<br>Sebastian Vargas ajustó la navegación.<br>Cálculo de vencimientos más exacto. |
| **Menos de** | 1. Dependencia de un solo revisor.<br>2. Tareas multiactividad.<br>3. Pruebas manuales repetitivas. | Cuello de botella para aprobar PRs.<br>Miembros saturados con 3 temas.<br>Se perdió tiempo en el login manual. |
| **Dejar de hacer** | 1. Subir secretos al repo.<br>2. Usar `any` en validaciones.<br>3. Documentar al final del sprint. | Causa Raíz: Expusimos la URI de DB.<br>Bugs por tipos de datos erróneos.<br>README desactualizado (Vanilla JS). |

### Milestone 3: Gestión documental y monitoreo

| Eje | Acción | Ejemplo / Justificación |
|-----|--------------------------|-------------------------|
| **Seguir haciendo** | 1. Usar patrón Facade.<br>2. Semaforización visual.<br>3. Exportación de reportes. | Simplificó alertas de SOAT/RTM.<br>Mejora inmediata en UX de flota.<br>Valor agregado para el usuario final. |
| **Empezar a hacer** | 1. Pruebas unitarias Jest.<br>2. Configurar SonarCloud.<br>3. Automatizar Coverage. | Asegurar lógica de vencimientos.<br>Identificar deuda técnica real.<br>Ver el progreso en cada PR. |
| **Más de** | 1. Revisión de code smells.<br>2. Optimización de imágenes.<br>3. Pruebas de carga simples. | Redujimos complejidad en el Dashboard.<br>Carga de la UI más fluida.<br>Estabilidad con muchos vehículos. |
| **Menos de** | 1. Hardcoding de rutas.<br>2. Uso de librerías pesadas.<br>3. Reuniones sin agenda. | Problemas al mover a producción.<br>Lentitud en el renderizado inicial.<br>Discusiones técnicas circulares. |
| **Dejar de hacer** | 1. Merges sin Ok de QA.<br>2. Ignorar warnings de consola.<br>3. Trabajar en ramas antiguas. | Evitamos bugs visuales en el M3.<br>Causa de fugas de memoria en React.<br>Conflictos de código innecesarios. |

### Milestone 4: Dashboard, alertas y cierre (En curso)

| Eje | Acción | Ejemplo / Justificación |
|-----|--------------------------|-------------------------|
| **Seguir haciendo** | 1. Contenerización Docker.<br>2. Reportes de SonarCloud.<br>3. Sincronización de README. | Despliegue reproducible en cualquier PC.<br>Evidencia visual para la rúbrica.<br>Documentación alineada al código. |
| **Empezar a hacer** | 1. Pruebas de integración SMS.<br>2. Mocking de servicios externos.<br>3. Auditoría final de seguridad. | Validar que Twilio/SMS funcione.<br>No gastar créditos de SMS en pruebas.<br>Cerrar puertos innecesarios en Docker. |
| **Más de** | 1. Refactorización de UI.<br>2. Limpieza de logs de consola.<br>3. Preparación de Storytelling. | El Dashboard ahora es profesional.<br>Producción sin rastro de debugging.<br>Asegurar que la sustentación sea fluida. |
| **Menos de** | 1. Inclusión de features nuevas.<br>2. Cambios de última hora.<br>3. Trabajo individual aislado. | Riesgo de no terminar la estabilidad.<br>Peligro de romper el Dockerfile.<br>Asegurar que todos saben sustentar. |
| **Dejar de hacer** | 1. Postergación de la trazabilidad.<br>2. Dejar HU abiertas.<br>3. Desatender el DoD. | Evitar pérdida de puntos en la rúbrica.<br>Tener el tablero de GitHub al 100%.<br>No entregar nada sin sus tests. |

---
