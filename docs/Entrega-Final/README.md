# Entrega Final - DriveControl / AutoMinder Enterprise

Esta carpeta contiene el informe final academico en LaTeX y el paquete visual de evidencias usado para defender la rubrica. La entrega queda centralizada para Overleaf en:

- `main.tex`
- `README.md`
- `evidencias/`
- `img/`
- `anexos/`

No modificar, borrar, des-trackear ni reemplazar `apps/web/.env`. Se conserva por decision academica para que el profesor pueda ejecutar `make build` y `make up` sin configurar credenciales manualmente. En el informe y en los README solo se mencionan nombres de variables, nunca valores reales.

## Archivo principal para Overleaf

El archivo principal es:

```text
main.tex
```

## Carpetas que se deben subir a Overleaf

Subir completa la carpeta `docs/Entrega-Final/` o, como minimo:

```text
main.tex
evidencias/
img/
anexos/
```

`img/` contiene el logo usado por la portada. `anexos/` contiene exportaciones y archivos de apoyo para metricas agiles; no reemplaza las capturas visuales del informe.

## Compilacion con Docker

Desde la raiz del repositorio:

```bash
docker run --rm -it -v "$PWD/docs/Entrega-Final:/work" -w /work texlive/texlive:latest pdflatex -interaction=nonstopmode -halt-on-error main.tex
```

Si se requiere actualizar tabla de contenido y referencias:

```bash
cd docs/Entrega-Final
pdflatex -interaction=nonstopmode -halt-on-error main.tex
pdflatex -interaction=nonstopmode -halt-on-error main.tex
```

## Mapa de evidencias visuales

Las imagenes usadas por `main.tex` estan centralizadas en `docs/Entrega-Final/evidencias/` y numeradas de forma consecutiva.

| N. | Archivo | Seccion del informe | Que demuestra | Criterio de rubrica asociado |
|---|---|---|---|---|
| 01 | `01_pr_checks_aprobados.png` | CI/CD | Checks aprobados del PR de cierre. | Despliegue y configuracion |
| 02 | `02_pr_sonar_quality_gate.png` | Pruebas / SonarCloud | Quality Gate aprobado en PR. | Metricas / Pruebas |
| 03 | `03_sonarcloud_coverage_main.png` | SonarCloud | Quality Gate, coverage, duplicidad y seguridad en `main`. | Metricas / Pruebas |
| 04 | `04_sonarcloud_metricas_generales.png` | SonarCloud | Vista general de metricas del analisis. | Metricas / Pruebas |
| 05 | `05_frontend_tests_ok.png` | Pruebas unitarias | Ejecucion exitosa de pruebas frontend. | Pruebas unitarias |
| 06 | `06_frontend_build_ok.png` | Pruebas / build | Build frontend exitoso. | Pruebas / Despliegue |
| 07 | `07_backend_tests_ok.png` | Pruebas backend | Tests backend del servicio SMS/Twilio. | Pruebas / SMS |
| 08 | `08_make_build.png` | Docker | Salida de `make build`. | Despliegue y configuracion |
| 09 | `09_make_up.png` | Docker | Salida de `make up`. | Despliegue y configuracion |
| 10 | `10_docker_compose_config.png` | Docker | Configuracion Compose valida. | Despliegue y configuracion |
| 11 | `11_docker_compose_ps.png` | Docker | Servicios arriba. | Despliegue y configuracion |
| 12 | `12_docker_network_inspect.png` | Docker y red | Red `drivecontrol-net` y subnet `172.28.0.0/16`. | Despliegue y configuracion |
| 13 | `13_pr_develop_main_checks.png` | CI/CD | Checks del PR hacia `main`. | Despliegue / Trazabilidad |
| 14 | `14_github_actions_docker_validate.png` | CI/CD Docker | Validacion Docker en GitHub Actions. | Despliegue y configuracion |
| 15 | `15_dockerhub_tags_1.png` | CI/CD Docker | Tags publicados visibles en DockerHub. | Despliegue y configuracion |
| 16 | `16_dockerhub_tags_2.png` | CI/CD Docker | Segunda vista de tags publicados. | Despliegue y configuracion |
| 17 | `17_metricas_calidad_app.png` | Metricas propias | Tarjetas de metricas dinamicas: 62%, 56% y 73%. | Metricas de calidad |
| 18 | `18_sms_app_verificacion.png` | SMS/Twilio | Verificacion SMS desde la app. | Integracion SMS |
| 19 | `19_sms_twilio_recibido.png` | SMS/Twilio | Recepcion o registro de mensaje. | Integracion SMS |
| 20 | `20_issue_618_hu_entrega_tecnica.png` | Trazabilidad | HU padre #618. | Agile / Trazabilidad |
| 21 | `21_github_issues_sprint13.png` | Trazabilidad | Issues #618 a #622. | Agile / Trazabilidad |
| 22 | `22_github_prs_finales.png` | Trazabilidad | PR #623 y PR #625. | Agile / CI/CD |
| 23 | `23_pr_sin_conflictos_develop.png` | Trazabilidad | PR sin conflictos. | Agile / CI/CD |
| 24 | `24_pr_issues_relacionadas.png` | Trazabilidad | Issues relacionadas en PR. | Agile / Trazabilidad |
| 25 | `25_agile_milestones_semestre.png` | Metodologia agil | Milestones M1-M4 cerrados. | Agile y postmortem |
| 26 | `26_agile_project_board.png` | Metodologia agil | Project board, estados e integrantes. | Agile y postmortem |
| 27 | `27_github_contributors_semestre.png` | Metodologia agil | Contributors/Insights. | Agile y postmortem |
| 28 | `28_github_commits_por_integrante.png` | Metodologia agil | Commits por integrante. | Agile y postmortem |
| 29 | `29_backend_health_db.png` | Docker | Backend saludable con DB. | Despliegue y configuracion |
| 30 | `30_frontend_http_200.png` | Docker | Frontend responde HTTP 200. | Despliegue y configuracion |
| 31 | `31_frontend_proxy_api_health.png` | Docker | Proxy frontend hacia API. | Despliegue y configuracion |
| 32 | `32_diagrama_base_datos.png` | Anexos | Modelo de datos que soporta metricas y alertas. | Soporte tecnico |

## Capturas pendientes

Estas capturas tienen espacio reservado en `main.tex` mediante `\insertplaceholderfigure`. No se deben crear valores manuales; se completan solo con evidencia real.

| Imagen sugerida | Seccion | Que debe mostrar | Ruta exacta | Como tomarla |
|---|---|---|---|---|
| `33_github_issues_por_integrante.png` | Metricas agiles finas | Issues totales/cerradas agrupadas por integrante. | `docs/Entrega-Final/evidencias/33_github_issues_por_integrante.png` | Exportar `issues.json` con `gh`, calcular tabla por assignee y capturar la tabla o GitHub Insights si aplica. |
| `34_github_commits_por_integrante.png` | Metricas agiles finas | Commits por integrante normalizado. | `docs/Entrega-Final/evidencias/34_github_commits_por_integrante.png` | Usar `git shortlog -sne --all` o Insights > Contributors y capturar la vista. |
| `35_github_lineas_codigo_por_integrante.png` | Metricas agiles finas | Lineas agregadas/eliminadas por integrante. | `docs/Entrega-Final/evidencias/35_github_lineas_codigo_por_integrante.png` | Generar resumen desde `git log --numstat`, normalizar aliases y capturar la tabla. |
| `36_github_prs_por_integrante.png` | Metricas agiles finas | PRs abiertos/cerrados/mergeados por autor. | `docs/Entrega-Final/evidencias/36_github_prs_por_integrante.png` | Exportar `pull_requests.json` con `gh`, agrupar por `author.login` y capturar la tabla. |
| `37_github_reviews_por_integrante.png` | Metricas agiles finas | Reviews por integrante, si GitHub entrega el dato. | `docs/Entrega-Final/evidencias/37_github_reviews_por_integrante.png` | Usar GitHub GraphQL o vista de reviews por PR; si no existe, dejar pendiente. |
| `38_sonarcloud_measures_main.png` | SonarCloud complementario | Measures/Summary de `main`: Maintainability, Reliability, Security Hotspots, Bugs, Vulnerabilities, Coverage y Duplications. | `docs/Entrega-Final/evidencias/38_sonarcloud_measures_main.png` | Abrir SonarCloud, proyecto `puj-course_FIS_2610_3517_G4`, rama `main`, pestaña Summary o Measures y tomar captura legible. |

## Validacion de metricas con datos de prueba

Las metricas propias del sistema son dinamicas. Se calculan con base en los vehiculos, documentos, conductores y alertas registrados en la cuenta activa.

Los valores de la evidencia visual son:

- Indice de riesgo documental: 62%.
- Completitud de datos operativos: 56%.
- Indice de criticidad de alertas: 73%.

Estos resultados corresponden a la cuenta usada para validacion, que ya tenia datos operativos cargados. Si se crea una cuenta nueva sin vehiculos, documentos, conductores ni alertas, los indicadores pueden aparecer en 0% o como sin datos evaluables. Eso no es un fallo: confirma que el calculo responde al estado real de los datos disponibles.

Para reproducir `17_metricas_calidad_app.png`, usar una cuenta con datos de prueba o cargar registros suficientes de flota, documentos y alertas antes de abrir la pantalla de reportes.

## Metricas agiles finas con GitHub CLI

El conector GitHub permite validar el repositorio, pero el entorno local actual no tiene `gh` instalado. Para regenerar anexos completos:

```bash
gh auth status
gh repo set-default puj-course/FIS_2610_3517_G4

gh issue list --state all --limit 1000 --json number,title,state,author,assignees,labels,milestone,createdAt,closedAt,url > docs/Entrega-Final/anexos/issues.json

gh pr list --state all --limit 1000 --json number,title,state,author,assignees,labels,milestone,createdAt,closedAt,mergedAt,url > docs/Entrega-Final/anexos/pull_requests.json

gh api repos/puj-course/FIS_2610_3517_G4/milestones --paginate > docs/Entrega-Final/anexos/milestones.json

gh api repos/puj-course/FIS_2610_3517_G4/contributors --paginate > docs/Entrega-Final/anexos/contributors.json

git shortlog -sne --all > docs/Entrega-Final/anexos/commits_por_autor.txt

git log --all --pretty=format:"%h%x09%an%x09%ad%x09%s" --date=short > docs/Entrega-Final/anexos/commits_detalle.tsv

git log --all --numstat --pretty="%an" > docs/Entrega-Final/anexos/lineas_por_autor_raw.txt
```

Los aliases de Git deben normalizarse antes de interpretar participacion individual, porque un integrante puede aparecer con diferentes correos o nombres.

## Captura complementaria en SonarCloud

Para completar `38_sonarcloud_measures_main.png`:

1. Abrir SonarCloud.
2. Entrar al proyecto `puj-course_FIS_2610_3517_G4`.
3. Seleccionar la rama `main`.
4. Abrir `Summary` o `Measures`.
5. Capturar Quality Gate, Coverage, Duplications, Security, Reliability y Maintainability.
6. Guardar la imagen como `docs/Entrega-Final/evidencias/38_sonarcloud_measures_main.png`.

## Comandos de validacion

Desde la raiz del repositorio:

```bash
npm --prefix apps/web test
npm --prefix backend test
make build
make up
docker compose ps
docker network inspect drivecontrol-net
```

Validaciones de documentacion:

```bash
git diff --check
git status --short apps/web/.env
git ls-files --stage apps/web/.env
git status --short docs/Agile
```

## Limpieza de auxiliares LaTeX

No subir archivos generados localmente salvo decision explicita del equipo:

```text
*.aux
*.log
*.out
*.toc
*.lof
*.lot
*.fls
*.fdb_latexmk
*.synctex.gz
main.pdf
```

## Commit sugerido

```bash
docs(report): limpiar entrega final y reforzar evidencia de rubrica. Closes #618.
```
