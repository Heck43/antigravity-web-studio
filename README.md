# Antigravity Web Product AI Studio

<p align="center">
  <b>English</b> &bull; <a href="README.ru.md">Русская версия</a>
</p>

> **An autonomous, execution-first multi-app web development environment for AI coding agents (Antigravity 2.0, Claude Code, Cursor, Codex, Gemini CLI).**

Build original, production-ready, verified web applications from scratch without copy-pasting code snippets or context collisions.

---

## Key Features

- **Multi-App Isolation (`apps/<slug>/`):**  
  Develop multiple web applications in parallel in the same workspace. Each project has its own isolated code, assets, and documentation (`docs/`). Completed projects are never overwritten or polluted.
- **The 5-Phase Autonomous Engineering Protocol:**  
  1. **Think & Isolate:** Deconstruct requirements, user journeys, edge cases, and clone clean documentation templates into `apps/<slug>/docs/`.
  2. **Interactive UI Clarification (`ask_question`):** The agent consults you with targeted questions on layout, theme, and component placement before coding.
  3. **Mandatory Web Research:** Inspect modern design trends, color tokens, and layout patterns from vetted design references.
  4. **Strict File Implementation (Zero Code in Chat):** All code is written directly to project files on disk (`write_to_file`) without dumping raw code into chat.
  5. **Verification & Pre-Release Lint:** Runs syntax validation (`node -c`), build checks, and pre-release linting before declaring completion.
- **Curated Knowledge Base (`knowledge/`):**  
  Production-tested recipes for state persistence with `localStorage`, accessible WAI-ARIA modal dialogs with focus trapping, fluid typography, and design tokens (`knowledge/design-sources.md`).
- **Automated Pre-Release Linter (`scripts/web-lint.js`):**  
  Automated validation script checking HTML5 doctype/viewport, CSS brace balance, JS syntax, and scanning for leaked secrets or leftover debug code.
- **Full Stack & Modern Framework Support:**  
  Supports **Vanilla HTML5/CSS3/JS**, as well as **React**, **Vue 3**, **Svelte**, **Tailwind CSS**, and **TypeScript** (scaffolded via Vite and npm).

---

## Workspace Architecture

```text
antigravity-web-product-workspace/
├── .agents/                      # Custom agent configurations and skills
│   ├── agents/                   # Orchestrator, UI designer, QA, frontend implementer
│   ├── rules/                    # Enforced coding and safety rules
│   └── skills/                   # Browser QA, design synthesis, performance review
├── apps/                         # All standalone web applications live here
│   ├── cozy-pomodoro-react/      # Example: React Pomodoro Timer & Ambient Sounds
│   ├── focusflow-tracker/        # Example: Habit Tracker with GitHub Heatmap (React + Vite)
│   ├── quick-notes-react/        # Example: React Notes Application
│   ├── study-task-manager/       # Example: Interactive Study & Task Manager (SPA)
│   └── weather-app/              # Example: Responsive Weather Dashboard
├── docs/                         # Master Read-Only Templates (Cloned into each app)
│   ├── BRIEF.md
│   ├── PLAN.md
│   ├── DESIGN.md
│   ├── SOURCES.md
│   ├── DEVLOG.md                 # Development journal tracking decisions & fixes
│   └── QA.md
├── knowledge/                    # Reusable architectural recipes & patterns
│   ├── design-sources.md         # Vetted design hubs and design tokens
│   └── recipes/
│       ├── localstorage-state.md
│       ├── modal-dialog-aria.md
│       └── responsive-design-tokens.md
├── scripts/                      # Verification & tooling
│   ├── check.sh                  # Structure and YAML frontmatter validator
│   └── web-lint.js               # Pre-release quality checker
├── AGENTS.md                     # Agent execution instructions (Codex / Claude / OpenCode)
├── GEMINI.md                     # Antigravity & Gemini instructions
├── LICENSE                       # MIT License
└── README.md
```

---

## Getting Started

### 1. Open in Antigravity or your AI Coding Agent
Open this workspace root folder in **Antigravity 2.0**, **Cursor**, **Claude Code**, or **Gemini CLI**.

### 2. Give the Agent a Product Request
State what you want to build and the target folder name:

#### Example 1: Vanilla Web App
> *"Create a crypto price tracker in `apps/crypto-dashboard` with interactive charts, search, and watchlist on vanilla JS/CSS."*

#### Example 2: React + Tailwind CSS
> *"Create a kanban board in `apps/kanban-board` on **React + Tailwind CSS** via Vite with drag-and-drop cards, task modal, and localStorage persistence."*

#### Example 3: Vue 3
> *"Create a recipe catalog in `apps/recipe-book` on **Vue 3** with ingredient filters and cooking timer."*

---

## Pre-Release Quality Check

Before shipping or publishing any application, run the automated linter:

```bash
# Run quality lint on any app
node scripts/web-lint.js apps/<app-name>
```

This checks:
- `index.html` structure, doctype, title, and responsive viewport
- CSS balanced braces across all stylesheets
- JavaScript syntax compilation via Node.js engine
- Hygiene & secret scan (no API tokens or leftover `debugger;` statements)

---

## License

This project is licensed under the [MIT License](LICENSE).
