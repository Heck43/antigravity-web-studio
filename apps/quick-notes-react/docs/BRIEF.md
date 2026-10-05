# Project Brief: Quick Notes React (Быстрый блокнот)

## Objective
Create an intuitive, fast, aesthetic single-page React application for personal notes management, tagging, filtering, searching, and pinning with persistent local storage.

## Target Audience & Needs
- Fast capture of thoughts, code snippets, checklists, and daily ideas.
- Visual tagging system with color badges for quick categorization.
- Real-time search across titles, content, and tags.
- Pinning crucial notes to the top of the dashboard.
- Export and import capability (JSON/Markdown backup) to keep user notes secure.

## Key Features
1. **Note Creation & Editing**: Title, content (multi-line), tags (comma-separated or chips), priority/accent color.
2. **Pinned Notes**: Keep important notes always visible in a designated "Pinned" section.
3. **Smart Search & Filter**:
   - Instant search input (filters title + content + tags).
   - Filter pills by tag (e.g. All, Work, Ideas, Personal, Urgent).
   - Sort by: Newest first, Oldest first, Alphabetical (A-Z).
4. **Card Micro-interactions**:
   - Color picker badge for note accent.
   - Quick copy note content to clipboard with feedback badge.
   - Pin / Unpin toggle button.
   - Edit modal / inline editing.
   - Delete with confirmation.
5. **Persistence & Export**:
   - Automatic local storage synchronization via robust hook.
   - Quick export to JSON / Markdown file.
   - Import notes from backup file.
6. **Dark Slate Neon Aesthetics**:
   - Deep slate background (`#0b0f19` to `#111827`).
   - Neon accent highlights (Cyan `#06b6d4`, Indigo `#6366f1`, Emerald `#10b981`, Amber `#f59e0b`).
   - Glassmorphic card surfaces with subtle borders and smooth transitions.
   - Full keyboard accessibility and responsive mobile/desktop layout.
