# Antigravity 2.0 — Multi-App Web Studio

This workspace is a reusable multi-project web development studio for creating independent, fully isolated web applications.

---

## 🏗️ Isolated Project Architecture (Strict Rule)

Every web application MUST be created in its own isolated directory inside `apps/<app-slug>/`.

### Self-Contained Project Structure:
Each project must contain everything needed for its execution and documentation:
```text
apps/<app-slug>/
├── docs/                 <-- Cloned from root `docs/` templates and filled specifically for THIS app
│   ├── BRIEF.md
│   ├── PLAN.md
│   ├── DESIGN.md
│   ├── SOURCES.md
│   ├── QA.md
│   └── RESULT.md
├── index.html            <-- Main application entry
├── style.css             <-- Application styles
├── script.js             <-- Application logic
└── (assets / tests)
```

### The Isolation Protocol:
1. **Root `docs/` is a READ-ONLY Master Template:**
   - **NEVER edit files in the root `docs/` folder directly.**
   - When starting a new project, create `apps/<app-slug>/docs/` and copy the template files from root `docs/` into it.
   - All research, planning, design tokens, and QA reports for this project MUST be written ONLY into `apps/<app-slug>/docs/`.
   - The root `docs/` folder must ALWAYS remain a clean template for future projects.
2. **Strict Project Boundaries:**
   - When working on `apps/<app-a>/`, **NEVER inspect, read, copy, or modify files from other folders inside `apps/`**.
   - Each project is completely independent from blank slate.
3. **Flexible Sub-structures:**
   - If the user prompt specifically asks for a `project/` folder (e.g. `project/ ├── index.html ├── style.css └── script.js`), place it inside the project directory: `apps/<app-slug>/project/` (or directly inside `apps/<app-slug>/`).

---

## The 5-Phase Development Protocol

Whenever the user asks to build or create a web application:

### Phase 1: THINK & ISOLATE
- Determine or create the project directory (e.g. `apps/<slug>/`).
- Create `apps/<slug>/docs/` by copying clean templates from root `docs/`.
- Analyze user goals, user journeys, edge cases, and write the plan into `apps/<slug>/docs/PLAN.md` and `apps/<slug>/docs/BRIEF.md`.

### Phase 2: MANDATORY INTERNET RESEARCH & DESIGN
- **Active web search is mandatory:** Execute at least 2–3 live web searches via `search_web` for modern UI/UX design patterns, color palettes, and component layouts specifically for this project.
- Save design tokens and styles in `apps/<slug>/docs/DESIGN.md`.
- Save all research URLs and citations in `apps/<slug>/docs/SOURCES.md`.

### Phase 3: STRICT FILE IMPLEMENTATION (ZERO CODE IN CHAT)
- **NEVER output raw code, full HTML/CSS/JS, or large code blocks into chat.**
- Write code directly into `apps/<slug>/index.html`, `apps/<slug>/style.css`, `apps/<slug>/script.js` using `write_to_file`.
- Use semantic HTML5, modern CSS3 (custom properties, flex/grid, micro-interactions, responsive mobile/desktop), and clean modular vanilla JavaScript.

### Phase 4: VERIFICATION & TESTING
- Never claim a project works without verifying.
- Execute checks via `run_command` (e.g. syntax checks on JavaScript files via `node -c`, HTML structure validation).
- Record QA evidence in `apps/<slug>/docs/QA.md`. Fix any defects immediately.

### Phase 5: SHIP & REPORT
- Complete `apps/<slug>/docs/RESULT.md`.
- Provide a concise final report: what was built, design decisions, clickable links to created files, and exact launch instructions.

---

---

## Stack Guidelines & Modern Framework Support

### 1. Default Lightweight Stack:
- Default: **HTML5 + modern CSS3 + vanilla JavaScript (ES6+)** for fast, dependency-free, zero-build SPAs and widgets.

### 2. Full Framework Support (React, Vue, Svelte, Next, Tailwind, etc.):
- When the user requests a framework (e.g. React, Vue, Svelte, Tailwind CSS, TypeScript, Express, FastAPI):
  1. **Scaffold locally:** Run scaffolding tools inside `apps/<app-slug>/` (for example: `npm create vite@latest . -- --template react` or `react-ts`, `vue`, `svelte`).
  2. **Install dependencies:** Run `npm install` directly within `apps/<app-slug>/` to install all requested and required dependencies (e.g. icons, router, UI libraries).
  3. **Framework Structure:** Organize the project according to industry conventions for that framework (`src/components/`, `src/hooks/`, `src/assets/`, `vite.config.js`, etc.).
  4. **Verification:** Validate the setup by running the build command (e.g. `npm run build` or type checks `npx tsc --noEmit`) to verify that the project builds with zero compile errors.
  5. **Launch Instructions:** In the final report, give the exact command to run the local dev server (e.g. `cd apps/<app-slug>; npm run dev`).

