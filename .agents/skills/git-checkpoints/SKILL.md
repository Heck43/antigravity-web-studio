---
name: git-checkpoints
description: Safe local Git checkpoint workflow for milestones, risky changes, QA fixes and release candidates.
---

# Protocol

Create a local checkpoint before risky refactors and after stable milestones. Use descriptive commit messages tied to the product phase.

Recommended phases:
- `checkpoint: discovery`
- `checkpoint: design`
- `checkpoint: implementation`
- `checkpoint: qa-fix`
- `checkpoint: release-candidate`

Never rewrite history or push remotely unless explicitly requested.
