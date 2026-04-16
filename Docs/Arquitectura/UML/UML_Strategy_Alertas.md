# UML - Strategy de ordenamiento de alertas

```mermaid
classDiagram
    class AlertSortStrategy {
      +sort(alerts)
    }

    class PriorityAlertSortStrategy {
      +sort(alerts)
    }

    class UrgencyAlertSortStrategy {
      +sort(alerts)
    }

    class AlertHubSingleton {
      +setSortStrategy(strategy)
      +buildAlerts()
    }

    class useAlertsFacade {
      +useAlertsFacade(sortMode)
    }

    AlertSortStrategy <|-- PriorityAlertSortStrategy
    AlertSortStrategy <|-- UrgencyAlertSortStrategy
    AlertHubSingleton --> AlertSortStrategy
    useAlertsFacade --> AlertHubSingleton