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

---

## 4. Dinámica Estrella de Mar por Milestones (Postmortem)

### Milestone 1:  Base funcional del sistema

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Consolidar el núcleo técnico.<br>2. Dividir historias de usuario.<br>3. Fomentar la autonomía individual. | El éxito del Login y Dashboard dio valor inmediato al proyecto.<br>El uso de sub-issues facilitó la trazabilidad y el orden.<br>Se cumplieron tareas sin necesidad de micro-gestión constante. |
| **Empezar a hacer** | 1. Implementar checklists de pre-commit.<br>2. Adoptar política "1 issue = 1 cambio".<br>3. Planificar según capacidad real. | Evitar errores de compilación al integrar código de diferentes miembros.<br>Mejorar el orden y la granularidad de los commits en GitHub.<br>Considerar la carga de parciales y externa en la estimación de tiempos. |
| **Dejar de hacer** | 1. Desarrollar sin validar compilación.<br>2. Ignorar metodología por estrés.<br>3. Subir código con estados incompletos. | Se integró código que rompió rutas en las primeras semanas.<br>El desorden metodológico acumuló trabajo innecesario al final del ciclo.<br>Generó inconsistencias visuales y bugs básicos en el frontend. |
| **Más de** | 1. Rigor en procesos Scrum.<br>2. Trazabilidad intuitiva de sprints.<br>3. Aterrizar la planificación inicial. | Evitar que las tareas se aplacen o se pierda la agilidad ganada.<br>No perder tiempo del equipo buscando entregables en el repositorio.<br>Asegurar que las metas del sprint sean realistas para todos los integrantes. |
| **Menos de** | 1. Aplazamiento de tareas pendientes.<br>2. Dependencia de reuniones sincrónicas.<br>3. Búsqueda dispersa de información. | Se debieron pasar tareas importantes del Sprint 3 al Sprint 4.<br>Se demostró que la autonomía y el trabajo asíncrono son más eficientes.<br>La desorganización inicial dificultó encontrar el trabajo ya realizado. |

### Milestone 2: Gestión básica de flota

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Aplicar patrones GoF (Factory/Facade).<br>2. Mantener la división en sub-issues técnicas.<br>3. Utilizar simuladores para pruebas de borde. | Limpió el "código espagueti" y mejoró la mantenibilidad real.<br>Permitió un avance progresivo y trazable de la vista AlertasPage.<br>El simulador de fechas detectó bugs críticos en condiciones normales. |
| **Empezar a hacer** | 1. Estandarizar convenciones de nombres.<br>2. Definir alcance de rutas y menús inicialmente.<br>3. Involucrar al QA desde el inicio del sprint. | Evitar confusiones entre archivos similares como useAlert y useAlerts.<br>Asegurar que las vistas nuevas sean accesibles desde el Sidebar.<br>Definir casos de prueba en paralelo al desarrollo para ganar tiempo. |
| **Dejar de hacer** | 1. Probar flujos sin infraestructura base.<br>2. Mezclar responsabilidades en implementaciones.<br>3. Ignorar errores de arquitectura como visuales. | Se intentó probar Toasts antes de montar el ToasterLayout base.<br>El hito logró separar el análisis, la construcción y la documentación.<br>Evitar retrabajos al confundir fallos de estado con simples fallos de UI. |
| **Más de** | 1. Recolección de evidencias en tiempo real.<br>2. Commits y Merges frecuentes a `main`.<br>3. Checklist de integración para el Dashboard. | No dejar las capturas de commits y UML para el final de la entrega.<br>Mitigar la complejidad de resolver conflictos al cierre del sprint.<br>Confirmar que cada acción nueva actualice la vista relacionada de inmediato. |
| **Menos de** | 1. Ambigüedad en la estructura de archivos.<br>2. Descubrimiento de feedback visual tardío.<br>3. Retrabajo por desalineación de entornos. | Se requiere interoperabilidad total entre Windows y otros entornos.<br>Definir qué acciones necesitan Toasts antes de empezar a codificar.<br>Evitar conflictos con alias de rutas y duplicados en la carpeta layouts. |

### Milestone 3: Gestión documental y monitoreo

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Refactorizar modelos antes que rutas.<br>2. Realizar Peer Reviews rigurosos.<br>3. Ejecutar pruebas en diversos dispositivos. | Ahorró tiempo de depuración en la lógica de autenticación.<br>Garantizó el cumplimiento del Definition of Done (DoD).<br>Aseguró que la flota sea gestionable desde móviles. |
| **Empezar a hacer** | 1. Configurar `.env` desde el día uno.<br>2. Fortalecer la validación de relaciones.<br>3. Usar middlewares globales de seguridad. | Evitar deudas técnicas y bloqueos por SonarCloud.<br>Detectar inconsistencias en la asignación conductor-vehículo.<br>Simplificar el cumplimiento de criterios de seguridad. |
| **Dejar de hacer** | 1. Utilizar credenciales "hardcoded".<br>2. Depender de datos simulados/pruebas.<br>3. Posponer ajustes de variables en staging. | SonarCloud detectó riesgos de seguridad al inicio del ciclo.<br>Las alertas deben reflejar información real y trazable.<br>Evitar cambios de última hora en interceptores del frontend. |
| **Más de** | 1. Comunicación asertiva y división efectiva.<br>2. Uso de Scrum Poker para estimación.<br>3. Coherencia entre entidades y alertas. | Se redujeron los percances y mejoró el ambiente de equipo.<br>Permitió un cumplimiento fluido de los criterios INVEST.<br>Asegurar que cada alerta tenga una referencia verificable. |
| **Menos de** | 1. Inconsistencias en StatusBadge/Buscadores.<br>2. Fallos de diseño en tablas responsivas.<br>3. Retrasos por gestión de credenciales. | QA detectó y reportó hallazgos antes de la integración final.<br>Se corrigieron para hacer la plataforma realmente usable.<br>La trazabilidad por sub-issues mitigó cuellos de botella. |

### Milestone 4: Dashboard, alertas y cierre del sistema

| Eje | Acción (Verbo + Frase) | Ejemplo / Justificación |
|-----|-------------------------|-------------------------|
| **Seguir haciendo** | 1. Implementar pruebas con datos reales.<br>2. Mantener trazabilidad técnica total.<br>3. Utilizar publicación condicional en CI/CD. | Se validó el flujo completo con MongoDB Atlas.<br>Vinculación exitosa entre issues, PRs y cambios.<br>Evitó fallos en el pipeline ante falta de credenciales. |
| **Empezar a hacer** | 1. Estandarizar `docker compose down -v`.<br>2. Ampliar cobertura de pruebas unitarias.<br>3. Validar formatos mientras el usuario escribe. | Mantener la higiene en los entornos de prueba técnicos.<br>Superar el estado "Failed" actual del Quality Gate.<br>Evitar errores posteriores de validación en la base de datos. |
| **Dejar de hacer** | 1. Enviar código sin revisión funcional.<br>2. Usar datos demo sin `OWNER_EMAIL`.<br>3. Ignorar hotspots de SonarCloud. | La integración continua no sustituye la validación manual.<br>Causó desajustes entre el usuario y su información demo.<br>Riesgo de comprometer la seguridad y confiabilidad final. |
| **Más de** | 1. Colaboración ante problemas emergentes.<br>2. Uso de navegación por componentes (`Link`).<br>3. Coherencia entre fuentes de información. | El equipo estuvo unido para resolver bloqueos de último minuto.<br>Hizo que la plataforma se sienta como una app nativa.<br>Asegurar que alertas y reportes muestren los mismos datos. |
| **Menos de** | 1. Tiempo de uso del botón 'atrás'.<br>2. Dependencia de datos técnicos en alertas.<br>3. Retrabajos por fallos de integración. | La mejora en la navegación redujo la fricción del usuario.<br>Se logró mostrar información realmente útil y no técnica.<br>La falta de pruebas previas al commit generó carga extra. |
