# Postmortem final

## Resumen ejecutivo

El proyecto llego a una base funcional con frontend, backend, Docker, CI/CD, SonarCloud, pruebas, metricas propias y SMS con Twilio. Los principales riesgos de cierre no son solo de codigo, sino de evidencia: capturas de Sonar, DockerHub, SMS real, milestones y participacion.

## Que salio bien

| Area | Evidencia |
|---|---|
| Metricas propias | Tres metricas implementadas, testeadas y generables en JSON. |
| Pruebas frontend | Suite Vitest sobre utilidades, adaptadores y reglas de dominio. |
| SMS | Servicio Twilio con manejo de errores y tests mockeados. |
| Docker | Compose con MongoDB/backend/frontend, healthchecks y red explicita. |
| CI/CD | Workflows de lint, tests, SonarCloud, Docker build/publish/deploy. |

## Que salio mal

| Problema | Causa raiz | Impacto | Accion correctiva | Responsable |
|---|---|---|---|---|
| Evidencia externa incompleta | Capturas y exports quedaron para el cierre. | Riesgo en Sonar, DockerHub, SMS y Agile. | Generar paquete de evidencias antes de sustentar. | Scrum Master + QA |
| Secretos versionados | `.env` aparece trackeado en Git. | Riesgo de seguridad y observacion de profesor. | Rotar credenciales, dejar `.env` ignorado y evaluar limpieza de historial. | DevOps |
| Milestones/participacion no exportados | `gh` no esta disponible localmente. | Reporte agil incompleto. | Instalar `gh`, exportar JSON y regenerar metricas. | Scrum Master |
| Backend con coverage limitado en Sonar | Sonar analiza frontend; backend tiene tests sin LCOV Sonar. | Puede requerir explicacion de alcance. | Documentar alcance y agregar coverage backend si hay tiempo. | QA + Backend |
| SMS real no capturado | Twilio depende de credenciales/telefono autorizado. | Puede quedar como integracion parcial. | Ejecutar prueba real y capturar Twilio/SMS. | Backend + QA |

## Problemas tecnicos y de proceso

| Tipo | Descripcion | Prevencion |
|---|---|---|
| Tecnico | Rutas de coverage y exclusiones deben ser defendibles. | Revisar Sonar en cada PR de calidad. |
| Tecnico | Redes Docker sin subnet explicito generan dudas de despliegue. | Mantener `drivecontrol-net` con subnet documentado. |
| Proceso | Evidencias no se cierran al mismo tiempo que la HU. | DoD con captura o enlace obligatorio. |
| Proceso | Aliases de autores distorsionan participacion. | Normalizar autores antes del reporte final. |

## Acciones preventivas

1. Crear una checklist por release con Sonar, Docker, SMS, Agile y seguridad.
2. Rechazar PRs de cierre sin evidencia o justificacion.
3. Mantener scripts de export y el informe Overleaf como parte del repositorio.
4. Rotar secretos cuando se detecte exposicion.
5. Preparar una ficha de sustentacion por integrante.

## Evidencia

| Evidencia | Ruta |
|---|---|
| Auditoria rubrica | `docs/Entrega-Final/final-evaluation/auditoria-rubrica.md` |
| Scripts Agile | `scripts/agile/` |
| Informe final Overleaf | `docs/Entrega-Final/main.tex` |
| CI/CD | `.github/workflows/` |
| Docker | `docker-compose.yml`, `Dockerfile`, `apps/web/Dockerfile` |

## Conclusion

El proyecto puede defender una calificacion alta si el equipo completa las evidencias externas reales. La brecha mas seria no es la ausencia de codigo, sino la verificabilidad final ante el profesor.
