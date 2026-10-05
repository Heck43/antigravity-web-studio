# Antigravity Web Product AI Studio v5

An execution-first reusable workspace for building small web products with Antigravity 2.0.

## Start a project

1. Open this folder in Antigravity 2.0.
2. Select `web-product-orchestrator` from `/agents`.
3. Give the agent the product request, preferably via `prompts/START.md` as a reference.
4. Expect workspace edits, research artifacts, a running implementation, browser QA, fixes, regression checks, and a final release report.

## Important

This version explicitly gives the orchestrator file, terminal, web, and subagent tools in its frontmatter. The custom agent should execute the task rather than merely describe a solution.

The workspace includes `AGENTS.md`, `.agents/rules/`, `.agents/skills/`, `.agents/agents/`, docs, artifacts, prompts, and a minimal vanilla-web starter.

Research sources are inspiration only. Do not clone proprietary sites or assets.

## v6 compatibility fix
The orchestrator uses the current SDK tool identifier `start_subagent` rather than `invoke_subagent`, because tool-name validation is strict and mismatched names can terminate/hang a custom agent.
