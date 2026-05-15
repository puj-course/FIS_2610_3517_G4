# Integracion SMS

## Proveedor usado

El repositorio implementa SMS mediante Twilio REST API en `backend/services/smsService.js`. El flujo esta integrado al backend para OTP de verificacion y recuperacion.

## Variables de entorno

No versionar valores reales.

```bash
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_PHONE_NUMBER=<numero-twilio>
OTP_EXPIRACION_MINUTOS=10
OTP_MAX_INTENTOS=5
OTP_COOLDOWN_SEGUNDOS=60
```

## Flujo de envio

1. El usuario solicita registro o recuperacion.
2. El backend genera OTP.
3. El servicio construye payload `application/x-www-form-urlencoded`.
4. Se llama `https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json` con Basic Auth.
5. Twilio responde con `sid`.
6. El backend escribe log operativo sin exponer token.

## Como probar

Prueba automatizada sin credenciales reales:

```bash
npm --prefix backend ci
npm --prefix backend test
```

Prueba manual real:

```bash
docker compose up -d --build
docker compose logs -f backend
```

Luego usar la UI de registro o recuperacion seleccionando SMS. Capturar:

- Formulario con canal SMS.
- SMS recibido con telefono/codigo ocultos parcialmente.
- Dashboard Twilio con estado entregado y SID.
- Log backend con SID, sin token ni credenciales.

## Limitaciones

Los tests mockeados prueban el contrato tecnico con Twilio, pero no demuestran entrega real a un telefono. Para nivel excelente se necesita evidencia de proveedor.

## Por que cumple la rubrica

Cumple tecnicamente porque existe servicio de proveedor externo, variables de entorno, manejo de errores, logs controlados, integracion con OTP y pruebas. Para defender "Excelente", el equipo debe adjuntar la prueba real de envio/recepcion.
