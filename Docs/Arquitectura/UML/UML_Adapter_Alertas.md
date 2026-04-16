# UML - Adapter para normalizacion de alertas

```mermaid
classDiagram
    class BaseAlertAdapter {
      +adapt(item)
      +normalize(result)
      +adaptMany(items)
    }

    class VehicleAlertAdapter
    class ConductorAlertAdapter
    class SoatAlertAdapter
    class publishAdaptedAlerts

    class useVehicles
    class useConductors
    class DocumentsProvider

    BaseAlertAdapter <|-- VehicleAlertAdapter
    BaseAlertAdapter <|-- ConductorAlertAdapter
    BaseAlertAdapter <|-- SoatAlertAdapter

    useVehicles --> publishAdaptedAlerts
    useConductors --> publishAdaptedAlerts
    DocumentsProvider --> publishAdaptedAlerts

    publishAdaptedAlerts --> BaseAlertAdapter
    ```