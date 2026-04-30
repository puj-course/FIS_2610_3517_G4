# Issue propuesta: Registro falla por acceso Atlas (MongooseServerSelectionError)

## Titulo sugerido
[Auth] Registro de usuario falla cuando la IP local no esta permitida en MongoDB Atlas

## Descripcion
El flujo de registro falla con error de conexion a MongoDB Atlas cuando la IP publica de la maquina no esta en la lista de acceso de Atlas.

Mensaje observado:
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster

## Impacto
- No se puede registrar usuario.
- No se puede autenticar en entornos nuevos hasta configurar Atlas manualmente.

## Causa raiz
- Falta de preflight automatizado para validar entorno de autenticacion.
- Falta de mensaje guiado para el equipo cuando Atlas bloquea por red.

## Criterios de aceptacion
- Existe un script de diagnostico ejecutable localmente para auth.
- El pipeline CI valida entorno de auth sin exponer secretos.
- El backend responde 503 con mensaje accionable cuando DB no esta disponible.
- Documentacion base de variables disponible en .env.example.

## Solucion aplicada en este cambio
- Script backend/scripts/auth-doctor.js.
- Scripts npm doctor:auth y doctor:auth:ci.
- Pipeline HU-454 ejecuta preflight auth automaticamente.
- Restauracion de backend/.env.example.

## Evidencia esperada
- npm run doctor:auth reporta DNS/DB OK en maquina configurada.
- GitHub Actions muestra job backend_ci con paso Preflight de autenticacion (env + DNS) en verde.
