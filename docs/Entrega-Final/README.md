# Entrega Final - DriveControl / AutoMinder Enterprise

Esta carpeta centraliza el informe final academico de SYNTIX TECH para la entrega de Fundamentos de Ingenieria de Software.

## Contenido

| Ruta | Contenido |
|---|---|
| `main.tex` | Informe principal listo para compilar en Overleaf. |
| `evidencias/` | Capturas usadas por el informe final. |
| `img/` | Imagenes generales del informe, incluido `javeriana.png`. |
| `agile/` | Capturas de milestones e Insights de GitHub usadas en Scrum/trabajo en equipo. |
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
- Milestones cerrados e Insights/contributors en `agile/`.

Tambien se copiaron evidencias complementarias de DockerHub y GitHub Actions a `evidencias/docker/`.

## Evidencias faltantes o recomendadas

- Revision manual de capturas SMS/Twilio para ocultar telefono, SID, codigo OTP, token, correo u otros datos sensibles.
- Guardar la captura nueva de metricas de calidad de la app como `evidencias/metricas_calidad_app.png`.
- No se creo release/tag final. El informe sustenta control de versiones con PR `#623`, PR `#625`, issues cerradas y commits trazables.

## Capturas pendientes para completar el informe

| Nombre de imagen | Seccion del informe | Que debe mostrar | Como tomar la captura | Ruta donde debe guardarse | Observaciones de censura o privacidad |
|---|---|---|---|---|---|
| `metricas_calidad_app.png` | Metricas de calidad propias | Tarjetas de la app con indice de riesgo documental, completitud de datos operativos e indice de criticidad de alertas. | Abrir la app, entrar a la seccion de metricas de calidad y capturar las tres tarjetas completas. | `docs/Entrega-Final/evidencias/metricas_calidad_app.png` | No debe mostrar datos personales de usuarios, placas privadas o telefonos. |
| `sonarcloud_main_coverage.png` | SonarCloud / pruebas y coverage | Quality Gate, coverage y duplicidad en la rama `main`. | Abrir SonarCloud del proyecto en `main`, vista Overview o Summary, y capturar el panel visible. | `docs/Entrega-Final/evidencias/sonarcloud_main_coverage.png` | No incluir tokens ni configuracion sensible. |
| `docker_network_inspect.png` | Docker y red | Red `drivecontrol-net`, driver `bridge` y subnet `172.28.0.0/16`. | Ejecutar `docker network inspect drivecontrol-net` despues de `make up` y capturar la salida. | `docs/Entrega-Final/evidencias/docker_network_inspect.png` | Verificar que no aparezcan variables de entorno ni secretos. |
| `sms_twilio_evidencia.png` | SMS/Twilio | Envio o recepcion exitosa por Twilio o evidencia del proveedor. | Probar registro/recuperacion por SMS y capturar mensaje recibido, log seguro o dashboard Twilio. | `docs/Entrega-Final/evidencias/sms_twilio_evidencia.png` | Censurar telefono, OTP, SID, token, correo y cualquier dato sensible. |
| `github_issues_sprint13.png` | Trazabilidad / Scrum | Issues `#618` a `#622` cerradas o vinculadas al cierre final. | Filtrar GitHub Issues por los numeros `618..622` y capturar estado, labels y milestone. | `docs/Entrega-Final/evidencias/github_issues_sprint13.png` | No exponer informacion privada de cuentas personales. |
| `github_prs_finales.png` | Trazabilidad tecnica | PR `#623` y PR `#625`, o el flujo `feature-sarm-m -> develop -> main`. | Abrir los PRs finales o la vista de Pull Requests mergeados y capturar titulos, ramas y estado mergeado. | `docs/Entrega-Final/evidencias/github_prs_finales.png` | No mostrar tokens, webhooks ni datos privados de configuracion. |
| `agile_semestre_project_board.png` | Metodologia agil del semestre | Tablero, milestones o avance Scrum del semestre. | Abrir GitHub Projects/Milestones o tablero usado por el equipo y capturar avance general. | `docs/Entrega-Final/evidencias/agile_semestre_project_board.png` | Ocultar datos personales si aparecen perfiles o correos. |
| `make_build.png` | Docker y despliegue | Salida exitosa de `make build`. | Ejecutar `make build` desde la raiz del repositorio y capturar el final del comando. | `docs/Entrega-Final/evidencias/make_build.png` | No mostrar valores de `.env`. |
| `make_up.png` | Docker y despliegue | Salida exitosa de `make up`. | Ejecutar `make up` desde la raiz del repositorio y capturar servicios creados/levantados. | `docs/Entrega-Final/evidencias/make_up.png` | No mostrar valores de `.env`. |
| `docker_compose_ps.png` | Docker y despliegue | Servicios `frontend`, `backend` y `mongodb` levantados y saludables. | Ejecutar `docker compose ps` despues de `make up`. | `docs/Entrega-Final/evidencias/docker_compose_ps.png` | Revisar que no aparezcan secretos en la salida. |

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

## Compilacion con Docker

Esta opcion solo compila el informe LaTeX. No se mezcla con Docker Compose de la aplicacion.

Desde la raiz del repositorio:

```bash
docker run --rm -it \
  -v "$PWD/docs/Entrega-Final:/work" \
  -w /work \
  texlive/texlive:latest \
  sh -lc "pdflatex -interaction=nonstopmode -halt-on-error main.tex && pdflatex -interaction=nonstopmode -halt-on-error main.tex"
```

Se ejecuta dos veces para actualizar correctamente la tabla de contenido.

Docker Compose del sistema sigue siendo:

```bash
make build
make up
```

## Commit sugerido

```bash
docs(report): ampliar informe final con evidencias de rubrica. Closes #618
```
