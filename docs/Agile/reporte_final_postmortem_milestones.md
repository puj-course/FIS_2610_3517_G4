# Reporte Final de Postmortem – Consolidado de Milestones

**Proyecto:** Drive Control / Syntix Tech  
**Stack:** MERN – MongoDB, Express, React y Node.js  
**Tipo de documento:** Reporte final de ciclo / consolidado de postmortems  
**Alcance:** Milestone 1, Milestone 2, Milestone 3 y Milestone 4  
**Equipo:** SYNTIX TECH  

| Nombre | Usuario | Rol |
|---|---|---|
| Sebastián Ramírez Maldonado | @Sarm-m | Scrum Master |
| Samuel Freile | @samuelfl680 | Configuration Manager |
| Sebastián Rodríguez Ramírez | @Juserora | Quality Assurance Lead |
| Solón Losada | @solonlosada2006 | DevOps Engineer |
| Sebastián Vargas | @juanvargax | Product Owner / Sprint Planner |

---

## 1. Resumen Ejecutivo

El proyecto Drive Control / Syntix Tech evolucionó a través de cuatro milestones que permitieron pasar de una base funcional inicial a un producto final con arquitectura desacoplada, persistencia en nube, alertas documentales dinámicas, proceso de QA formalizado y pipeline de CI/CD con control de calidad automatizado.

El **Milestone 1** se enfocó en establecer la base funcional del sistema: autenticación, registro, Dashboard inicial y flujo colaborativo mediante GitFlow. Aunque se logró entregar una primera versión utilizable, el equipo identificó problemas de planeación, ausencia de Definition of Done, integración sin validación local y estimaciones optimistas frente a la carga académica real.

El **Milestone 2** representó un salto arquitectónico. Se introdujeron patrones de diseño GoF, especialmente Factory Method y Facade, se fortaleció la gestión básica de flota y se integró un simulador de validación RUNT. El mayor aprendizaje fue que la calidad técnica no depende solo del código, sino también de convenciones de nombres, interoperabilidad entre entornos y secuencias de construcción bien definidas.

El **Milestone 3** consolidó la madurez técnica y de proceso mediante MongoDB Atlas, aislamiento de datos por `ownerEmail`, formalización de reportes de QA y adopción de Scrum Poker. Sin embargo, también reveló una deuda crítica de seguridad: la configuración tardía de variables de entorno permitió que credenciales o cadenas de conexión quedaran temporalmente expuestas, situación detectada por SonarCloud.

El **Milestone 4** cerró el proyecto con alertas documentales dinámicas de SOAT y RTM, navegación mejorada mediante `Link`, interfaz responsiva, entorno Docker Compose y pipeline de CI/CD con GitHub Actions, SonarCloud y publicación condicional en DockerHub. El principal hallazgo final fue que la automatización del pipeline es necesaria, pero no reemplaza la validación funcional humana en local.

En conjunto, el proyecto muestra una evolución clara: el equipo pasó de trabajar con criterios ambiguos y validaciones manuales dispersas a operar con trazabilidad, QA, infraestructura reproducible, análisis estático y una cultura de mejora continua. La principal conclusión del postmortem final es que la madurez del equipo no se midió únicamente por el producto entregado, sino por la capacidad de aprender de cada error y convertirlo en una mejora concreta para el siguiente ciclo.

---

## 2. Propósito del Reporte Final

Este reporte consolida la información de los cuatro postmortems individuales y responde al propósito del proceso de postmortem: evaluar el producto producido, el esfuerzo invertido y el proceso seguido para construirlo. Además, identifica problemas recurrentes, causas raíz, acciones preventivas, evolución de los roles y oportunidades de mejora para futuros proyectos.

El documento cumple la función de **reporte del ciclo**, es decir, un artefacto final que sintetiza:

- Lo que se produjo en cada milestone.
- El proceso de trabajo seguido por el equipo.
- Los roles desempeñados y su evolución.
- Qué funcionó y qué no funcionó.
- Cómo mejorar el proceso en ciclos futuros.
- Las principales acciones del PIP final.

---

## 3. Línea de Tiempo General de los Milestones

| Milestone | Enfoque principal | Producto entregado | Problema crítico | Aprendizaje principal |
|---|---|---|---|---|
| M1 – Base funcional del sistema | Autenticación, registro, Dashboard base y GitFlow | Login, registro, estructura inicial del Dashboard y flujo de ramas | Ausencia de DoD e integración sin validación local | Sin criterios compartidos de terminado, el equipo no puede entregar con consistencia |
| M2 – Gestión básica de flota y patrones | Gestión de flota, patrones GoF, simulador RUNT | Factory Method, Facade, flota y validación RUNT simulada | Interoperabilidad Windows/Linux, rutas, nombres de archivos y dependencias visuales | La arquitectura necesita convenciones, secuencia de construcción y entorno homogéneo |
| M3 – Gestión documental, monitoreo y nube | MongoDB Atlas, ownerEmail, QA formal y Scrum Poker | Persistencia en nube, aislamiento de datos y reportes QA | Credenciales hardcodeadas y criterios incompletos de responsividad | La seguridad y la calidad se incorporan desde el Día 1, no al cierre |
| M4 – Dashboard, alertas y cierre | Alertas dinámicas, CI/CD, Docker, SonarCloud y cierre | Producto funcional con pipeline, análisis estático y publicación condicional | Exceso de confianza en pipeline sin validación funcional local | La automatización no sustituye la validación humana de negocio |

---

## 4. Evaluación Global del Producto Producido

### 4.1 Producto entregado por milestone

#### Milestone 1: Base funcional

El primer milestone produjo la base mínima del sistema. Se implementaron los módulos de Login y Registro, se estructuró el Dashboard inicial y se estableció un flujo de trabajo colaborativo mediante GitFlow. El valor principal fue demostrar que el equipo podía levantar una primera versión funcional del sistema y trabajar sobre una base común.

No obstante, el producto aún era inmaduro: el Dashboard no cumplía completamente los criterios visuales esperados y la integración de rutas del frontend generó retrabajo. La falta de criterios formales de aceptación permitió que historias de usuario se cerraran con interpretaciones distintas de lo que significaba “terminado”.

#### Milestone 2: Gestión de flota y arquitectura

El segundo milestone amplió el valor funcional del sistema con la gestión básica de flota y la simulación de validación RUNT. Además, introdujo patrones de diseño GoF para evitar que el proyecto creciera como código acoplado y difícil de mantener.

La implementación de Factory Method para modales y Facade para subsistemas de alertas fue clave para mejorar la mantenibilidad. Este milestone no solo agregó funcionalidades, sino que modificó la forma en que el equipo pensaba el diseño del software.

#### Milestone 3: Persistencia, monitoreo y nube

El tercer milestone permitió que el sistema dejara de depender de almacenamiento local y se conectara a MongoDB Atlas. Además, la validación por `ownerEmail` aportó aislamiento de datos entre usuarios, elemento importante para un sistema multiusuario.

También se estabilizó la edición de vehículos y conductores, se avanzó en relaciones Conductor-Vehículo y se formalizó el proceso de QA con reportes estructurados. El producto alcanzó una madurez mayor, aunque el incidente de credenciales evidenció que la seguridad no estaba completamente integrada al proceso de desarrollo.

#### Milestone 4: Producto final y despliegue

El cuarto milestone consolidó el producto final. Las alertas dinámicas de SOAT y RTM vencidos se conectaron con datos persistentes, la navegación mejoró con componentes de enrutamiento nativo, la interfaz se refinó y el pipeline de CI/CD permitió validar y publicar de forma controlada.

El producto final alcanzó un estado funcional, desplegable y técnicamente defendible. El pipeline, el entorno Docker Compose y el análisis de SonarCloud elevaron la calidad del sistema y cerraron varias deudas detectadas en milestones anteriores.

### 4.2 Evaluación global del producto

El producto final cumple con una evolución lógica: primero se construyó la base, luego se fortaleció la arquitectura, después se incorporó persistencia real y finalmente se automatizó la validación/despliegue. La funcionalidad más valiosa para el usuario final quedó concentrada en el flujo de gestión de flota, documentación y alertas.

La mayor fortaleza del producto es que no terminó siendo solo una interfaz funcional, sino un sistema con arquitectura, datos persistentes, separación de responsabilidades, validaciones, trazabilidad y automatización. La mayor debilidad fue que varios atributos de calidad —seguridad, responsividad, validación funcional local y cobertura— se trataron tarde en algunos ciclos, generando retrabajo.

---

## 5. Evaluación Global del Proceso Seguido

### 5.1 Evolución del proceso

El proceso del equipo evolucionó de forma incremental:

| Etapa | Estado inicial | Mejora alcanzada |
|---|---|---|
| Planeación | Estimaciones optimistas y poca consideración de carga académica | Scrum Poker y mayor conciencia de capacidad real |
| Seguimiento | Comunicación irregular y Daily Standups poco consistentes | Mayor trazabilidad mediante GitHub Issues y sub-issues |
| Integración | Merges con validación insuficiente | Mayor uso de checklist, PRs, pipeline y revisión técnica |
| Calidad | Criterios ambiguos de terminado | QA formal con reportes, pasos de reproducción y evidencias |
| Infraestructura | Entornos manuales e inconsistentes | Docker Compose y CI/CD con GitHub Actions |
| Seguridad | Variables de entorno postergadas | Reconocimiento de seguridad como requisito transversal |

### 5.2 Qué funcionó en el proceso

Funcionó especialmente bien la adopción progresiva de prácticas de ingeniería más disciplinadas. GitFlow permitió organizar el trabajo desde el inicio, las sub-issues técnicas mejoraron la trazabilidad, los patrones GoF ayudaron a reducir acoplamiento, Scrum Poker mejoró la planeación y el pipeline permitió convertir la calidad en una verificación recurrente.

También funcionó la capacidad del equipo para aprender entre ciclos. Las lecciones del M1 sobre DoD y validación local impulsaron discusiones posteriores sobre checklists. Los problemas de interoperabilidad del M2 justificaron el avance hacia entornos reproducibles. El incidente de seguridad del M3 fortaleció la conciencia sobre `.env`, secretos y SonarCloud. El Quality Gate fallido del M4 confirmó que el equipo necesitaba combinar automatización con validación funcional humana.

### 5.3 Qué no funcionó en el proceso

No funcionó la tendencia inicial a postergar definiciones de calidad hasta etapas tardías del sprint. En varios hitos, el equipo trabajó primero y formalizó después: primero se integró código y luego se discutió el DoD; primero se construyeron componentes y luego se revisaron dependencias; primero se conectó infraestructura y luego se gestionaron secretos; primero se confió en el pipeline y luego se evidenció la falta de pruebas funcionales locales.

Tampoco funcionó depender de supuestos implícitos. La estructura de rutas, los nombres de archivos, la compatibilidad entre entornos, los datos demo y la validación responsiva debieron ser decisiones explícitas del equipo desde la planeación.

---

## 6. Evaluación Global de Calidad

### 6.1 Desempeño real comparado con lo planeado

El desempeño real fue mejorando milestone a milestone, pero con desviaciones relevantes respecto a lo planeado. En el M1, la desviación principal fue de tiempo y alcance visual. En el M2, la desviación se concentró en retrabajos por interoperabilidad y dependencias mal secuenciadas. En el M3, la desviación fue causada por remediación de seguridad no planificada. En el M4, la desviación apareció por Quality Gate fallido, Hotspots y baja cobertura.

El patrón común es que el equipo sí logró entregar valor en cada milestone, pero varias veces lo hizo con retrabajo porque las condiciones de calidad no estaban completamente definidas antes de iniciar la construcción.

### 6.2 Calidad del producto

La calidad del producto mejoró de forma acumulativa. El sistema pasó de tener rutas rotas e integración manual a contar con análisis estático, pipeline, arquitectura desacoplada y persistencia real. Las mejoras más visibles fueron:

- Uso de patrones de diseño para mejorar mantenibilidad.
- Formalización de QA con reportes reproducibles.
- Validación de datos por usuario mediante `ownerEmail`.
- Pipeline con SonarCloud y publicación condicional.
- Entorno Docker Compose para reproducibilidad.
- Mejora de navegación y responsividad.

Sin embargo, persistieron riesgos importantes:

- Cobertura de pruebas insuficiente en etapas finales.
- Validación funcional local no siempre obligatoria antes de PR.
- Datos demo no siempre coherentes con el usuario de sesión.
- Seguridad tratada tarde en algunos ciclos.
- Criterios responsivos no siempre incluidos desde los criterios de aceptación.

### 6.3 Lecciones de calidad

La principal lección de calidad es que no basta con “hacer que funcione”. El equipo necesita evidencias de que funciona, criterios de aceptación verificables, pruebas, revisión local, revisión de pares, validación de entorno y control automatizado.

La segunda lección es que SonarCloud y el pipeline son herramientas de defensa, no sustitutos del criterio de ingeniería. Detectan vulnerabilidades, fallos de calidad y condiciones de publicación, pero no garantizan por sí solos que un flujo de negocio tenga sentido para el usuario.

---

## 7. Análisis de Causas Raíz Consolidado

| Milestone | Causa raíz principal | Causa secundaria | Medida preventiva recomendada |
|---|---|---|---|
| M1 | Ausencia de Definition of Done unificado y verificable | Estimaciones sin capacidad real del equipo | Definir DoD, checklist de pre-merge y planificación con disponibilidad real |
| M2 | Falta de estandarización de nombres e interoperabilidad entre entornos | Construcción de componentes dependientes sin infraestructura base | ESLint, convenciones, kick-off técnico y entorno homogéneo |
| M3 | Configuración tardía de variables de entorno y secretos | Falta de criterios de responsividad | `.env.example`, hooks de secretos, revisión de seguridad desde Sprint Planning |
| M4 | Dependencia excesiva del pipeline para validar corrección funcional | Falta de higiene de entorno y datos demo incoherentes | Validación local obligatoria, E2E, `docker compose down -v` y guía de datos demo |

### 7.1 Tendencias detectadas

Las causas raíz muestran una tendencia clara: los problemas no se originaron principalmente por falta de habilidad técnica individual, sino por ausencia o tardanza de acuerdos de equipo. Cada problema crítico pudo haberse prevenido con una definición explícita previa:

- DoD explícito.
- Convenciones explícitas.
- Contratos de rutas explícitos.
- Gestión de secretos explícita.
- Criterios responsivos explícitos.
- Validación local explícita.
- Datos demo explícitos.

La mejora futura debe centrarse en que las reglas del proceso estén visibles antes de iniciar el desarrollo y no aparezcan únicamente después del incidente.

---

## 8. Reporte Consolidado de Roles

### 8.1 Scrum Master

El Scrum Master tuvo una evolución desde la coordinación inicial del equipo hasta la gestión de incidentes críticos en el cierre. En el M1, el reto fue consolidar comunicación y ritmo de trabajo. En el M2, se fortaleció la trazabilidad mediante sub-issues atómicas. En el M3, se impulsó Scrum Poker como herramienta para mejorar estimaciones. En el M4, el rol fue clave para coordinar la respuesta asíncrona ante el Quality Gate fallido.

**Qué funcionó:**

- Mantener GitFlow y trazabilidad.
- Impulsar sub-issues técnicas.
- Coordinar al equipo en momentos de presión.
- Promover prácticas de mejora entre milestones.

**Problemas:**

- Comunicación sincrónica irregular en los primeros ciclos.
- Falta de espacios tempranos para detectar riesgos técnicos.
- DoD y validación funcional no suficientemente exigidos al inicio.

**Mejora futura:**

El Scrum Master debe incluir una revisión fija de riesgos técnicos, seguridad, integración y validación funcional en cada Sprint Planning. Además, debe asegurar que ningún PR avance sin cumplir el DoD acordado.

### 8.2 Product Owner / Sprint Planner

El Product Owner mantuvo el foco de valor en autenticación, flota, RUNT, documentación, alertas y cierre funcional. Su rol fue importante para priorizar las funcionalidades con mayor impacto para el usuario final. La planeación mejoró con el tiempo, especialmente cuando el equipo incorporó Scrum Poker y mayor descomposición técnica.

**Qué funcionó:**

- Priorización de módulos con valor de negocio.
- Enfoque en flota, documentos y alertas.
- Coherencia progresiva entre funcionalidades y necesidades del usuario.

**Problemas:**

- Estimaciones optimistas en M1.
- Rutas, menús y datos demo no definidos con suficiente anticipación.
- Criterios de responsividad omitidos en algunas historias.

**Mejora futura:**

El Product Owner debe convertir elementos de configuración y datos de prueba en tareas explícitas del backlog. Las historias visuales deben incluir criterios responsive y las historias de negocio deben tener datos demo coherentes definidos desde el inicio.

### 8.3 Configuration Manager

El Configuration Manager fue clave para estructurar GitFlow, controlar integración y evidenciar problemas de configuración. Su rol evolucionó desde la gestión de ramas hasta la necesidad de formalizar convenciones, protección de ramas, limpieza de entorno y publicación controlada.

**Qué funcionó:**

- Uso temprano de GitFlow.
- Identificación de problemas de ramas, merges y entornos.
- Reconocimiento de la necesidad de estandarizar nombres, rutas y limpieza de Docker.

**Problemas:**

- Merges sin suficiente validación en etapas iniciales.
- Ausencia de linters estrictos para detectar convenciones.
- Falta de guía temprana de limpieza de volúmenes y datos persistentes.

**Mejora futura:**

El Configuration Manager debe mantener una política de ramas, checklist de pre-merge, reglas de naming, guía de entorno y comandos de limpieza desde el README inicial del proyecto.

### 8.4 Quality Assurance Lead

El rol de QA fue uno de los que más maduró. En el M1, el principal hallazgo fue la ausencia de DoD. En el M2, se identificaron problemas por secuencia de construcción y componentes dependientes. En el M3, QA se formalizó con reportes reproducibles y evidencia. En el M4, QA enfrentó Hotspots, Quality Gate fallido y la necesidad de pruebas E2E.

**Qué funcionó:**

- Reportes de bugs con pasos de reproducción.
- Identificación de errores visuales y de responsividad.
- Priorización de Hotspots en cierre.
- Enfoque en QA como responsabilidad medible.

**Problemas:**

- QA ingresó tarde en algunas decisiones de dependencia.
- Falta de pruebas E2E desde etapas tempranas.
- Cobertura añadida tardíamente bajo presión.

**Mejora futura:**

QA debe participar desde el inicio del sprint para mapear dependencias, definir criterios de aceptación, diseñar casos E2E y asegurar que las pruebas crezcan junto con el producto.

### 8.5 DevOps Engineer

El rol de DevOps pasó de configurar bases de entorno a entregar un pipeline completo. En los primeros milestones se evidenció la ausencia de CI/CD y entorno homogéneo. En el M3, SonarCloud detectó credenciales hardcodeadas. En el M4, GitHub Actions, SonarCloud, DockerHub y Docker Compose consolidaron una práctica DevOps real.

**Qué funcionó:**

- Construcción progresiva de infraestructura.
- Uso de SonarCloud como control de calidad.
- Pipeline con publicación condicional.
- Reconocimiento de Docker Compose como entorno homogéneo.

**Problemas:**

- CI/CD llegó tarde para detectar problemas tempranos.
- Hooks locales y gestión de secretos no estuvieron listos desde el inicio.
- Limpieza de entorno no estaba documentada inicialmente.

**Mejora futura:**

DevOps debe iniciar cada proyecto con pipeline mínimo, verificación de build, detección de secretos, Docker Compose, `.env.example` y scripts de limpieza reproducibles.

---

## 9. Reporte de Desarrollo

La estrategia de desarrollo fue madurando desde una construcción funcional inicial hacia una arquitectura mantenible. En M1, el foco fue entregar autenticación y Dashboard. En M2, se corrigió el rumbo arquitectónico con patrones GoF. En M3, se fortaleció el modelo de dominio con persistencia y relaciones. En M4, se conectaron los flujos finales con alertas, navegación y despliegue.

### 9.1 Efectividad de la estrategia

La estrategia funcionó porque permitió entregar incrementos reales en cada milestone. Sin embargo, fue más reactiva que preventiva en algunos puntos. El equipo aprendió a corregir rápido, pero debe mejorar en prevenir problemas mediante acuerdos previos.

### 9.2 Usabilidad

La usabilidad mejoró principalmente en el M4 con navegación basada en `Link`, reducción de recargas completas y refinamiento visual responsivo. Para futuros proyectos, los criterios de usabilidad deben incorporarse desde las historias de usuario y no solo en el cierre.

### 9.3 Mantenibilidad

La mantenibilidad mejoró notablemente con los patrones de diseño y la separación de responsabilidades. El uso de Factory Method, Facade y otros patrones permitió reducir acoplamiento y preparar el sistema para futuras extensiones.

### 9.4 Compatibilidad

La compatibilidad fue un dolor importante en M2 por diferencias entre Windows y Linux, rutas absolutas y alias. El aprendizaje final es que la compatibilidad debe validarse desde el entorno y no depender de cada máquina individual.

### 9.5 Seguridad

La seguridad fue el atributo de calidad más crítico en M3. La exposición temporal de credenciales mostró que las variables de entorno, los secretos y los hooks de detección deben estar activos desde el inicio.

### 9.6 Desempeño

No se reportaron métricas numéricas homogéneas de desempeño. Sin embargo, sí se identificaron mejoras indirectas como navegación sin recarga completa, persistencia en nube y entorno reproducible. Para futuros proyectos, se recomienda medir tiempos de carga, latencia de endpoints y comportamiento bajo datos demo representativos.

---

## 10. Reporte de Planeación y Proceso

### 10.1 Planeación

La planeación comenzó con estimaciones optimistas y poca consideración de carga externa. Con el avance del proyecto, Scrum Poker permitió estimaciones más realistas y mayor participación del equipo. La planeación mejoró, pero aún requiere incorporar riesgos técnicos y criterios de calidad como tareas explícitas del sprint.

### 10.2 Seguimiento

El seguimiento mejoró mediante GitHub Issues, sub-issues, trazabilidad y PRs. La política de “1 issue = 1 cambio” fue una buena práctica porque permitió reconstruir el avance y asociar decisiones técnicas con trabajo específico.

### 10.3 Gestión de riesgos

El equipo identificó riesgos importantes, aunque varios aparecieron tarde:

| Riesgo | Cuándo apareció | Cómo se respondió | Prevención futura |
|---|---|---|---|
| Falta de DoD | M1 | Se propuso formalizar criterios | DoD aprobado antes de desarrollar |
| Entornos incompatibles | M2 | Se reconoció necesidad de Docker/convenciones | Docker Compose desde inicio |
| Credenciales expuestas | M3 | SonarCloud detectó y se remediaron | Hooks, `.env.example`, revisión de secretos |
| Quality Gate fallido | M4 | Trabajo asíncrono de remediación | Cobertura incremental y revisión continua |
| Datos demo incoherentes | M4 | Se detectó en QA | Guía formal de datos demo |

---

## 11. Reporte de Calidad

### 11.1 Disciplina de calidad

La disciplina de calidad fue creciendo. Al inicio, el equipo dependía de validaciones informales. Luego incorporó checklists, reportes de QA, SonarCloud y pipeline. El principal salto fue pasar de “probar si funciona” a “documentar, reproducir y verificar con evidencia”.

### 11.2 Estándares

Los estándares iniciales no fueron suficientes. El equipo necesitó formalizar:

- Definition of Done.
- Convenciones de nombres de archivos.
- Estructura de rutas.
- Reglas de importaciones.
- Manejo de variables de entorno.
- Criterios responsive.
- Datos demo.
- Validación local antes de PR.

### 11.3 Inspecciones y revisiones

Las inspecciones mejoraron con el tiempo. Los Peer Reviews del M3 ayudaron a disminuir bugs en integración. Para futuros proyectos, las revisiones deben verificar no solo compilación, sino lógica de negocio, seguridad, criterios de aceptación y evidencia funcional.

### 11.4 PIPs generados

Los PIPs más relevantes fueron:

- Definir DoD antes de cada sprint.
- Validar localmente antes de abrir PR.
- Usar ESLint y reglas de naming.
- Configurar `.env` desde el Día 1.
- Incorporar SonarCloud y hooks de secretos.
- Añadir pruebas responsive y E2E.
- Documentar datos demo y limpieza de Docker.

---

## 12. Reporte de Soporte, Configuración y DevOps

El soporte del proyecto pasó de una configuración manual a un entorno controlado por pipeline y Docker Compose. Esta evolución fue fundamental porque varios problemas de los primeros milestones estuvieron relacionados con integración, entornos locales y falta de validaciones automáticas.

### 12.1 Administración de configuración

GitFlow fue útil desde el inicio, pero necesitaba complementarse con políticas de PR, protección de ramas y checklists. La gestión de configuración debe incluir no solo ramas, sino también nombres, rutas, variables de entorno y scripts de limpieza.

### 12.2 Control de cambios

El control de cambios mejoró con sub-issues y PRs, pero se afectó cuando se enviaron cambios sin validación funcional local. La trazabilidad debe mantenerse, pero también debe exigirse evidencia mínima de funcionamiento.

### 12.3 Logística del entorno

La logística del entorno fue problemática en M2 por diferencias Windows/Linux. El cierre con Docker Compose permite reducir ese riesgo. Para futuros ciclos, el entorno reproducible debe existir desde el inicio, no al final.

### 12.4 Estrategia de reutilización

La reutilización mejoró en M4 al recomendar verificar componentes existentes antes de crear nuevos. En M2, la falta de coordinación generó duplicación de componentes. La estrategia futura debe incluir un catálogo de componentes, hooks, utilidades y patrones reutilizables.

---

## 13. Reporte de Ingenieros

A nivel individual, el desempeño de los ingenieros mostró crecimiento en autonomía, trazabilidad y capacidad de respuesta. El equipo aprendió a dividir trabajo en tareas atómicas, documentar hallazgos, corregir problemas de integración y responder ante bloqueos críticos.

### 13.1 Contraste planeado vs. ejecutado

En general, el equipo ejecutó los objetivos principales de cada milestone, pero el esfuerzo real fue mayor al planeado debido a retrabajo, riesgos no anticipados y validaciones tardías. Esto evidencia que la planeación debe incorporar buffers técnicos y capacidad real.

### 13.2 Calidad del trabajo

La calidad del trabajo mejoró con cada ciclo. Al final, el producto tenía más controles, mejor arquitectura y mayor reproducibilidad. No obstante, la calidad dependió en exceso de correcciones reactivas en algunos momentos.

### 13.3 Oportunidades de mejora personal

Cada integrante debe fortalecer:

- Validación local antes de subir cambios.
- Comunicación temprana de bloqueos.
- Documentación de decisiones técnicas.
- Revisión de criterios de aceptación antes de implementar.
- Uso disciplinado de issues, commits y PRs.
- Conciencia de seguridad y manejo de secretos.

---

## 14. Reflexión Final del Trabajo en Grupo

### 14.1 Comunicación

La comunicación fue irregular al inicio y mejoró cuando se combinó autonomía con trazabilidad. Discord sirvió como canal de desbloqueo, pero el equipo necesitó más espacios de sincronización técnica en momentos clave. La comunicación más efectiva ocurrió en el M4, cuando el equipo respondió de forma asíncrona al bloqueo de SonarCloud.

### 14.2 Calidad del trabajo de los integrantes

La calidad individual fue aumentando a medida que los roles se hicieron más claros y los criterios de calidad más explícitos. El equipo mostró capacidad de aprendizaje y adaptación, especialmente en QA, DevOps y arquitectura.

### 14.3 Planeación y seguimiento

La planeación mejoró con Scrum Poker y sub-issues, pero debe seguir fortaleciendo la identificación de riesgos. El seguimiento mediante GitHub fue una buena práctica y debe mantenerse.

### 14.4 Mitigación de riesgos

La mitigación fue inicialmente reactiva, pero se volvió más estructurada. El equipo debe pasar de detectar riesgos durante el daño a identificarlos durante el Sprint Planning.

### 14.5 Relación con tecnologías

El equipo aprendió a trabajar con MERN, MongoDB Atlas, Docker, GitHub Actions, SonarCloud y patrones de diseño. La relación con estas tecnologías fue progresiva: primero generaron fricción, luego se volvieron parte de la solución.

---

## 15. Retrospectiva Starfish Final

### ⭐ Seguir haciendo

| Acción | Justificación |
|---|---|
| Mantener trazabilidad entre issues, commits, Pull Requests y entregables. | Permite reconstruir el avance del proyecto y justificar decisiones con evidencia. |
| Aplicar patrones de diseño cuando exista una necesidad real de desacoplamiento. | Mejora la mantenibilidad y evita crecimiento desordenado del código. |
| Usar QA con reportes reproducibles, evidencia y pasos claros. | Reduce tiempos de corrección y mejora la calidad del producto. |
| Ejecutar análisis estático y pipeline de CI/CD en cada integración. | Convierte la calidad en una práctica continua. |
| Trabajar con datos persistentes y escenarios cercanos al uso real. | Permite detectar errores que no aparecen con datos simulados simples. |

### ➕ Comenzar a hacer

| Acción | Justificación |
|---|---|
| Definir el DoD antes de iniciar cada sprint. | Evita interpretaciones distintas de “terminado”. |
| Configurar `.env.example`, hooks de secretos y política de variables desde el Día 1. | Previene exposición de credenciales y retrabajo de seguridad. |
| Incluir pruebas E2E y validación responsive desde la planeación. | Mejora cobertura de flujos reales y experiencia de usuario. |
| Documentar datos demo con `OWNER_EMAIL` coherente. | Evita falsos bugs por datos mal configurados. |
| Estandarizar comandos de limpieza como `docker compose down -v`. | Garantiza entornos limpios para QA y reproducción de errores. |

### ➖ Dejar de hacer

| Acción | Justificación |
|---|---|
| Abrir Pull Requests sin validación funcional local. | El pipeline no valida por completo la lógica de negocio. |
| Construir componentes dependientes antes de tener su infraestructura base. | Genera retrabajo y dependencias invertidas. |
| Subir credenciales o cadenas de conexión al repositorio. | Representa un riesgo crítico de seguridad. |
| Depender de supuestos implícitos sobre rutas, nombres o datos. | Los supuestos distintos generan bugs de integración. |
| Agregar cobertura de pruebas únicamente al cierre. | Produce pruebas apresuradas y deja riesgos sin detectar durante el desarrollo. |

### 🔼 Más de

| Acción | Justificación |
|---|---|
| Realizar revisiones técnicas tempranas de dependencias entre componentes. | Previene bloqueos como Toasts sin ToasterLayout. |
| Usar Scrum Poker y revisión de capacidad real. | Mejora la precisión de estimaciones. |
| Documentar decisiones técnicas en el momento en que se toman. | Reduce pérdida de contexto para postmortems y mantenimiento. |
| Revisar seguridad en Sprint Planning. | Evita tratar secretos y vulnerabilidades como tareas finales. |
| Ejecutar pruebas manuales guiadas además del pipeline. | Complementa la automatización con criterio humano. |

### 🔽 Menos de

| Acción | Justificación |
|---|---|
| Estimar con optimismo sin considerar parciales, carga académica o retrabajo. | Distorsiona la capacidad real del equipo. |
| Resolver problemas de entorno de forma individual y no documentada. | Multiplica errores tipo “funciona en mi máquina”. |
| Crear componentes nuevos sin revisar si ya existe una alternativa reutilizable. | Aumenta deuda técnica y duplicación. |
| Acumular cierres masivos al final del milestone. | Reduce tiempo de corrección y eleva presión de entrega. |
| Usar datos de prueba sin reglas claras. | Puede simular fallos inexistentes en la lógica del sistema. |

---

## 16. PIP Final – Plan de Mejora del Proceso

| Prioridad | Acción de mejora | Problema que corrige | Responsable sugerido | Criterio de éxito |
|---|---|---|---|---|
| Alta | Definir y aprobar DoD al inicio de cada sprint | Historias cerradas con criterios ambiguos | QA Lead + Scrum Master | Todas las issues incluyen checklist de DoD antes de pasar a Done |
| Alta | Exigir validación funcional local antes de abrir PR | PRs que pasan pipeline pero fallan en lógica de negocio | Scrum Master + QA Lead | Todo PR incluye evidencia local: captura, video corto o pasos ejecutados |
| Alta | Configurar `.env.example` y hooks de detección de secretos desde el Día 1 | Credenciales hardcodeadas y hallazgos de seguridad tardíos | DevOps + Configuration Manager | Pipeline y hooks bloquean secretos antes de merge |
| Alta | Mantener pipeline mínimo desde el primer milestone | Errores detectados tarde | DevOps Engineer | Build, lint y análisis básico corren en cada PR |
| Media | Estandarizar naming, rutas e importaciones con ESLint | Bugs por `useAlert` vs. `useAlerts` y rutas inconsistentes | Configuration Manager | El linter falla ante nombres/importaciones fuera de convención |
| Media | Diseñar mapa de rutas y menús antes de construir vistas | Supuestos distintos sobre navegación | Product Owner + Frontend responsables | Documento de rutas aprobado antes de historias visuales |
| Media | Incorporar criterios responsive en historias visuales | Fallos en componentes como StatusBadge móvil | Product Owner + QA Lead | Cada historia UI incluye escenario desktop y móvil |
| Media | Definir guía de datos demo con `OWNER_EMAIL` coherente | Alertas inconsistentes por datos de prueba mal configurados | Product Owner + QA Lead | QA ejecuta pruebas con dataset documentado y versionado |
| Media | Documentar protocolo de limpieza con `docker compose down -v` | Volúmenes persistentes contaminan pruebas | DevOps + Configuration Manager | README incluye limpieza y QA la ejecuta antes de ciclos críticos |
| Media | Crear pruebas E2E para flujos críticos | Pruebas unitarias no cubren flujos completos | QA Lead + DevOps | Al menos login, flota, documentos y alertas tienen escenario E2E |
| Baja | Mantener catálogo de componentes reutilizables | Duplicación de UI y layouts | Equipo de desarrollo | Antes de crear componente nuevo se verifica catálogo existente |
| Baja | Registrar decisiones técnicas durante el sprint | Evidencia incompleta al cierre | Scrum Master + todos los roles | Cada decisión relevante queda asociada a issue, PR o documento técnico |

---

## 17. Conclusiones Finales

El proyecto Drive Control / Syntix Tech evidencia una evolución real del equipo en términos técnicos, metodológicos y de calidad. Al inicio, el mayor reto era coordinarse, definir qué significaba “terminado” y evitar integraciones inestables. Al cierre, el equipo contaba con arquitectura más limpia, persistencia en nube, QA formalizado, pipeline de CI/CD, análisis estático, Docker Compose y alertas documentales conectadas a datos reales.

La principal fortaleza del equipo fue su capacidad de aprendizaje entre milestones. Cada problema importante produjo una mejora concreta: la falta de DoD llevó a checklists; la interoperabilidad llevó a pensar en entornos homogéneos; las credenciales hardcodeadas llevaron a políticas de secretos; el Quality Gate fallido llevó a una comprensión más madura de la diferencia entre automatización y validación funcional.

La principal debilidad fue la tendencia a descubrir algunos riesgos tarde. Muchos problemas no fueron imposibles de prever; simplemente no estaban integrados en la planeación inicial. Por eso, el mayor aprendizaje final es que la calidad no debe aparecer como una fase de cierre, sino como una condición de entrada para cada historia, cada rama, cada PR y cada entrega.

El equipo finaliza el ciclo con un producto funcional y con una comprensión más sólida del proceso de ingeniería de software. El postmortem final demuestra que el valor del proyecto no está únicamente en lo que se construyó, sino en cómo el equipo aprendió a construir mejor.

---

## 18. Resumen Ejecutivo Corto para Presentación

Drive Control / Syntix Tech evolucionó durante cuatro milestones desde una base funcional inicial hasta un producto final con alertas documentales dinámicas, persistencia en MongoDB Atlas, arquitectura desacoplada con patrones GoF, QA formalizado y pipeline de CI/CD con GitHub Actions, SonarCloud y DockerHub. El equipo aprendió que la calidad no depende únicamente de que el código compile, sino de contar con DoD, trazabilidad, validación local, seguridad desde el inicio, datos de prueba coherentes, pruebas incrementales y automatización bien integrada. El principal resultado del postmortem es un PIP final que convierte los problemas vividos —rutas rotas, interoperabilidad, credenciales hardcodeadas, Quality Gate fallido y datos demo inconsistentes— en acciones concretas para futuros ciclos de desarrollo.
