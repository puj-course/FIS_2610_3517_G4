# Matriz de patrones GoF implementados

## Resumen general
El proyecto implementa **6 patrones GoF** distribuidos así:

- **Creacionales**
  - Singleton
  - Factory Method

- **Estructurales**
  - Facade
  - Adapter

- **Comportamentales**
  - Observer
  - Strategy

Esta matriz sirve como apoyo directo para la sustentación, ya que relaciona cada patrón con su tipo, sus archivos principales y el documento donde se explica. Esto coincide con la última validación del repositorio, donde en código ya se pudo defender la distribución **2 creacionales + 2 estructurales + 2 comportamentales**. 

---

## Patrones creacionales

### Singleton
- **Tipo:** Creacional
- **Nombre del archivo de documentación:** `creacionales/singleton_alert_hub.md`
- **Archivo principal en código:** `apps/web/src/patterns/singleton/AlertHubSingleton.js`
- **Archivos de apoyo en código:**
  - `apps/web/src/hooks/useAlertHub.js`
  - `apps/web/src/hooks/useAlertsFacade.js`
- **Rol dentro del sistema:** Mantiene una única instancia compartida del hub de alertas para garantizar consistencia en suscripciones, publicaciones y lectura del estado.
- **Diagrama:** Incluido dentro de `singleton_alert_hub.md`

### Factory Method
- **Tipo:** Creacional
- **Nombre del archivo de documentación:** `creacionales/factory_method_modales.md`
- **Archivo principal en código:** `apps/web/src/patterns/factory/BaseModalFactory.jsx`
- **Archivos de apoyo en código:**
  - `apps/web/src/patterns/factory/AuthModalFactory.jsx`
  - `apps/web/src/patterns/factory/FleetModalFactory.jsx`
  - `apps/web/src/components/ModalFactory.jsx`
- **Rol dentro del sistema:** Organiza la creación de modales mediante una jerarquía de fábricas concretas, evitando concentrar la instanciación en un solo bloque rígido.
- **Diagrama:** Incluido dentro de `factory_method_modales.md`

---

## Patrones estructurales

### Facade
- **Tipo:** Estructural
- **Nombre del archivo de documentación:** `estructurales/facade_alertas.md`
- **Archivo principal en código:** `apps/web/src/hooks/useAlertsFacade.js`
- **Archivos de apoyo en código:**
  - `apps/web/src/hooks/useAlerts.js`
  - `apps/web/src/hooks/useAlertHub.js`
  - `apps/web/src/hooks/useVehicles.js`
  - `apps/web/src/components/Sidebar.jsx`
  - `apps/web/src/components/Header.jsx`
  - `apps/web/src/pages/AlertasPage.jsx`
  - `apps/web/src/components/DataPanel.jsx`
  - `apps/web/src/pages/DashboardPage.jsx`
- **Rol dentro del sistema:** Expone una interfaz simplificada para que la UI consuma alertas sin depender de la complejidad interna del subsistema.
- **Diagrama:** Incluido dentro de `facade_alertas.md`

### Adapter
- **Tipo:** Estructural
- **Nombre del archivo de documentación:** `estructurales/adapter_alertas.md`
- **Archivo principal en código:** `apps/web/src/patterns/adapters/BaseAlertAdapter.js`
- **Archivos de apoyo en código:**
  - `apps/web/src/patterns/adapters/VehicleAlertAdapter.js`
  - `apps/web/src/patterns/adapters/ConductorAlertAdapter.js`
  - `apps/web/src/patterns/adapters/SoatAlertAdapter.js`
  - `apps/web/src/patterns/adapters/publishAdaptedAlerts.js`
  - `apps/web/src/hooks/useVehicles.js`
  - `apps/web/src/hooks/useConductors.js`
  - `apps/web/src/contexts/DocumentsContext.jsx`
- **Rol dentro del sistema:** Normaliza estructuras de datos heterogéneas para convertirlas a un modelo unificado de alertas.
- **Diagrama:** Incluido dentro de `adapter_alertas.md`

---

## Patrones comportamentales

### Observer
- **Tipo:** Comportamental
- **Nombre del archivo de documentación:** `comportamentales/observer_alert_hub.md`
- **Archivo principal en código:** `apps/web/src/patterns/singleton/AlertHubSingleton.js`
- **Archivos de apoyo en código:**
  - `apps/web/src/hooks/useAlertHub.js`
  - `apps/web/src/hooks/useVehicles.js`
  - `apps/web/src/hooks/useConductors.js`
  - `apps/web/src/contexts/DocumentsContext.jsx`
  - `apps/web/src/hooks/useAlertsFacade.js`
- **Rol dentro del sistema:** Propaga automáticamente cambios de alertas desde las fuentes hacia los consumidores por medio de suscripción y notificación.
- **Diagrama:** Incluido dentro de `observer_alert_hub.md`

### Strategy
- **Tipo:** Comportamental
- **Nombre del archivo de documentación:** `comportamentales/strategy_orden_alertas.md`
- **Archivo principal en código:** `apps/web/src/patterns/strategy/AlertSortStrategy.js`
- **Archivos de apoyo en código:**
  - `apps/web/src/patterns/strategy/PriorityAlertSortStrategy.js`
  - `apps/web/src/patterns/strategy/UrgencyAlertSortStrategy.js`
  - `apps/web/src/patterns/singleton/AlertHubSingleton.js`
  - `apps/web/src/hooks/useAlertsFacade.js`
- **Rol dentro del sistema:** Permite intercambiar el criterio de ordenamiento de alertas sin modificar el contexto principal.
- **Diagrama:** Incluido dentro de `strategy_orden_alertas.md`

---

## Relación final con la rúbrica
La implementación actual permite defender en código:
- **2 patrones creacionales**
- **2 patrones estructurales**
- **2 patrones comportamentales**

La finalidad de esta matriz es conectar cada patrón con:
- su rol dentro del sistema,
- los archivos donde se implementa,
- y el documento donde se explica.

De esta forma, la sustentación puede hacerse de forma directa, clara y trazable. 