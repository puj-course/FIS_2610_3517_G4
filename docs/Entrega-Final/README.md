# Entrega Final - DriveControl / AutoMinder Enterprise

Esta carpeta centraliza el informe final academico de SYNTIX TECH para la entrega de Fundamentos de Ingenieria de Software.

## Contenido

| Ruta | Contenido |
|---|---|
| `main.tex` | Informe principal listo para compilar en Overleaf. |
| `evidencias/` | Capturas usadas por el informe final. |
| `img/` | Imagenes generales del informe, incluido el logo si se anexa. |
| `anexos/` | Espacio para anexos adicionales no sensibles. |
| `final-evaluation/` | Documentacion fuente y paquete de auditoria conservado como respaldo. |

## Como abrirlo en Overleaf

1. Subir a Overleaf la carpeta `docs/Entrega-Final/` completa.
2. Seleccionar `main.tex` como archivo principal.
3. Compilar con PDFLaTeX.
4. Si falta una imagen, el informe no falla: muestra un recuadro reservado mediante `\insertplaceholderfigure{}`.

## Evidencias usadas

Las evidencias principales estan en `evidencias/sprint-13/` y cubren:

- SonarCloud en `main`.
- Checks y Quality Gate de PR.
- Pruebas frontend y backend.
- Build frontend.
- Docker Compose, `docker compose ps` y `docker network inspect drivecontrol-net`.
- SMS/Twilio.
- Issue padre `#618` y trazabilidad de PRs.

Tambien se copiaron evidencias complementarias de DockerHub y GitHub Actions a `evidencias/docker/`.

## Evidencias faltantes o recomendadas

- Logo oficial de la Javeriana en `img/logo-javeriana.png`, si el equipo cuenta con permiso de uso.
- Capturas finales de GitHub Milestones cerrados.
- Capturas de GitHub Insights/contributors por integrante.
- Captura de release/tag final si se quiere defender control de versiones excelente.
- Revision manual de capturas SMS/Twilio para ocultar telefono, SID, codigo OTP u otros datos sensibles.

## No tocar

No modificar, borrar, des-trackear ni reemplazar `apps/web/.env`.

Ese archivo se conserva por decision academica para que el profesor pueda ejecutar el proyecto con:

```bash
make build
make up
```

El informe no muestra valores reales de credenciales. Solo menciona nombres de variables como `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` y `TWILIO_PHONE_NUMBER`.

## Comandos de validacion

```bash
npm --prefix apps/web test
npm --prefix backend test
make build
make up
docker compose ps
docker network inspect drivecontrol-net
```

Validacion LaTeX local si el entorno tiene `latexmk`:

```bash
cd docs/Entrega-Final
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

## Commit sugerido

```bash
docs(report): centralizar informe final en latex para overleaf. Closes #618
```
