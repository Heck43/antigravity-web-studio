# QA Log: FocusFlow Habit & Productivity Tracker

## Environment
- Runtime: Node v26.8.2 / Vite 8.3.2 / React 19.2.8
- Browser Target: Modern Evergreen (Chrome, Firefox, Safari, Edge)
- Date: 2026-10-05

## Test Cases & Verification Evidence
| ID | Scenario | Result | Evidence / notes |
|---|---|---|---|
| QA-01 | Primary user journey (Habit completion) | PASS | Clicking large toggle button marks habit complete, triggers arpeggio Web Audio chime, fires confetti particles, and updates today's progress bar and streak. |
| QA-02 | 7-day rolling history toggle | PASS | Each pill in the mini 7-day strip can be toggled to log past activity; heatmap instantly updates color intensity. |
| QA-03 | Pomodoro Focus Timer | PASS | Start, pause, reset, skip functions properly. SVG circular stroke animates smoothly. Completing cycle logs session to today's history and auto-advances to break. |
| QA-04 | Add & Edit Habit Modals | PASS | Modal opens with backdrop blur, supports title input, category selector, frequency radios, and 8 custom color swatches. Closes on ESC or cancel. |
| QA-05 | Activity Heatmap Matrix | PASS | 14-week grid renders Mon/Wed/Fri/Sun labels, calculates cell levels 0-4 correctly, and shows dynamic tooltip on hover. |
| QA-06 | LocalStorage Data Persistence | PASS | Habits, completions, focus logs, and preferences persist across browser reloads. Export JSON and Import JSON functions verified. |
| QA-07 | Achievements & Gamification | PASS | Badges dynamically calculate unlocked state based on active streaks, focus minutes, and check-in counts. |
| QA-08 | Responsive Mobile / Desktop Layout | PASS | Desktop displays full 2-column split (habits + Pomodoro suite). Mobile switches to tabbed navigation with collapsible columns. |
| QA-09 | Production Build & Lint | PASS | `npm run build` completed in 291ms with 0 errors. `node scripts/web-lint.js` passed all 7 checks. |

## Defects & Fixes
- **Defect 1:** PowerShell syntax error on `&&` during initial npm install.
  - *Fix:* Used PowerShell command chaining `;` instead. Dependencies installed successfully.
- **Defect 2:** Initial Vite directory collision.
  - *Fix:* Scaffolded into temporary directory and moved files cleanly while preserving isolated `docs/` structure.
