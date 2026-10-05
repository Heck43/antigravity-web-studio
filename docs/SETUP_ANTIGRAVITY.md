# Antigravity 2.0 setup

Open this folder itself as the workspace root.

Antigravity 2.0 discovers workspace rules from `AGENTS.md` and `.agents/rules/`, skills from `.agents/skills/`, and custom agents from `.agents/agents/`. Skills can be invoked with slash commands such as `/product-build`; custom agents can be inspected with `/agents`.

This template includes a workspace Refero MCP configuration in `.agents/mcp_config.json` pointing to Refero's read-only MCP endpoint. The first use may require browser authorization; Refero states live MCP research requires its Pro plan.

Use `prompts/BUILD.md` as the standard starting prompt.


## Troubleshooting custom-agent startup

This template uses `serverUrl` in `.agents/mcp_config.json` and `invoke_subagent` in the orchestrator tool list, matching the current Antigravity custom-agent/MCP documentation. If the custom agent still fails immediately, temporarily rename `.agents/mcp_config.json` to disable workspace MCP and retry the agent; this isolates MCP configuration from agent configuration.
