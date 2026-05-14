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

| Sprint | Periodo | HU Cerradas | Issues | Commits | Hito / Detalle Técnico |
|--------|---------|-------------|--------|---------|------------------------|
| **S1** | 16/02 - 22/02 | 5 | 44 | 20 | Estructura de carpetas y ESLint. |
| **S2** | 23/02 - 01/03 | 2 | 12 | 7 | Modelos de Usuario y Roles. |
| **S3** | 02/03 - 08/03 | 12 | 31 | 20 | Middleware de protección de rutas. |
| **S4** | 09/03 - 15/03 | 18 | 57 | 38 | **Cierre M1:** Login funcional. |
| **S5** | 16/03 - 22/03 | 6 | 33 | 22 | Integración Cloudinary (Imágenes). |
| **S6** | 23/03 - 29/03 | 6 | 30 | 17 | Controladores de Flota y Lógica. |
| **S7** | 30/03 - 05/04 | 4 | 28 | 10 | Optimización de índices en Mongo. |
| **S8** | 06/04 - 12/04 | 5 | 42 | 55 | **Cierre M2:** CRUD validado. |
| **S9** | 13/04 - 19/04 | 7 | 31 | 54 | Lógica de Semaforización (Alertas). |
| **S10** | 20/04 - 26/04 | 5 | 26 | 15 | **Cierre M3:** Reportes PDF/Excel. |
| **S11** | 27/04 - 03/05 | 5 | 23 | 41 | Dockerfile y Docker Compose. |
| **S12** | 04/05 - 11/05 | 6 | 10 | 47 | GitHub Actions (CI) configurado. |
| **S13** | 12/05 - 17/05 | 7 | 8 | 59 | **Cierre M4:** SonarCloud & Release. |
| **TOTAL**| | **88** | **375** | **405** | **Promedio: 6.7 HU / Sprint** |

---

## 4. Dinámica Estrella de Mar por Milestones (Postmortem)

### Milestone 1: Infraestructura y Autenticación
| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Utilizar GitFlow estricto.<br>2. Realizar Dailies de 10 min.<br>3. Documentar el SRS. | Evitó conflictos en `main`.<br>Sincronizó al equipo frontend.<br>Claridad en los requisitos iniciales. |
| **Empezar a hacer** | 1. Estandarizar con Tailwind.<br>2. Configurar `.env.example`.<br>3. Implementar Husky para hooks. | Mejorar la consistencia visual.<br>Evitar falta de variables en despliegue.<br>Validar linting antes del commit. |
| **Dejar de hacer** | 1. Realizar commits sin mensaje.<br>2. Ignorar el linter de código.<br>3. Trabajar sobre la rama `main`. | Dificultó el rastreo de cambios.<br>Generó errores de sintaxis básicos.<br>Riesgo de romper la versión estable. |
| **Más de** | 1. Investigación de librerías.<br>2. Sesiones de Pair Programming.<br>3. Revisión de la arquitectura. | Aceleró la elección de JWT.<br>Resolvió bloqueos en la conexión DB.<br>Aseguró escalabilidad del backend. |
| **Menos de** | 1. Uso de librerías obsoletas.<br>2. Reuniones largas sin agenda.<br>3. Documentación en papel. | Evitamos problemas de compatibilidad.<br>Optimizamos el tiempo de desarrollo.<br>Migramos todo a Markdown en el repo. |

### Milestone 2: Lógica de Negocio y Flota
| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Validar esquemas con Mongoose.<br>2. Usar Pull Requests (PRs).<br>3. Mantener el backlog al día. | Aseguró integridad de datos de placas.<br>Permitió revisión por pares del código.<br>Facilitó la asignación de HU. |
| **Empezar a hacer** | 1. Crear documentación JSDoc.<br>2. Implementar Logs de errores.<br>3. Usar Postman para pruebas. | Facilitó la rotación de tareas.<br>Ayudó a debuguear fallos en producción.<br>Agilizó el testeo de la API de vehículos. |
| **Dejar de hacer** | 1. Subir secretos al repositorio.<br>2. Crear rutas sin protección.<br>3. Duplicar lógica de validación. | Se expuso la URI de Mongo (corregido).<br>Cualquier usuario podía borrar vehículos.<br>Se centralizó en un middleware. |
| **Más de** | 1. Modularización de servicios.<br>2. Refactorización de controladores.<br>3. Consultas en la documentación. | Reutilización de código en reportes.<br>Código más limpio y legible.<br>Mejor uso de operadores de MongoDB. |
| **Menos de** | 1. Hardcoding de variables.<br>2. Pruebas manuales repetitivas.<br>3. Consultas pesadas a la DB. | Se movió todo a variables globales.<br>Se empezó a planear Jest.<br>Se implementó paginación. |

### Milestone 3: Gestión Documental y Alertas
| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Aplicar el Patrón Facade.<br>2. Diseñar UI intuitiva.<br>3. Monitorear el progreso diario. | Centralizó la lógica de vencimientos.<br>Semaforización visual clara (SOAT/RTM).<br>Garantizó entregas en la fecha límite. |
| **Empezar a hacer** | 1. Integrar SonarCloud.<br>2. Realizar Unit Testing.<br>3. Automatizar backups de DB. | Identificar deuda técnica acumulada.<br>Validar cálculos de fechas de alerta.<br>Prevenir pérdida de datos en pruebas. |
| **Dejar de hacer** | 1. Aprobar PRs propios.<br>2. Ignorar los warnings de React.<br>3. Postponer la deuda técnica. | El QA debe ser independiente.<br>Causa de fugas de memoria detectadas.<br>Se priorizó la refactorización inmediata. |
| **Más de** | 1. Comunicación vía Slack/Discord.<br>2. Revisión de logs en consola.<br>3. Uso de librerías de fechas. | Resolución de dudas en tiempo real.<br>Eliminación de rastro de debugging.<br>Migración a `date-fns` para precisión. |
| **Menos de** | 1. Cambios directos en `develop`.<br>2. Desorden en carpetas de assets.<br>3. Suposiciones sobre el usuario. | Evitó inestabilidad en la rama base.<br>Se organizaron iconos y estilos.<br>Se consultó el flujo real con el PO. |

### Milestone 4: Calidad, Docker y Cierre
| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Contenerizar con Docker.<br>2. Sincronizar el README.<br>3. Ejecutar el Quality Gate. | Aseguró despliegue en cualquier PC.<br>Documentación alineada al código real.<br>SonarCloud validó el 0% de bugs. |
| **Empezar a hacer** | 1. Mockear servicios externos.<br>2. Auditar la seguridad final.<br>3. Practicar el Storytelling. | No gastar créditos de Twilio/SMS.<br>Cerrar puertos innecesarios en Compose.<br>Asegurar fluidez en la sustentación. |
| **Dejar de hacer** | 1. Incluir nuevas features.<br>2. Realizar cambios de última hora.<br>3. Trabajar de forma aislada. | Riesgo de comprometer la estabilidad.<br>Peligro de romper el Dockerfile final.<br>Garantizar que todos conocen el sistema. |
| **Más de** | 1. Pulir detalles visuales.<br>2. Optimizar el tiempo de build.<br>3. Revisar la trazabilidad de HU. | Acabado profesional del Dashboard.<br>Uso de imágenes `alpine` en Docker.<br>Asegurar que cada issue tiene evidencia. |
| **Menos de** | 1. Logs innecesarios en prod.<br>2. Dependencias sin utilizar.<br>3. Código muerto o comentado. | Mejora el rendimiento de la aplicación.<br>Reducción del tamaño de la imagen final.<br>Limpieza total para entrega de código. |


