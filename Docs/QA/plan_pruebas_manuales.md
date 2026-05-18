# Plan de Pruebas Manuales — DriveControl / AutoMinder Enterprise

## Información del documento

| Campo | Valor |
|-------|-------|
| **Proyecto** | DriveControl / AutoMinder Enterprise |
| **Equipo** | SYNTIX TECH |
| **Autor** | juserora (QA Lead) |
| **Versión** | 1.0 |
| **Fecha** | 2026-05-18 |
| **Entorno de referencia** | Docker Compose local (`docker compose up -d --build`) |

---

## Convenciones

| Símbolo | Significado |
|---------|-------------|
| ✅ | Aprobado — el comportamiento coincide con el resultado esperado |
| ❌ | Fallido — el comportamiento difiere del resultado esperado |
| ⚠️ | Bloqueado — no se puede ejecutar por dependencia externa o datos faltantes |
| ⬜ | Sin ejecutar |

**Nomenclatura de IDs:** `QA-{MÓDULO}-{NÚMERO}` (ej: `QA-AUTH-01`).

**Precondición general para todos los casos:** El stack Docker está activo y los tres servicios muestran estado `healthy` en `docker compose ps`.

---

## Módulo 1: Autenticación y Registro

### QA-AUTH-01 — Registro exitoso con email nuevo

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | El email `qa_test_nuevo@syntix.test` no existe en la base de datos |
| **Pasos** | 1. Navegar a `http://localhost:3000` <br>2. Hacer clic en "Crear cuenta" <br>3. Ingresar nombre: `QA Tester`, email: `qa_test_nuevo@syntix.test`, contraseña: `Test1234!` <br>4. Hacer clic en "Registrarse" |
| **Resultado esperado** | El sistema muestra la pantalla de verificación OTP y envía un correo a la dirección indicada |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-AUTH-02 — Registro con email ya registrado

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe una cuenta con el email `qa_existente@syntix.test` |
| **Pasos** | 1. Navegar a la pantalla de registro <br>2. Ingresar el email ya registrado con cualquier contraseña <br>3. Hacer clic en "Registrarse" |
| **Resultado esperado** | El sistema muestra un mensaje de error indicando que el email ya está en uso; no envía correo ni crea cuenta duplicada |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-AUTH-03 — Verificación OTP con código correcto

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Se completó QA-AUTH-01 y se recibió el correo con el código OTP |
| **Pasos** | 1. Ingresar el código OTP de 6 dígitos recibido por correo <br>2. Hacer clic en "Verificar" |
| **Resultado esperado** | La cuenta queda activada y el sistema redirige al dashboard principal |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-AUTH-04 — Verificación OTP con código incorrecto

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Se está en la pantalla de verificación OTP |
| **Pasos** | 1. Ingresar el código `000000` (incorrecto) <br>2. Hacer clic en "Verificar" |
| **Resultado esperado** | El sistema muestra un error de código inválido y permite reintentar |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-AUTH-05 — Login exitoso con credenciales correctas

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe una cuenta verificada con email y contraseña conocidos |
| **Pasos** | 1. Navegar a `http://localhost:3000` <br>2. Ingresar email y contraseña correctos <br>3. Hacer clic en "Iniciar sesión" |
| **Resultado esperado** | El sistema redirige al dashboard. El nombre del usuario aparece en la barra de navegación |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-AUTH-06 — Login con contraseña incorrecta

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe una cuenta verificada |
| **Pasos** | 1. Ingresar el email correcto con una contraseña incorrecta (`Wrongpass123!`) <br>2. Hacer clic en "Iniciar sesión" |
| **Resultado esperado** | El sistema muestra un mensaje de credenciales inválidas; no redirige al dashboard |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

## Módulo 2: Recuperación de Contraseña

### QA-REC-01 — Solicitud de recuperación por email

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe una cuenta verificada con email conocido; `EMAIL_USER` y `EMAIL_PASS` configurados en `backend/.env` |
| **Pasos** | 1. En la pantalla de login, hacer clic en "¿Olvidaste tu contraseña?" <br>2. Ingresar el email registrado <br>3. Hacer clic en "Enviar código" |
| **Resultado esperado** | El sistema confirma que se envió el código y el correo llega en menos de 2 minutos |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-REC-02 — Recuperación con código OTP válido

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Se completó QA-REC-01 y se recibió el código OTP por correo |
| **Pasos** | 1. Ingresar el código OTP recibido <br>2. Ingresar la nueva contraseña: `NuevaClave456!` <br>3. Confirmar la nueva contraseña <br>4. Hacer clic en "Restablecer contraseña" |
| **Resultado esperado** | El sistema confirma el cambio y redirige al login; se puede iniciar sesión con la nueva contraseña |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-REC-03 — Recuperación con código OTP incorrecto

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Se está en la pantalla de ingreso de código OTP de recuperación |
| **Pasos** | 1. Ingresar el código `000000` (incorrecto) <br>2. Hacer clic en continuar |
| **Resultado esperado** | El sistema muestra error de código inválido y permite reintentar; la contraseña no cambia |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-REC-04 — Bloqueo tras intentos fallidos consecutivos

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | `OTP_MAX_INTENTOS=5` en `backend/.env`; se tiene un código de recuperación válido |
| **Pasos** | 1. Ingresar el código `000000` cinco veces consecutivas <br>2. Observar el mensaje del sistema en el quinto intento |
| **Resultado esperado** | Tras el quinto intento fallido, el sistema bloquea temporalmente la cuenta o el código y muestra mensaje de bloqueo |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-REC-05 — Recuperación por SMS (requiere credenciales Twilio)

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` y `TWILIO_PHONE_NUMBER` configurados; cuenta con número de teléfono registrado |
| **Pasos** | 1. En la pantalla de recuperación, seleccionar "Enviar por SMS" si está disponible <br>2. Ingresar el número de teléfono registrado <br>3. Verificar que el SMS llega al dispositivo |
| **Resultado esperado** | El SMS llega con el código OTP en el formato `Drive Control: {nombre}, tu codigo de recuperacion es {codigo}` |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

## Módulo 3: CRUD de Vehículos

### QA-VEH-01 — Crear vehículo con placa válida

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Usuario autenticado; la placa `QAT001` no existe en el sistema |
| **Pasos** | 1. Navegar a "Vehículos" en el menú lateral <br>2. Hacer clic en "Nuevo Vehículo" <br>3. Completar: placa `QAT001`, marca `Toyota`, modelo `Hilux`, año `2024`, tipo `Pickup` <br>4. Hacer clic en "Guardar" |
| **Resultado esperado** | El vehículo aparece en la tabla de vehículos con los datos ingresados |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-VEH-02 — Crear vehículo con placa duplicada

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | El vehículo con placa `QAT001` fue creado en QA-VEH-01 |
| **Pasos** | 1. Hacer clic en "Nuevo Vehículo" <br>2. Ingresar la misma placa `QAT001` con datos diferentes <br>3. Hacer clic en "Guardar" |
| **Resultado esperado** | El sistema muestra un error de placa duplicada y no crea un segundo registro |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-VEH-03 — Editar vehículo existente

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe el vehículo `QAT001` |
| **Pasos** | 1. Localizar el vehículo `QAT001` en la tabla <br>2. Hacer clic en el ícono de editar <br>3. Cambiar el campo `tipo` a `Camioneta` <br>4. Guardar los cambios |
| **Resultado esperado** | La tabla refleja el cambio `tipo: Camioneta` para el vehículo `QAT001` |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-VEH-04 — Buscar vehículo por placa

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe el vehículo `QAT001` |
| **Pasos** | 1. En la barra de búsqueda de la tabla, escribir `QAT001` <br>2. Observar los resultados |
| **Resultado esperado** | La tabla filtra y muestra únicamente el vehículo con placa `QAT001` |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-VEH-05 — Eliminar vehículo con confirmación

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe el vehículo `QAT001` sin conductor asignado |
| **Pasos** | 1. Localizar el vehículo `QAT001` <br>2. Hacer clic en el ícono de eliminar (basura) <br>3. Confirmar la eliminación en el diálogo |
| **Resultado esperado** | El vehículo desaparece de la tabla; una búsqueda de `QAT001` no retorna resultados |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

## Módulo 4: CRUD de Conductores

### QA-CON-01 — Crear conductor con cédula válida

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | La cédula `1234567890` no existe en el sistema |
| **Pasos** | 1. Navegar a "Conductores" <br>2. Hacer clic en "Nuevo Conductor" <br>3. Completar: nombre `QA Conductor`, documento `1234567890`, teléfono `3001234567`, categoría `B1`, fecha de vencimiento licencia `2027-12-31` <br>4. Guardar |
| **Resultado esperado** | El conductor aparece en la tabla con los datos ingresados |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-CON-02 — Crear conductor con cédula duplicada

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe el conductor con cédula `1234567890` (creado en QA-CON-01) |
| **Pasos** | 1. Intentar crear un nuevo conductor con la misma cédula `1234567890` <br>2. Guardar |
| **Resultado esperado** | El sistema rechaza el registro con mensaje de documento duplicado |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-CON-03 — Asignar vehículo a conductor

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe el conductor `1234567890` y el vehículo `QAT001` sin conductor asignado |
| **Pasos** | 1. Editar el conductor `QA Conductor` <br>2. En el campo de vehículo asignado, seleccionar `QAT001` <br>3. Guardar |
| **Resultado esperado** | En la tabla de conductores, la columna "Vehículo asignado" muestra `QAT001 · Toyota Hilux` |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-CON-04 — Eliminar conductor

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe el conductor `QA Conductor` (cédula `1234567890`) |
| **Pasos** | 1. Localizar el conductor en la tabla <br>2. Hacer clic en el ícono de eliminar <br>3. Confirmar |
| **Resultado esperado** | El conductor desaparece de la tabla; la búsqueda por nombre `QA Conductor` no retorna resultados |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

## Módulo 5: Gestión Documental y Alertas

### QA-DOC-01 — Dashboard muestra vehículos con semaforización correcta

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existen vehículos con SOAT: uno vencido, uno próximo a vencer (≤15 días) y uno vigente |
| **Pasos** | 1. Navegar al Dashboard principal <br>2. Observar la sección de alertas y el resumen de flota |
| **Resultado esperado** | El SOAT vencido aparece en rojo 🔴, el próximo a vencer en amarillo 🟡 y el vigente en verde 🟢 |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-DOC-02 — Alerta generada por documento vencido

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe un SOAT con `fechaFinVigencia` anterior a la fecha actual |
| **Pasos** | 1. Navegar a la sección de "Alertas" <br>2. Observar si aparece una alerta para el documento vencido |
| **Resultado esperado** | Se lista una alerta de prioridad roja para el SOAT vencido con el nombre del vehículo afectado |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-DOC-03 — Alerta generada por documento próximo a vencer

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existe un RTM con `fechaVencimiento` entre 1 y 15 días desde hoy |
| **Pasos** | 1. Navegar a la sección de "Alertas" <br>2. Observar las alertas preventivas |
| **Resultado esperado** | Se lista una alerta amarilla para el RTM próximo a vencer indicando los días restantes |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-DOC-04 — Exportar reporte en PDF

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existen al menos 3 vehículos con documentos en el sistema |
| **Pasos** | 1. Navegar a "Reportes" <br>2. Seleccionar el rango de fechas deseado <br>3. Hacer clic en "Exportar PDF" |
| **Resultado esperado** | El navegador descarga un archivo `.pdf` con el reporte de estado de flota; el archivo se puede abrir correctamente |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

### QA-DOC-05 — Métricas de calidad en el reporte

| Campo | Detalle |
|-------|---------|
| **Precondiciones** | Existen datos de vehículos, conductores, SOAT y RTM en el sistema |
| **Pasos** | 1. Navegar a "Reportes" o al Dashboard de métricas <br>2. Observar los indicadores: Índice de Riesgo Documental, Completitud de Datos y Criticidad de Alertas |
| **Resultado esperado** | Los tres indicadores muestran un valor numérico, un estado semafórico (verde/amarillo/rojo/neutro) y un mensaje de interpretación |
| **Resultado real** | ⬜ |
| **Estado** | ⬜ |

---

## Resumen de ejecución

| Módulo | Total casos | ✅ Aprobados | ❌ Fallidos | ⚠️ Bloqueados | ⬜ Sin ejecutar |
|--------|-------------|-------------|------------|--------------|----------------|
| Autenticación | 6 | — | — | — | 6 |
| Recuperación | 5 | — | — | — | 5 |
| CRUD Vehículos | 5 | — | — | — | 5 |
| CRUD Conductores | 4 | — | — | — | 4 |
| Documentos / Alertas | 5 | — | — | — | 5 |
| **TOTAL** | **25** | **—** | **—** | **—** | **25** |

---

## Registro de defectos encontrados

| ID defecto | Caso QA | Descripción | Severidad | Estado |
|------------|---------|-------------|-----------|--------|
| — | — | *(completar durante la ejecución)* | — | — |

---

## Referencias

- Arquitectura del sistema: [DEPLOYMENT.md](../../DEPLOYMENT.md)
- Métricas de calidad propias: [Docs/QA/metricas_calidad.md](metricas_calidad.md)
- Reporte QA existente: [Docs/QA/QA_Reporte_DriveControl.pdf](QA_Reporte_DriveControl.pdf)
- Issue de autenticación Atlas: [Docs/QA/issue_auth_registro_mongo_atlas.md](issue_auth_registro_mongo_atlas.md)
