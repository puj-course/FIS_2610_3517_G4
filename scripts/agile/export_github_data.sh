#!/usr/bin/env bash
set -euo pipefail

REPO="${1:-puj-course/FIS_2610_3517_G4}"
OUT_DIR="${2:-docs/Entrega-Final/final-evaluation/agile/data}"

mkdir -p "$OUT_DIR"

cat > "$OUT_DIR/github-export-status.json" <<JSON
{
  "repository": "$REPO",
  "generated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "gh_available": $(command -v gh >/dev/null 2>&1 && echo true || echo false),
  "gh_authenticated": $(command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1 && echo true || echo false)
}
JSON

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  gh issue list \
    --repo "$REPO" \
    --state all \
    --limit 1000 \
    --json number,title,state,labels,assignees,milestone,createdAt,updatedAt,closedAt,url \
    > "$OUT_DIR/issues.json"

  gh pr list \
    --repo "$REPO" \
    --state all \
    --limit 1000 \
    --json number,title,state,author,assignees,labels,createdAt,updatedAt,closedAt,mergedAt,headRefName,baseRefName,url \
    > "$OUT_DIR/pull_requests.json"

  gh api "repos/$REPO/milestones?state=all&per_page=100" > "$OUT_DIR/milestones.json"
else
  cat > "$OUT_DIR/issues.json" <<'JSON'
[]
JSON
  cat > "$OUT_DIR/pull_requests.json" <<'JSON'
[]
JSON
  cat > "$OUT_DIR/milestones.json" <<'JSON'
[]
JSON
  cat > "$OUT_DIR/README-gh-cli-required.md" <<'EOF'
# GitHub CLI requerido

No se encontro `gh` autenticado en este entorno. Para exportar issues, PRs y milestones reales:

```bash
gh auth login
scripts/agile/export_github_data.sh puj-course/FIS_2610_3517_G4
python3 scripts/agile/generate_agile_report.py
```

Sin `gh`, el reporte solo puede calcular commits/autores desde el historial Git local.
EOF
fi

git log --all --date=iso-strict \
  --pretty=format:'%H	%h	%ad	%an	%ae	%s' \
  > "$OUT_DIR/commits.tsv"

git shortlog -sne --all > "$OUT_DIR/authors.tsv"
git branch -r --format='%(refname:short)' | sed 's#^origin/##' | sort -u > "$OUT_DIR/branches.txt"

printf 'Export generado en %s\n' "$OUT_DIR"
