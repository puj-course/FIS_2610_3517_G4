# UML - Factory Method para modales

```mermaid
classDiagram
    class BaseModalFactory {
      +canHandle(modalType)
      +createModal(modalType, props)
    }

    class AuthModalFactory
    class FleetModalFactory
    class ModalFactory

    BaseModalFactory <|-- AuthModalFactory
    BaseModalFactory <|-- FleetModalFactory

    ModalFactory --> AuthModalFactory
    ModalFactory --> FleetModalFactory
    ```