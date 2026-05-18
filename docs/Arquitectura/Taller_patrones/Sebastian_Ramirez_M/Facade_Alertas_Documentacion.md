# Documentación del patrón Facade en el módulo de alertas

## 1. Historia relacionada
Como miembro del equipo, quiero centralizar la generación de alertas mediante una fachada, para que las vistas consuman una interfaz simple y el sistema reduzca el acoplamiento entre vehículos, conductores y documentos.

## 2. Problema de diseño identificado
Antes de la refactorización, el módulo `useAlerts.js` concentraba múltiples responsabilidades en un solo punto del sistema. Entre ellas se encontraban:

- la consulta de vehículos,
- la consulta de conductores,
- la consulta de documentos,
- la detección de vencimientos,
- la detección de faltantes,
- la construcción manual de alertas,
- y el ordenamiento de resultados por prioridad.

Esta situación producía un problema claro de diseño:

- alto acoplamiento entre el módulo de alertas y varios subsistemas,
- mezcla de responsabilidades en un único hook,
- menor claridad arquitectónica para los clientes,
- y dificultad para extender o modificar reglas del flujo de alertas sin afectar directamente su implementación.

## 3. Patrón aplicado
Se implementó el patrón estructural **Facade** para encapsular la interacción entre varios subsistemas del frontend y exponer una interfaz simplificada para el consumo de alertas.

La fachada introducida fue:

- `apps/web/src/hooks/useAlertsFacade.js`

Su propósito es centralizar la interacción entre:

- `useVehicles.js`
- `useConductors.js`
- `useDocuments.js`

y devolver una salida simplificada para el módulo cliente de alertas.

## 4. Justificación del patrón
El patrón Facade fue seleccionado porque permite ocultar la complejidad interna de varios módulos y ofrecer una interfaz única, simple y coherente al resto del sistema.

En este caso, la fachada mejora el diseño porque:

- reduce el acoplamiento directo entre el cliente y los subsistemas,
- mejora la separación de responsabilidades,
- hace más mantenible la lógica del flujo de alertas,
- facilita futuras extensiones del módulo,
- y deja una arquitectura más clara para documentación y pruebas.

Frente a una solución directa, donde `useAlerts.js` coordinaba de manera explícita toda la lógica, el uso de la fachada centraliza esa complejidad y deja a los clientes trabajando únicamente con una salida lista para consumo.

## 5. Roles del patrón en el proyecto

### Fachada
- `useAlertsFacade.js`

### Subsistemas
- `useVehicles.js`
- `useConductors.js`
- `useDocuments.js`

### Cliente inmediato
- `useAlerts.js`

### Clientes finales
- `Header.jsx`
- `Sidebar.jsx`
- `AlertasPage.jsx`

## 6. Flujo final del patrón

### Antes
```text
Header / Sidebar / AlertasPage
            │
            ▼
       useAlerts.js
       ├── useVehicles.js
       ├── useConductors.js
       └── useDocuments.js

       
### Después
```text
Header / Sidebar / AlertasPage
            │
            ▼
       useAlerts.js
            │
            ▼
     useAlertsFacade.js
       ├── useVehicles.js
       ├── useConductors.js
       └── useDocuments.js