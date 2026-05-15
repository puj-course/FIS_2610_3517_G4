# Evaluacion final DriveControl / AutoMinder Enterprise

Este indice organiza la evidencia final contra la rubrica oficial. Usar como guia de sustentacion y no afirmar evidencia externa sin captura o enlace actual.

## Resumen de cumplimiento

| Criterio | Porcentaje | Evidencia | Archivo |
|---|---:|---|---|
| Metricas de calidad | 20% | Tres metricas propias en codigo + SonarCloud configurado. | [metricas-calidad.md](metricas-calidad.md) |
| Despliegue y configuracion | 20% | Dockerfiles, Compose, red explicita, CI/CD Docker. | [docker-despliegue.md](docker-despliegue.md), [cicd.md](cicd.md) |
| Pruebas unitarias | 20% | Vitest coverage, tests backend SMS, pipeline. | [pruebas-unitarias-coverage.md](pruebas-unitarias-coverage.md) |
| Integracion SMS | 10% | Twilio integrado y testeado con mocks; requiere evidencia real. | [integracion-sms.md](integracion-sms.md) |
| Metodologias agiles y postmortem | 30% | Reportes, scripts de export, postmortem. | [agile/](agile/) |
| Trabajo en equipo | Participacion | Commits locales + export GitHub requerido. | [agile/metricas-scrum.md](agile/metricas-scrum.md) |

## Comandos rapidos

```bash
# Frontend
npm --prefix apps/web ci
npm --prefix apps/web run lint
npm --prefix apps/web test
npm --prefix apps/web run build
npm --prefix apps/web run quality:metrics

# Backend
npm --prefix backend ci
npm --prefix backend test

# Docker
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker network inspect drivecontrol-net
docker compose down

# Agile
scripts/agile/export_github_data.sh puj-course/FIS_2610_3517_G4
python3 scripts/agile/generate_agile_report.py

# PDFs
scripts/generate_final_pdfs.sh
```

## Como revisar CI/CD

1. Abrir GitHub Actions.
2. Revisar `CI`, `SonarCloud Analysis` y `Docker CI/CD`.
3. Confirmar eventos `push` y `pull_request`.
4. Confirmar secrets: `SONAR_TOKEN`, `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, opcionales de deploy/Discord/Google.
5. Capturar runs verdes y DockerHub tags.

## Como probar SMS

1. Para modo mock: ejecutar `SMS_PROVIDER=mock SMS_MOCK_ENABLED=true npm --prefix backend start` y `npm --prefix apps/web run dev:frontend`.
2. Para Twilio real: usar las variables `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` y `TWILIO_PHONE_NUMBER` ya configuradas por el equipo.
3. En Docker directo, `docker-compose.yml` carga `apps/web/.env` para el backend mediante `env_file`.
4. Probar registro/recuperacion seleccionando SMS.
5. Capturar SMS recibido o mensaje mock exitoso, dashboard Twilio si aplica y log backend sin secretos.

## Capturas que debe tomar el equipo

| Captura | Criterio |
|---|---|
| Sonar Quality Gate + coverage >80% | Metricas/pruebas |
| Sonar duplicidad/mantenibilidad/security | Metricas |
| `npm test` frontend/backend | Pruebas |
| `docker compose ps` y `network inspect drivecontrol-net` | Docker |
| GitHub Actions Docker publish/deploy | CI/CD |
| DockerHub tags | CI/CD |
| SMS recibido + Twilio dashboard | SMS |
| Milestones/issues/PRs/contributors | Agile/trabajo en equipo |
| Release/tag final | Agile/control de versiones |

## Que decir en sustentacion

- "Las metricas propias estan implementadas en codigo y no son metricas de Sonar; miden riesgo documental, completitud operativa y criticidad de alertas."
- "SonarCloud complementa esas metricas con coverage, duplicidad, mantenibilidad, reliability y seguridad."
- "Docker Compose define red explicita `drivecontrol-net` con subnet `172.28.0.0/16` y los contenedores se comunican por nombres de servicio."
- "El pipeline valida pruebas, coverage, build, Compose y publica imagenes cuando existen secrets DockerHub."
- "SMS usa Twilio; los tests prueban el contrato tecnico y la evidencia real se demuestra con captura del proveedor."
- "La trazabilidad agil se defiende con export de GitHub: issue, branch, commit, PR y milestone."

## Advertencias

- `apps/web/.env` aparece trackeado por Git en este checkout. No mostrarlo en capturas. Rotar credenciales si contienen valores reales.
- Por decision academica, este paquete no modifica ni reemplaza credenciales existentes en `.env`; solo documenta el riesgo.
- No hay `gh` instalado en este entorno; los datos finales de issues/milestones deben exportarse en una maquina con GitHub CLI autenticado.
- No se observaron tags remotos con `git ls-remote --tags origin`; crear release/tag final si se quiere defender control de versiones excelente.
- El script de PDF esta listo, pero en este entorno no estan instalados `pandoc` ni `markdown-pdf`.
