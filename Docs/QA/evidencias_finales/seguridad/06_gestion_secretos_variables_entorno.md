# 06 - Gestion de credenciales academicas y variables de entorno

Este documento define como manejar las credenciales requeridas para la sustentacion academica sin exponer tokens, contrasenas o llaves reales en un repositorio publico.

## Principio

Por requerimiento academico, el profesor puede necesitar credenciales reales para validar Twilio, MongoDB, correo, OAuth, DockerHub o SonarCloud. Esas credenciales se entregan al profesor como anexo privado, no como archivo versionado en GitHub.

La razon tecnica es que un token Twilio, una cadena MongoDB, una clave SMTP o un secreto JWT permiten uso indebido del sistema aun si el proyecto es pedagogico. El repositorio debe contener la estructura reproducible y los nombres de variables; los valores reales se cargan localmente o en GitHub Secrets.

## Archivos esperados

| Archivo | Proposito | Debe contener credenciales reales |
|---|---|---|
| `.env.example` | Archivo de ejemplo raiz para despliegue/Compose | No |
| `backend/.env.example` | Archivo de ejemplo backend | No |
| `apps/web/.env.example` | Archivo de ejemplo frontend | No |
| `.env` | Configuracion local privada para ejecucion academica | Si, solo en maquina local; no versionar |
| `backend/.env` | Configuracion local privada backend | Si, solo en maquina local; no versionar |
| `apps/web/.env` | Configuracion local privada frontend | Si, solo en maquina local; no versionar |

## Variables documentadas

```bash
MONGO_URI=<mongo-uri>
DOCKER_MONGO_URI=<docker-mongo-uri>
PORT=5000
JWT_SECRET=<jwt-secret>
GOOGLE_CLIENT_ID=<google-client-id>
VITE_GOOGLE_CLIENT_ID=<google-client-id>
VITE_API_URL=/api
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<smtp-user>
EMAIL_PASS=<smtp-password>
TWILIO_ACCOUNT_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_PHONE_NUMBER=<twilio-phone-number>
OTP_EXPIRACION_MINUTOS=10
OTP_MAX_INTENTOS=5
OTP_COOLDOWN_SEGUNDOS=60
BACKEND_IMAGE=<dockerhub-user>/drivectrl-backend
FRONTEND_IMAGE=<dockerhub-user>/drivectrl-frontend
IMAGE_TAG=<tag>
```

## GitHub Secrets recomendados

| Secret | Uso |
|---|---|
| `SONAR_TOKEN` | Analisis SonarCloud |
| `DOCKERHUB_USERNAME` | Namespace de DockerHub |
| `DOCKERHUB_TOKEN` | Publicacion de imagenes |
| `VITE_GOOGLE_CLIENT_ID` | Build frontend |
| `BACKEND_DEPLOY_HOOK_URL` | Deploy externo si aplica |
| `FRONTEND_DEPLOY_HOOK_URL` | Deploy externo si aplica |
| `DISCORD_WEBHOOK_URL` | Notificacion si aplica |

## Entrega academica al profesor

Si el profesor exige credenciales reales, preparar un anexo privado fuera del repositorio con esta tabla:

| Variable | Valor real | Uso | Entorno |
|---|---|---|---|
| `MONGO_URI` | Entregado por canal privado | Conexion base de datos | Backend/local |
| `JWT_SECRET` | Entregado por canal privado | Firma JWT | Backend/local |
| `EMAIL_USER` | Entregado por canal privado | Envio de OTP por correo | Backend/local |
| `EMAIL_PASS` | Entregado por canal privado | Envio de OTP por correo | Backend/local |
| `TWILIO_ACCOUNT_SID` | Entregado por canal privado | SMS OTP | Backend/local |
| `TWILIO_AUTH_TOKEN` | Entregado por canal privado | SMS OTP | Backend/local |
| `TWILIO_PHONE_NUMBER` | Entregado por canal privado | Numero remitente SMS | Backend/local |
| `VITE_GOOGLE_CLIENT_ID` | Entregado por canal privado | OAuth frontend | Frontend/local |

Canales aceptables: entrega del aula virtual, correo institucional al profesor, mensaje privado autorizado o carga manual en GitHub Secrets. No incluir estos valores en commits, PRs, README, capturas publicas ni issues.

## Comandos de auditoria

No publicar la salida si contiene valores sensibles.

```bash
git ls-files | grep -E '(^|/)\\.env(\\..*)?$'
git grep -n "TWILIO_AUTH_TOKEN\\|EMAIL_PASS\\|JWT_SECRET\\|MONGO_URI" -- ':!node_modules' ':!.git'
```

En PowerShell:

```powershell
git ls-files | Select-String -Pattern '(^|/)\\.env(\\..*)?$'
git grep -n "TWILIO_AUTH_TOKEN\\|EMAIL_PASS\\|JWT_SECRET\\|MONGO_URI" -- ':!node_modules' ':!.git'
```

## Si hubo credenciales versionadas

No basta con borrarlos del ultimo commit, porque permanecen en el historial. Acciones requeridas:

1. Rotar credenciales afectadas: MongoDB, correo, Google OAuth, Twilio, JWT y tokens.
2. Eliminar o reemplazar `.env` versionados por placeholders antes de publicar.
3. Mantener `.env.example` con nombres de variables.
4. Configurar secretos en GitHub Actions.
5. No proyectar archivos `.env` en sustentacion.
6. Anotar que las credenciales academicas se entregan por anexo privado al profesor.

## Evidencias pendientes

| Captura | Archivo esperado | Estado |
|---|---|---|
| `.gitignore` actualizado | `img/gitignore-env.png` | Pendiente |
| `.env.example` con variables requeridas | `img/env-example-placeholders.png` | Pendiente |
| GitHub Secrets configurados sin mostrar valores | `img/github-secrets-names.png` | Pendiente |
| Anexo privado preparado para el profesor | `img/anexo-credenciales-redacted.png` | Pendiente |

## Acciones para defender 5.0

- [ ] Verificar que no se agregan credenciales reales a commits.
- [ ] Reemplazar valores reales por placeholders en archivos versionados antes de publicar.
- [ ] Rotar credenciales que hayan aparecido en historial.
- [ ] Entregar credenciales academicas al profesor por anexo privado.
- [ ] Incluir capturas redacted, nunca tokens reales.
