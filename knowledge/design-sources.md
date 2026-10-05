# 🎨 Design & CSS Inspiration Hub (AI-Tested & Direct Extractable)

This catalog is specifically optimized for AI agents and developers. Every resource is classified by its accessibility for AI tools (`read_url_content` / `search_web`), with direct endpoints to extract markup, SVG vectors, CSS snippets, and color tokens without hitting Cloudflare blocks or empty SPA shells.

---

## ⚡ Legend: AI Accessibility Status
- **`[⚡ AI-Direct]`**: Static HTML or raw GitHub/CDN endpoint. 100% accessible via `read_url_content`. Complete HTML, SVG, and CSS code can be fetched directly.
- **`[🔍 AI-Searchable]`**: Best queried via `search_web` for summaries and trends. Direct page reading may be truncated or heavy.
- **`[👁️ Human / SPA]`**: Client-side JS apps or bot-protected (e.g. Cloudflare 403 or empty `<div id="root"></div>`). **Do NOT call `read_url_content` directly on these** — use the `[⚡ AI-Direct]` alternatives listed below.

---

## 1. Ready-Made Components & CSS (Direct Extractable Code)

### `[⚡ AI-Direct]` HyperUI Components
- **URL Pattern:** `https://www.hyperui.dev/components/application/<category>`
- **Categories:** `button-groups`, `buttons`, `badges`, `cards`, `dropdown`, `inputs`, `modals`, `navbars`, `stats`, `tables`, `tabs`.
- **How AI extracts:** Call `read_url_content` on the exact category URL. It returns ready-to-use semantic HTML, Tailwind utility classes, and inline SVGs.
- **GitHub Raw:** `https://raw.githubusercontent.com/markmead/hyperui/main/README.md`

### `[⚡ AI-Direct]` Flowbite Component Docs
- **URL Pattern:** `https://flowbite.com/docs/components/<category>/`
- **Categories:** `buttons/`, `card/`, `forms/`, `modal/`, `navbar/`, `tables/`, `tooltips/`, `skeleton/`.
- **How AI extracts:** Call `read_url_content`. Flowbite renders static SSR HTML with complete copy-pasteable HTML snippets and SVG icons.

### `[⚡ AI-Direct]` DaisyUI Component Docs
- **URL Pattern:** `https://daisyui.com/components/<category>/`
- **Categories:** `button/`, `card/`, `modal/`, `drawer/`, `navbar/`, `input/`, `table/`.
- **How AI extracts:** Call `read_url_content`. Returns full HTML snippets, variants (`btn-soft`, `btn-outline`, `btn-primary`), and accessibility attributes.

### `[⚡ AI-Direct]` Modern CSS Solutions
- **URL:** `https://moderncss.dev`
- **How AI extracts:** Call `read_url_content`. Returns pure vanilla CSS3 recipes for CSS Grid, Flexbox layouts, fluid typography, and container queries with zero framework dependencies.

### `[⚠️ SPA / Human Only]` Uiverse.io & Shadcn UI Notes
- **`https://uiverse.io`**: Protected by Cloudflare bot challenge (returns HTTP 403 on direct bot GET). If you need pure CSS buttons or animated toggles, use the **Built-in Pure CSS Components** section below or query via `search_web`.
- **`https://ui.shadcn.com`**: Client-side Next.js SPA. For raw components, read from the GitHub repository: `https://raw.githubusercontent.com/shadcn-ui/ui/main/packages/shadcn/README.md`.

---

## 2. Direct Vector Icons (Raw SVG Endpoints)

Agents can fetch clean, production-ready SVG vectors immediately using `read_url_content`:

### `[⚡ AI-Direct]` Lucide Icons (Recommended)
- **Direct SVG Endpoint:**
  `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/<icon-name>.svg`
- **Common Icon Names:**
  `search`, `plus`, `trash-2`, `edit-2`, `check`, `x`, `chevron-down`, `chevron-right`, `arrow-right`, `user`, `settings`, `sun`, `moon`, `bell`, `calendar`, `cloud-rain`, `filter`, `folder`, `home`, `loader-2`.
- **Example Usage:** Call `read_url_content` with `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/search.svg` to get the clean vector markup.

### `[⚡ AI-Direct]` Tabler Icons
- **Direct SVG Endpoint:**
  `https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/<icon-name>.svg`
- **Common Icon Names:** `user.svg`, `search.svg`, `check.svg`, `trash.svg`, `settings.svg`.

---

## 3. Real Product UI/UX Inspiration (Screen & Flow Layouts)

### `[🔍 AI-Searchable]` Mobbin & Refero
- **Mobbin:** `https://mobbin.com` (SaaS & Mobile flows).
- **Refero:** `https://refero.design` (Web App dashboards & views — note: client-side SPA).
- **Godly:** `https://godly.website` (High-end aesthetics, editorial and dark typography).
- **Dribbble:** `https://dribbble.com/tags/dashboard-ui`
- **Agent Usage:** Query via `search_web` (e.g. `search_web` query: `"modern SaaS dashboard layout design patterns"` or `"split view layout best practices"`) to capture layout structure without relying on JS-rendered screenshots.

---

## 4. Built-in Offline Color Palettes (Zero Network Dependent)

If offline or to avoid round-trips, use these battle-tested design tokens directly:

### 🌌 Theme A: Modern SaaS Dark (Slate / Indigo) — Recommended for Web Apps
```css
:root {
  --bg-primary: #0b0f17;       /* Deep obsidian canvas */
  --bg-surface: #151b28;       /* Elevated card background */
  --bg-surface-hover: #1e2638; /* Interactive hover card */
  --border-subtle: #242f44;    /* Structural divider */
  --border-focus: #6366f1;     /* Primary accent ring */
  
  --text-primary: #f8fafc;     /* Crisp white text */
  --text-secondary: #94a3b8;   /* Muted subtext / descriptions */
  --text-tertiary: #64748b;    /* Placeholders & disabled text */
  
  --accent-primary: #6366f1;   /* Vibrant Indigo */
  --accent-primary-hover: #4f46e5;
  --accent-surface: rgba(99, 102, 241, 0.12);
  
  --success: #10b981;          /* Emerald */
  --warning: #f59e0b;          /* Amber */
  --danger: #ef4444;           /* Rose/Red */
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.45);
}
```

### ☀️ Theme B: Clean Minimalist Light (Zinc / Emerald)
```css
:root {
  --bg-primary: #f8fafc;       /* Clean neutral background */
  --bg-surface: #ffffff;       /* Pure white card */
  --bg-surface-hover: #f1f5f9;
  --border-subtle: #e2e8f0;    /* Crisp light border */
  --border-focus: #10b981;
  
  --text-primary: #0f172a;     /* Deep slate text */
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  
  --accent-primary: #10b981;   /* Emerald Green */
  --accent-primary-hover: #059669;
  --accent-surface: rgba(16, 185, 129, 0.10);
  
  --shadow-card: 0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
}
```

### 🌊 Theme C: Deep Midnight (Cyan / Blue)
```css
:root {
  --bg-primary: #050b14;
  --bg-surface: #0a1424;
  --bg-surface-hover: #102038;
  --border-subtle: #172a45;
  --border-focus: #06b6d4;
  
  --text-primary: #f0f9ff;
  --text-secondary: #7dd3fc;
  --accent-primary: #06b6d4;   /* Electric Cyan */
  --accent-primary-hover: #0891b2;
}
```

---

## 5. Built-in Production CSS Snippets

### Modern Accessible Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  background-color: var(--accent-primary);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: var(--accent-primary-hover);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
```

### Elevated Card with Subtle Lift
```css
.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.card:hover {
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.6);
}
```

### Modern Sleek Scrollbar
```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
```
