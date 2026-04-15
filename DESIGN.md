# Design System Document: Cinematic Depth & Precision

## 1. Overview & Creative North Star: "The Abyssal Architect"
This design system is built upon the concept of **The Abyssal Architect**. It moves away from the "flat" web of generic templates, instead embracing a world of immense scale, tactile precision, and bioluminescent clarity. We are designing for the "Tidemark" experience—a place where the vastness of the deep ocean meets the sharp, technical rigor of high-end engineering.

The aesthetic is characterized by **Atmospheric Monoliths**: large, imposing structural headlines contrasted against microscopic, high-density data. We break the grid not through chaos, but through intentional asymmetry and tonal "stacking." By eliminating standard borders and shadows, we force the user’s eye to follow light and surface transitions, creating a digital environment that feels carved rather than drawn.

---

## 2. Colors: The Bioluminescent Palette
The color strategy relies on "The Deep"—a matte, non-reflective base that absorbs light, allowing our primary and secondary accents to "glow" from within the interface.

| Token | Hex | Role |
| :--- | :--- | :--- |
| `background` | `#111417` | The foundation. A matte, oceanic black. |
| `primary` | `#B6CACB` | Bioluminescent primary; used for high-signal highlights. |
| `secondary` | `#95D1D4` | Technical secondary; used for interactive states and accents. |
| `on_primary` | `#213435` | High-contrast dark text for use on primary surfaces. |
| `surface` | `#111417` | The primary canvas for all content. |
| `surface_container` | `#1D2023` | Secondary depth level for grouping related items. |
| `surface_container_high`| `#272A2D` | Elevated surfaces (modals, active cards). |
| `tertiary_fixed_variant`| `#3A494A` | The "Trace Line" color for 0.5px dividers. |

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited. Sectioning must be achieved through:
1.  **Tonal Shifts:** Placing a `surface_container_low` section against a `surface` background.
2.  **The Trace Line:** When a boundary is essential, use a **0.5px** line with color `#3A494A` at **40% opacity**. It should feel like a hairline fracture in stone, not a structural box.

### Signature Textures
Use subtle radial gradients for hero sections, transitioning from `surface` to `primary_container` (#041718) at a 30% spread. This mimics the way light dissipates in deep water, adding "soul" to the otherwise matte environment.

---

## 3. Typography: Extreme Contrast
The typographic identity is built on a "Brutalist Editorial" scale. We pair cinematic scale with technical density to convey both vision and precision.

*   **Display & Headlines (Space Grotesk):** Use for high-impact messaging. Headlines should be set with tight letter-spacing (-0.02em) to create a monolithic block of text.
    *   *Display LG:* 3.5rem / Leading 1.1
    *   *Headline LG:* 2.0rem / Leading 1.2
*   **Technical Labels & Body (Inter):** High-density, sans-serif clarity for data.
    *   *Body LG:* 1.0rem (Standard reading)
    *   *Label SM:* 0.6875rem (Uppercase with +0.05em tracking for technical metadata).

---

## 4. Elevation & Depth: Tonal Layering
We reject the standard "Drop Shadow" in favor of physical stacking.

*   **The Layering Principle:** Depth is achieved by nesting. A `surface_container_lowest` (#0B0E11) element placed on a `surface` background creates a "carved out" look. Conversely, a `surface_container_high` (#272A2D) element creates a "raised" platform.
*   **Ambient Glow (Shadow Replacement):** When an element must "float" (like a dropdown), do not use a black shadow. Use a diffused `primary` tint shadow at 4% opacity with a 40px blur to simulate bioluminescent light reflecting off the surface below.
*   **Glassmorphism:** For navigation overlays, use `surface` at 70% opacity with a `backdrop-filter: blur(20px)`. This keeps the "monolithic" feel while providing necessary context of the layers beneath.

---

## 5. Components: Sharp & Integrated

### 0px Border Radius
Every element—buttons, cards, inputs—must have **0px (sharp) corners**. This reinforces the "Monolith" concept and feels more architectural than consumer-grade.

### Buttons (Integrated & Glowing)
*   **Primary:** Solid `primary` background. On hover, apply a `box-shadow: 0 0 15px #e9feff` (a soft bioluminescent glow).
*   **Ghost (Secondary):** No background. 0.5px trace line. Text in `secondary`.
*   **Interaction:** Use `cubic-bezier(0.2, 0, 0, 1)` for the glow transition to ensure it feels "expensive."

### Cards & Lists
*   **Structural Rule:** Prohibit divider lines. Separate items using `surface_container` variations or 32px/48px vertical gutters.
*   **Reveal:** Cards should stagger into view using a scroll-driven reveal, moving 20px upward as they fade in.

### Micro-Navigation
Navigation elements should be "Micro." Use `label-sm` typography (0.7rem). The indicator for an active link is a 1px horizontal line of `primary` that expands from the center—never a bulky "pill" shape.

---

## 6. Motion: The High-Fidelity Feel
Motion is the "connective tissue" of this system. It should feel intentional and weighted.

*   **Standard Motion:** `cubic-bezier(0.2, 0, 0, 1)` — Use for page transitions and opacity fades. It is fast but smooth.
*   **Tactile Spring:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — Use for hover states and button presses. This provides a subtle "snap" that makes the 0px sharp corners feel physically reactive.
*   **Scroll-Driven Orchestration:** Elements should not all appear at once. Use a 50ms stagger delay between sibling elements in a list or grid to create a "cascading" effect as the user descends into "The Deep."

---

## 7. Do's and Don'ts

### Do:
*   **DO** use whitespace as a structural element. If a section feels crowded, increase the margin rather than adding a border.
*   **DO** use `secondary_container` (#054F52) for subtle background accents behind technical data.
*   **DO** ensure all text meets AA accessibility standards against the `#111417` background.

### Don't:
*   **DON'T** ever use a border-radius. Roundness is the enemy of this system's "Monolith" identity.
*   **DON'T** use standard grey shadows. If you need depth, use tonal shifts or low-opacity primary glows.
*   **DON'T** use generic icon sets. Use ultra-thin (1pt or 0.5pt) stroke icons to match the technicality of the Inter typeface.