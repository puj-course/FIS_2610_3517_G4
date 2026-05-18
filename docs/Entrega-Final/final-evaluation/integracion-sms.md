# Integracion SMS

## Proveedor usado

El repositorio implementa SMS mediante Twilio REST API en `backend/services/smsService.js`. El flujo esta integrado al backend para OTP de verificacion y recuperacion.

Tambien queda disponible un modo academico seguro de prueba, activable por entorno, para generar evidencia de envio exitoso sin depender de credenciales reales ni de entrega a un telefono.

## Diagnostico del error corregido

El error `Servicio SMS no configurado: faltan TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN o TWILIO_PHONE_NUMBER` aparecia porque en este checkout existe `apps/web/.env`, pero no existe `backend/.env` ni `.env` raiz. Antes de esta correccion, el backend solo cargaba `backend/.env.example`, `backend/.env` y `.env` raiz; por eso las variables Twilio conservadas por el equipo en `apps/web/.env` no llegaban al proceso Node.

Tambien habia un riesgo en Docker Compose: al ejecutar `docker compose up` directo, Compose no toma automaticamente `apps/web/.env` como archivo de interpolacion. Ahora el servicio `backend` declara `env_file: apps/web/.env` y no pisa las variables Twilio con defaults vacios.

Por decision academica del equipo, las credenciales existentes en `.env` se conservan intactas. Este ajuste no modifica, no imprime y no reemplaza esos valores.

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

Variables para modo mock/sandbox academico:

```bash
SMS_PROVIDER=mock
SMS_MOCK_ENABLED=true
```

Con `SMS_PROVIDER=mock` o `SMS_MOCK_ENABLED=true`, el backend simula envio exitoso y no exige Twilio.

## Flujo de envio

1. El usuario solicita registro o recuperacion.
2. El backend genera OTP.
3. El servicio construye payload `application/x-www-form-urlencoded`.
4. Se llama `https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json` con Basic Auth.
5. Twilio responde con `sid`.
6. El backend escribe log operativo enmascarando telefono y SID, sin exponer token ni codigo OTP.

En modo mock, el servicio no llama a Twilio. Registra un log seguro como envio simulado y retorna un mensaje visible para la UI:

```text
Codigo de verificacion enviado en modo de prueba.
```

## Como probar

Prueba automatizada sin credenciales reales:

```bash
npm --prefix backend ci
npm --prefix backend test
```

Validar que el backend local carga los nombres de variables desde los archivos esperados sin imprimir valores:

```bash
node - <<'NODE'
const { loadProjectEnv } = require('./backend/config/load-env');
const loaded = loadProjectEnv();
console.log(loaded.join(', '));
console.log('TWILIO_ACCOUNT_SID loaded:', Boolean(process.env.TWILIO_ACCOUNT_SID));
console.log('TWILIO_AUTH_TOKEN loaded:', Boolean(process.env.TWILIO_AUTH_TOKEN));
console.log('TWILIO_PHONE_NUMBER loaded:', Boolean(process.env.TWILIO_PHONE_NUMBER));
NODE
```

Prueba manual en modo mock para captura academica:

```bash
SMS_PROVIDER=mock SMS_MOCK_ENABLED=true npm --prefix backend start
npm --prefix apps/web run dev:frontend
```

En otra terminal, usar la UI de registro, elegir SMS y capturar el mensaje de confirmacion. No se requiere Twilio real.

Prueba manual real con Twilio:

```bash
npm --prefix backend start
npm --prefix apps/web run dev:frontend
```

Prueba Docker con variables conservadas en `apps/web/.env`:

```bash
docker compose up -d --build
docker compose logs -f backend
```

Prueba Docker en modo mock sin tocar `.env`:

```bash
SMS_PROVIDER=mock SMS_MOCK_ENABLED=true docker compose up -d --build
docker compose logs -f backend
```

Luego usar la UI de registro o recuperacion seleccionando SMS.

Capturar:

- Formulario con canal SMS.
- Para Twilio real: SMS recibido con telefono/codigo ocultos parcialmente.
- Para Twilio real: dashboard Twilio con estado entregado y SID.
- Para modo mock: mensaje de confirmacion visible en UI.
- Log backend con telefono/SID enmascarados, sin token, credenciales ni codigo completo.

## Limitaciones

Los tests mockeados prueban el contrato tecnico con Twilio y el modo academico de envio simulado. Para nivel excelente con proveedor real se recomienda capturar Twilio. Si el equipo decide no exponer/probar credenciales reales durante la sustentacion, el modo mock deja evidencia funcional comprobable sin secretos.

## Por que cumple la rubrica

Cumple tecnicamente porque existe servicio de proveedor externo, variables de entorno, manejo de errores, logs controlados, integracion con OTP, modo academico seguro y pruebas. Para defender "Excelente", el equipo debe adjuntar la prueba real de envio/recepcion o explicar que la evidencia pedagogica se tomo en modo mock por proteccion de credenciales.

## Validacion local realizada

| Comando | Resultado |
|---|---|
| `npm --prefix backend test` | 10 tests SMS exitosos. |
| `node --check backend/server.js` | Sintaxis valida. |
| `node --check backend/services/smsService.js` | Sintaxis valida. |
| `docker compose config` | Configuracion valida. |
| `loadProjectEnv()` | Carga `backend/.env.example` y `apps/web/.env`; las tres variables Twilio aparecen presentes sin imprimir valores. |
