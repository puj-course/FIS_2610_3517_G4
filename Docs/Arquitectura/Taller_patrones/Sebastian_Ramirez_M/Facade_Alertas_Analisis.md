# Análisis del punto de introducción del patrón Facade en alertas

## Contexto
En Sprint 7 se propone introducir el patrón estructural **Facade** en el flujo de alertas del proyecto DriveControl / AutoMinder Enterprise. El objetivo es reducir el acoplamiento entre módulos y ofrecer una interfaz más simple para los clientes que consumen alertas, para el taller de patrones.

## Punto de entrada identificado
El punto de entrada más adecuado para introducir la fachada es el hook:

- `apps/web/src/hooks/useAlerts.js`

Este archivo actualmente centraliza la generación de alertas a partir de la consulta y combinación de múltiples subsistemas del frontend.

## Dependencias actuales detectadas
El hook `useAlerts.js` depende directamente de los siguientes módulos:

- `apps/web/src/hooks/useVehicles.js`
- `apps/web/src/hooks/useConductors.js`
- `apps/web/src/hooks/useDocuments.js`

## Responsabilidades actuales de useAlerts.js
A partir del análisis del flujo actual, `useAlerts.js` asume simultáneamente las siguientes responsabilidades:

- Consultar vehículos registrados  
- Consultar conductores registrados  
- Consultar documentos SOAT  
- Detectar SOAT vencidos o próximos a vencer  
- Detectar licencias vencidas o próximas a vencer  
- Detectar vehículos sin conductor asignado  
- Detectar vehículos sin SOAT registrado  
- Construir objetos de alerta listos para consumo  
- Ordenar alertas por prioridad  

## Problema de diseño observado
La lógica actual concentra en un solo hook tareas de consulta, agregación, validación, construcción y priorización de alertas. Esto genera:

- Alto acoplamiento entre el módulo de alertas y varios subsistemas  
- Mezcla de responsabilidades en un único punto  
- Menor claridad arquitectónica para los clientes  
- Dificultad para extender o modificar reglas de cumplimiento sin tocar directamente el flujo de alertas  

## Decisión de diseño para el patrón
Se propone crear una fachada específica para este flujo mediante el archivo:

- `apps/web/src/hooks/useAlertsFacade.js`

Este nuevo hook actuará como interfaz simplificada entre los subsistemas base y el módulo cliente de alertas.

## Distribución propuesta de responsabilidades

### Subsistemas
Los siguientes hooks conservarán su responsabilidad principal de exponer datos base del sistema:

- `useVehicles.js`  
- `useConductors.js`  
- `useDocuments.js`  

### Fachada
La fachada propuesta será:

- `useAlertsFacade.js`

Su responsabilidad será:

- Consultar los subsistemas necesarios  
- Centralizar la lógica de agregación  
- Construir alertas  
- Ordenar el resultado  
- Exponer una salida simplificada  

### Cliente inmediato
El cliente inmediato de la fachada será:

- `useAlerts.js`

Después de la refactorización, este hook reducirá su responsabilidad y se limitará a consumir la salida preparada por la fachada.

### Clientes finales
Los clientes finales identificados en el flujo actual son:

- `apps/web/src/components/Header.jsx`  
- `apps/web/src/components/Sidebar.jsx`  
- `apps/web/src/pages/AlertasPage.jsx`  

Estos clientes solo requieren alertas listas para consumo y no deben conocer la complejidad de coordinación entre subsistemas.

## Flujos

```text
FLUJO ACTUAL
Header / Sidebar / AlertasPage
            │
            ▼
       useAlerts.js
       ├── useVehicles.js
       ├── useConductors.js
       └── useDocuments.js


FLUJO PROPUESTO
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