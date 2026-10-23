---
name: Pablo Stefan — painel de azulejos
description: A portfolio built as a modular tile wall; the same few pieces recombine into every section, the way a design system builds different apps.
colors:
  cobalt: "#1c3f94"
  glaze: "#eef1f5"
  ink: "#111318"
  ochre: "#f0b323"
  ink-soft: "#4a4d55"
  glaze-soft: "#c9d3ec"
  ash: "#9aa0ab"
typography:
  display-cover:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "calc(var(--cell) * 1.28)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  display-section:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.8rem, 6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  figure:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(3.6rem, 8.5vw, 7.5rem)"
    fontWeight: 700
    lineHeight: 0.85
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
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.glaze}"
    rounded: "{rounded.none}"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "48px"
  index-row-hover:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.glaze}"
---

## Overview

The site is a tile wall in the spirit of Brazilian modernist azulejaria. Eight original motifs, fired in four glazes, are the only ornament. They stand for the design system: the same pieces, turned and combined, build every section. The cover lays a wall with the name and the positioning set on blank glaze blocks aligned to the grid; the "O sistema" section turns sixteen copies of one tile into three compositions as you scroll. Motion only ever turns, lays or reveals tiles.

## Colors

- **Cobalt** `#1c3f94` is the main glaze and the ground of SOMA, recommendations and contact. Glaze text on it is 8.5:1, glaze-soft `#c9d3ec` 6.4:1.
- **Glaze** `#eef1f5` is a cool porcelain white, the reading ground. Ink 16.4:1, ink-soft `#4a4d55` 7.5:1, cobalt 8.5:1.
- **Ink** `#111318` grounds the Motion case and the footer. Ash `#9aa0ab` for secondary text on it (7.1:1); ochre on ink 9.9:1.
- **Ochre** `#f0b323` is the accent: one in five tiles at most, the recompose control, diff markers. Never body text on glaze.

## Typography

- **Bricolage Grotesque** 700 for all display text, tracking −0.03em. The cover size follows the tile cell, so the name always spans whole tiles.
- **Hanken Grotesk** for running text, 16–19px, line height 1.3 or more, max 56–62ch.
- **JetBrains Mono** for labels: kickers, stage numbers, diff markers, the motion tokens.

## Layout

Panels are CSS grids sized from their own width with container units: `--cell = 100cqw / --cols`. Text blocks laid over a panel (`.panel-block`) take `--x --y --w --h` in cells, so they snap to the tiles at every breakpoint. Cover: 6 × 11 cells on mobile, 12 × 7 from `md`. Contact: 6 × 12 and 12 × 7. Sections are full-bleed with a 16px gutter on mobile and 32px from `sm`. Verified with no horizontal scroll from 320px to 1920px.

## Elevation & Depth

Flat. Depth comes from the change of ground between sections and from glaze blocks laid over tiles.

## Shapes

Square corners everywhere; the only curves are inside the tiles. Borders are 2px ink. Motifs (`lib/tiles.ts`, `TileArt`): quarter disc, half disc, triangle, lens, dot, quarter ring, split, bar. A panel's pattern is seeded, so server and client lay the same wall.

## Components

- **TilePanel**: lays tiles in with a seeded stagger (scale and quarter turn, 0.7s ease-out). Hover with a fine pointer turns the tile a quarter, once per visit. `recompose` gives every tile a new turn with a spread delay. Rotation lives on the DOM (`data-turn`, `--rot`), so hovering never re-renders React. `onView` holds the entrance until the panel is on screen.
- **System**: 16 quarter-disc tiles, sticky from `lg`. Scroll turns them from loose pieces to circles to bows, always clockwise. Reduced motion shows the circles.
- **TileDiff** (Morphix): the same 4 × 3 wall on `main` and on the PR; one piece turned out of the pattern, one fired in a color outside the tokens. The toggle draws dashed numbered outlines on both.
- **TileCascade** (Motion): six tiles turn with the real tokens, 450ms, ease-out, 60ms stagger. It plays once in view and on demand.
- **SemanticsSpecimen**: a toggle button with `aria-pressed` that shows the semantics tree of a component.
- **Career**: each role carries a strip of tiles, one more piece per stage, laid in as it scrolls into view.

## Do's and Don'ts

- Do build ornament from `TileArt` motifs only; don't add icons, illustrations or photos as decoration.
- Do keep ochre rare; a wall with more than one ochre tile in five stops reading as cobalt.
- Do mark every tile `aria-hidden`; text never lives inside a panel's grid.
- Do give every animation a reduced-motion state and gate hover behind fine pointers.
- Don't use real artists' panels or name them as the source; the motifs here are original.
- Don't invent testimonials or metrics; `data/recommendations.json` holds verified LinkedIn quotes only.
- Don't round corners, add shadows, gradients or glassmorphism.
