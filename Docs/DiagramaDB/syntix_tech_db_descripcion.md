# 📊 Modelo de Base de Datos — Syntix Tech

> Documentación del modelo de datos de la plataforma **Syntix Tech**, una aplicación de gestión de flotas vehiculares construida sobre **MongoDB**.

---

## 🧭 Visión general

Este diagrama representa el modelo de datos de una aplicación de **gestión de flotas vehiculares** implementada sobre **MongoDB** (se evidencia por el uso de `ObjectId` como tipo de identificador primario).

El sistema gestiona:

- 👥 **Usuarios** (empresas propietarias de flotas)
- 🚚 **Conductores** registrados por cada empresa
- 🚗 **Vehículos** asignados a conductores
- 📄 **SOAT** — pólizas de seguro obligatorio
- 📋 **Historial de validaciones** contra el RUNT
- 🔔 **Alertas** automatizadas por vencimientos y eventos relevantes

---

## 🗺️ Diagrama Entidad-Relación

```mermaid
erDiagram
    USUARIO {
        ObjectId _id PK
        string email
        string password
        string empresa
        string telefono
        string role
    }
    CONDUCTOR {
        ObjectId _id PK
        string ownerEmail FK
        string nombre
        string documento
        string telefono
        string categoria
        string fechaVencimiento
    }
    VEHICULO {
        ObjectId _id PK
        string conductorId FK
        string ownerEmail FK
        string placa
        string marca
        string modelo
        number anio
        string tipo
    }
    SOAT {
        ObjectId _id PK
        string vehiculoId FK
        string numeroPoliza
        string fechaInicio
        string fechaVencimiento
    }
    HISTORIAL_VALIDACION {
        ObjectId _id PK
        string placa FK
        string usuarioEmail FK
        string timestamp
        object resultadoRUNT
        string notas
        string ip
    }
    ALERTA {
        ObjectId _id PK
        string vehiculoId FK
        string conductorId FK
        string tipo
        string entidad
        string mensaje
        number diasRestantes
        string prioridad
        string fecha
        string sourceKey
    }

    %% Relaciones basadas en la lógica de Drive Control
    USUARIO --o{ CONDUCTOR : "posee"
    USUARIO --o{ VEHICULO : "posee"
    USUARIO --o{ HISTORIAL_VALIDACION : "genera"
    CONDUCTOR }o--o| VEHICULO : "asignado a"
    VEHICULO --o| SOAT : "tiene"
    VEHICULO --o{ HISTORIAL_VALIDACION : "referenciado en"
    VEHICULO --o{ ALERTA : "genera"
    CONDUCTOR ||--o{ ALERTA : "genera"
```

---

## 📚 Entidades

### 🧑‍💼 USUARIO

Representa a la empresa o propietario que utiliza la plataforma. Es la entidad principal desde la cual se derivan los permisos y la propiedad de los demás recursos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId (PK) | Identificador único del usuario |
| `email` | string | Correo electrónico (usado como referencia lógica en otras colecciones) |
| `password` | string | Contraseña cifrada |
| `empresa` | string | Nombre de la empresa asociada |
| `telefono` | string | Número de contacto |
| `role` | string | Rol del usuario dentro del sistema (admin, operador, etc.) |

---

### 🚚 CONDUCTOR

Almacena la información de los conductores registrados por cada empresa, incluyendo la vigencia de su licencia.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId (PK) | Identificador único del conductor |
| `ownerEmail` | string (FK) | Referencia al usuario propietario |
| `nombre` | string | Nombre completo |
| `documento` | string | Número de identificación |
| `telefono` | string | Contacto del conductor |
| `categoria` | string | Categoría de la licencia de conducción |
| `fechaVencimiento` | string | Fecha de vencimiento de la licencia |

---

### 🚗 VEHICULO

Representa cada vehículo de la flota. Se vincula tanto al usuario propietario como al conductor asignado.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId (PK) | Identificador único del vehículo |
| `conductorId` | string (FK) | Conductor asignado |
| `ownerEmail` | string (FK) | Usuario propietario |
| `placa` | string | Placa del vehículo |
| `marca` | string | Marca |
| `modelo` | string | Modelo |
| `anio` | number | Año de fabricación |
| `tipo` | string | Tipo de vehículo (carga, pasajeros, etc.) |

---

### 📄 SOAT

Registro de la póliza del Seguro Obligatorio de Accidentes de Tránsito asociada a cada vehículo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId (PK) | Identificador único |
| `vehiculoId` | string (FK) | Vehículo al que pertenece la póliza |
| `numeroPoliza` | string | Número de la póliza |
| `fechaInicio` | string | Inicio de vigencia |
| `fechaVencimiento` | string | Fin de vigencia |

---

### 📋 HISTORIAL_VALIDACION

Bitácora de las consultas realizadas contra el **RUNT** (Registro Único Nacional de Tránsito) u otras fuentes externas. Permite auditoría y trazabilidad.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId (PK) | Identificador único |
| `placa` | string (FK) | Placa consultada |
| `usuarioEmail` | string (FK) | Usuario que ejecutó la consulta |
| `timestamp` | string | Momento de la validación |
| `resultadoRUNT` | object | Respuesta cruda del RUNT (objeto embebido) |
| `notas` | string | Observaciones manuales |
| `ip` | string | Dirección IP desde la que se consultó |

---

### 🔔 ALERTA

Notificaciones generadas automáticamente por vencimientos (SOAT, licencia, tecnomecánica, etc.) u otros eventos relevantes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId (PK) | Identificador único |
| `vehiculoId` | string (FK) | Vehículo relacionado |
| `conductorId` | string (FK) | Conductor relacionado |
| `tipo` | string | Tipo de alerta (SOAT, licencia, etc.) |
| `entidad` | string | Entidad emisora o fuente |
| `mensaje` | string | Texto descriptivo |
| `diasRestantes` | number | Días hasta el vencimiento |
| `prioridad` | string | Nivel de urgencia (alta, media, baja) |
| `fecha` | string | Fecha de la alerta |
| `sourceKey` | string | Clave única para evitar duplicados |

---

## 🔗 Relaciones

| Origen | Cardinalidad | Destino | Descripción |
|--------|:------------:|---------|-------------|
| USUARIO | 1 — N | CONDUCTOR | Un usuario **posee** varios conductores |
| USUARIO | 1 — N | VEHICULO | Un usuario **posee** varios vehículos |
| USUARIO | 1 — N | HISTORIAL_VALIDACION | Un usuario **genera** múltiples validaciones |
| CONDUCTOR | 1 — N | VEHICULO | Un conductor puede estar **asignado a** varios vehículos |
| CONDUCTOR | 1 — N | ALERTA | Un conductor puede **generar** varias alertas |
| VEHICULO | 1 — 1 | SOAT | Un vehículo **tiene** un SOAT vigente |
| VEHICULO | 1 — N | HISTORIAL_VALIDACION | Un vehículo es **referenciado en** varias validaciones |
| VEHICULO | 1 — N | ALERTA | Un vehículo **genera** varias alertas |

---

## 🧩 Consideraciones de diseño

### Modelo híbrido referencial
Aunque MongoDB favorece la incrustación de documentos, este esquema usa **referencias explícitas** (`ObjectId` y claves lógicas como `ownerEmail` o `placa`). Esto facilita las consultas cruzadas y la integridad entre colecciones, a costa de requerir `$lookup` o joins en la capa de aplicación.

### Uso de `email` y `placa` como claves lógicas
Además de los `ObjectId`, se emplean **campos naturales** (`ownerEmail`, `placa`) como referencias, lo que simplifica el desarrollo pero exige controles de unicidad a nivel de aplicación o índices únicos en MongoDB.

### Campos de fecha como `string`
Los campos `fechaInicio`, `fechaVencimiento`, `timestamp`, etc. están tipados como strings. Sería recomendable migrarlos a `Date` de BSON para aprovechar índices por rango y cálculos temporales nativos.

### Trazabilidad robusta
La colección `HISTORIAL_VALIDACION` guarda **IP, timestamp y el resultado crudo del RUNT**, lo cual es una buena práctica para auditoría y cumplimiento normativo.

### Sistema de alertas desacoplado
El campo `sourceKey` en `ALERTA` sugiere un mecanismo de **deduplicación (idempotencia)**, útil para procesos batch que revisan vencimientos periódicamente sin generar duplicados.

---

## 📝 Notas técnicas

- **Motor de base de datos:** MongoDB
- **Patrón de referencias:** Híbrido (ObjectId + claves lógicas)
- **Integración externa:** RUNT (Registro Único Nacional de Tránsito — Colombia)

---

<sub>Documentación del modelo de datos — Syntix Tech © 2026</sub>
