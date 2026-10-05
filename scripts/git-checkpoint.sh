#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

MSG="${*:-checkpoint: stable milestone}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a Git repository. Initialize Git first with: git init"
  exit 1
fi

if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "No changes to checkpoint."
  exit 0
fi

git add -A
git commit -m "$MSG"
echo "Checkpoint created: $MSG"
