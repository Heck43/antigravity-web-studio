# Mandatory Research Before UI

## Hard requirement: Active web search is NOT optional

Before writing visual styles, layout, or components for any new feature or project:
1. **Consult curated resources & execute live searches:** Check `knowledge/design-sources.md` for AI-accessible component endpoints (HyperUI, Flowbite, DaisyUI, Modern CSS, Lucide raw SVGs) and offline palettes. Call `search_web` at least 2-3 times to find real-world modern UI/UX design patterns, color schemes, typography, and UX layouts specifically tailored to the project's topic.
2. **Read reference material:** Use `read_url_content` on static SSR / raw GitHub endpoints to extract concrete markup and styles (avoid bot-blocked 403 pages like Uiverse or empty SPAs like Refero).
3. **Extract design tokens:** Define primary/accent colors, backgrounds, card styles, typography, and micro-interactions based on the research.
4. **Document findings:** Record the URLs, search queries, and insights in `docs/SOURCES.md` and the visual design system in `docs/DESIGN.md`.

Do NOT rely solely on default memory or generic gray/blue boxes. Every project must have a distinct, aesthetically polished visual identity informed by real design research.
