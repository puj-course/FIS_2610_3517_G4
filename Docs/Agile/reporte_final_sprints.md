# Reporte de Ingeniería: Metodologías Ágiles y Postmortem Detallado

---

## 1. Cuadro de Control de Milestones (Estado Final)

| Milestone | Descripción Técnica | Progreso | Estado |
|-----------|---------------------|----------|--------|
| **M1** | Setup MERN, GitFlow, JWT Auth y Layout Base. | 100% | ✅ Finalizado |
| **M2** | CRUD Vehículos, Esquemas Mongo y Capa de Servicios. | 100% | ✅ Finalizado |
| **M3** | Motor de Vigilancia, Cron Jobs y Alertas Documentales. | 100% | ✅ Finalizado |
| **M4** | Dashboard Pro, Dockerización, CI/CD y QA Final. | 100% | ✅ Finalizado |

---
## 2. Identificación de Causas Raíz (Análisis RCA)

Siguiendo la metodología de ingeniería de software, se analizaron los incidentes críticos del proyecto para identificar su origen sistémico y establecer medidas que eviten su recurrencia.

### 1. Análisis de Causa Raíz: Exposición de Secretos (Seguridad)
* **Problema:** Se detectaron claves de API y URIs de base de datos en el historial de Git.
* **Análisis de los 5 Porqués:**
    1.  *¿Por qué estaban las claves en el repositorio?* Porque se subió el archivo `.env` al hacer el primer commit.
    2.  *¿Por qué se subió el archivo `.env`?* Porque no estaba incluido en el archivo `.gitignore`.
    3.  *¿Por qué no estaba en el `.gitignore`?* Porque se utilizó un template genérico que no se revisó detalladamente al inicio del Milestone 1.
    4.  *¿Por qué no se revisó detalladamente?* Por la presión de iniciar el desarrollo sin una política de seguridad de configuración definida.
    5.  *¿Por qué no había una política definida?* (Causa Raíz) **Ausencia de un protocolo de "Secure Bootstrapping" en el plan de administración de configuración.**
* **Acción Correctiva:** Implementación de `dotenv-safe`, rotación de llaves y uso de **Husky** para ejecutar un script de escaneo de secretos antes de cada commit.

### 2. Análisis de Causa Raíz: Inconsistencia en Cálculos de Alertas (Lógica)
* **Problema:** El sistema de semaforización mostraba alertas erróneas para el SOAT/RTM en ciertos navegadores.
* **Análisis de los 5 Porqués:**
    1.  *¿Por qué las alertas eran erróneas?* Porque el cálculo de días restantes devolvía valores negativos o NaN.
    2.  *¿Por qué devolvía valores erróneos?* Porque la librería de fechas interpretaba el formato de entrada de manera distinta según el motor del navegador.
    3.  *¿Por qué dependía del navegador?* Porque se utilizó el objeto `Date` nativo de JavaScript sin normalizar el formato ISO.
    4.  *¿Por qué no se normalizó el formato?* Porque no se definieron estándares de manejo de tiempo en la capa de servicios.
    5.  *¿Por qué no se definieron estándares?* (Causa Raíz) **Falta de pruebas de compatibilidad cross-browser y unitarias en la lógica del motor de vigilancia.**
* **Acción Correctiva:** Migración a `date-fns` para estandarizar el manejo de zonas horarias y creación de un suite de pruebas en **Jest** que valide 15 casos de borde (fechas pasadas, bisiestos, fin de mes).

### 3. Análisis de Causa Raíz: Retraso en el Despliegue (Proceso/DevOps)
* **Problema:** La configuración del entorno de producción tomó 3 días adicionales a lo planeado.
* **Análisis de los 5 Porqués:**
    1.  *¿Por qué hubo retraso?* Porque el backend no conectaba con la base de datos en el servidor de despliegue.
    2.  *¿Por qué no conectaba?* Porque las versiones de Node.js y las dependencias de red diferían entre la máquina de desarrollo y el servidor.
    3.  *¿Por qué diferían las versiones?* Porque cada integrante configuró su entorno de manera manual.
    4.  *¿Por qué se configuró manualmente?* Porque no se priorizó la virtualización del entorno desde el Sprint 1.
    5.  *¿Por qué no se priorizó?* (Causa Raíz) **Subestimación de la complejidad de integración y falta de una estrategia de "Infraestructura como Código".**
* **Acción Correctiva:** Adopción total de **Docker y Docker Compose** para garantizar la paridad entre los entornos de desarrollo, QA y producción.

## 3. Métricas de Productividad Sprint a Sprint

| Sprint | Periodo | HU Completadas | Issues Cerradas | Commits | Milestone Relacionado |
|--------|---------|----------------|-----------------|---------|-----------------------|
| Sprint 1 | 16/02 - 22/02 | 5 | 44 | 20 | Milestone 1 |
| Sprint 2 | 23/02 - 01/03 | 2 | 12 | 7 | Milestone 1 |
| Sprint 3 | 02/03 - 08/03 | 12 | 31 | 20 | Milestone 1 |
| Sprint 4 | 09/03 - 15/03 | 18 | 57 | 38 | Milestone 1 |
| Sprint 5 | 16/03 - 22/03 | 6 | 33 | 22 | Milestone 2 |
| Sprint 6 | 23/03 - 29/03 | 6 | 30 | 17 | Milestone 2 |
| Sprint 7 | 30/03 - 05/04 | 4 | 28 | 10 | Milestone 2 |
| Sprint 8 | 06/04 - 12/04 | 5 | 42 | 55 | Milestone 2 |
| Sprint 9 | 13/04 - 19/04 | 7 | 31 | 54 | Milestone 3 |
| Sprint 10 | 20/04 - 26/04 | 5 | 26 | 15 | Milestone 3 |
| Sprint 11 | 27/04 - 03/05 | 5 | 23 | 41 | Milestone 4 |
| Sprint 12 | 04/05 - 11/05 | 6 | 10 | 47 | Milestone 4 |
| Sprint 13 | 12/05 - 17/05 | 7 | 7 | 59 | Milestone 4 |
| **TOTAL** | | **88** | **374** | **405** | - |

---

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
