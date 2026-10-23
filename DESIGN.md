---
name: Pablo Stefan — espécime tipográfico cinético
description: A portfolio that reads like a living type specimen; the name, the numbers and the career are set in one variable face whose axes move.
colors:
  vermilion: "#ff4a1c"
  bottle: "#0e3b2c"
  fog: "#e6e8eb"
  ink: "#000000"
  paper: "#e9ede6"
  ink-soft: "#4a4d52"
  paper-soft: "#9fc2a8"
  rust: "#c2310a"
typography:
  display-cover:
    fontFamily: "Anybody, sans-serif"
    fontSize: "clamp(4.5rem, 23vw, 24rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  display-section:
    fontFamily: "Anybody, sans-serif"
    fontSize: "clamp(2.8rem, 6vw, 5.5rem)"
    fontWeight: 850
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  figure:
    fontFamily: "Anybody, sans-serif"
    fontSize: "clamp(3.6rem, 11vw, 9.5rem)"
    fontWeight: 850
    lineHeight: 1.05
  body:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "32px"
  section-mobile: "96px"
  section-desktop: "128px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.vermilion}"
    rounded: "{rounded.none}"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "48px"
  index-row-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.fog}"
---

## Overview

The site is a type specimen for one person. Each section is a printed sheet with its own stock: vermilion for the cover and colophon, bottle green for SOMA and the recommendations, pale fog for reading, black for the Motion case. The typeface carries the identity; there are no photos, gradients, glass or icons-as-decoration. Motion only ever changes the axes of the variable font, the length of a stroke or a clip, never decorative floating shapes.

## Colors

- **Vermilion** `#ff4a1c` is the cover stock. Text on it is always ink (6.25:1).
- **Bottle** `#0e3b2c` carries paper `#e9ede6` (10.5:1) and paper-soft `#9fc2a8` (6.4:1) for secondary text. Vermilion on bottle is large text only (3.7:1).
- **Fog** `#e6e8eb` is the reading stock. Ink-soft `#4a4d52` (6.9:1) for secondary text, rust `#c2310a` (4.6:1) for a figure or an accent mark.
- **Ink** black is a stock too (Motion case, the floating nav tab, hover inversion of index rows).
- Never put rust or vermilion on small text over a tinted background without checking contrast.

## Typography

- **Anybody** (variable, `wdth` 50–150, `wght` 100–900) is the only display face. Set axes per use with `fontVariationSettings`; the `.display` class lives in the components layer, so `leading-*` and `tracking-*` utilities override its 0.86 line height.
- **Hanken Grotesk** for all running text, 17–19px, line height 1.5–1.6, max 56–62ch.
- **JetBrains Mono** for specimen labels only: sizes in the waterfall, `wght` readouts, semantics trees, the bezier caption.
- Kinetic words never break inside a word: KineticText wraps each word in a nowrap span; numbers with a currency use a non-breaking space.

## Layout

Full-bleed sections, 16px gutter on mobile and 32px from `sm`. Content runs left-aligned on a two-column grid from `lg`, with hairline `border-ink/25` rules between rows like a specimen sheet. The cover is `min-h-svh`. Verified with no horizontal scroll from 320px to 1920px, including the pointer peak on the last glyph of the name.

## Elevation & Depth

Flat. Depth comes from stock changes between sections and from the fixed nav tab, which is a black slab, not a shadowed card.

## Shapes

Square corners everywhere. Borders are 2px ink for buttons and the Morphix frame, 1px for row rules. The glyph-cell guide lines (22%, 62%, 84%) appear only behind large figures.

## Components

- **KineticText**: CSS keyframe entrance from hairline to resting axes, staggered per glyph, then JS takes over and widens glyphs near a fine pointer (smoothstep falloff, lerp 0.16). `onView` holds the entrance until the text is on screen. Reduced motion renders the resting axes, no entrance, no tracking.
- **Waterfall**: four sizes (96/56/32/20). Only the two large rows open from `wdth` 62 to 100 as they scroll in; small text never condenses.
- **Career weights**: company name weight scrubs from 100 to its target as the row reaches 65% of the viewport; the newest role is heaviest.
- **SemanticsSpecimen**: a real toggle button with `aria-pressed` that reveals the semantics tree.
- **MorphixCompare**: native range input under a vermilion handle. Both versions share the same centered layout so only the diff (button height, missing label) changes across the split.
- **EaseCurve**: draws `cubic-bezier(0.23, 1, 0.32, 1)` with `pathLength`; the dot uses `getPointAtLength` so it stays on the stroke tip.
- **SpecimenNav**: slides in once the cover leaves the viewport.

## Do's and Don'ts

- Do let the type move; don't add moving decoration.
- Do use `cubic-bezier(0.23, 1, 0.32, 1)` for entrances and `cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement; animate transform, opacity, clip-path and font axes only.
- Do gate hover-only effects behind `(hover: hover) and (pointer: fine)` and give every animation a reduced-motion state.
- Don't invent testimonials or metrics; `data/recommendations.json` holds verified LinkedIn quotes only.
- Don't round corners, add shadows, gradients or glassmorphism.
