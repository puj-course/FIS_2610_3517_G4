# Postmortem – Milestone 1: Base Funcional del Sistema
**Proyecto:** Drive Control / Syntix Tech  
**Stack:** MERN (MongoDB, Express, React, Node.js)  
**Equipo:**

| Nombre | Usuario | Rol |
|---|---|---|
| Sebastián Ramírez Maldonado | @Sarm-m | Scrum Master |
| Samuel Freile | @samuelfl680 | Configuration Manager |
| Sebastián Rodríguez Ramírez | @Juserora | Quality Assurance Lead |
| Solón Losada | @solonlosada2006 | DevOps Engineer |
| Sebastián Vargas | @juanvargax | Product Owner / Sprint Planner |

---

## 1. Resumen Ejecutivo

El Milestone 1 tuvo como objetivo establecer la base funcional del sistema sobre el stack MERN, asegurando el flujo de trabajo colaborativo mediante GitFlow, e implementando los módulos iniciales de autenticación (Login/Registro) y la estructura visual del Dashboard. El equipo logró entregar estos componentes, aunque con retrasos atribuibles a una subestimación del esfuerzo real y a la carga académica concurrente del calendario de parciales universitarios. Las lecciones de este hito sentaron las bases metodológicas y técnicas para los sprints siguientes.

---

## 2. Contexto de Ingeniería y Negocio

El objetivo de negocio en este primer hito era demostrar la viabilidad técnica de la plataforma mediante el acceso controlado de usuarios y la visualización de la interfaz principal. Técnicamente, el reto consistió en alinear al equipo alrededor de un stack nuevo para varios de sus miembros y en establecer convenciones de trabajo colaborativo desde cero.

La prioridad del sprint fue el núcleo de autenticación segura y el Dashboard base. Sin embargo, la ausencia de un criterio de aceptación técnico unificado (Definition of Done) generó ambigüedad sobre cuándo una historia de usuario podía considerarse realmente terminada, lo que impactó directamente la velocidad de entrega.

---

## 3. Revisión de Datos del Proceso y Calidad

### Desempeño real vs. planeado

- Las historias de usuario relacionadas con Login y Registro fueron completadas, pero con un tiempo de ciclo mayor al estimado, principalmente por retrabajos derivados de rutas del frontend rotas al integrar código sin validación previa de compilación.
- El Dashboard base fue entregado en su versión mínima, sin alcanzar algunos criterios visuales inicialmente planteados.
- No se utilizó un criterio de aceptación formalizado, lo que generó discrepancias entre lo que cada integrante consideraba "listo" y lo que el Product Owner esperaba.

### Lecciones aprendidas

- La estimación de esfuerzo debe contemplar la capacidad real del equipo, incluyendo compromisos académicos externos.
- Integrar código directamente sobre el repositorio sin verificar la compilación local es una fuente recurrente de deuda técnica inmediata.
- La falta de un DoD unificado es equivalente a no tener criterios de calidad: cada miembro trabajó con su propia interpretación de "terminado".

---

## 4. Reporte de Roles

### 4.1 Reporte del Scrum Master – Sebastián Ramírez Maldonado (@Sarm-m)

Durante este primer milestone, el Scrum Master enfrentó el reto de consolidar un equipo que aún estaba alineando sus ritmos de trabajo y sus herramientas de comunicación. Las Daily Standups no se realizaron con la frecuencia ni la consistencia requeridas, lo que generó silos de información entre los integrantes. Se logró mantener la estructura de GitFlow activa desde el inicio, lo cual fue un acierto significativo. Para el siguiente ciclo, se debe formalizar el canal de comunicación principal (Discord) y establecer una agenda mínima para las sesiones sincrónicas, garantizando que los impedimentos se escalen oportunamente y no bloqueen el avance del equipo por períodos prolongados.

### 4.2 Reporte del Product Owner / Sprint Planner – Sebastián Vargas (@juanvargax)

La planeación del sprint inicial careció de amortiguadores de tiempo frente a la carga académica externa del equipo. Las historias de usuario fueron estimadas con optimismo sin considerar la capacidad real disponible en la semana de parciales. El valor de negocio entregado fue parcial: el flujo de autenticación quedó funcional, pero el Dashboard base no alcanzó los criterios visuales definidos en la refinación inicial. Para los siguientes milestones, el Sprint Planner debe incorporar un factor de capacidad real como insumo obligatorio de la planeación, y las historias de usuario deben descomponerse en sub-tareas técnicas verificables antes de iniciar el sprint.

### 4.3 Reporte del Configuration Manager – Samuel Freile (@samuelfl680)

El Configuration Manager estableció exitosamente la estructura de GitFlow desde el inicio del proyecto, lo cual fue fundamental para evitar conflictos mayores durante la integración de ramas. Sin embargo, se detectaron casos en los que los integrantes subieron código con estados incompletos o realizaron merges sin revisión previa, lo que introdujo inestabilidades en la rama principal. Para el siguiente ciclo, se debe implementar una política explícita de protección de ramas y una checklist de pre-merge que impida integrar código sin que el flujo de compilación local haya sido verificado previamente.

### 4.4 Reporte del Quality Assurance Lead – Sebastián Rodríguez Ramírez (@Juserora)

La ausencia de un Definition of Done unificado fue el principal hallazgo de calidad en este milestone. Sin un criterio claro de aceptación, las historias de usuario fueron marcadas como completas sin pasar por una verificación funcional estructurada. Se identificaron rutas del frontend rotas tras la integración de código no validado, lo que hubiera podido prevenirse con una checklist de pre-commit básica. Para el Milestone 2, el QA Lead debe liderar la definición formal del DoD del equipo y establecer un proceso mínimo de revisión funcional antes de cerrar cualquier historia de usuario.

### 4.5 Reporte del DevOps Engineer – Solón Losada (@solonlosada2006)

En este primer milestone, el rol de DevOps se concentró en sentar las bases del entorno de desarrollo compartido. No se contó con un pipeline de integración continua activo, lo que permitió que código con errores de rutas llegara a la rama principal sin detección automática. La infraestructura de desarrollo fue configurada manualmente por cada integrante, generando inconsistencias entre entornos. Para el siguiente ciclo, se debe priorizar la configuración de al menos un paso básico de validación automática (build check) que actúe como primer filtro antes de que cualquier rama sea integrada.

---

## 5. Identificación de Causa Raíz

La causa raíz principal de los problemas del Milestone 1 fue la **ausencia de un Definition of Done unificado y verificable**, combinada con la **integración de código sin validación previa de compilación local**. Estas dos condiciones operaron de forma sinérgica: sin un DoD claro, no había un estándar que obligara a verificar la compilación antes de integrar, y sin esa verificación, los errores de rutas del frontend llegaron al repositorio compartido, generando retrabajos que consumieron tiempo del sprint.

Como causa secundaria, la **estimación de esfuerzo no consideró la capacidad real del equipo**, al ignorar la carga académica concurrente del calendario de parciales universitarios. Esto resultó en compromisos de sprint que el equipo no pudo honrar dentro del tiempo disponible.

---

## 6. Retrospectiva

El primer sprint del proyecto fue, en esencia, un proceso de autodescubrimiento como equipo. Cada integrante llegó con supuestos distintos sobre cómo se trabajaría, qué herramientas se usarían y cuán rápido fluiría el desarrollo. La realidad del sprint reveló que esos supuestos no estaban alineados: mientras algunos miembros avanzaban de forma autónoma, otros esperaban coordinación que nunca llegó de forma explícita.

El mayor aprendizaje no fue técnico sino metodológico: un equipo sin criterios compartidos de "terminado" no puede entregar con consistencia, independientemente de las habilidades individuales de sus miembros. La deuda metodológica acumulada en este hito fue tan costosa en tiempo como los propios errores técnicos.

En términos positivos, la adopción de GitFlow desde el inicio fue una decisión que evitó conflictos de integración mayores. La autonomía individual de los integrantes permitió avanzar en paralelo, y la comunicación a través de Discord, aunque irregular, funcionó como canal de desbloqueo para dudas puntuales. Estos son los cimientos sobre los cuales el equipo puede construir una disciplina más sólida en los milestones siguientes.

El equipo reconoce que la carga académica externa es una variable real que no puede ignorarse en la planeación. Incorporarla como factor explícito en la estimación de capacidad no es una excusa, sino una práctica de ingeniería de software responsable y realista.

---

## 7. Retrospectiva Starfish

> **Reglas aplicadas:** cada frase inicia con un verbo en infinitivo; ninguna frase se repite entre ejes.

### ⭐ Seguir Haciendo

| # | Frase | Justificación |
|---|---|---|
| 1 | Mantener la estructura de GitFlow activa desde el inicio del proyecto. | Permitió aislar el trabajo de cada integrante en ramas propias y evitó conflictos directos en la rama principal durante el sprint. |
| 2 | Fomentar la autonomía individual de los integrantes para avanzar en paralelo. | Varios módulos pudieron desarrollarse de forma simultánea gracias a que cada miembro tenía claridad sobre su tarea asignada. |
| 3 | Usar Discord como canal principal de comunicación asíncrona del equipo. | Permitió resolver dudas puntuales y desbloquear a integrantes sin necesidad de convocar reuniones formales en cada ocasión. |
| 4 | Consolidar el núcleo técnico del stack MERN antes de agregar funcionalidades secundarias. | Establecer primero la autenticación y el Dashboard base como prioridades evitó dispersar el esfuerzo del equipo en features no críticas. |
| 5 | Dividir las historias de usuario en sub-tareas técnicas atómicas desde la planeación. | Facilita la asignación, el seguimiento y la verificación individual de cada componente del sprint. |

### ➕ Comenzar a Hacer

| # | Frase | Justificación |
|---|---|---|
| 1 | Definir y documentar un Definition of Done unificado antes de iniciar cada sprint. | La ausencia de este criterio fue la causa raíz principal de los problemas de calidad e integración del milestone. |
| 2 | Implementar una checklist de pre-commit que incluya verificación de compilación local. | Hubiera prevenido la integración de código con rutas rotas que generó retrabajos durante el sprint. |
| 3 | Establecer una política explícita de "1 issue = 1 cambio" en el repositorio. | Permite trazabilidad directa entre cada modificación del código y la tarea que la originó. |
| 4 | Planificar la capacidad real del equipo considerando la carga académica del periodo. | La semana de parciales no fue contemplada en la estimación inicial, lo que resultó en compromisos que el equipo no pudo cumplir. |
| 5 | Documentar las rutas de la API y los contratos de interfaz antes de comenzar el desarrollo. | Evita que diferentes integrantes asuman estructuras distintas que luego generan conflictos de integración. |
| 6 | Validar la compilación local de cada rama antes de abrir un Pull Request. | Es el control más básico y efectivo para evitar que errores triviales lleguen a la rama principal. |

### ➖ Dejar de Hacer

| # | Frase | Justificación |
|---|---|---|
| 1 | Integrar código al repositorio sin haber verificado previamente que compila correctamente. | Esta práctica introdujo rutas del frontend rotas que bloquearon el avance de otros integrantes. |
| 2 | Subir ramas personales con estados incompletos o parcialmente funcionales sin avisarlo al equipo. | Genera confusión sobre el estado real del sprint y puede bloquear la integración de otras ramas dependientes. |
| 3 | Postergar la creación de issues en GitHub hasta después de haber comenzado el desarrollo. | Sin la issue creada, no hay trazabilidad del trabajo realizado ni forma de hacer seguimiento al progreso real del sprint. |
| 4 | Realizar merges sobre ramas principales sin revisión previa de al menos un integrante. | Un merge no revisado es una puerta abierta a errores que, una vez en la rama principal, afectan a todo el equipo. |
| 5 | Ignorar las prácticas metodológicas del equipo bajo el argumento del estrés académico. | El estrés externo es una razón para ajustar la capacidad del sprint, no para abandonar el proceso acordado. |

### 🔼 Más de

| # | Frase | Justificación |
|---|---|---|
| 1 | Aplicar rigor en los procesos de Scrum, especialmente en la planeación y el cierre del sprint. | La falta de rigor en este milestone fue directamente proporcional a los retrasos y a la deuda metodológica acumulada. |
| 2 | Revisar los criterios de aceptación de cada historia de usuario en la sesión de refinación. | Evita que el equipo avance sobre supuestos distintos acerca de qué significa que una historia está terminada. |
| 3 | Realizar Dailies sincronizadas con una agenda mínima definida. | Mejora la visibilidad del estado del sprint y permite escalar impedimentos antes de que se conviertan en bloqueos. |
| 4 | Generar trazabilidad de los sprints vinculando commits, issues y Pull Requests explícitamente. | Permite al equipo y al instructor reconstruir la historia del desarrollo y evaluar el proceso con datos objetivos. |
| 5 | Aterrizar la planeación del sprint a escenarios realistas con base en la velocidad real del equipo. | Las estimaciones optimistas son la principal causa de sprints incompletos y de frustración en el equipo. |

### 🔽 Menos de

| # | Frase | Justificación |
|---|---|---|
| 1 | Aplazar tareas pendientes al siguiente sprint sin un análisis explícito del impacto. | Cada tarea aplazada sin análisis transfiere deuda técnica o funcional que se acumula y complica los sprints siguientes. |
| 2 | Depender de reuniones sincrónicas para resolver dudas que podrían resolverse de forma asíncrona. | Las reuniones no planificadas consumen tiempo valioso del sprint y no siempre generan el resultado esperado. |
| 3 | Generar estimaciones optimistas que no contemplan riesgos ni tiempos de retrabajo. | El retrabajo por rutas rotas en este milestone consumió una fracción significativa del tiempo disponible. |
| 4 | Mantener ramas personales sin push durante períodos prolongados. | El código que no está en el repositorio no puede ser revisado, integrado ni respaldado por el equipo. |
| 5 | Buscar información de forma dispersa sin una referencia técnica centralizada y acordada por el equipo. | Genera soluciones heterogéneas al mismo problema y dificulta la coherencia técnica del codebase. |

---

## 8. Plan de Mejora para el Milestone 2

| Acción | Responsable | Criterio de éxito |
|---|---|---|
| Definir y documentar el DoD del equipo antes del inicio del M2. | QA Lead (@Juserora) | DoD aprobado por todo el equipo en la sesión de planeación. |
| Implementar checklist de pre-commit con verificación de compilación local. | Configuration Manager (@samuelfl680) | Ningún PR abierto sin checklist completada. |
| Planificar el sprint con factor de capacidad real (descontar parciales y compromisos). | Product Owner (@juanvargax) | Sprint planning incluye tabla de disponibilidad por integrante. |
| Configurar un build check básico en el pipeline de CI. | DevOps Engineer (@solonlosada2006) | El pipeline rechaza automáticamente ramas que no compilan. |
| Establecer política de 1 issue = 1 cambio y comunicarla al equipo. | Scrum Master (@Sarm-m) | Todos los commits del M2 referencian una issue activa. |
