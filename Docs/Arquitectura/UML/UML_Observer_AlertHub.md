# UML - Observer del hub de alertas

```mermaid
classDiagram
    class AlertHubSingleton {
      +subscribe(listener)
      +notifyListeners()
      +registerSourceAlerts(sourceKey, alerts)
      +clearSourceAlerts(sourceKey)
    }

    class useAlertHub {
      +useAlertHub()
    }

    class useVehicles
    class useConductors
    class DocumentsProvider
    class useAlertsFacade

    useVehicles --> AlertHubSingleton : publica
    useConductors --> AlertHubSingleton : publica
    DocumentsProvider --> AlertHubSingleton : publica

    useAlertHub --> AlertHubSingleton : se suscribe
    useAlertsFacade --> useAlertHub : consume alertas
    ```