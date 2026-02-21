````markdown
# DriveControl / AutoMinder Enterprise  
## SYNTIX TECH — Blindaje operativo para flotas mediante cumplimiento documental

![DriveControl Banner](https://github.com/user-attachments/assets/70b5b3d2-98c2-4d25-995a-783896a2b28b)

**Propuesta de valor:** Transformamos la gestión documental de flotas en una ventaja operativa, disminuyendo el riesgo de inmovilizaciones y multas mediante automatización del cumplimiento, visibilidad en tiempo real y alertas preventivas.

---

# 👥 Equipo

## Roles y Responsabilidades (Equipo SYNTIX)

| Miembro                      | GitHub                                         | Rol                              |
|-----------------------------|-----------------------------------------------|----------------------------------|
| Sebastian Ramirez Maldonado | [@Sarm-m](https://github.com/Sarm-m)           | Scrum Master                     |
| Samuel Freile               | [@samuelfl680](https://github.com/samuelfl680) | Configuration Manager            |
| Sebastian Rodriguez Ramirez | [@juserora](https://github.com/juserora)       | Quality Assurance Lead (QA Lead) |
| Solon Losada                | [@solonlosada2006](https://github.com/solonlosada2006) | DevOps Engineer                  |
| Sebastian Vargas            | [@juanvargax](https://github.com/juanvargax)   | Product Owner y Sprint Planner   |

### Roles y responsabilidades

- **Scrum Master:** facilita ceremonias Scrum, seguimiento del sprint y gestión de impedimentos.  
- **Product Owner y Sprint Planner:** prioriza el backlog, define alcance del sprint y valida entregables.  
- **Configuration Manager:** administración del repositorio, control de versiones, Gitflow y consistencia documental.  
- **DevOps Engineer:** soporte a automatización, integración y buenas prácticas de entrega.  
- **QA Lead:** revisión de calidad funcional, técnica y documental; verificación de criterios de evaluación.

---

# 📌 Contenido

1. [Descripción](#-descripción)  
2. [Motivación](#-motivación)  
3. [Problema que resuelve](#-problema-que-resuelve)  
4. [Usuarios objetivo](#-usuarios-objetivo)  
5. [Propuesta de valor y diferenciación](#-propuesta-de-valor-y-diferenciación)  
6. [Alcance del MVP](#-alcance-del-mvp)  
7. [Funcionalidades](#-funcionalidades)  
8. [Tecnología y enfoque](#-tecnología-y-enfoque)  
9. [Estructura del repositorio](#-estructura-del-repositorio)  
10. [Requisitos](#-requisitos)  
11. [Instalación](#-instalación)  
12. [Ejecución](#-ejecución)  
13. [Pruebas](#-pruebas)  
14. [Wiki y enlaces](#-wiki-y-enlaces)  
15. [Licencia](#-licencia)  
16. [Contexto académico](#-contexto-académico)  

---

# 📝 Descripción

DriveControl / AutoMinder Enterprise es una solución orientada al seguimiento y control del cumplimiento documental de flotas de transporte (logística, carga y operación empresarial).

Su objetivo es reducir riesgos operativos —multas e inmovilizaciones— asociados al vencimiento de documentos críticos como SOAT, Tecnomecánica y licencias.

En escenarios reales, el control documental suele gestionarse manualmente (hojas de cálculo, recordatorios dispersos o validación por memoria), generando errores y baja visibilidad. DriveControl centraliza la información y la transforma en una vista operativa accionable.

Proyecto desarrollado como iniciativa académica dentro de la asignatura **Fundamentos de Ingeniería de Software**.

---

# 🎯 Motivación

En el sector transporte, un vehículo detenido implica pérdidas económicas y retrasos logísticos.  
La gestión documental es obligatoria por ley, pero suele ejecutarse de forma reactiva.

DriveControl propone un enfoque preventivo:  
✔ Visualizar el estado legal de la flota en segundos.  
✔ Anticipar vencimientos mediante alertas.  
✔ Reducir riesgos antes de que impacten la operación.

---

# ⚠ Problema que resuelve

- Falta de seguimiento estructurado de documentos obligatorios.  
- Manejo manual de fechas y estados.  
- Baja visibilidad global del estado de la flota.  
- Ausencia de alertas preventivas.  
- Riesgo de sanciones e inmovilizaciones por vencimientos no detectados.

---

# 👤 Usuarios objetivo

- Gerentes de logística y coordinadores de transporte.  
- Personal administrativo responsable de cumplimiento y renovaciones.  
- Conductores (consulta de estado y alertas).

---

# 💡 Propuesta de valor y diferenciación

DriveControl convierte la gestión documental en un proceso operativo estructurado mediante:

1. **Visibilidad inmediata:** dashboard tipo semáforo por vehículo (al día / próximo a vencer / vencido).  
2. **Prevención:** alertas programadas basadas en fechas de vencimiento.  
3. **Preparación para integración futura:** simulación de consulta por placa.

A diferencia de hojas de cálculo aisladas o recordatorios genéricos, el sistema ofrece una vista ejecutiva centralizada con enfoque preventivo.

---

# 🚀 Alcance del MVP

La demo académica incluye:

1. **Dashboard de cumplimiento tipo semáforo**
   - Verde: al día  
   - Amarillo: próximo a vencer  
   - Rojo: vencido  

2. **Gestión de flotas**
   - Registro de vehículos  
   - Asociación vehículo–conductor–licencia  

3. **Simulación de alertas**
   - Notificaciones basadas en fechas de vencimiento  

4. **Validación por placa (mock)**
   - Simulación de integración con fuentes oficiales  

---

# 🛠 Funcionalidades

## Cumplimiento y visibilidad
- Semáforo por vehículo según vigencia documental  
- Filtros por estado  

## Gestión de flota
- CRUD de vehículos  
- Asociación vehículo–conductor–licencia  
- Búsqueda por placa  

## Gestión documental (MVP)
- Gestión de SOAT  
- Registro de fechas de vigencia  
- Cálculo automático de estado  

## Simulación de integración
- Validación por placa mediante mock data  

---

# 🧩 Tecnología y enfoque

## Stack del MVP
- HTML  
- CSS  
- JavaScript (Vanilla)  
- LocalStorage  

## Enfoque de ingeniería
- Metodología Scrum académico  
- Gestión con GitHub Issues y Projects  
- Milestones por sprint  
- Flujo de ramas: feature → develop → main  

---

# 📂 Estructura del repositorio

```text
frontend/   → interfaz y dashboard  
backend/    → lógica de negocio (si aplica)  
docs/       → documentación, UML y evidencias  
assets/     → recursos gráficos  
````

---

# 📋 Requisitos

* Navegador actualizado (Chrome, Edge o Firefox)
* Visual Studio Code (recomendado)
* Git

---

# ⚙ Instalación

```bash
git clone https://github.com/puj-course/FIS_2610_3517_G4.git
cd FIS_2610_3517_G4
```


# 🔗 Wiki y enlaces

* Repositorio: [https://github.com/puj-course/FIS_2610_3517_G4](https://github.com/puj-course/FIS_2610_3517_G4)
* Wiki: [https://github.com/puj-course/FIS_2610_3517_G4/wiki](https://github.com/puj-course/FIS_2610_3517_G4/wiki)
* Issues: [https://github.com/puj-course/FIS_2610_3517_G4/issues](https://github.com/puj-course/FIS_2610_3517_G4/issues)
* Projects: [https://github.com/puj-course/FIS_2610_3517_G4/projects](https://github.com/puj-course/FIS_2610_3517_G4/projects)

---

# 📄 Licencia

Proyecto desarrollado con fines académicos.

---

# 🎓 Contexto académico

* **Asignatura:** Fundamentos de Ingeniería de Software
* **Institución:** Pontificia Universidad Javeriana
* **Proyecto:** DriveControl / AutoMinder Enterprise
* **Equipo:** SYNTIX TECH
* **Año:** 2026

© 2026 SYNTIX TECH
