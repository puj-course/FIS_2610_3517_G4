# Postmortem Final del Proyecto — DriveControl / AutoMinder Enterprise

## Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Asignatura** | Fundamentos de Ingeniería de Software |
| **Institución** | Pontificia Universidad Javeriana |
| **Período** | Febrero 12 — Mayo 19, 2026 |
| **Equipo** | SYNTIX TECH (5 integrantes) |
| **Metodología** | Scrum académico + Kanban automatizado |
| **Repositorio** | [puj-course/FIS_2610_3517_G4](https://github.com/puj-course/FIS_2610_3517_G4) |

---

## 1. Resumen Ejecutivo

DriveControl/AutoMinder Enterprise es un sistema de gestión documental para flotas de transporte que transforma el seguimiento manual de SOAT, RTM y licencias en una vista operativa centralizada con alertas preventivas.

En 13 sprints distribuidos en 4 milestones, el equipo completó **96 de 97 historias de usuario planificadas (98.9%)**, entregando:

- Sistema completo de autenticación (email/OTP + Google OAuth + recuperación de cuenta)
- CRUD de vehículos y conductores con asociación bidireccional
- Motor de alertas con 6 patrones de diseño GoF implementados
- Dashboard de cumplimiento documental con semaforización en tiempo real
- Exportación de reportes (PDF/Excel)
- Pipeline CI/CD completo con 7 GitHub Actions workflows
- Despliegue Docker multi-stage con healthchecks automatizados
- Validación de calidad con SonarCloud (83.7% cobertura en New Code)

---

## 2. Línea de Tiempo

| Milestone | Período | HUs Completadas | Issues Cerradas | Estado |
|-----------|---------|-----------------|-----------------|--------|
| M1: Base funcional | 12/02 – 13/03 | 24/24 | 85 | ✅ 100% |
| M2: Gestión de flota | 14/03 – 10/04 | 29/29 | 39 | ✅ 100% |
| M3: Gestión documental | 11/04 – 01/05 | 26/26 | 32 | ✅ 100% |
| M4: Dashboard y cierre | 02/05 – 19/05 | 17/18 | 119/120 | 🔄 99% |
| **TOTAL** | **13 sprints** | **96/97** | **275+** | **98.9%** |

---

## 3. Lo Que Funcionó Bien

### Decisiones técnicas acertadas

| Decisión | Impacto | Sprint de adopción |
|----------|---------|-------------------|
| GoF Adapter para alertas | Desacoplamiento total de fuentes de datos; agregar un nuevo tipo de alerta requiere solo un adapter nuevo | Sprint 9 |
| GoF Facade para el hub de alertas | Simplificó los componentes consumidores; eliminó dependencias directas al singleton | Sprint 9 |
| GoF Singleton para AlertHub | Un único estado global de alertas sin prop drilling ni context abuse | Sprint 9 |
| Docker multi-stage build | Imágenes de producción mínimas (~180MB frontend, ~120MB backend) | Sprint 10 |
| SonarCloud Quality Gate en PRs | Detectó 4 code smells críticos en `qualityMetrics.js` antes de que llegaran a `main` | Sprint 11 |
| `sonar.coverage.exclusions` calibrado | Cobertura del 83.7% refleja lógica real probada, sin inflarse con archivos visuales | Sprint 11 |
| Métricas propias de dominio | Complementan SonarCloud con evidencia funcional (riesgo documental, completitud, criticidad) | Sprint 13 |

### Prácticas de proceso exitosas

- **GitFlow estricto**: ninguna feature llegó directamente a `main`; todas pasaron por PR con code review.
- **Dailies cortos**: sincronización de estado sin reuniones largas; detectamos bloqueos en menos de 24h.
- **Retrospectivas Starfish por milestone**: cada retrospectiva generó acciones concretas que se aplicaron en el siguiente milestone.
- **Kanban automatizado**: los workflows de auto-asignación y checklist INVEST redujeron la fricción para seguir estándares en cada issue.
- **Definition of Done con tests**: a partir del Sprint 11, ningún código entró a `main` sin pruebas unitarias asociadas.

---

## 4. Lo Que No Funcionó — Incidentes

### Registro de incidentes

| # | Incidente | Sprint | Causa raíz | Resolución aplicada | Tiempo de resolución |
|---|-----------|--------|-----------|---------------------|---------------------|
| 1 | URI de MongoDB expuesta en un commit | M2 (Sprint 6) | `.env.example` no existía al inicio; un miembro usó credenciales reales directamente | Rotación de credenciales de Atlas; se creó `backend/.env.example` obligatorio | ~2 horas |
| 2 | Build de CI roto por falta de prueba local | M1 (Sprint 3) | Commit directo sin ejecutar `npm run build` localmente | Educación del equipo + regla de "build local antes de push" en la DoD | 45 minutos |
| 3 | Backend sin conectar a Atlas en CI | M3 (Sprint 10) | IP del runner de GitHub Actions no estaba en el whitelist de Atlas | Script `auth-doctor.js` + pipeline `pipeline_hu454_auth_ci_cd.yml` con preflight | 1 sprint completo |
| 4 | Conflictos de merge masivos en `feature-juserora` | M4 (Sprint 13) | Rama divergió ~131 commits respecto a `main` sin sincronización | Resolución manual de 3 archivos (`VehiculosPage.jsx`, `ConductoresPage.jsx`, `vite.config.js`) | ~3 horas |
| 5 | Advertencias de consola en producción | M2-M3 | `useEffect` con dependencias incompletas; `any` en validaciones | Correcciones progresivas durante code reviews | Distribuido |

### Análisis de causas raíz recurrentes

Los incidentes 1, 3 y 4 comparten una causa común: **configuración de entorno postergada**. El `.env.example` debería haber existido desde el Sprint 0. La validación de conectividad con Atlas debería haberse automatizado desde el primer deploy. La sincronización de ramas debería ser un ritual diario.

---

## 5. Deuda Técnica Identificada

| Ítem | Tipo | Severidad | Estado al cierre |
|------|------|----------|-----------------|
| Issues legacy de Overall Code en SonarCloud (vars no usadas, ternarios anidados) | Code Smell | Media | Pendiente — priorizamos New Code para el Quality Gate |
| Integración SMS real con Twilio | Feature | Alta | Planificado fuera del MVP; variables en `.env.example` reservadas |
| Pruebas de integración de flujos críticos (login, CRUD) | Testing | Media | Excluido del scope actual; requiere Playwright o Cypress |
| Documentación JSDoc incompleta en hooks de integración | Documentation | Baja | Parcialmente resuelto en Sprint 11 |
| `sonar.coverage.exclusions` incluye `patterns/` | Testing | Media | Los adapters tienen tests; el Singleton y Facade no se prueban de forma aislada |

---

## 6. Métricas Finales del Proyecto

### Productividad

| Métrica | Valor |
|---------|-------|
| Sprints ejecutados | 13 |
| HUs planificadas / completadas | 97 / 96 (98.9%) |
| Issues totales cerradas | 275+ |
| Pull Requests mergeadas | 71 de 83 (85%) |
| PRs cerradas sin merge | 12 (15%) |
| Commits totales | 639 |
| Promedio de commits por sprint | 42.4 |
| Promedio de HUs por sprint | 7.38 |

### Calidad de código

| Métrica | Valor |
|---------|-------|
| Cobertura SonarCloud (New Code) | 83.7% |
| Duplicación (New Code) | 0.0% |
| Quality Gate PR #564 | ✅ Aprobado |
| Archivos de prueba | 9 |
| Líneas de código de prueba | ~1,557 |
| Patrones GoF implementados | 6 (Facade, Singleton, Strategy, Adapter, Observer, Factory) |
| Pipelines CI/CD | 7 GitHub Actions workflows |

### Participación del equipo

| Integrante | Commits | % | Rol |
|------------|---------|---|-----|
| Sarm-m | 174 | 27.2% | Scrum Master |
| samuelfl680 | 149 | 23.3% | Configuration Manager |
| solonlosada2006 | 97 | 15.2% | DevOps Engineer |
| juanvargax | 93 | 14.5% | Product Owner |
| juserora | 41 | 6.4% | QA Lead |
| Bots / CI | 81 | 12.7% | Automatización |

---

## 7. Lecciones Aprendidas

### L1 — Configurar el ambiente desde el Sprint 0

**Qué pasó**: El `.env.example` se creó en Sprint 6; antes de eso, al menos un miembro usó credenciales reales en el código.  
**Lección**: Antes del primer commit funcional, deben existir: `.env.example`, `.gitignore` con `.env`, `README.md` con instrucciones de setup y un workflow de CI básico.

### L2 — Integrar herramientas de calidad en el Sprint 1, no en el Sprint 11

**Qué pasó**: SonarCloud se configuró en Sprint 11. Al momento de la primera análisis, ya había deuda técnica legacy acumulada en 10 sprints de código.  
**Lección**: SonarCloud (o cualquier analizador estático) debe estar configurado desde el inicio. Detectar un code smell cuando hay 5 líneas es trivial; cuando hay 5,000 es costoso.

### L3 — Sincronizar ramas frecuentemente

**Qué pasó**: `feature-juserora` divergió ~131 commits de `main` sin rebase ni merge. El resultado fue 3 archivos con conflictos complejos.  
**Lección**: Al iniciar cada sesión de trabajo, ejecutar `git fetch origin && git merge origin/main` en la rama de feature. El costo de resolver un conflicto de 2 líneas es trivial; de 131 commits, no lo es.

### L4 — Separar coverage unitario del coverage visual

**Qué salió bien**: Excluir páginas, layouts y contextos del cálculo de cobertura fue una decisión correcta.  
**Lección**: Las métricas de cobertura son valiosas cuando miden lógica testeable de forma aislada. Incluir componentes visuales solo infla el número sin aportar confianza en la lógica.

### L5 — Documentar incidentes en el momento, no al final

**Qué pasó**: El documento `issue_auth_registro_mongo_atlas.md` se escribió retrospectivamente. Perdimos contexto diagnóstico valioso.  
**Lección**: Cuando un incidente bloquea al equipo más de 30 minutos, abrir inmediatamente un issue en GitHub con causa raíz tentativa, pasos de reproducción y solución aplicada.

### L6 — La automatización de procesos repetitivos tiene ROI alto

**Qué salió bien**: Los dos workflows de Kanban (auto-asignación + checklist INVEST) y el workflow de SonarCloud ahoraron tiempo manual y redujeron errores de proceso.  
**Lección**: Todo proceso que el equipo repite más de 3 veces por sprint debería automatizarse. El costo de escribir el workflow se recupera en el segundo sprint.

---

## 8. Recomendaciones para Proyectos Futuros

1. **Sprint 0 obligatorio**: Configurar repositorio, CI básico, `.env.example`, linter, SonarCloud y Definition of Done antes de cualquier feature.

2. **Pre-commit hooks desde el inicio**: Usar `husky` + `lint-staged` para enforcer el linter y los tests localmente antes de cada push.

3. **Política de sincronización de ramas**: Documentar en el `CONTRIBUTING.md` que toda rama de feature debe sincronizarse con `main` al menos una vez cada 2 días.

4. **Pruebas de integración para flujos críticos**: Agregar al menos 3-5 pruebas con Playwright o Cypress que cubran login, registro y el flujo de creación de vehículo. Estos son los flujos que más frecuentemente rompen silenciosamente.

5. **Registro de incidentes en tiempo real**: Crear una template de issue tipo "Incidente" en GitHub con campos: descripción, impacto, causa raíz, solución aplicada, prevención futura.

6. **Retrospectivas por sprint, no solo por milestone**: Las retrospectivas por milestone permiten acumular problemas durante 3-4 sprints. Una retrospectiva de 15 minutos al final de cada sprint detecta problemas cuando aún son pequeños.
