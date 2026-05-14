# Reporte de Ingeniería: Metodologías Ágiles y Postmortem Detallado

---

## 1. Cuadro de Control de Milestones (Estado Final)

| Milestone | Descripción Técnica | Progreso | Estado |
|-----------|---------------------|----------|--------|
| **M1** | Base funcional del sistema. | 100% | ✅ Finalizado |
| **M2** | Gestión básica de flotas. | 100% | ✅ Finalizado |
| **M3** |  Gestión documental y monitoreo. | 100% | ✅ Finalizado |
| **M4** | Dashboard, alertas y cierre del sistema. | 100% | ✅ Finalizado |

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

## 4. Dinámica Estrella de Mar por Milestones (Postmortem)

### Milestone 1: Base funcional del sistema

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Consolidar el núcleo técnico.<br>2. Dividir historias de usuario.<br>3. Fomentar la autonomía individual.<br>4. Utilizar Discord para comunicación rápida.<br>5. Mantener el flujo de GitFlow. | El éxito del Login y Dashboard dio valor inmediato.<br>El uso de sub-issues facilitó la trazabilidad.<br>Se cumplieron tareas sin necesidad de micro-gestión.<br>Permitió resolver dudas técnicas en tiempo real.<br>Evitó conflictos mayores en la rama principal. |
| **Empezar a hacer** | 1. Implementar checklists de pre-commit.<br>2. Adoptar política "1 issue = 1 cambio".<br>3. Planificar según capacidad real.<br>4. Documentar rutas de la API inicialmente.<br>5. Validar compilación local obligatoria. | Evitar errores al integrar código de diferentes miembros.<br>Mejorar la granularidad de los commits en GitHub.<br>Considerar la carga de parciales en la estimación.<br>Facilitar la integración entre frontend y backend.<br>Prevenir que el código roto llegue al repositorio. |
| **Dejar de hacer** | 1. Desarrollar sin validar compilación.<br>2. Ignorar metodología por estrés.<br>3. Subir código con estados incompletos.<br>4. Postergar la creación de issues.<br>5. Realizar merges sin revisión previa. | Se integró código que rompió rutas al inicio.<br>El desorden metodológico acumuló trabajo al final.<br>Generó inconsistencias visuales en el frontend.<br>Dificultó el seguimiento del progreso real del sprint.<br>Introdujo bugs que pudieron evitarse con un par de ojos extra. |
| **Más de** | 1. Rigor en procesos Scrum.<br>2. Trazabilidad intuitiva de sprints.<br>3. Aterrizar la planificación inicial.<br>4. Sesiones de Daily sincronizadas.<br>5. Revisión de criterios de aceptación. | Evitar que las tareas se aplacen a ciclos futuros.<br>No perder tiempo buscando entregables en el repo.<br>Asegurar que las metas sean realistas para todos.<br>Alineación total del equipo sobre bloqueos técnicos.<br>Garantizar que la funcionalidad cumpla lo solicitado. |
| **Menos de** | 1. Aplazamiento de tareas pendientes.<br>2. Dependencia de reuniones sincrónicas.<br>3. Búsqueda dispersa de información.<br>4. Estimaciones excesivamente optimistas.<br>5. Uso de ramas personales sin push frecuente. | Se debieron pasar tareas del Sprint 3 al Sprint 4.<br>La autonomía y el trabajo asíncrono fueron más efectivos.<br>La desorganización inicial dificultó encontrar avances.<br>Causó frustración al no cumplir con el scope previsto.<br>Fragmentó el avance del código y generó silos. |

### Milestone 2: Gestión básica de flota

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Aplicar patrones GoF (Factory/Facade).<br>2. Mantener la división en sub-issues técnicas.<br>3. Utilizar simuladores para pruebas de borde.<br>4. Documentar UML en tiempo real.<br>5. Separar construcción de refactorización. | Limpió el "código espagueti" y mejoró la mantenibilidad.<br>Permitió un avance progresivo de AlertasPage.<br>El simulador detectó bugs críticos de fechas.<br>Evitó el desfase entre el código y el sustento académico.<br>Aseguró estabilidad antes de mejorar la arquitectura. |
| **Empezar a hacer** | 1. Estandarizar convenciones de nombres.<br>2. Definir alcance de rutas y menús.<br>3. Involucrar al QA desde el inicio.<br>4. Configurar linters de forma estricta.<br>5. Definir la interoperabilidad de entornos. | Evitar confusiones entre hooks (useAlert vs useAlerts).<br>Asegurar acceso a vistas nuevas desde el Sidebar.<br>Definir casos de prueba en paralelo al desarrollo.<br>Mantener un estilo de código uniforme en todo el equipo.<br>Garantizar que el sistema compile igual en Windows y Linux. |
| **Dejar de hacer** | 1. Probar flujos sin infraestructura base.<br>2. Mezclar responsabilidades en código.<br>3. Ignorar errores de arquitectura.<br>4. Subir archivos duplicados en layouts.<br>5. Ignorar conflictos con alias (`@/`). | Se probó Toasts antes de montar el ToasterLayout.<br>Dificultó la depuración al tener lógica mezclada.<br>Evitar confundir fallos de estado con fallos de UI.<br>Generó confusión sobre qué archivo era el definitivo.<br>Provocó errores de importación en el frontend. |
| **Más de** | 1. Recolección de evidencias en tiempo real.<br>2. Commits y Merges frecuentes a `main`.<br>3. Checklist de integración para el Dashboard.<br>4. Comunicación sobre cambios en el esquema.<br>5. Feedback técnico entre compañeros. | No dejar las capturas de commits para el final.<br>Mitigar conflictos de versión al cierre del sprint.<br>Confirmar que cada acción actualice la vista relacionada.<br>Evitar que el frontend rompa al cambiar el backend.<br>Detección temprana de lógica ineficiente en el código. |
| **Menos de** | 1. Ambigüedad en la estructura de archivos.<br>2. Descubrimiento de feedback visual tardío.<br>3. Retrabajo por desalineación de entornos.<br>4. Navegación por URL directa.<br>5. Dependencia de datos manuales. | Se requiere orden total para escalar el proyecto.<br>Definir qué acciones necesitan Toasts antes de codificar.<br>Los fallos de rutas en Windows consumieron mucho tiempo.<br>Las páginas deben estar conectadas al flujo de usuario.<br>Priorizar el uso de semillas de base de datos. |

### Milestone 3: Gestión documental y monitoreo

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Refactorizar modelos antes que rutas.<br>2. Realizar Peer Reviews rigurosos.<br>3. Ejecutar pruebas en diversos dispositivos.<br>4. Usar MongoDB Atlas para persistencia.<br>5. Trazabilidad por 5 sub-issues. | Ahorró tiempo de depuración en la autenticación.<br>Garantizó el cumplimiento del DoD en cada entrega.<br>Aseguró que la flota sea gestionable desde móviles.<br>Permitió el trabajo colaborativo con datos reales en nube.<br>Mantuvo el orden en la migración de datos. |
| **Empezar a hacer** | 1. Configurar `.env` desde el día uno.<br>2. Fortalecer la validación de relaciones.<br>3. Usar middlewares globales de seguridad.<br>4. Implementar reportes de bugs estandarizados.<br>5. Automatizar la limpieza de bases de prueba. | Evitar deudas técnicas detectadas por SonarCloud.<br>Validar correctamente la relación Conductor-Vehículo.<br>Simplificar el cumplimiento de criterios de seguridad.<br>Para que todos entiendan severidad y pasos a reproducir.<br>Garantizar que cada prueba inicie con un estado limpio. |
| **Dejar de hacer** | 1. Utilizar credenciales "hardcoded".<br>2. Depender de datos simulados.<br>3. Posponer ajustes en staging.<br>4. Ignorar inconsistencias en el `StatusBadge`.<br>5. Desarrollar flujos sin documentar pruebas. | SonarCloud detectó riesgos críticos de seguridad.<br>Las alertas deben reflejar información real del usuario.<br>Evitar cambios de última hora en interceptores.<br>QA detectó que los estados no siempre coincidían.<br>Causó pérdida de tiempo al ejecutar el aseguramiento. |
| **Más de** | 1. Comunicación asertiva y división efectiva.<br>2. Uso de Scrum Poker para estimación.<br>3. Coherencia entre entidades y alertas.<br>4. Uso de herramientas de diseño responsivo.<br>5. Validación temprana de flujos complejos. | Se redujeron los percances y mejoró el ambiente.<br>Permitió un cumplimiento fluido de criterios INVEST.<br>Asegurar que cada alerta tenga una referencia verificable.<br>Logró que tablas y buscadores fueran realmente usables.<br>Detectó inconsistencias antes de la integración final. |
| **Menos de** | 1. Inconsistencias en Buscadores.<br>2. Fallos de diseño en tablas responsivas.<br>3. Retrasos por gestión de credenciales.<br>4. Pérdida en el alcance del sprint.<br>5. Reportes de hallazgos vagos. | Se corrigieron comportamientos erráticos de búsqueda.<br>Se ajustaron para que no se cortara la información.<br>La detección de secretos detuvo el pipeline innecesariamente.<br>Fácil perderse probando cosas fuera del scope inicial.<br>Se migró a reportes claros con evidencia adjunta. |

### Milestone 4: Dashboard, alertas y cierre del sistema

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Implementar pruebas con datos reales.<br>2. Mantener trazabilidad técnica total.<br>3. Utilizar publicación condicional en CI/CD.<br>4. Reutilizar componentes existentes.<br>5. Realizar el cierre progresivo de tareas. | Se validó el flujo completo con MongoDB Atlas.<br>Vinculación exitosa entre issues y cambios de código.<br>Evitó fallos en el pipeline ante falta de secretos.<br>Aceleró la implementación de edición de conductores.<br>Garantizó estabilidad antes de la sustentación final. |
| **Empezar a hacer** | 1. Estandarizar `docker compose down -v`.<br>2. Ampliar cobertura de pruebas unitarias.<br>3. Validar formatos en tiempo real.<br>4. Revisar los límites de formularios.<br>5. Establecer guías para datos demo. | Mantener la higiene en entornos de prueba técnicos.<br>Superar el estado "Failed" del Quality Gate.<br>Evitar errores de base de datos (placa, SOAT, celular).<br>Prevenir fallos al cargar volúmenes masivos de datos.<br>Garantizar que el `OWNER_EMAIL` coincida con el usuario. |
| **Dejar de hacer** | 1. Enviar código sin revisión funcional.<br>2. Usar datos demo sin coherencia.<br>3. Ignorar hotspots de SonarCloud.<br>4. Cargar información sin validación previa.<br>5. Ignorar el impacto de navegación nativa. | La integración continua no sustituye la validación humana.<br>Causó que las alertas no se mostraran al usuario correcto.<br>Riesgo de comprometer la confiabilidad final del sistema.<br>Provocó errores de inconsistencia de datos en el dashboard.<br>Se abusaba del botón 'atrás' del navegador. |
| **Más de** | 1. Colaboración ante problemas emergentes.<br>2. Uso de navegación por componentes (`Link`).<br>3. Coherencia entre fuentes de información.<br>4. Monitoreo del desempeño del pipeline.<br>5. Pruebas funcionales de fin a fin (E2E). | El equipo estuvo unido ante bloqueos de último minuto.<br>Hizo que la plataforma se sienta como una app nativa.<br>Asegurar que reportes y dashboard usen la misma fuente.<br>Concluyó en el éxito de la publicación en DockerHub.<br>Validó que el flujo del usuario sea fluido y sin errores. |
| **Menos de** | 1. Tiempo de uso del botón 'atrás'.<br>2. Dependencia de datos técnicos en alertas.<br>3. Retrabajos por fallos de integración.<br>4. Cobertura global de pruebas baja.<br>5. Alertas sin información útil. | La mejora en la navegación redujo la fricción significativamente.<br>Se logró mostrar información clara para el usuario final.<br>La falta de pruebas locales generó carga extra al corregir.<br>Se propone ampliar tests para mejorar el Quality Gate.<br>Se eliminaron avisos técnicos por mensajes de valor. |
---

