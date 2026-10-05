# 🎨 Responsive Design Tokens & CSS System Recipe

A battle-tested CSS Custom Properties foundation for modern web applications. Provides consistent fluid typography, spacing scales, dark/light theme switching, and accessible contrast ratios.

---

## 1. Quick Integration

Copy this snippet into your app's `style.css`:

```css
:root {
  /* Color Palette - Modern Dark Theme Default */
  --bg-app: #0b0f17;
  --bg-surface: #151b28;
  --bg-surface-elevated: #1e2638;
  --border-subtle: #242f44;
  --border-highlight: #3b4b68;
  
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-faint: #64748b;
  
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-faint: rgba(99, 102, 241, 0.12);
  
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  
  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Light theme toggle override */
[data-theme="light"] {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #f1f5f9;
  --border-subtle: #e2e8f0;
  --border-highlight: #cbd5e1;
  
  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-faint: #94a3b8;
  
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --primary-faint: rgba(79, 70, 229, 0.08);
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Responsive Fluid Typography */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);
  line-height: 1.6;
  background-color: var(--bg-app);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}
```

---

## 2. Best Practices
1. **Always use semantic tokens**: Use `var(--bg-surface)` and `var(--border-subtle)` instead of hardcoded hex values in component classes.
2. **Accessible contrast**: Ensure all `--text-main` on `--bg-surface` passes WCAG AA (minimum 4.5:1 ratio).
3. **Theme switching**: Toggle themes dynamically with `document.documentElement.setAttribute('data-theme', 'light')`.
