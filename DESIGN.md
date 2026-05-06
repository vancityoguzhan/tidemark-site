# Design System Document: Cinematic Depth & Precision

> **Source of truth:** the live HTML in this repo. When this document and the
> shipped pages disagree, the pages win. Update this file to match before
> citing it as a rule.

## 1. Overview & Creative North Star: "The Abyssal Architect"
This design system is built upon the concept of **The Abyssal Architect**. It moves away from the "flat" web of generic templates, instead embracing a world of immense scale, tactile precision, and bioluminescent clarity. We are designing for the "Tidemark" experience—a place where the vastness of the deep ocean meets the sharp, technical rigor of high-end engineering.

The aesthetic is characterized by **Atmospheric Monoliths**: large, imposing structural headlines contrasted against microscopic, high-density data. We break the grid not through chaos, but through intentional asymmetry and tonal "stacking." Depth comes from light and surface transitions rather than hard borders or grey shadows, so the environment feels carved rather than drawn.

---

## 2. Colors: The Bioluminescent Palette
The live palette is a slate base with a single bioluminescent cyan accent. All four pages share the same `:root` token block:

| Token | Hex / Value | Role |
| :--- | :--- | :--- |
| `--obsidian` | `#0F172A` | Page background. Matte, oceanic black. |
| `--surface` | `#1E293B` | Primary canvas for elevated content. |
| `--elevated` | `#334155` | Raised surfaces (modals, active cards). |
| `--gold` | `#22D3EE` | Bioluminescent cyan accent (named "gold" in code for legacy reasons). |
| `--gold-glow` | `rgba(34,211,238,0.22)` | Glow halo around accent elements. |
| `--gold-subtle` | `rgba(34,211,238,0.08)` | Faint accent washes behind technical data. |
| `--ivory` | `#F1F5F9` | Primary text. |
| `--ivory-60` / `-30` / `-15` / `-08` | ivory at 60/30/15/8% | Body, secondary, tertiary, hairline tiers. |
| `--rim` | `rgba(241,245,249,0.22)` | Glass / card rim highlight. |
| `--border` | `rgba(241,245,249,0.07)` | The "Trace Line" hairline. |
| `--amber` | `#FBBF24` | Warning / caution state. |
| `--green` | `#10B981` | Success / verified state. |

> Note: the token is named `--gold` for historical reasons; the actual color is cyan `#22D3EE`. Don't rename it — it's threaded through every page.

### The Hairline Rule
Avoid 1px solid borders. Section using:
1. **Tonal Shifts:** placing a `--surface` block against `--obsidian`.
2. **The Trace Line:** when a boundary is essential, use `1px` of `--border` (`rgba(241,245,249,0.07)`) — the live equivalent of the original "0.5px @ 40%" rule.

### Signature Textures
A fixed full-viewport scanline overlay (repeating linear gradients at ~7% opacity, `mix-blend-mode: overlay`) sits above every page — see `body::before` in each file. Hero sections layer large `glow-orb` radial gradients in `--gold` for bioluminescent ambience.

---

## 3. Typography: Extreme Contrast
Pair cinematic display scale with technical density.

* **Display & Headlines — Plus Jakarta Sans (`.font-headline`):** Use for high-impact messaging. Headlines run with tight tracking and heavy weight.
* **Body & Technical Labels — Inter:** Default body face. Technical labels use uppercase + `0.2em–0.6em` letter-spacing at 9–11px to read as "data."

Both faces are loaded from Google Fonts; no Space Grotesk on the live site.

---

## 4. Elevation & Depth: Tonal Layering
Depth comes from physical stacking, not drop shadows.

* **Layering Principle:** nest `--surface` (`#1E293B`) on `--obsidian` to "carve out," and `--elevated` (`#334155`) to "raise."
* **Ambient Glow (Shadow Replacement):** when an element must float, use a diffused `--gold-glow` tint at low opacity with a wide blur (e.g. `box-shadow: 0 0 60px var(--gold-glow)`). Never a black/grey shadow.
* **Glassmorphism:** the live `.glass` class uses a 135° low-opacity ivory gradient with `backdrop-filter: blur(60px) saturate(180%)`. Use it for floating panels, sidebars, and CTA cards.

---

## 5. Components: Sharp & Integrated

### Corner Radius Strategy
The system mixes two radius tiers — preserve both:

* **Structural surfaces (sections, hero stages, blueprint frames): 0px.** Sharp corners reinforce the monolith identity.
* **Interactive & glass elements:** rounded forms are intentional and load-bearing.
  * CTA buttons: `rounded-full` (pill)
  * Glass panels / cards: `rounded-[1.5rem]`
  * Hero glass containers / waitlist success: `rounded-[2.5rem]`

Don't introduce *other* radii (`rounded-md`, `rounded-xl`, etc.) — the three above are the full vocabulary.

### Buttons
* **Primary (`.btn-primary`):** filled accent background, glows on hover via `--gold-glow`. Uppercase Plus Jakarta Sans, 10px, `0.5em` tracking.
* **Secondary (`.btn-secondary`):** transparent background, ivory text, hairline `--border`. Same typographic treatment as primary.
* **Easing:** standard `cubic-bezier(0.2, 0, 0, 1)` for fades; tactile `cubic-bezier(0.34, 1.56, 0.64, 1)` for hover/press.

### Cards & Lists
* No divider lines between list items — separate via `--surface` tonal nesting or 32–48px vertical gutters.
* `.bento-card` elements get a magnetic hover (translate by 3% of cursor offset) on desktop pointers only — gated by `matchMedia('(hover:hover)')`.
* Reveal: cards stagger in via the `.reveal` ScrollTrigger pattern.

### Micro-Navigation
Navigation labels use 9–11px Inter with heavy uppercase tracking. Active state is a thin accent underline that grows from center — never a pill.

---

## 6. Motion: The High-Fidelity Feel
Motion is the connective tissue of the system. All motion respects `prefers-reduced-motion`.

* **Scroll Reveals (`.reveal`):** GSAP `fromTo` with `opacity 0 → 1`, `y: 36 → 0`, duration `1.3s`, easing `power4.out`, ScrollTrigger `start: 'top 94%'`.
* **Ambient Parallax (`.glow-orb`):** scrubbed across full document scroll, alternating ±280px Y / ±120px X by index.
* **Light Sweep (`.light-sweep`):** 2.5s `power2.inOut` cycle with a 6s repeat delay — adds a slow shimmer across hero blocks.
* **Page-specific theatre:** Incident has the SHA-256 typewriter, PII tokenization swap, and confidence-bar fill, each driven by a dedicated ScrollTrigger `onEnter`.
* **Stagger:** sibling reveals offset by ~50–80ms.

---

## 7. Do's and Don'ts

### Do
* **DO** treat the live HTML as the source of truth. If you change a token here without changing the pages, you've introduced drift.
* **DO** use whitespace as a structural element. If a section feels crowded, increase the margin rather than adding a border.
* **DO** ensure all text meets AA contrast against `--obsidian` (`#0F172A`).
* **DO** gate hover-only effects behind `matchMedia('(hover:hover)')` and motion behind `prefers-reduced-motion`.

### Don't
* **DON'T** introduce new radius values outside the three-tier vocabulary (0 / `rounded-full` / `rounded-[1.5rem]` / `rounded-[2.5rem]`).
* **DON'T** use grey drop shadows. For depth, use tonal shifts or a low-opacity `--gold-glow`.
* **DON'T** rename `--gold` to `--cyan` — it's threaded through every page and the changelog refers to it by name.
* **DON'T** add a 1px solid border. Use `--border` (`rgba(241,245,249,0.07)`) hairlines or tonal stacking instead.
