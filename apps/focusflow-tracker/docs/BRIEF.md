# Project Brief: FocusFlow (React Habit & Productivity Tracker)

## Objective
Create a modern, feature-rich Habit and Personal Productivity Tracker in React called **FocusFlow**. It provides users with full daily habit management, GitHub-style interactive activity heatmaps, productivity statistics, weekly streaks, an integrated Pomodoro focus timer with audio cues and ambient sounds, and persistent browser storage.

## Target User & Core Needs
- Students, developers, and remote knowledge workers wanting to track recurring daily routines, build streaks, and stay focused during deep work sessions.
- Needs a unified single-page dashboard with zero friction, responsive mobile-to-desktop design, and dark modern slate aesthetics.

## Key Features & Requirements
1. **Interactive Habit Tracker:**
   - Add custom habits with title, category (Health, Coding, Focus, Mindset, Fitness), icon/tag, target frequency.
   - Quick one-click toggle for daily completion.
   - Streak counters (current streak, longest streak).
   - Filter by category or active status.
   - Edit, delete, and archive habits.
2. **Visual Progress & Activity Heatmap:**
   - 12-week / month-level interactive activity contribution heatmap (GitHub style) showing intensity of completed habits per day.
   - Daily progress gauge (% of scheduled habits completed today).
   - Weekly summary bar chart with breakdown of completed habits.
3. **Integrated Pomodoro Focus Timer:**
   - 25m Focus / 5m Short Break / 15m Long Break intervals with customizable timer settings.
   - SVG circular progress ring with smooth countdown animation.
   - Play/Pause, Skip, Reset controls.
   - Built-in sound synthesis (Web Audio API - chime on complete, subtle tick toggle) and celebration confetti on goal reach.
   - Link focus sessions to specific habits/tasks.
4. **Productivity Metrics & Badges:**
   - Overall completion rate, total focus minutes logged, current best streaks.
   - Motivational achievement badges (e.g., "First Step", "3-Day Streak", "Centurion Focus").
5. **Data Persistence & Export/Import:**
   - Full state synchronization via `localStorage`.
   - Export backup as JSON and import existing backups.
   - Reset to sample demo data with a single click.

## Aesthetic & Tone
- **Theme:** Dark Modern Slate (`#0b0f17` background, `#151b28` surface, vibrant `#6366f1` Indigo primary accent, `#10b981` Emerald success, `#f59e0b` Amber warning).
- **Feel:** Sleek, high-precision, snappy micro-interactions, clean glass-morphic borders.
