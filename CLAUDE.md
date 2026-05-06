# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site for Project Tidemark, deployed at **gettidemark.com** (see `CNAME`) via GitHub Pages from the repo root. There is no build system, no package manager, no server — the deployable artifact is the raw HTML in this directory.

## Pages

- `index.html` — landing page; routes the visitor to the two product pillars
- `incident.html` — Incident product page
- `shift.html` — Shift product page
- `changelog.html` — release notes

All pages are self-contained: HTML + inline `<style>` + inline `<script>`. CSS/JS dependencies (Tailwind, GSAP + ScrollTrigger, Google Fonts, Material Symbols) are loaded from CDNs. **Tailwind runs via the Play CDN at runtime** — there is no `tailwind.config.js` or compile step. Edits happen directly in the HTML files.

## Local preview

```bash
# from this directory
python3 -m http.server 8000
# then open http://localhost:8000
```

## Design system

`DESIGN.md` is the canonical design spec ("The Abyssal Architect" / "Bioluminescent Palette"). Honor it when editing pages — it has rules that aren't obvious from reading the markup:

- **0px border-radius everywhere.** Sharp corners are part of the identity; do not introduce rounded corners.
- **No 1px solid borders.** Sectioning via tonal shifts; if a boundary is unavoidable, use a 0.5px line `#3A494A` at 40% opacity.
- **No grey drop shadows.** For depth, use tonal layering or a low-opacity `primary` glow (`#B6CACB` at 4% / 40px blur).
- **Typography:** Space Grotesk for display/headlines (tight tracking, -0.02em); Inter for body and technical labels (uppercase + 0.05em tracking for `label-sm`).
- **Motion:** standard `cubic-bezier(0.2,0,0,1)`; tactile spring `cubic-bezier(0.34,1.56,0.64,1)` for hover/press; 50ms stagger between siblings on scroll-driven reveals.

Note: `DESIGN.md` references a slate-based palette (`#0F172A` background, `#B6CACB` primary). The current `index.html` uses an overlapping but slightly different token set under CSS custom properties (`--obsidian`, `--gold: #22D3EE`, etc.). When touching color, check the page's actual `:root` block rather than assuming `DESIGN.md` values are live.

## Conventions

- Keep pages self-contained — do not introduce a bundler, framework, or shared CSS file unless explicitly asked.
- Preserve the GSAP/ScrollTrigger reveal patterns when editing layout; they're load-bearing for the "cinematic" feel.
- The site is the public marketing surface — never commit secrets, API keys, or internal URLs into the HTML.
