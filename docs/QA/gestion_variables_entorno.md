# Gestion de Variables de Entorno

## Contexto academico

El archivo `.env` se conserva temporalmente por tratarse de un proyecto academico que requiere reproducibilidad por parte del equipo y del evaluador. Esta decision permite ejecutar el sistema durante la sustentacion sin depender de configuracion externa adicional.

Sin embargo, en un entorno profesional o productivo, las credenciales no deben versionarse en Git. La practica recomendada seria usar `.env.example` con placeholders, GitHub Secrets para CI/CD, variables protegidas en el entorno de despliegue y rotacion de credenciales despues de la entrega.

## Riesgo de seguridad

Versionar credenciales puede exponer acceso a base de datos, correo, tokens de autenticacion o proveedores externos. Por eso, durante la sustentacion no se debe abrir ni proyectar el contenido de `.env`, y los reportes no deben copiar valores reales.

## Variables requeridas

Solo se documentan nombres, nunca valores:

- `MONGO_URI`
- `DOCKER_MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_API_URL`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `OTP_EXPIRACION_MINUTOS`
- `OTP_MAX_INTENTOS`
- `OTP_COOLDOWN_SEGUNDOS`
- `BACKEND_IMAGE`
- `FRONTEND_IMAGE`
- `IMAGE_TAG`

## GitHub Secrets recomendados

| Secret | Uso |
| --- | --- |
| `SONAR_TOKEN` | Analisis SonarCloud. |
| `DOCKERHUB_USERNAME` | Publicacion de imagenes DockerHub. |
| `DOCKERHUB_TOKEN` | Autenticacion de publicacion DockerHub. |
| `VITE_GOOGLE_CLIENT_ID` | Build frontend cuando se requiera Google Auth. |

## Buenas practicas para produccion

1. Mantener `.env` fuera de Git.
2. Usar `.env.example` con placeholders.
3. Configurar secretos en GitHub Actions o en el proveedor de despliegue.
4. Rotar credenciales despues de una entrega academica.
5. Limitar permisos de tokens y usuarios de base de datos.
6. No incluir valores reales en logs, capturas, reportes ni pruebas.
7. Revisar historial de Git si alguna credencial fue expuesta.

## Verificacion antes de sustentar

Ejecutar busquedas de control y revisar resultados sin publicar valores:

```bash
grep -R "TWILIO_AUTH_TOKEN" Docs .github apps backend --exclude-dir=node_modules --exclude-dir=.git || true
grep -R "EMAIL_PASS" Docs .github apps backend --exclude-dir=node_modules --exclude-dir=.git || true
grep -R "JWT_SECRET" Docs .github apps backend --exclude-dir=node_modules --exclude-dir=.git || true
```

Si aparece un valor real en documentacion o codigo no destinado a configuracion local, debe retirarse o redactarse. Si aparece dentro de `.env`, no se debe proyectar ni copiar; despues de la entrega se recomienda rotacion.
