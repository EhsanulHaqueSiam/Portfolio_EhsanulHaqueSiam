---
name: Ehsanul Haque Siam Portfolio
description: A monochrome, true-black single-column portfolio (dashed rails, hatched section bands, Instrument Serif titles) where color is signal, not decoration.
colors:
  bg-dark: "#000000"
  fg-dark: "#ffffff"
  card-dark: "#0a0a0a"
  secondary-dark: "#171717"
  muted-fg-dark: "#999999"
  border-dark: "#212121"
  bg-light: "#ffffff"
  fg-light: "#0a0e1a"
  muted-fg-light: "#5c6370"
  border-light: "#e4e7ec"
  signal-live: "#3ecf8e"
  signal-star: "#f5b82e"
  merged: "#a78bfa"
  print-paper: "#f4f4f1"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "28px (section) / 30-40px (name, page title)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Variable, Geist, system-ui, sans-serif"
    fontSize: "13-15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono Variable, Geist Mono, ui-monospace, monospace"
    fontSize: "11-12px"
    fontWeight: 400
    letterSpacing: "0.14em uppercase for the role line, normal elsewhere"
rounded:
  chip: "6-8px"
  tile: "7-10px"
  pill: "9999px"
spacing:
  column: "680px"
  gutter: "16px"
  hatch: "28px"
components:
  chip:
    backgroundColor: "{colors.card-dark}"
    border: "1px {colors.border-dark}"
    rounded: "{rounded.chip}"
  button-primary:
    backgroundColor: "{colors.fg-dark}"
    textColor: "{colors.bg-dark}"
    rounded: "{rounded.pill}"
---

# Design System: Ehsanul Haque Siam Portfolio

## 1. Overview

One 680px column on true black, framed by dashed side rails. Sections are stacked and
separated by a 28px hatched band (`.hatch`), each opening with an Instrument Serif title and an
optional right-aligned aside (a link or a hint). Everything else is Geist. The look follows
samworks (banner, boxed avatar, rails, hatching, serif titles, tech chips, GitHub grid) with the
list rhythm of sou-hardo (logo rows, a pile of prints, open-source PR lists, a floating dock).

**Key characteristics**
- Dense rows over cards: most content is a 3-column row (mark, title + sub, right meta).
- Color only means something: green = live, violet = merged, amber = stars.
- Delight comes from sound, haptics and small hover motion, not decoration.

## 2. Colors

Tokens live in `src/index.css` as HSL triplets (`:root` light, `.dark` dark). Dark is the default.

- **Background** `#000`, **Foreground** `#fff`.
- **Card** `#0a0a0a` (chips, tiles), **Secondary** `#171717` (row hover, active filter).
- **Muted foreground** `#999` for subs, dates and asides.
- **Border** `#212121` for hairlines, rails and hatching.
- **Signal success** (live dots), **signal star** (star counts), `#a78bfa` (merged PRs).
- **Print paper** `#f4f4f1`: the border of project prints and stickers, in both themes.

**Rule:** no color on the base surface unless it carries a state.

## 3. Typography

- **Display:** Instrument Serif 400 for the name, section titles and page titles. Never bold.
- **Body:** Geist 400/500 at 13-15px. Titles in rows are 14px 500; subs 13px muted.
- **Mono:** Geist Mono for dates, counts, repo slugs and the uppercase role line.
- Headings use `text-balance`; numbers use `tabular-nums`.

## 4. Layout and elevation

- `.rails` column, 16px gutters, sticky solid nav on top, fixed dock at the bottom.
- Flat at rest. Shadows only on things that float: prints, stickers, the hover preview, the dock.

## 5. Components

- **Nav:** serif "Siam", text links, sound toggle and theme toggle (32px bordered squares).
- **Profile:** banner image, boxed 88px avatar, name + sticker strip, mono role, location.
- **Stickers:** tilted 28px tiles with a paper border; lift on hover or tap with a note.
- **Contact chips:** icon tile + label + ↗; icon pops and arrow nudges on hover.
- **Project pile:** five tilted prints that fan out on hover (desktop) or scroll-snap (touch).
- **Rows:** mark tile, title, sub, right meta; hover tints the row `secondary/60`.
- **Repo card:** logo, name, slug, stars, PR count, chevron; expands a PR list (grid-rows 0fr→1fr).
- **Tech chips:** filter buttons (`aria-pressed`) and chips that play a note on hover.
- **Dock:** magnifies under the cursor (spring), tooltip with blur-in, note per item.

## 6. Motion, sound and haptics

- Easing `cubic-bezier(0.23, 1, 0.32, 1)` / `--ease-out-strong`; UI motion under 300ms,
  the pile fan 450ms. Press feedback `scale(0.97)`.
- Hover motion is gated behind `(hover: hover) and (pointer: fine)` and removed under
  `prefers-reduced-motion`.
- Sounds (`src/lib/sound.ts`) are synthesized: tick on hover, notes on a pentatonic scale for
  item sweeps, paper rustle for the pile and expanders, a two-tone toggle. Silent until the
  first gesture and while muted.
- Haptics (`src/lib/haptics.ts`) fire only on coarse pointers, on taps that do something.

## 7. Do and don't

- **Do** keep new sections inside `Section` so the hatching and title rhythm stay consistent.
- **Do** keep facts in `assets/data` (generated from hq); components only format them.
- **Don't** add gradients, glass blur or glow; the banner and project shots carry the color.
- **Don't** animate on keyboard actions or loop animations continuously.
