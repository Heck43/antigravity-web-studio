# Implementation Plan — Cozy Focus (:3)

## Architectural & Execution Phases

### Phase 1: Foundation & Scaffold
- [x] Configure Vite + React 19 project structure.
- [x] Install dependencies (`lucide-react`, `canvas-confetti`).
- [ ] Set up global CSS tokens, typography, and pastel color palette.

### Phase 2: Core Components Architecture
- [ ] `Mascot`: Interactive animated SVG character ("Mochi the Cat") reacting to timer states (idle/working/break/complete) and click reactions.
- [ ] `TimerDisplay`: Circular SVG progress ring with elapsed/remaining time, mode pills (Focus / Short Break / Long Break), controls (Play, Pause, Skip, Reset).
- [ ] `SoundGenerator`: Web Audio API procedural sound engine with 4 channels (Rain, Campfire, Coffee Shop, Forest Breeze) with toggle and volume controls.
- [ ] `TaskManager`: Task checklist with completed state, pomodoro counter, and persistence via `localStorage`.
- [ ] `MoodAndQuotes`: Cozy mood tracker + rotating uplifting affirmations.
- [ ] `SettingsModal`: Accessible dialog to customize timer durations (Focus, Short Break, Long Break), sound notifications, and auto-start.

### Phase 3: Web Audio Synth Sound Design
- [ ] Gentle chime sound using Web Audio oscillator + gain envelope.
- [ ] Procedural ambient generators:
  - Rain: Pink noise through bandpass/lowpass filter.
  - Campfire: Random crackle pulses + warm low rumble.
  - Coffee Shop: Layered multi-frequency gentle murmur.
  - Wind: Modulated bandpass white noise.

### Phase 4: Polish & Accessibility
- [ ] Keyboard navigation and focus rings.
- [ ] ARIA attributes (`aria-label`, `role="dialog"`, `aria-live` for timer).
- [ ] Responsive design across desktop, tablet, and mobile.
- [ ] Pre-release linter and Vite build verification.

### Phase 5: QA & Release
- [ ] Run `npm run build` and verify 0 warnings/errors.
- [ ] Check console cleanliness and runtime reliability.
- [ ] Finalize documentation in `docs/` (`QA.md`, `RESULT.md`, `DEVLOG.md`).
