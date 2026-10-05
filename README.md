# 🚀 Antigravity Web Product AI Studio

> **An autonomous, execution-first multi-app web development environment for AI coding agents (Antigravity 2.0, Claude Code, Cursor, Codex, Gemini CLI).**

Build original, production-ready, verified web applications from scratch without copy-pasting code snippets or context collisions.

---

## ✨ Key Features

- **🏗️ Multi-App Isolation (`apps/<slug>/`):**  
  Develop multiple web applications in parallel in the same workspace. Each project has its own isolated code, assets, and documentation (`docs/`). Old projects are never overwritten or polluted.
- **🔄 The 5-Phase Autonomous Engineering Protocol:**  
  1. **Think & Isolate:** Deconstruct requirements, user journeys, edge cases, and clone clean documentation templates into `apps/<slug>/docs/`.
  2. **Interactive UI Clarification (`ask_question`):** The agent actively consults you with multiple-choice questions on layout, theme, and component placement before coding.
  3. **Mandatory Live Web Research:** The agent searches real web design trends, color palettes, and component layouts on Dribbble, Notion, and W3C standards.
  4. **Strict File Implementation (Zero Code in Chat):** All code is written directly to project files on disk (`write_to_file`) — no messy walls of code in chat.
  5. **Verification & Pre-Release Lint:** Runs syntax checks (`node -c`), DOM tests, and pre-release linting before declaring completion.
- **📚 Curated Knowledge Base (`knowledge/`):**  
  Production-tested recipes for state management with `localStorage`, accessible WAI-ARIA modal dialogs with focus trapping, fluid typography, and drag-and-drop.
- **🧪 Automated Pre-Release Linter (`scripts/web-lint.js`):**  
  One-click automated validation inspired by *universal-modder*: checks HTML5 doctype/viewport, CSS brace balance, JS syntax, and scans for leaked secrets or leftover debug code.
- **⚡ Full Stack & Modern Framework Support:**  
  Works with **Vanilla HTML5/CSS3/JS**, as well as **React**, **Vue 3**, **Svelte**, **Tailwind CSS**, and **TypeScript** (scaffolded via `npm create vite`).

---

## 📁 Workspace Architecture

```text
antigravity-web-product-workspace/
├── .agents/                      # Custom agent configurations and skills
│   ├── agents/                   # Orchestrator, UI designer, QA, frontend implementer
│   ├── rules/                    # Enforced coding and safety rules
│   └── skills/                   # Browser QA, design synthesis, performance review
├── apps/                         # 🌟 All standalone web applications live here
│   ├── study-task-manager/       # Example: Interactive Study & Task Manager (SPA)
│   └── weather-app/              # Example: Responsive Weather Dashboard
├── docs/                         # 📋 Master Read-Only Templates (Cloned into each app)
│   ├── BRIEF.md
│   ├── PLAN.md
│   ├── DESIGN.md
│   ├── SOURCES.md
│   ├── DEVLOG.md                 # Development journal tracking decisions & fixes
│   └── QA.md
├── knowledge/                    # 💡 Reusable architectural recipes & patterns
│   └── recipes/
│       ├── localstorage-state.md
│       └── modal-dialog-aria.md
├── scripts/                      # 🛠️ Verification & tooling
│   ├── check.sh                  # Structure and YAML frontmatter validator
│   └── web-lint.js               # Pre-release quality checker
├── AGENTS.md                     # Agent execution instructions (Codex / Claude / OpenCode)
├── GEMINI.md                     # Antigravity & Gemini instructions
├── LICENSE                       # MIT License
└── README.md
```

---

## 🚦 Getting Started

### 1. Open in Antigravity or your AI Coding Agent
Open this workspace root folder in **Antigravity 2.0**, **Cursor**, **Claude Code**, or **Gemini CLI**.

### 2. Give the Agent a Product Request
Simply state what you want to build and the target folder name:

#### Example 1: Vanilla Web App
> *"Создай в папке `apps/crypto-dashboard` веб-приложение: мониторинг цен криптовалют с интерактивными графиками, поиском и списком избранного на чистом JS/CSS."*

#### Example 2: React + Tailwind CSS
> *"Создай в папке `apps/kanban-board` приложение на **React + Tailwind CSS** через Vite: канбан-доска с drag-and-drop карточек, модальным окном создания задач и сохранением в localStorage."*

#### Example 3: Vue 3
> *"Создай в `apps/recipe-book` приложение на **Vue 3**: каталог кулинарных рецептов с фильтрами по ингредиентам и таймером готовки."*

---

## 🔍 Pre-Release Quality Check

Before shipping or publishing any application, run the automated linter:

```bash
# Run quality lint on any app
node scripts/web-lint.js apps/<app-name>
```

This checks:
- ✅ `index.html` structure, doctype, title, and responsive viewport
- ✅ CSS balanced braces across all stylesheets
- ✅ JavaScript syntax compilation via Node.js engine
- ✅ Hygiene & secret scan (no API tokens or `debugger;` statements)

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
