# 10 - Guion de sustentacion

Este guion propone un orden de presentacion para defender 5.0 sin afirmar evidencias no verificadas.

## Apertura

> DriveControl / AutoMinder Enterprise es una aplicacion para gestion documental de flotas. El sistema usa React + Vite en frontend, Node.js + Express en backend, MongoDB como persistencia, Docker Compose para ejecucion reproducible, SonarCloud para calidad tecnica y Twilio para integracion SMS.

## Orden sugerido

| Minuto | Responsable | Tema | Evidencia |
|---:|---|---|---|
| 0-2 | Product Owner | Problema, alcance y valor | README actualizado |
| 2-5 | Scrum Master | Metodologia, milestones, HU y postmortem | `07_agil_postmortem_trazabilidad.md` |
| 5-8 | QA Lead | Pruebas, coverage, SonarCloud | `03_pruebas_unitarias_coverage.md`, `02_sonarcloud.md` |
| 8-11 | DevOps | Docker, Compose, CI/CD | `04_despliegue_docker_ci_cd.md` |
| 11-13 | Backend/QA | SMS Twilio | `05_integracion_sms_twilio.md` |
| 13-15 | Equipo | Trabajo en equipo y cierre | `09_trabajo_equipo.md` |

## Frases seguras

Usar:

- "Esta evidencia esta implementada y aqui esta el archivo/ruta."
- "Esta ejecucion se demuestra con esta captura."
- "Esta parte queda pendiente de captura, por eso no la contamos como evidencia ejecutada."
- "Las credenciales se entregan por canal privado y no estan en el repositorio."
- "La cobertura Sonar corresponde al alcance configurado en `apps/web/src`."

Evitar:

- "Se desplego" sin workflow o captura.
- "Se publico en DockerHub" sin repositorio/tag visible.
- "Se recibio SMS" sin captura del mensaje o Twilio.
- "Todo el sistema tiene 98% coverage" si Sonar solo analiza frontend.

## Preguntas probables y respuesta base

| Pregunta | Respuesta segura |
|---|---|
| Que metricas propias implementaron? | Riesgo documental, completitud operativa y criticidad de alertas, implementadas en `qualityMetrics.js`. |
| Por que no son Sonar? | Porque miden estado operativo de la flota y datos del dominio, no propiedades estaticas del codigo. |
| Como se reproduce Docker? | Con `docker compose up -d --build`, validando health backend, frontend y proxy `/api`. |
| Como prueban SMS? | Con tests mockeados y, para excelente, con captura real de Twilio/SMS. |
| Donde esta la trazabilidad agil? | En issues, PRs, milestones y el reporte final de sprints. |
| Como protegen secretos? | `.env.example` con placeholders, `.env` ignorados, secretos por GitHub Secrets o canal privado. |

## Checklist de ensayo

- [ ] Cada integrante habla maximo 3 minutos.
- [ ] Nadie muestra tokens, `.env` reales ni correos privados completos.
- [ ] Las capturas estan en carpetas `img/`.
- [ ] Las rutas se abren antes de presentar.
- [ ] El equipo sabe explicar que esta implementado y que requiere evidencia externa.
- [ ] El equipo no contradice el estado real de issues/milestones.

