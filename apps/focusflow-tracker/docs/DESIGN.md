# Design System: FocusFlow Dark Slate

## Color Palette (Modern Dark Slate + Vibrant Indigo & Emerald)
Based on `knowledge/design-sources.md` (Theme A: Modern SaaS Dark):
```css
:root {
  /* Canvas & Surfaces */
  --bg-primary: #0b0f17;          /* Obsidian void background */
  --bg-surface: #151b28;          /* Primary cards & panels */
  --bg-surface-elevated: #1e2638; /* Modals, hover states, dropdowns */
  --bg-input: #101522;            /* Input fields & controls */
  
  /* Borders & Dividers */
  --border-subtle: #242f44;       /* Standard component borders */
  --border-active: #3b4b69;       /* Active / focused borders */
  --border-focus: #6366f1;        /* Primary accent ring */
  
  /* Typography */
  --text-primary: #f8fafc;        /* Main headings & primary body */
  --text-secondary: #94a3b8;      /* Captions, labels, secondary info */
  --text-tertiary: #64748b;       /* Subtle timestamps & placeholders */
  
  /* Primary & Semantic Accents */
  --accent-primary: #6366f1;      /* Indigo primary action */
  --accent-primary-hover: #4f46e5;
  --accent-surface: rgba(99, 102, 241, 0.14);
  
  --success: #10b981;             /* Emerald completion / high activity */
  --success-surface: rgba(16, 185, 129, 0.15);
  --warning: #f59e0b;             /* Amber streak flame / alert */
  --danger: #ef4444;              /* Rose deletion / break timer */
  --info: #06b6d4;                /* Cyan focus mode */
  
  /* Heatmap Activity Levels */
  --heat-level-0: #1a2234;        /* No activity */
  --heat-level-1: #1e3a5f;        /* 1 habit */
  --heat-level-2: #2563eb;        /* 2-3 habits */
  --heat-level-3: #6366f1;        /* 4-5 habits */
  --heat-level-4: #10b981;        /* 6+ habits (Full target) */
  
  /* Geometry & Elevation */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.45);
  --shadow-glow: 0 0 24px -4px rgba(99, 102, 241, 0.35);
}
```

## Typography
- **Font Stack:** system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Scale:**
  - `text-xs`: 0.75rem (12px) - badges, day labels
  - `text-sm`: 0.875rem (14px) - button labels, secondary stats
  - `text-base`: 1rem (16px) - body text, habit titles
  - `text-lg`: 1.125rem (18px) - card subheadings
  - `text-xl`: 1.25rem (20px) - modal titles, section headers
  - `text-3xl`: 1.875rem (30px) - key metric numbers
  - `text-5xl`: 3rem (48px) - circular timer countdown display

## Layout & Responsive Breakpoints
- **Mobile (< 768px):** Single column stack. Timer switches to collapsible card or sticky footer bar. Heatmap scrolls horizontally with swipe gesture.
- **Tablet (768px - 1024px):** Reflowed grid with 2 columns.
- **Desktop (> 1024px):** 12-column layout (7-column habit manager & heatmap analytics + 5-column Pomodoro deep work suite).
