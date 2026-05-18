# 08 - Release final

Este documento organiza el cierre de version para sustentar que el proyecto tiene control de versiones y trazabilidad por release.

## Objetivo

Defender que la entrega final no es un conjunto disperso de cambios, sino una version identificable del producto, con rama, PR, checks, evidencias y tag/release.

## Estado requerido

| Elemento | Requerido para 5.0 | Estado |
|---|---|---|
| Rama de trabajo | `feature-sarm-m` | Confirmar |
| PR destino | `develop` | Pendiente captura |
| Checks verdes | Tests, Sonar, Docker si aplica | Pendiente captura |
| Tag final | `v1.0.0` o `entrega-final` | Pendiente |
| Release notes | Resumen de cambios y evidencias | Pendiente |
| Issues cerradas | `Closes #ID` en PR | Pendiente |

## Comandos sugeridos

Crear rama si no existe:

```bash
git checkout -b feature-sarm-m
```

Commit documental:

```bash
git add README.md .gitignore .env.example Docs/QA Docs/Agile
git commit -m "docs: agregar paquete final de evidencias de sustentacion."
```

Push:

```bash
git push origin feature-sarm-m
```

Tag final despues de merge y validaciones:

```bash
git tag -a v1.0.0 -m "Entrega final DriveControl."
git push origin v1.0.0
```

## Modelo de PR

```markdown
## Resumen
- Agrega paquete final de evidencias para sustentacion 5.0.
- Actualiza README al stack real del proyecto.
- Documenta gestion segura de variables de entorno.
- Deja placeholders de capturas sin inventar evidencia.

## Evidencias
- Docs/QA/evidencias_finales/00_indice_sustentacion_5.md
- Docs/Agile/evidencias_finales/07_agil_postmortem_trazabilidad.md

## Validaciones
- [ ] npm --prefix apps/web test
- [ ] npm --prefix backend test
- [ ] docker compose -f docker-compose.yml config
- [ ] SonarCloud Quality Gate revisado

## Issues
Closes #ID
```

## Evidencias pendientes

| Captura | Archivo esperado | Estado |
|---|---|---|
| PR final hacia develop | `img/pr-release-final.png` | Pendiente |
| Checks del PR | `img/pr-checks-green.png` | Pendiente |
| Release/tag | `img/release-tag.png` | Pendiente |
| Comparacion branch | `img/compare-feature-develop.png` | Pendiente |

## Acciones para defender 5.0

- [ ] No cerrar PR sin checks.
- [ ] No crear release si quedan issues criticas abiertas.
- [ ] Adjuntar evidencia de tag/release.
- [ ] Relacionar release con milestones cerrados.
- [ ] Usar commit convencional con punto final.
