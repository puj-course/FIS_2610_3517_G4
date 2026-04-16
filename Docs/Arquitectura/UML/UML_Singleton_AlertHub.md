# UML - Singleton del hub de alertas

```mermaid
classDiagram
    class AlertHubSingleton {
      -instance
      +getInstance()
      +subscribe()
      +registerSourceAlerts()
      +clearSourceAlerts()
      +setSortStrategy()
    }

    class useAlertHub

    useAlertHub --> AlertHubSingleton : obtiene instancia unica

    ```