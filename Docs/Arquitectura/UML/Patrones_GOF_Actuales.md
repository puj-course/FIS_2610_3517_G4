# Diagrama general de patrones GoF implementados

```mermaid
classDiagram
    class useAlerts
    class useAlertsFacade
    class useAlertHub
    class AlertHubSingleton

    class BaseAlertAdapter
    class VehicleAlertAdapter
    class ConductorAlertAdapter
    class SoatAlertAdapter
    class publishAdaptedAlerts

    class AlertSortStrategy
    class PriorityAlertSortStrategy
    class UrgencyAlertSortStrategy

    class BaseModalFactory
    class AuthModalFactory
    class FleetModalFactory
    class ModalFactory

    class useVehicles
    class useConductors
    class DocumentsProvider

    class Sidebar
    class Header
    class AlertasPage
    class DataPanel
    class DashboardPage

    Sidebar --> useAlerts
    Header --> useAlerts
    AlertasPage --> useAlerts
    DataPanel --> useAlerts
    DashboardPage --> useAlerts

    useAlerts --> useAlertsFacade
    useAlertsFacade --> useAlertHub
    useAlertHub --> AlertHubSingleton

    AlertHubSingleton --> AlertSortStrategy
    AlertSortStrategy <|-- PriorityAlertSortStrategy
    AlertSortStrategy <|-- UrgencyAlertSortStrategy

    BaseAlertAdapter <|-- VehicleAlertAdapter
    BaseAlertAdapter <|-- ConductorAlertAdapter
    BaseAlertAdapter <|-- SoatAlertAdapter

    useVehicles --> publishAdaptedAlerts
    useConductors --> publishAdaptedAlerts
    DocumentsProvider --> publishAdaptedAlerts
    publishAdaptedAlerts --> BaseAlertAdapter
    publishAdaptedAlerts --> AlertHubSingleton

    BaseModalFactory <|-- AuthModalFactory
    BaseModalFactory <|-- FleetModalFactory
    ModalFactory --> AuthModalFactory
    ModalFactory --> FleetModalFactory

    ```