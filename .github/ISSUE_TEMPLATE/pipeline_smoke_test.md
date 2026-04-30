---
name: Pipeline smoke test
about: Ejecutar prueba controlada de CI/CD de HU-454
title: "[HU-454][Smoke] Probar pipeline en rama <rama>"
labels: ["ci", "pipeline", "testing"]
assignees: []
---

## Objetivo
Validar que la pipeline de HU-454 ejecuta CI y, cuando aplique, CD por hooks.

## Checklist de prueba
- [ ] Abrir PR hacia `develop` con un cambio minimo (ej. comentario).
- [ ] Verificar que corren `frontend_ci` y `backend_ci`.
- [ ] Confirmar que el PR queda bloqueado si falla lint/build.
- [ ] Hacer merge y verificar trigger de `deploy_backend`.
- [ ] Hacer merge y verificar trigger de `deploy_frontend`.
- [ ] Confirmar mensajes de omision si faltan secrets de hooks.

## Resultado esperado
- CI en verde para cambios validos.
- Deploy disparado por hooks si secrets existen.
- Trazabilidad en Actions con logs claros.

## Evidencia
Adjuntar capturas de:
1. Checks en PR.
2. Ejecucion en `Actions`.
3. Logs de deploy (proveedor backend/frontend).
