# Datos demo para DriveControl / AutoMinder Enterprise

Este paquete carga datos demo colombianos para validar dashboard, vehiculos, conductores, documentos, alertas y reportes.

## Conteos esperados

- 12 conductores.
- 14 vehiculos.
- 12 SOAT.
- 12 RTM.
- 2 vehiculos quedan sin SOAT/RTM para validar reportes de faltantes.

## Formatos del seed

- Placa: `ABC123`, tres letras y tres numeros, sin guiones ni espacios.
- Cedula: 10 digitos numericos.
- Celular: 10 digitos iniciando por `3`.
- SOAT canonico: `vehiculoId`, `placaVehiculo`, `numeroPoliza`, `aseguradora`, `fechaExpedicion`, `fechaInicioVigencia`, `fechaFinVigencia`, `observaciones`, `ownerEmail`, `ownerEmpresa`, `seedTag`.
- RTM canonica: `vehiculoId`, `placaVehiculo`, `numeroCertificado`, `cda`, `nitCda`, `fechaExpedicion`, `fechaVencimiento`, `resultado`, `observaciones`, `ownerEmail`, `ownerEmpresa`, `seedTag`.

## Variables

La app filtra por `ownerEmail`. Debes iniciar sesion con el mismo correo usado al importar.

Valores por defecto del seed:

```text
OWNER_EMAIL=uafv718ily@lnovic.com
OWNER_EMPRESA=Transportes Syntix Demo
```

Puedes cambiarlos con variables de entorno.

## Importar usando Docker

Desde la raiz del repo:

```bash
MONGO_URI=$(grep '^MONGO_URI=' .env | cut -d= -f2-)

docker run --rm \
  -e OWNER_EMAIL="sekasolnin@gmail.com" \
  -e OWNER_EMPRESA="Sarm" \
  -v "$PWD/Docs/QA/datos_mongo_seed:/seed" \
  mongo:7 \
  mongosh "$MONGO_URI" /seed/seed_drivecontrol_demo.mongosh.js
```

El seed limpia primero los registros con el mismo `{ ownerEmail, seedTag }` y tambien los `_id` demo usados por este archivo. Por eso se puede ejecutar varias veces sin `MongoBulkWriteError E11000 duplicate key`.

## Verificar API

Con el backend en `localhost:5000`:

```bash
curl -s "http://localhost:5000/api/vehiculos?email=sekasolnin%40gmail.com"
curl -s "http://localhost:5000/api/conductores?email=sekasolnin%40gmail.com"
curl -s "http://localhost:5000/api/soats?email=sekasolnin%40gmail.com"
curl -s "http://localhost:5000/api/rtms?email=sekasolnin%40gmail.com"
```

## Verificar en la app

1. Levanta el stack:

```bash
docker compose up -d --build
```

2. Abre:

```text
http://localhost:3000
```

3. Inicia sesion con el mismo correo usado en `OWNER_EMAIL`.

4. Revisa:

- Dashboard.
- Vehiculos.
- Conductores.
- Documentos.
- Alertas.
- Reportes.

## Limpiar datos demo

```bash
MONGO_URI=$(grep '^MONGO_URI=' .env | cut -d= -f2-)

docker run --rm \
  -v "$PWD/Docs/QA/datos_mongo_seed:/seed" \
  mongo:7 \
  mongosh "$MONGO_URI" --eval '
    const OWNER_EMAIL = "sekasolnin@gmail.com";
    const SEED_TAG = "drivecontrol-demo-alertas-2026-05";
    db.conductors.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
    db.vehiculos.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
    db.soats.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
    db.rtms.deleteMany({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG });
  '
```
