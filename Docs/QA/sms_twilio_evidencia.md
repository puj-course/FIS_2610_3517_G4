# Evidencia de Integracion SMS con Twilio

## Objetivo

Documentar la integracion SMS de DriveControl / AutoMinder Enterprise con Twilio para sustentar el envio de codigos OTP de verificacion y recuperacion de cuenta sin exponer credenciales.

## Proveedor y alcance

| Elemento | Descripcion |
| --- | --- |
| Proveedor | Twilio |
| Tipo de integracion | API HTTP mediante `axios` |
| Servicio principal | `backend/services/smsService.js` |
| Flujos cubiertos | Verificacion de cuenta, reenvio de codigo y recuperacion de contrasena con respaldo SMS |
| Prueba automatizada | `backend/test/smsService.test.js` con Twilio mockeado |

## Archivos involucrados

| Archivo | Responsabilidad |
| --- | --- |
| `backend/services/smsService.js` | Construye el request a Twilio y valida que la respuesta incluya `sid`. |
| `backend/server.js` | Conecta SMS con reenvio de OTP y recuperacion de contrasena. |
| `apps/web/src/components/RegisterModal.jsx` | Permite elegir SMS como canal de verificacion cuando aplica. |
| `apps/web/src/components/LoginModal.jsx` | Muestra flujo de recuperacion y canal de entrega. |
| `apps/web/src/services/api.js` | Expone llamadas frontend hacia endpoints de autenticacion. |

## Variables requeridas

No se deben documentar valores reales. La sustentacion solo debe mencionar nombres:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `OTP_EXPIRACION_MINUTOS`
- `OTP_MAX_INTENTOS`
- `OTP_COOLDOWN_SEGUNDOS`

## Flujo funcional

1. El usuario solicita verificacion o recuperacion.
2. El backend genera un codigo OTP y lo guarda como hash.
3. Si el canal elegido o de respaldo es SMS, `server.js` normaliza el telefono.
4. `smsService.js` envia el mensaje a Twilio.
5. Twilio debe responder con un `sid`.
6. El backend registra un log operativo sin tokens.

## Pruebas automatizadas

Ejecutar:

```bash
npm --prefix backend test
```

Las pruebas usan mocks y validan:

- envio exitoso de verificacion;
- envio exitoso de recuperacion;
- error cuando falta cada variable Twilio requerida;
- error cuando Twilio no devuelve `sid`;
- propagacion de error si Twilio falla;
- ausencia de credenciales en logs.

Estas pruebas no envian SMS reales y no consumen saldo de Twilio.

## Prueba manual para sustentacion

1. Confirmar que las variables Twilio estan configuradas localmente o en el entorno de despliegue.
2. Iniciar frontend y backend.
3. Registrar o recuperar una cuenta con telefono valido.
4. Solicitar codigo por SMS.
5. Verificar que el mensaje llegue al telefono autorizado.
6. Tomar captura del formulario, del SMS recibido y del dashboard de Twilio.
7. Ocultar numeros completos, tokens y datos sensibles en las capturas.

## Evidencia externa pendiente

El repositorio deja lista la integracion y las pruebas mockeadas. Para defender nivel excelente, el equipo debe anexar evidencia real:

- captura del formulario que solicita SMS;
- captura del SMS recibido;
- captura del dashboard de Twilio con mensaje entregado;
- log de envio exitoso sin tokens;
- resultado de `npm --prefix backend test`.

No se debe afirmar que un SMS fue recibido si no existe captura o registro externo verificable.
