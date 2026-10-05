# Design System: Dark Slate & Neon Accents

## Color Palette Tokens
- **Background Root**: `#0a0e17` (Deep Obsidian Slate)
- **Surface Elevation 1**: `#111827` (Card / Modal background)
- **Surface Elevation 2**: `#1f293d` (Hover / Input fields / Pills)
- **Surface Elevation 3 / Border**: `#2e384d` (Subtle boundary borders)
- **Primary Text**: `#f8fafc` (Slate 50)
- **Muted Text**: `#94a3b8` (Slate 400)
- **Dimmed Text**: `#64748b` (Slate 500)

### Neon Accent Themes
- **Cyan Neon (Default / Tech)**:
  - Base: `#06b6d4`
  - Glow: `rgba(6, 182, 212, 0.25)`
  - Badge Background: `rgba(6, 182, 212, 0.15)`
- **Violet Neon (Creative / Ideas)**:
  - Base: `#8b5cf6`
  - Glow: `rgba(139, 92, 246, 0.25)`
  - Badge Background: `rgba(139, 92, 246, 0.15)`
- **Emerald Neon (Work / Tasks)**:
  - Base: `#10b981`
  - Glow: `rgba(16, 185, 129, 0.25)`
  - Badge Background: `rgba(16, 185, 129, 0.15)`
- **Amber Neon (Urgent / Personal)**:
  - Base: `#f59e0b`
  - Glow: `rgba(245, 158, 11, 0.25)`
  - Badge Background: `rgba(245, 158, 11, 0.15)`
- **Rose Neon (Favorites / Alerts)**:
  - Base: `#f43f5e`
  - Glow: `rgba(244, 63, 94, 0.25)`
  - Badge Background: `rgba(244, 63, 94, 0.15)`

## Typography
- System Font Stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Headings: Semi-bold / Bold with subtle letter spacing (-0.02em)
- Body: 14px / 1.6 line height for comfortable reading
- Monospace snippets: `ui-monospace, "Fira Code", monospace`

## Layout & Components
- Header bar: App branding, live note counter, Search bar with shortcut (`/`), "New Note" CTA (`+`), Import/Export dropdown.
- Filter Bar: Scrollable tags with active glow and count badges.
- Notes Grid: Responsive grid (`repeat(auto-fill, minmax(280px, 1fr))`).
- Pinned section with distinct header and neon pin icon.
- Note card with hover elevation, category neon accent left-border or top-border, markdown-like bullet formatting, quick copy, pin toggle, and smooth action buttons.
