# Web Studio Knowledge Base & Recipes

A curated library of battle-tested, production-ready web development patterns and architectural recipes.

## How Agents Use This Knowledge Base:
1. **Search Before Re-inventing:** When a user requests a common feature (modal dialogs, localStorage persistence, drag-and-drop, responsive layout tokens, SPA router), the agent should first inspect `knowledge/recipes/` to reuse proven best practices.
2. **Quality Guarantee:** Recipes here follow accessibility (WCAG), performance, and clean code standards.
3. **Contribute New Recipes:** When a complex problem is solved effectively in an app, the agent can summarize the solution into a new recipe in `knowledge/recipes/<topic>.md`.

## Available Guides & Recipes:
- [`design-sources.md`](design-sources.md) — 🎨 Curated sources for UI/UX inspiration, component systems, CSS libraries, and color palettes.
- [`localstorage-state.md`](recipes/localstorage-state.md) — Robust state manager with localStorage, serialization, quota protection, and initial seed.
- [`modal-dialog-aria.md`](recipes/modal-dialog-aria.md) — Accessible modal dialog with focus trapping, `Escape` key handling, and backdrop dismissal.
- [`responsive-design-tokens.md`](recipes/responsive-design-tokens.md) — Modern CSS Custom Properties design system with fluid typography and dark mode support.
- [`html5-drag-and-drop.md`](recipes/html5-drag-and-drop.md) — Clean HTML5 Drag & Drop reordering without dependencies.
