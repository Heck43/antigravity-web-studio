# Research & Citations: FocusFlow React App

## Design System & Component References
1. **Modern SaaS Dark Palette:** `knowledge/design-sources.md` (Theme A: Modern SaaS Dark Slate & Indigo).
2. **Accessible Modals & ARIA Standards:** `knowledge/recipes/modal-dialog-aria.md` (focus trapping, Escape key listener, aria-labelledby, aria-modal="true").
3. **Responsive Design Tokens:** `knowledge/recipes/responsive-design-tokens.md` (fluid typography, CSS variables, mobile-first media queries).
4. **LocalStorage State Synchronization:** `knowledge/recipes/localstorage-state.md` (safe JSON parse, fallback hydration, change persistence).

## External Patterns & Libraries
1. **GitHub Activity Heatmap:**
   - Pattern: GitHub contribution calendar grid showing daily completion intensity across multi-week window with hover tooltip details.
   - Reference: [grubersjoe/react-activity-calendar](https://github.com/grubersjoe/react-activity-calendar).
2. **Pomodoro Circular Progress Ring:**
   - Pattern: SVG `strokeDasharray` and `strokeDashoffset` dynamically animated according to timer percentage remaining.
3. **Sound Synthesis:**
   - Pattern: Browser Native Web Audio API (`AudioContext`) with sine/triangle wave oscillators and exponential gain decay for zero-latency bell notifications without audio file bandwidth or CORS issues.
4. **Icons:**
   - Lucide React icons (`lucide-react`) for clean, uniform SVG iconography (Check, Plus, Flame, Timer, BarChart, Settings, Trash, Edit, Trophy, Play, Pause, RotateCcw).
5. **Confetti Celebration:**
   - `canvas-confetti` library for visual reward burst when completing daily habits or Pomodoro sessions.
