# Multi-agent team

This workspace is designed around a lead orchestrator plus specialist subagents.

| Agent | Role | Typical phase |
|---|---|---|
| `web-product-orchestrator` | Owns the whole lifecycle | All phases |
| `researcher` | Public/web/reference research | Discovery + research |
| `ui-designer` | UX and visual system | Design |
| `frontend-implementer` | Production implementation | Build |
| `qa-engineer` | Browser + functional + responsive QA | Verify + fix |

The orchestrator should run independent research/design work in parallel, then serialize production edits unless isolated worktrees are used.
