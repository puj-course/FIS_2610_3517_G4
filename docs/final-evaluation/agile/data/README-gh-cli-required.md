# GitHub CLI requerido

No se encontro `gh` autenticado en este entorno. Para exportar issues, PRs y milestones reales:

```bash
gh auth login
scripts/agile/export_github_data.sh puj-course/FIS_2610_3517_G4
python3 scripts/agile/generate_agile_report.py
```

Sin `gh`, el reporte solo puede calcular commits/autores desde el historial Git local.
