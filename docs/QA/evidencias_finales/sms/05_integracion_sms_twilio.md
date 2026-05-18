# 05 - Integracion SMS con Twilio

Este documento cubre la integracion SMS del backend con Twilio. Para defender nivel excelente se requiere evidencia real de envio o recepcion, no solo pruebas mockeadas.

## Alcance implementado

| Elemento | Ruta | Estado |
|---|---|---|
| Servicio SMS | `backend/services/smsService.js` | Implementado |
| Uso en backend | `backend/server.js` | Integrado con OTP de verificacion y recuperacion |
| Pruebas automatizadas | `backend/test/smsService.test.js` | Mock de Twilio |
| UI registro | `apps/web/src/components/RegisterModal.jsx` | Permite seleccionar SMS |
| UI recuperacion | `apps/web/src/components/LoginModal.jsx` | Permite seleccionar canal |
| API frontend | `apps/web/src/services/api.js` | Envia canal al backend |

## Variables requeridas

No documentar valores reales en el repositorio.

```bash
TWILIO_ACCOUNT_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_PHONE_NUMBER=<twilio-phone-number>
OTP_EXPIRACION_MINUTOS=10
OTP_MAX_INTENTOS=5
OTP_COOLDOWN_SEGUNDOS=60
```

Si el profesor requiere credenciales por el contexto academico, entregarlas en un anexo privado o cargarlas como GitHub Secrets. No publicarlas en commits, issues, README ni capturas.

## Flujo funcional

1. El usuario inicia registro o recuperacion.
2. El usuario selecciona SMS como canal.
3. El backend genera un OTP.
4. El OTP se guarda como hash.
5. `smsService.js` construye un request `application/x-www-form-urlencoded`.
6. Twilio debe responder con `sid`.
7. El backend registra un log operativo sin credenciales.

## Comandos reproducibles

Pruebas automatizadas con Twilio mockeado:

```bash
npm --prefix backend ci
npm --prefix backend test
```

Verificacion local realizada el 2026-05-14 en Docker:

```bash
docker run --rm -v "${PWD}\\backend:/app" -w /app node:20-alpine sh -lc "npm ci && npm test"
```

Resultado observado: 8 pruebas backend, 8 exitosas. Estas pruebas validan la integracion con Twilio mediante mocks y manejo de errores, pero no prueban entrega real a un telefono.

Stack para prueba manual:

```bash
docker compose up -d --build
docker compose ps
```

## Diferencia entre prueba mockeada y evidencia real

| Evidencia | Que demuestra | Sirve para excelente |
|---|---|---|
| `backend/test/smsService.test.js` | El codigo construye request, maneja errores y no imprime credenciales. | Parcial |
| Captura del formulario SMS | El flujo UI permite seleccionar SMS. | Parcial |
| Captura del SMS recibido | El proveedor entrego el mensaje a un telefono. | Si |
| Dashboard Twilio con `sid`/estado | Twilio registro el envio. | Si |
| Log backend con `sid` redacted | El backend recibio confirmacion del proveedor. | Si |

## Evidencias pendientes

| Captura | Archivo esperado | Estado |
|---|---|---|
| Test backend SMS | `img/backend-sms-tests.png` | Verificado por comando; falta captura |
| Formulario seleccion SMS | `img/sms-formulario.png` | Pendiente |
| SMS recibido con datos ocultos | `img/sms-recibido-redacted.png` | Pendiente |
| Dashboard Twilio con estado | `img/twilio-message-status-redacted.png` | Pendiente |
| Log backend sin secretos | `img/backend-sms-log-redacted.png` | Pendiente |

## Interpretacion tecnica

La integracion mejora la calidad del sistema porque agrega un canal alternativo de verificacion y recuperacion. Tambien aumenta resiliencia operativa cuando el correo falla o cuando el usuario prefiere SMS.

## Acciones si la evidencia queda debil

| Debilidad | Accion | Como corrige |
|---|---|---|
| Solo hay mocks | Ejecutar prueba real con numero autorizado y capturar Twilio. | Demuestra comunicacion real con proveedor. |
| Faltan credenciales en entorno | Cargar variables desde el anexo privado academico o GitHub Secrets. | Permite ejecutar sin exponer tokens publicamente. |
| Twilio falla | Capturar error, revisar SID/token/numero remitente y telefono verificado. | Aisla configuracion de proveedor. |
| Logs exponen datos | Redactar telefono/token y corregir logging. | Reduce riesgo de seguridad. |

## Trazabilidad

| Issue | Branch | Commit | PR | Evidencia |
|---|---|---|---|---|
| Integracion SMS | `feature-sarm-m` o rama asignada | Ver PR | PR hacia `develop` | Tests, capturas Twilio, logs redacted |

## Frase segura para sustentacion

Usar esta frase hasta tener capturas reales:

> El repositorio contiene la integracion con Twilio y pruebas automatizadas mockeadas. Para afirmar envio real se adjunta captura del SMS recibido y del dashboard Twilio. Si esas capturas no estan presentes, la evidencia debe considerarse parcial.
