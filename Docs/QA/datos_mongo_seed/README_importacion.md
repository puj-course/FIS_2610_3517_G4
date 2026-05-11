# Datos demo para DriveControl / AutoMinder Enterprise

Este paquete contiene un seed para cargar datos masivos en MongoDB Atlas y revisar el estado visual de la pagina.

## Que inserta

- 12 conductores.
- 14 vehiculos.
- 12 SOAT.
- 12 RTM.
- Casos verdes, amarillos y rojos para dashboard, documentos y alertas.

## Importante

La app filtra por `ownerEmail`. Para que los datos se vean, debes iniciar sesion con el mismo correo usado al importar.

El seed usa por defecto:

```text
uafv718ily@lnovic.com
```

Si entras con otro correo, cambia `OWNER_EMAIL` al ejecutar el comando.

## Importar usando Docker y la URI del archivo .env

Desde la raiz del repo:

```bash
MONGO_URI=$(grep '^MONGO_URI=' .env | cut -d= -f2-)
docker run --rm \
  -v "$PWD/Docs/QA/datos_mongo_seed:/seed" \
  mongo:7 \
  mongosh "$MONGO_URI" /seed/seed_drivecontrol_demo.mongosh.js
```

## Importar con otro correo de usuario

```bash
MONGO_URI=$(grep '^MONGO_URI=' .env | cut -d= -f2-)
docker run --rm \
  -e OWNER_EMAIL="tu-correo@dominio.com" \
  -e OWNER_EMPRESA="Nombre de Empresa Demo" \
  -v "$PWD/Docs/QA/datos_mongo_seed:/seed" \
  mongo:7 \
  mongosh "$MONGO_URI" /seed/seed_drivecontrol_demo.mongosh.js
```

## Verificar en la app

1. Levanta el stack:

```bash
docker compose up -d --build
```

2. Verifica conexion a Atlas:

```bash
curl http://localhost:5000/api/health/db
curl http://localhost:3000/api/health/db
```

Debe aparecer:

```json
"source":"atlas"
```

3. Abre:

```text
http://localhost:3000
```

4. Inicia sesion con el mismo correo usado en `OWNER_EMAIL`.

5. Revisa:

- Dashboard.
- Vehiculos.
- Documentos.
- Alertas.

## Limpiar solo estos datos demo

Si quieres borrar esta carga de prueba:

```bash
MONGO_URI=$(grep '^MONGO_URI=' .env | cut -d= -f2-)
docker run --rm \
  -v "$PWD/Docs/QA/datos_mongo_seed:/seed" \
  mongo:7 \
  mongosh "$MONGO_URI" --eval '
    const OWNER_EMAIL = "uafv718ily@lnovic.com";
    const SEED_TAG = "drivecontrol-demo-alertas-2026-05";
    db.conductors.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
    db.vehiculos.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
    db.soats.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
    db.rtms.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
  '
```
