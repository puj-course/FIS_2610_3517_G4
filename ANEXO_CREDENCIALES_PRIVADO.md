# Anexo privado de credenciales academicas

Este archivo es para entregar credenciales reales al profesor por un canal privado. No debe subirse a GitHub, no debe adjuntarse a issues, PRs ni capturas publicas.

Estado de Git esperado:

```bash
git check-ignore -v ANEXO_CREDENCIALES_PRIVADO.md
```

## Datos de entrega

| Campo | Valor |
|---|---|
| Proyecto | DriveControl / AutoMinder Enterprise |
| Equipo | SYNTIX TECH |
| Curso | Fundamentos de Ingenieria de Software |
| Fecha de entrega | <fecha> |
| Responsable de entrega | <nombre-integrante> |
| Canal privado usado | <correo institucional / aula virtual / mensaje privado autorizado> |

## Credenciales backend

| Variable | Valor real | Uso | Observaciones |
|---|---|---|---|
| `MONGO_URI` | `<pegar-valor-real>` | Conexion MongoDB externa | No publicar |
| `DOCKER_MONGO_URI` | `<pegar-valor-real-si-aplica>` | Conexion MongoDB en Docker | No publicar |
| `JWT_SECRET` | `<pegar-valor-real>` | Firma de tokens JWT | No publicar |
| `GOOGLE_CLIENT_ID` | `<pegar-valor-real>` | OAuth backend | No publicar |
| `EMAIL_HOST` | `<pegar-valor-real>` | SMTP | Ejemplo: `smtp.gmail.com` |
| `EMAIL_PORT` | `<pegar-valor-real>` | SMTP | Ejemplo: `587` |
| `EMAIL_USER` | `<pegar-valor-real>` | Cuenta remitente | No publicar |
| `EMAIL_PASS` | `<pegar-valor-real>` | Contrasena/app password SMTP | No publicar |
| `TWILIO_ACCOUNT_SID` | `<pegar-valor-real>` | SMS Twilio | No publicar |
| `TWILIO_AUTH_TOKEN` | `<pegar-valor-real>` | SMS Twilio | No publicar |
| `TWILIO_PHONE_NUMBER` | `<pegar-valor-real>` | Numero remitente Twilio | No publicar |

## Credenciales frontend

| Variable | Valor real | Uso | Observaciones |
|---|---|---|---|
| `VITE_API_URL` | `<pegar-valor-real>` | URL API frontend | Ejemplo local: `/api` |
| `VITE_GOOGLE_CLIENT_ID` | `<pegar-valor-real>` | OAuth frontend | No publicar |

## Credenciales CI/CD

| Variable o secret | Valor real | Uso | Observaciones |
|---|---|---|---|
| `SONAR_TOKEN` | `<pegar-valor-real>` | Analisis SonarCloud | Preferir GitHub Secrets |
| `DOCKERHUB_USERNAME` | `<pegar-valor-real>` | Publicacion DockerHub | Preferir GitHub Secrets |
| `DOCKERHUB_TOKEN` | `<pegar-valor-real>` | Publicacion DockerHub | Preferir GitHub Secrets |
| `BACKEND_IMAGE` | `<pegar-valor-real>` | Imagen backend | Ejemplo: `<usuario>/drivectrl-backend` |
| `FRONTEND_IMAGE` | `<pegar-valor-real>` | Imagen frontend | Ejemplo: `<usuario>/drivectrl-frontend` |
| `IMAGE_TAG` | `<pegar-valor-real>` | Version de despliegue | Ejemplo: `sha-abcdef0` |

## Comandos para usar las credenciales localmente

Copiar los valores reales desde este anexo a los archivos `.env` locales:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp apps/web/.env.example apps/web/.env
```

Luego reemplazar placeholders por valores reales solo en la maquina local.

## Confirmacion antes de publicar

Antes de hacer commit o push:

```bash
git status --short
git check-ignore -v ANEXO_CREDENCIALES_PRIVADO.md
git ls-files | grep -E '(^|/)\\.env(\\..*)?$|ANEXO_CREDENCIALES_PRIVADO.md'
```

Resultado esperado:

- `ANEXO_CREDENCIALES_PRIVADO.md` debe aparecer como ignorado.
- Ningun `.env` real debe aparecer como archivo versionado nuevo.
- Solo deben versionarse `.env.example`.
