#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="docs/final-evaluation/pdf"
mkdir -p "$OUT_DIR"

sources=(
  "docs/final-evaluation/auditoria-rubrica.md:auditoria-rubrica.pdf"
  "docs/final-evaluation/metricas-calidad.md:metricas-calidad.pdf"
  "docs/final-evaluation/sonarqube-interpretacion.md:sonarqube-interpretacion.pdf"
  "docs/final-evaluation/pruebas-unitarias-coverage.md:pruebas-unitarias-coverage.pdf"
  "docs/final-evaluation/docker-despliegue.md:docker-despliegue.pdf"
  "docs/final-evaluation/cicd.md:cicd.pdf"
  "docs/final-evaluation/integracion-sms.md:integracion-sms.pdf"
  "docs/final-evaluation/agile/informe-general-agil.md:agile-informe-general.pdf"
  "docs/final-evaluation/agile/milestone-1.md:agile-milestone-1.pdf"
  "docs/final-evaluation/agile/milestone-2.md:agile-milestone-2.pdf"
  "docs/final-evaluation/agile/milestone-3.md:agile-milestone-3.pdf"
  "docs/final-evaluation/agile/milestone-4.md:agile-milestone-4.pdf"
  "docs/final-evaluation/agile/metricas-scrum.md:agile-metricas-scrum.pdf"
  "docs/final-evaluation/agile/postmortem.md:postmortem.pdf"
)

if command -v pandoc >/dev/null 2>&1; then
  for item in "${sources[@]}"; do
    src="${item%%:*}"
    dst="$OUT_DIR/${item##*:}"
    pandoc "$src" -f gfm -o "$dst" --metadata lang=es
    echo "Generado $dst"
  done
  exit 0
fi

if command -v markdown-pdf >/dev/null 2>&1; then
  for item in "${sources[@]}"; do
    src="${item%%:*}"
    dst="$OUT_DIR/${item##*:}"
    markdown-pdf "$src" -o "$dst"
    echo "Generado $dst"
  done
  exit 0
fi

cat >&2 <<'EOF'
No se encontro pandoc ni markdown-pdf.

Instalacion sugerida:
  sudo apt-get update && sudo apt-get install -y pandoc texlive-xetex

Alternativa Node:
  npm install -g markdown-pdf

Luego ejecuta:
  scripts/generate_final_pdfs.sh
EOF

exit 2
