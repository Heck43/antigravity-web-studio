---
name: research-sweep
description: Research public websites, UI patterns, technical sources, open-source references, and licensing before design or implementation.
---

# Research protocol

- Start from the product goal, not from a preferred aesthetic.
- Search at least 3 strong references when the task is substantial.
- Prefer official product pages, documentation, open-source repositories, and design systems.
- Consult `knowledge/design-sources.md` for verified AI-accessible endpoints (HyperUI, Flowbite, DaisyUI, Modern CSS, Lucide raw SVGs) and offline palettes.
- Avoid calling `read_url_content` on bot-blocked 403 sites (Uiverse) or empty client-side SPAs (Refero).
- Separate observed facts from inferred recommendations.
- Record source URL, title, what was learned, and how it will influence the project.
- Check asset/library licenses before recommending direct reuse.

# Output

Write `artifacts/research/RESEARCH.md` and update `docs/SOURCES.md`.
