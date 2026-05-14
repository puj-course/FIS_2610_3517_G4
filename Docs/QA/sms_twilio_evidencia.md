# Evidencia de integracion SMS con Twilio

Este documento resume la integracion SMS. La defensa completa esta en:

- [Integracion SMS Twilio](evidencias_finales/sms/05_integracion_sms_twilio.md)
- [Gestion de secretos y variables](evidencias_finales/seguridad/06_gestion_secretos_variables_entorno.md)

## Alcance implementado

| Elemento | Ruta | Estado |
|---|---|---|
| Servicio SMS | `backend/services/smsService.js` | Implementado |
| Pruebas SMS | `backend/test/smsService.test.js` | Mockeadas |
| Integracion backend | `backend/server.js` | OTP verificacion/recuperacion |
| UI registro | `apps/web/src/components/RegisterModal.jsx` | Canal SMS |
| UI recuperacion | `apps/web/src/components/LoginModal.jsx` | Canal SMS |

## Variables necesarias

No incluir valores reales en el repositorio.

```bash
TWILIO_ACCOUNT_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_PHONE_NUMBER=<twilio-phone-number>
OTP_EXPIRACION_MINUTOS=10
OTP_MAX_INTENTOS=5
OTP_COOLDOWN_SEGUNDOS=60
```

Si el profesor requiere credenciales por contexto academico, se entregan por canal privado.

## Comando de prueba automatizada

```bash
npm --prefix backend ci
npm --prefix backend test
```

Estas pruebas usan mocks. No prueban recepcion real de SMS ni consumo del proveedor.

## Evidencia real requerida para excelente

| Evidencia | Archivo esperado |
|---|---|
| Formulario seleccionando SMS | `Docs/QA/evidencias_finales/sms/img/sms-formulario.png` |
| SMS recibido con datos ocultos | `Docs/QA/evidencias_finales/sms/img/sms-recibido-redacted.png` |
| Dashboard Twilio con estado del mensaje | `Docs/QA/evidencias_finales/sms/img/twilio-message-status-redacted.png` |
| Log backend sin tokens | `Docs/QA/evidencias_finales/sms/img/backend-sms-log-redacted.png` |
| Tests backend | `Docs/QA/evidencias_finales/sms/img/backend-sms-tests.png` |

## Regla de sustentacion

No afirmar "se recibio SMS" si no existe captura del mensaje o registro verificable de Twilio. Sin evidencia real, la integracion debe presentarse como implementada y probada con mocks, pero con evidencia funcional externa pendiente.

