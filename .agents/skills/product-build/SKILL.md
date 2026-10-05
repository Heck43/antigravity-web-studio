---
name: product-build
description: End-to-end web product delivery protocol with research, design, implementation, browser QA, visual/accessibility/performance review, defect fixing, regression and ship gating.
---

# Goal

Deliver a working, original, tested web product with evidence. Do not stop at code generation.

# Phase A — Brief

Create `docs/BRIEF.md` from the user's request. Normalize the idea into:
- goal;
- target user;
- primary journey;
- must-have features;
- non-goals;
- assumptions;
- acceptance criteria.

# Phase B — Research

Delegate `researcher` and `ui-designer` in parallel where useful. Search public products, technical references and, when connected, Refero Styles/Screens/Flows. Record exact sources in `docs/SOURCES.md` and supporting notes in `artifacts/research/`.

# Phase C — Original design

`ui-designer` creates `docs/DESIGN.md`: information architecture, screen inventory, visual direction, tokens, components, states, responsive behavior and accessibility considerations. Do not clone a single source.

# Phase D — Plan

Create `docs/PLAN.md` and `docs/TASKS.md`. Break work into small, verifiable tasks with acceptance criteria. Mark status as TODO / IN PROGRESS / DONE / BLOCKED.

# Phase E — Build

Implement using the declared stack. For simple web projects default to HTML5 + CSS3 + vanilla JavaScript. Keep production code coherent and avoid unnecessary dependencies.

Create a Git checkpoint after the first stable implementation.

# Phase F — Functional QA

Run project checks and launch the site. Use the browser subagent and `qa-engineer` to test:
- core flow;
- navigation/forms;
- state changes;
- empty/loading/error states;
- persistence/data behavior when relevant;
- console/runtime errors;
- responsive behavior.

# Phase G — Parallel specialist review

After a stable build, delegate in parallel:
- `visual-reviewer` → `docs/VISUAL_QA.md`;
- `accessibility-reviewer` → `docs/ACCESSIBILITY.md`;
- `performance-reviewer` → `docs/PERFORMANCE.md`.

# Phase H — Fix + regression

Fix verified blocker/high findings first. Re-run the affected tests. Repeat until acceptance criteria are satisfied or a concrete blocker remains. Update `docs/TASKS.md` and QA evidence after every meaningful cycle.

# Phase I — Ship gate

Run `release-manager`. Update `docs/SHIP_CHECKLIST.md` and `docs/RESULT.md`. The release manager must distinguish verified facts from assumptions and must reject unsupported “done” claims.

# Phase J — Delivery

Return:
- what was built;
- sources/references used;
- design direction;
- tests performed;
- bugs fixed;
- known limitations/blockers;
- exact launch instructions;
- ship-gate status.
