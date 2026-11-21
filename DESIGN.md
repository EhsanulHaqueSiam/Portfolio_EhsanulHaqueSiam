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

- **Nav:** serif "Siam", text links with a 4px dot under the current one that slides to the
  hovered link (CSS transform from a measured offset), a sound button ("Sound", pressed/not)
  and the theme toggle.
- **Profile:** animated pixel banner, boxed 88px avatar, name + stickers (contribution tiles
  link to Open Source, tool tiles are labelled images), rolling role line, location.
- **Rows:** mark tile, title, sub, right meta. One highlight glides under the hovered or
  focused row (`GlideList`, after motion-primitives' Animated Background).
- **Project cards (default view):** hairline-bordered card, gradient corner with the inset
  screenshot (slides out with a light sheen on hover), a reach ribbon when a metric names
  users/customers/clients, title, the project's first sentence, chips, site and code icons.
  Cards | List is a ui-sdk Segmented Control; List is the pile plus rows with a hover preview.
  The new view settles in (240ms fade and 4px rise, only after a switch).
- **Open Source:** ui-sdk Collapsible per repo; the panel height animates from
  `--collapsible-panel-height`. Star counts roll in like an odometer (RollNumber: CSS digit strips, no shadow DOM).
- **Tech stack:** ui-sdk Segmented Control filter; chips play a pitched tick on hover and
  stagger in (16ms apart) after a filter change.
- **GitHub grid:** a static empty grid at the loaded size while it fetches; on hover one ring
  and one tooltip travel to the day (moved by hand, no re-render), with a pitched note.
- **Scroll-in:** home blocks that start below the fold fade and rise in once as they scroll
  into view (600ms); the closing quote's words follow 30ms apart. Never hidden before
  hydration, in print, or with reduced motion.
- **Paper pages:** a 1px reading-progress bar on the header's bottom edge.
- **Dock:** magnifies under the cursor (spring); one label slides between items and resizes
  to each word (no per-item tooltip, no blur); pitched tick per item.

## 6. Motion, sound and haptics

- Tokens follow transitions.dev: `--duration-fast` 250ms with `--ease-smooth-out` for
  indicators and panels, 30-40ms letter stagger. Press feedback `scale(0.97)`.
- Loops that run while visible are cheap: the banner is an animated image, the live mark and
  ping animate transform/opacity only, the rolling role pauses off screen.
- Theme switch: a circle grows from the toggle (View Transitions, ease-in-out 600ms); the new
  snapshot starts clipped in CSS so no frame flashes.
- Sound (`src/lib/sound.ts`): one sine tick (1000 to 800Hz, 45ms) after samworks, pitched for
  chips and the dock; a whoosh for the theme. On by default; the speaker is a plain on/off
  switch. Audio starts at load when the browser allows it, otherwise on the first click; internal links use
  Astro's client router, so audio stays running from page to page after that.
- Haptics (`src/lib/haptics.ts`) fire only on coarse pointers, on taps that do something.
- Everything moving is gated by `prefers-reduced-motion`; hover-only motion by `(hover: hover)`.

## 7. Do and don't

- **Do** keep new sections inside `Section` so hatching and title rhythm stay consistent.
- **Do** keep facts in `assets/data` (generated from hq); presentation data in `site.json`.
- **Do** use ui-sdk for any control with a role (tabs, radios, disclosure) instead of hand ARIA.
- **Don't** add glow, glass blur or gradient borders; gradients live only in card corners.
- **Don't** animate on keyboard actions, and don't loop anything that repaints layout or paint.
