# Design System — Cozy Focus (:3)

## 1. Aesthetic Direction
- **Style:** Kawaii Pastel Modernism / Soft Neumorphic Card Accents.
- **Atmosphere:** Warm, calm, welcoming, playful, low cognitive load.
- **Roundness:** Generous border radiuses (`16px`, `24px`, `9999px` pills) for a cuddly tactile feel.

## 2. Color Palette & Design Tokens
```css
:root {
  /* Backgrounds */
  --bg-primary: #FFF8F6;          /* Soft warm cream / blush */
  --bg-surface: #FFFFFF;          /* Pure white card surface */
  --bg-surface-soft: #FFF1F2;     /* Gentle rose card surface */
  --bg-surface-tint: #FDF2F8;     /* Lavender-rose tint */

  /* Pastel Accents */
  --accent-pink: #F472B6;         /* Strawberry pink */
  --accent-pink-light: #FCE7F3;   /* Light strawberry */
  --accent-peach: #FB923C;        /* Warm apricot */
  --accent-peach-light: #FFEDD5;  /* Soft peach */
  --accent-mint: #34D399;         /* Fresh mint */
  --accent-mint-light: #D1FAE5;   /* Gentle matcha */
  --accent-lavender: #A78BFA;     /* Muted violet */
  --accent-lavender-light: #EDE9FE;/* Muted violet light */
  --accent-sky: #60A5FA;          /* Soft cloud blue */
  --accent-sky-light: #E0F2FE;    /* Soft cloud blue light */

  /* Text & Foreground */
  --text-main: #334155;           /* Deep slate brown/grey (high contrast 9:1) */
  --text-muted: #64748B;          /* Gentle secondary text */
  --text-soft: #94A3B8;           /* Subtle tertiary labels */
  --border-soft: #FCE7F3;         /* Soft dividing borders */
  --border-subtle: #F3E8FF;

  /* Shadows */
  --shadow-sm: 0 2px 8px -2px rgba(244, 114, 182, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 12px 24px -6px rgba(244, 114, 182, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 20px 35px -10px rgba(244, 114, 182, 0.18), 0 8px 16px -4px rgba(0, 0, 0, 0.06);

  /* Typography */
  --font-family: 'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

## 3. Micro-Interactions & States
- **Hover:** Gentle scale `transform: translateY(-2px) scale(1.02);` with bouncy transition (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Active / Click:** `transform: translateY(1px) scale(0.98);`.
- **Timer Mascot:** Gentle breathing animation (scale 1.0 to 1.03), blinking eyes, ear wiggle on hover.
- **Focus Rings:** Accessible focus-visible rings with outline offset in `var(--accent-pink)`.
