# UML - Facade de alertas

```mermaid
classDiagram
    class useAlerts {
      +useAlerts()
    }

    class useAlertsFacade {
      +useAlertsFacade(sortMode)
      +alerts
      +totalAlerts
      +criticalAlerts
      +warningAlerts
    }

    class useAlertHub {
      +useAlertHub()
    }

    class AlertHubSingleton {
      +getInstance()
    }

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