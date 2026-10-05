#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

required=(
  AGENTS.md
  README.md
  .agents/agents/web-product-orchestrator.md
  .agents/agents/researcher.md
  .agents/agents/ui-designer.md
  .agents/agents/frontend-implementer.md
  .agents/agents/qa-engineer.md
  .agents/skills/product-build/SKILL.md
  .agents/skills/research-sweep/SKILL.md
  .agents/skills/design-synthesis/SKILL.md
  .agents/skills/frontend-build/SKILL.md
  .agents/skills/browser-qa/SKILL.md
  .agents/skills/release-report/SKILL.md
  .agents/agents/visual-reviewer.md
  .agents/agents/accessibility-reviewer.md
  .agents/agents/performance-reviewer.md
  .agents/agents/release-manager.md
  .agents/skills/git-checkpoints/SKILL.md
  .agents/skills/visual-review/SKILL.md
  .agents/skills/accessibility-review/SKILL.md
  .agents/skills/performance-review/SKILL.md
  .agents/skills/ship-gate/SKILL.md
)
for f in "${required[@]}"; do
  test -f "$f" || { echo "Missing: $f"; exit 1; }
done

python3 - <<'PY'
from pathlib import Path
import re
root=Path('.')
for p in list((root/'.agents/agents').glob('*.md'))+list((root/'.agents/agents').glob('*/agent.md')):
    s=p.read_text(encoding='utf-8')
    assert s.startswith('---\n'), f'No YAML frontmatter: {p}'
    assert re.search(r'^name:\s*\S+', s, re.M), f'No name: {p}'
    assert re.search(r'^description:\s*.+', s, re.M), f'No description: {p}'
for p in (root/'.agents/skills').glob('*/SKILL.md'):
    s=p.read_text(encoding='utf-8')
    assert s.startswith('---\n'), f'No frontmatter: {p}'
    assert re.search(r'^name:\s*\S+', s, re.M), f'No name: {p}'
print('Workspace structure and frontmatter: OK')
PY

echo 'All checks passed.'
