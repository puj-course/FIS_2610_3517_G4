# Plan de Pruebas — DriveControl / AutoMinder Enterprise

## Objetivo

Definir la estrategia, alcance y estructura de las pruebas unitarias del sistema DriveControl, garantizando que la lógica de dominio sea verificable de forma aislada y que la cobertura refleje calidad real, no superficies visuales.

---

## Estrategia General

### Principios

1. **Probar lógica, no infraestructura**: las pruebas cubren funciones puras, adaptadores y utilidades de dominio. Los componentes React, páginas y contextos se validan mediante análisis estático (SonarCloud), lint y revisión funcional manual.

2. **Cobertura significativa sobre cobertura alta**: un 83.7% de cobertura en archivos de lógica real es más valioso que un 95% inflado con componentes visuales vacíos.

3. **Tests como documentación**: cada test describe el comportamiento esperado de una función de forma legible. Los `describe` e `it` forman un contrato legible del módulo.

4. **Independencia total**: ningún test depende de estado externo, red, DOM ni otros tests. Los mocks se usan solo para dependencias inevitables.

---

## Alcance de las Pruebas

### Incluido en cobertura (9 archivos de prueba)

| Archivo de Prueba | Módulo Probado | Líneas | Tipo |
|-------------------|----------------|--------|------|
| `__tests__/baseAlertAdapter.test.js` | `patterns/adapters/BaseAlertAdapter.js` | 74 | Unit |
| `__tests__/colombiaFormats.test.js` | `utils/colombiaFormats.js` | 176 | Unit |
| `__tests__/conductorAlertAdapter.test.js` | `patterns/adapters/ConductorAlertAdapter.js` | 73 | Unit |
| `__tests__/dateUtils.test.js` | `utils/dateUtils.js` | 82 | Unit |
| `__tests__/emailValidation.test.js` | `utils/emailValidation.js` | 50 | Unit |
| `__tests__/qualityMetrics.test.js` | `utils/qualityMetrics.js` | 736 | Unit |
| `__tests__/soatAlertAdapter.test.js` | `patterns/adapters/SoatAlertAdapter.js` | 95 | Unit |
| `__tests__/RtmAlertAdapter.test.js` | `patterns/adapters/RtmAlertAdapter.js` | 105 | Unit |
| `test/useRUNTSimulator.test.js` | `hooks/useRUNTSimulator.js` | 166 | Unit |
| **TOTAL** | **9 módulos** | **~1,557** | |

### Excluido de cobertura (con justificación)

| Categoría | Archivos | Razón de exclusión |
|-----------|---------|-------------------|
| Páginas (`pages/**`) | ConductoresPage, VehiculosPage, DashboardPage, etc. | Lógica de UI; se valida visualmente y mediante lint |
| Layouts (`layouts/**`) | MainLayout, AuthLayout | Sin lógica de dominio; solo composición de componentes |
| Contextos (`contexts/**`) | ThemeContext, OnboardingContext, AuthContext | Estado React; requiere integración o DOM (no unit-testable de forma aislada) |
| Hooks de integración | useVehicles, useConductors, useAlerts, useAlertHub | Dependen de fetch/API; candidatos a mock solo con herramienta de integración |
| Componentes visuales | StatusBadge, AddVehicleModal, Sidebar, etc. | Renderizado puro; sin lógica de dominio testeable aisladamente |
| Servicios API | `services/api.js` | Capa delgada sobre fetch; testeable solo con mocks de red |
| Patrones singleton/facade | AlertHubSingleton, useAlertsFacade | Dependen de estado global; se validan mediante análisis estático |
| Punto de entrada | `main.jsx`, `App.jsx` | Configuración; sin lógica de negocio |

---

## Matriz de Casos de Prueba por Módulo

### BaseAlertAdapter

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-BA-01 | `normalize()` retorna null para item null | Normal | ✅ |
| CP-BA-02 | `adaptMany()` filtra nulls y retorna solo alertas válidas | Normal | ✅ |
| CP-BA-03 | `adapt()` lanza error si no está implementado en subclase | Negativo | ✅ |
| CP-BA-04 | `adaptMany([])` retorna array vacío sin error | Borde | ✅ |

### ColombiFormats

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-CF-01 | Placa válida formato ABC123 retorna true | Normal | ✅ |
| CP-CF-02 | Placa con guion ABC-123 normaliza correctamente | Borde | ✅ |
| CP-CF-03 | Cédula de 10 dígitos válida | Normal | ✅ |
| CP-CF-04 | Número móvil colombiano inicia con 3 | Normal | ✅ |
| CP-CF-05 | Cédula con letras retorna inválida | Negativo | ✅ |
| CP-CF-06 | Placa vacía retorna inválida | Borde | ✅ |

### ConductorAlertAdapter

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-CA-01 | Licencia vigente no genera alerta | Normal | ✅ |
| CP-CA-02 | Licencia vencida genera alerta roja | Normal | ✅ |
| CP-CA-03 | Licencia próxima a vencer genera alerta amarilla | Borde | ✅ |

### DateUtils

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-DU-01 | Días restantes para fecha futura es positivo | Normal | ✅ |
| CP-DU-02 | Días restantes para fecha pasada es negativo | Normal | ✅ |
| CP-DU-03 | Estado de documento con 0 días es rojo | Borde | ✅ |
| CP-DU-04 | Estado con >15 días es verde | Normal | ✅ |

### EmailValidation

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-EV-01 | Email válido formato user@domain.com | Normal | ✅ |
| CP-EV-02 | Email sin @ retorna inválido | Negativo | ✅ |
| CP-EV-03 | Email con dominio sin TLD retorna inválido | Negativo | ✅ |
| CP-EV-04 | Email vacío retorna inválido | Borde | ✅ |
| CP-EV-05 | Email con longitud máxima válida (254 chars) | Borde | ✅ |

### QualityMetrics

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-QM-01 | Riesgo documental 0% con todos documentos vigentes | Normal | ✅ |
| CP-QM-02 | Riesgo documental 100% con todos vencidos | Normal | ✅ |
| CP-QM-03 | Completitud 100% con todos los campos presentes | Normal | ✅ |
| CP-QM-04 | Completitud 0% con registros vacíos | Negativo | ✅ |
| CP-QM-05 | Criticidad 0% sin alertas críticas | Normal | ✅ |
| CP-QM-06 | `buildQualityMetricsSummary` retorna array de 3 métricas | Normal | ✅ |
| CP-QM-07..N | 30+ casos edge (datos nulos, undefined, fechas inválidas) | Borde | ✅ |

### SoatAlertAdapter

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-SA-01 | SOAT vigente no genera alerta | Normal | ✅ |
| CP-SA-02 | SOAT vencido genera alerta roja con placa | Normal | ✅ |
| CP-SA-03 | SOAT próximo a vencer genera alerta amarilla | Borde | ✅ |

### RtmAlertAdapter

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-RTM-01 | RTM vigente no genera alerta | Normal | ✅ |
| CP-RTM-02 | RTM vencida genera alerta roja con placa del vehículo | Normal | ✅ |
| CP-RTM-03 | RTM sin placa visible usa fallback de texto | Borde | ✅ |

### useRUNTSimulator

| ID | Descripción | Tipo | Estado |
|----|-------------|------|--------|
| CP-SL-01 | Placa válida existente retorna datos del vehículo | Normal | ✅ |
| CP-SL-02 | Placa inexistente retorna `encontrado: false` | Negativo | ✅ |
| CP-SL-03 | Placa vacía retorna error de validación | Borde | ✅ |
| CP-SL-04 | Placa en minúscula se normaliza y encuentra | Borde | ✅ |
| CP-SL-05 | VIN con menos de 17 caracteres retorna error | Negativo | ✅ |
| CP-SL-06 | VIN vacío retorna error | Borde | ✅ |
| CP-SL-07 | VIN existente retorna vehículo con SOAT y RTM | Normal | ✅ |
| CP-SL-08 | VIN con espacios y minúsculas se normaliza | Borde | ✅ |
| CP-SL-09 | VIN de 17 chars inexistente retorna no encontrado | Negativo | ✅ |
| CP-SL-10 | `getAllVehiculos` retorna array con campos resumidos | Normal | ✅ |
| CP-SL-11 | Todos los vehículos tienen estructura de resumen válida | Normal | ✅ |

---

## Configuración de Cobertura

### Umbral objetivo

| Métrica | Umbral | Estado actual |
|---------|--------|---------------|
| Cobertura de líneas (New Code) | ≥ 80% | ✅ 83.7% |
| Cobertura de ramas | ≥ 75% | ✅ (aproximado) |
| Duplicación | 0% | ✅ 0.0% |

### Configuración en `package.json`

```json
"test": "sh -c 'vitest run --coverage.enabled=true \"$@\" --coverage.reporter=text --coverage.reporter=lcovonly --coverage.reporter=html' --"
```

### Configuración en `sonar-project.properties`

```properties
sonar.javascript.lcov.reportPaths=apps/web/coverage/lcov.info
sonar.coverage.exclusions=apps/web/src/main.jsx,apps/web/src/App.jsx,apps/web/src/components/**,...
```

---

## Cómo Ejecutar las Pruebas

### Ejecución completa con cobertura

```bash
npm --prefix apps/web run test -- --coverage
```

Genera informes en:
- `apps/web/coverage/index.html` — informe visual interactivo
- `apps/web/coverage/lcov.info` — formato para SonarCloud

### Ejecución de un archivo específico

```bash
npm --prefix apps/web run test -- qualityMetrics.test.js --coverage
```

### Modo watch (desarrollo)

```bash
npm --prefix apps/web run test:watch
```

---

## Integración con CI/CD

Las pruebas se ejecutan automáticamente en dos workflows:

| Workflow | Momento | Comando |
|----------|---------|---------|
| `ci_verificacion.yml` | PR a develop/main | `npm run test` + `npm run lint` + `npm run build` |
| `sonarcloud.yml` | Push/PR a ramas principales | `npm run test -- --coverage` → sube `lcov.info` a SonarCloud |

Un PR no puede mergearse a `main` si alguna de estas verificaciones falla.

---

## Evolución de la Suite de Pruebas

| Sprint | Hito de testing |
|--------|----------------|
| Sprint 9 | Primeros adapters de alerta implementados (sin tests) |
| Sprint 11 | Configuración de Vitest + SonarCloud; primeros tests unitarios |
| Sprint 12 | Tests para qualityMetrics (736 líneas), colombiaFormats, dateUtils |
| Sprint 13 | Tests expandidos para RtmAlertAdapter; plan de pruebas documentado |

---

## Pendientes y Trabajo Futuro

| Ítem | Prioridad | Justificación |
|------|-----------|---------------|
| Pruebas de integración de flujos críticos (login, CRUD) | Alta | Playwright/Cypress para los flows más expuestos a regresión |
| Tests del AlertHubSingleton aislado | Media | Actualmente excluido de `sonar.coverage.exclusions` |
| Tests del Facade (useAlertsFacade) | Media | La fachada orquesta adapters que sí están probados |
| Ampliar casos edge en emailValidation | Baja | Casos de dominios internacionales y punycode |
