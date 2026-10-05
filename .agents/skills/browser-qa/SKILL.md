---
name: browser-qa
description: Verify a web product in a real browser and close the loop on functional, responsive, visual, and runtime defects.
---

# Browser verification

Prefer the built-in browser subagent in Antigravity 2.0 for interactive testing.

Test the highest-value user journeys first. Use a representative desktop viewport and at least one narrow mobile viewport.

Check:
- page load;
- primary actions;
- navigation;
- forms and validation;
- empty/loading/error/success states;
- responsive layout;
- keyboard focus;
- console/runtime errors;
- overflow, clipping, overlap, and unreadable text;
- persistence when relevant.

For every defect include reproducible steps, expected behavior, actual behavior, severity, and evidence. Re-test after fixes.

Never claim visual fidelity from source inspection alone; verify the rendered result.
