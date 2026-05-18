#!/usr/bin/env python3
"""Genera tablas agiles reproducibles desde exports de GitHub CLI y git local."""

from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

DATA_DIR = Path("docs/Entrega-Final/final-evaluation/agile/data")
OUTPUT = DATA_DIR / "metricas_scrum_generadas.md"
SPRINT_START = date(2026, 2, 16)
SPRINT_LENGTH_DAYS = 7
SPRINT_COUNT = 13

AUTHOR_ALIASES = {
    "Sarm": "Sarm-m",
    "Sarm-m": "Sarm-m",
    "samuelfl680": "samuelfl680",
    "Samuel felipe": "samuelfl680",
    "Samuel Freile": "samuelfl680",
    "solonlosada2006": "solonlosada2006",
    "juansebastianvd": "juansebastianvd",
    "Juan Sebastian Vargas Dicelys": "juansebastianvd",
    "Juan Sebastian": "juansebastianvd",
    "juserora": "juserora",
    "Juserora": "juserora",
    "juanvargax": "juanvargax",
}


def load_json(path: Path, default):
    if not path.exists():
        return default
    with path.open(encoding="utf-8") as file:
        return json.load(file)


def sprint_name(day: date) -> str:
    if day < SPRINT_START:
        return "Antes del Sprint 1"
    index = ((day - SPRINT_START).days // SPRINT_LENGTH_DAYS) + 1
    if index > SPRINT_COUNT:
        return f"Despues del Sprint {SPRINT_COUNT}"
    return f"Sprint {index}"


def parse_commit_date(value: str) -> date | None:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
    except ValueError:
        return None


def normalize_author(author: str) -> str:
    return AUTHOR_ALIASES.get(author, author or "Sin autor")


def read_commits(path: Path):
    if not path.exists():
        return []
    commits = []
    with path.open(encoding="utf-8") as file:
        reader = csv.reader(file, delimiter="\t")
        for row in reader:
            if len(row) < 6:
                continue
            full_sha, short_sha, authored_at, author, email, subject = row[:6]
            commit_date = parse_commit_date(authored_at)
            commits.append(
                {
                    "sha": full_sha,
                    "short_sha": short_sha,
                    "date": commit_date,
                    "author": normalize_author(author),
                    "email": email,
                    "subject": subject,
                    "sprint": sprint_name(commit_date) if commit_date else "Sin fecha",
                }
            )
    return commits


def parse_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
    except ValueError:
        return None


def issue_assignees(issue) -> list[str]:
    assignees = issue.get("assignees") or []
    result = []
    for assignee in assignees:
        login = assignee.get("login") if isinstance(assignee, dict) else str(assignee)
        result.append(normalize_author(login))
    return result or ["Sin asignar"]


def write_table(file, headers, rows):
    file.write("| " + " | ".join(headers) + " |\n")
    file.write("|" + "|".join(["---"] * len(headers)) + "|\n")
    for row in rows:
        file.write("| " + " | ".join(str(cell) for cell in row) + " |\n")


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    commits = read_commits(DATA_DIR / "commits.tsv")
    issues = load_json(DATA_DIR / "issues.json", [])
    prs = load_json(DATA_DIR / "pull_requests.json", [])
    milestones = load_json(DATA_DIR / "milestones.json", [])
    issue_data_available = bool(issues)

    commits_by_sprint = Counter(commit["sprint"] for commit in commits)
    commits_by_author = Counter(commit["author"] for commit in commits)
    issues_closed_by_sprint = Counter()
    issues_closed_by_person = Counter()
    prs_by_author = Counter()

    for issue in issues:
        if issue.get("state") != "CLOSED":
            continue
        closed = parse_date(issue.get("closedAt"))
        issues_closed_by_sprint[sprint_name(closed)] += 1 if closed else 0
        for assignee in issue_assignees(issue):
            issues_closed_by_person[assignee] += 1

    for pr in prs:
        author = pr.get("author") or {}
        login = normalize_author(author.get("login", "Sin autor") if isinstance(author, dict) else str(author))
        prs_by_author[login] += 1

    sprint_rows = []
    sprint_total_commits = 0
    sprint_total_issues = 0
    for idx in range(1, SPRINT_COUNT + 1):
        name = f"Sprint {idx}"
        start = SPRINT_START + timedelta(days=(idx - 1) * SPRINT_LENGTH_DAYS)
        end = start + timedelta(days=SPRINT_LENGTH_DAYS - 1)
        commit_count = commits_by_sprint[name]
        issue_count = issues_closed_by_sprint[name] if issue_data_available else "No disponible"
        sprint_total_commits += commit_count
        if isinstance(issue_count, int):
            sprint_total_issues += issue_count
        sprint_rows.append([name, start.isoformat(), end.isoformat(), issue_count, commit_count])

    with OUTPUT.open("w", encoding="utf-8") as file:
        file.write("# Metricas Scrum generadas\n\n")
        file.write("Este archivo es generado por `scripts/agile/generate_agile_report.py`.\n")
        file.write("Si `issues.json` o `pull_requests.json` estan vacios, instala/autentica `gh` y vuelve a exportar.\n\n")

        file.write("## HU/issues cerradas y commits por sprint\n\n")
        write_table(file, ["Sprint", "Inicio", "Fin", "Issues cerradas", "Commits"], sprint_rows)
        file.write("\n")
        if issue_data_available:
            file.write(f"- Promedio de HU/issues cerradas por sprint: {sprint_total_issues / SPRINT_COUNT:.2f}\n")
        else:
            file.write("- Promedio de HU/issues cerradas por sprint: no disponible sin export de GitHub CLI.\n")
        file.write(f"- Promedio de commits por sprint: {sprint_total_commits / SPRINT_COUNT:.2f}\n\n")

        file.write("## Commits por integrante\n\n")
        write_table(file, ["Integrante normalizado", "Commits"], commits_by_author.most_common())
        file.write("\n")

        file.write("## Issues cerradas por integrante\n\n")
        issue_rows = issues_closed_by_person.most_common() or [["No disponible sin gh", 0]]
        write_table(file, ["Integrante", "Issues cerradas"], issue_rows)
        file.write("\n")

        file.write("## PRs por integrante\n\n")
        pr_rows = prs_by_author.most_common() or [["No disponible sin gh", 0]]
        write_table(file, ["Integrante", "PRs"], pr_rows)
        file.write("\n")

        file.write("## Milestones exportados\n\n")
        milestone_rows = []
        for milestone in milestones:
            milestone_rows.append([
                milestone.get("title", "Sin titulo"),
                milestone.get("state", "sin estado"),
                milestone.get("open_issues", "n/d"),
                milestone.get("closed_issues", "n/d"),
            ])
        write_table(file, ["Milestone", "Estado", "Issues abiertas", "Issues cerradas"], milestone_rows or [["No disponible sin gh", "n/d", "n/d", "n/d"]])

    print(f"Reporte generado en {OUTPUT}")


if __name__ == "__main__":
    main()
