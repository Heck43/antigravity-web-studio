# Definition of Done and Execution Rules

## 1. Zero Code in Chat (Strict File-First Rule)
- **NEVER paste long source code, full HTML/CSS/JS files, or boilerplate into the chat response.**
- All code MUST be created and modified directly in the target files using file tools (`write_to_file`, `replace_file_content`).
- Chat output must be concise: status updates, research insights, clickable links to modified files, and verification/launch instructions.

## 2. Complete Development Cycle
Every non-trivial task must go through:
1. **Thinking & Decomposition:** Analyze requirements, user journeys, edge cases, and define the plan in `docs/PLAN.md`.
2. **Web Research:** Search the internet for design and technical patterns for the specific topic.
3. **File Implementation:** Write clean, modular, semantic code into project files.
4. **Verification:** Actually run checks (syntax checks, console logs, test scripts) to ensure the code executes without errors.
5. **Final Honest Report:** State verified results, launch instructions, and known limitations.
