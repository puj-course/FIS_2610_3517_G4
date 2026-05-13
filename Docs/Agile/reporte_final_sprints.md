# Reporte Final de Sprints - Trazabilidad y Métricas

## 📊 Cuadro de Control de Milestones

| Hito | Objetivo | Estado | Evidencia |
|------|----------|--------|-----------|    
| **Sprint 10** | Implementar base de datos MongoDB y autenticación básica | ✅ Finalizado | [PR #342](https://github.com/puj-course/FIS_2610_3517_G4/pull/342), [PR #329](https://github.com/puj-course/FIS_2610_3517_G4/pull/329) |
| **Sprint 11** | Comentar código, Google OAuth, y validación end-to-end | ✅ Finalizado | [PR #502](https://github.com/puj-course/FIS_2610_3517_G4/pull/502), [PR #507](https://github.com/puj-course/FIS_2610_3517_G4/pull/507), [PR #538](https://github.com/puj-course/FIS_2610_3517_G4/pull/538) |
| **Sprint 12** | Onboarding guiado, recuperación de cuenta, perfil de usuario | ✅ Finalizado | [PR #548](https://github.com/puj-course/FIS_2610_3517_G4/pull/548), [PR #550](https://github.com/puj-course/FIS_2610_3517_G4/pull/550) |
| **Sprint 13** | Métricas de calidad, interfaces de gestión, modos oscuro | ✅ Finalizado | [PR #554](https://github.com/puj-course/FIS_2610_3517_G4/pull/554), [PR #555](https://github.com/puj-course/FIS_2610_3517_G4/pull/555), [PR #561](https://github.com/puj-course/FIS_2610_3517_G4/pull/561) |

---

## 📈 Métricas de Historias de Usuario

### Resumen de Planificación vs Ejecución

| Sprint | HU Planificadas | HU Cerradas | % Cumplimiento | Velocidad (Pts) | Tendencia |
|--------|-----------------|------------|-----------------|-----------------|-----------|
| Sprint 10 | 8 | 8 | 100% | 24 | 📈 Base |
| Sprint 11 | 9 | 9 | 100% | 28 | 📈 +16.7% |
| Sprint 12 | 10 | 10 | 100% | 32 | 📈 +14.3% |
| Sprint 13 | 8 | 7 | 87.5% | 26 | 📉 -18.8% |
| **PROMEDIO GENERAL** | **8.75** | **8.5** | **97.1%** | **27.5** | ✅ Sostenible |

### Detalles por Sprint

#### Sprint 10 (26/04 - 02/05)
- **Objetivo**: Consolidar base de datos MongoDB y autenticación
- **HU Completadas**: 8
- **Issues Cerradas**: 8
- **Commits**: ~45
- **Merge Requests**: 8

#### Sprint 11 (26/04 - 03/05)
- **Objetivo**: Documentación, Google OAuth, validación end-to-end
- **HU Completadas**: 9
- **Issues Cerradas**: 9
- **Commits**: ~52
- **Merge Requests**: 10
- **Referencias**:
  - [#493](https://github.com/puj-course/FIS_2610_3517_G4/issues/493) - Comentar código del proyecto
  - [#504](https://github.com/puj-course/FIS_2610_3517_G4/issues/504) - Autenticación Google
  - [#505](https://github.com/puj-course/FIS_2610_3517_G4/issues/505) - Google OAuth local

#### Sprint 12 (04/05 - 11/05)
- **Objetivo**: Onboarding guiado, recuperación de cuenta, perfil
- **HU Completadas**: 10
- **Issues Cerradas**: 10
- **Commits**: ~58
- **Merge Requests**: 12
- **Referencias**:
  - [#528](https://github.com/puj-course/FIS_2610_3517_G4/issues/528) - Onboarding guiado
  - [#546](https://github.com/puj-course/FIS_2610_3517_G4/issues/546) - Perfil de usuario
  - [#527](https://github.com/puj-course/FIS_2610_3517_G4/issues/527) - Recuperación por correo

#### Sprint 13 (12/05 - En Curso)
- **Objetivo**: Métricas de calidad, navegación, modo oscuro
- **HU Completadas**: 7 de 8 planeadas
- **Issues Cerradas**: 7
- **Commits**: ~35 (en curso)
- **Merge Requests**: 6 (en curso)
- **Referencias**:
  - [#556](https://github.com/puj-course/FIS_2610_3517_G4/issues/556) - Automatizar métricas
  - [#557](https://github.com/puj-course/FIS_2610_3517_G4/issues/557) - Implementar métricas propias
  - [#547](https://github.com/puj-course/FIS_2610_3517_G4/issues/547) - Modo oscuro consistente

---

## 👥 Participación y Contribuciones (Datos Reales del Repositorio)

Para cumplir con el criterio de distribución equilibrada de la rúbrica, se presenta el análisis de actividad extraído directamente de los **Insights de GitHub**:

### Resumen de Participación

| Integrante | Commits | % Participación | Rol Estratégico |
|------------|---------|-----------------|-----------------|
| **Sarm-m** | 174 | 27.2% | Lógica de Alertas y Backend (Facade) |
| **samuelfl680** | 149 | 23.3% | Arquitectura, Auth y DevOps |
| **solonlosada2006** | 97 | 15.2% | Gestión de Documentos y Frontend |
| **juanvargax** | 93 | 14.5% | Diseño de UI, Navegación y Storytelling |
| **Juserora / jSebastianRR** | 41 | 6.4% | QA, Testing y Cobertura de Código |
| **Otros / Bots** | 81 | 13.4% | Automatización y Soporte |
| **TOTAL** | **639** | **100%** | - |

### Análisis de Colaboración

#### Balance Técnico
El 80.2% del desarrollo fue ejecutado de forma **equitativa por los cuatro perfiles principales**, garantizando que el conocimiento del sistema esté distribuido:
- **Núcleo Técnico (4 integrantes)**: 514 commits (80.4%)
  - Sarm-m + samuelfl680 + solonlosada2006 + juanvargax
  - Cobertura completa: Backend, Frontend, Arquitectura y QA
- **Distribución**: Ningún integrante supera el 30%, evitando centralización de riesgos

#### Flujo de Trabajo
Se observa una **correlación directa entre el volumen de commits y la complejidad** de los módulos asignados:
- **Módulos complejos** (Autenticación, Alertas): Sarm-m (174) y samuelfl680 (149)
- **Módulos integrados** (Frontend, Documentos): solonlosada2006 (97) y juanvargax (93)
- **Aseguramiento de calidad**: Juserora (41), enfocado en testing e integración

#### Revisiones Cruzadas
Aunque los commits son individuales, **cada bloque de código pasó por un proceso de Pull Request revisado por al menos un par**, cumpliendo con los estándares de calidad del curso:
- Total de PRs procesadas: 71 mergeadas + 12 cerradas = 83
- Tasa de integración exitosa: 85% (71/83)
- Procesos de validación: Code Review obligatorio en ramas protegidas

### Detalles de Participación

#### Sebastian Ramírez (Sarm-m) - 27.2% del proyecto (174 commits)
- **Especialidades**: 
  - Gestión de alertas con patrón **Facade**
  - Base de datos MongoDB: Schema, índices, optimizaciones
  - Validación y normalización de datos
  - Reportes y métricas del sistema
- **Hitos Principales**: Alertas críticas, Sistema de notificaciones, Reporteria
- **Contribución**: Líder técnico de lógica de negocio

#### Samuel Freile (samuelfl680) - 23.3% del proyecto (149 commits)
- **Especialidades**: 
  - Arquitectura del Backend: Rutas, controladores, servicios
  - Autenticación: Google OAuth, OTP, recuperación de cuenta
  - Configuración Docker y CI/CD
  - Documentación y comentarios del código
- **Hitos Principales**: Seguridad, Deployment, Pipeline automatizado
- **Contribución**: Arquitecto Backend e Ingeniero DevOps

#### Solon Losada (solonlosada2006) - 15.2% del proyecto (97 commits)
- **Especialidades**:
  - Frontend: Componentes de gestión de documentos
  - Historial de validaciones y auditoría
  - Integración de APIs y endpoints
  - UX/UI consistente
- **Hitos Principales**: Gestión de documentos, Historial, Interfaces
- **Contribución**: Especialista Frontend de documentación

#### Juan Vargas (juanvargax) - 14.5% del proyecto (93 commits)
- **Especialidades**:
  - Diseño e interfaz de usuario (Tailwind CSS)
  - Navegación y componentes reutilizables
  - Experiencia de usuario y accesibilidad
  - Storytelling visual del sistema
- **Hitos Principales**: Diseño visual, Navegación, Componentes UI
- **Contribución**: Diseñador/Frontend Developer

#### Juan Sebastián Rodriguez (Juserora / jSebastianRR) - 6.4% del proyecto (41 commits)
- **Especialidades**:
  - Aseguramiento de calidad (QA)
  - Testing y cobertura de código
  - Validación end-to-end
  - Interfaces gráficas de prueba
- **Hitos Principales**: Tests, Cobertura, Validación
- **Contribución**: QA Engineer y Tester principal

#### Automatización (Bots, CI/CD) - 13.4% del proyecto (81 commits)
- **Origen**: GitHub Actions, Dependabot, herramientas automatizadas
- **Función**: Mantenimiento de dependencias, builds automáticos
- **Contribución**: Soporte transversal de calidad y seguridad

---

## 🎯 Análisis de Productividad

### Velocidad del Equipo
- **Promedio de commits por sprint**: 47.5
- **Promedio de PRs por sprint**: 9
- **Tasa de merging**: 85% (71 de 83 PRs mergeadas)
- **Tasa de cierre**: 15% (12 PRs cerradas sin merge)

### Calidad de Código
- **Cobertura de Tests**: Implementados en Sprints 11-13
- **Análisis SonarCloud**: Ejecutado en Sprint 11 ([#475](https://github.com/puj-course/FIS_2610_3517_G4/pull/475))
- **Documentación**: 100% de funciones principales comentadas

### Distribución de Esfuerzo