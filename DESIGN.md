---
name: Ehsanul Haque Siam Portfolio
description: A monochrome, default-dark engineering portfolio where color is signal, not decoration.
colors:
  bg-dark: "#030712"
  fg-dark: "#f8fafc"
  card-dark: "#181d29"
  muted-fg-dark: "#9099a8"
  border-dark: "#1e2531"
  bg-light: "#ffffff"
  fg-light: "#0a0e1a"
  muted-fg-light: "#6b7280"
  border-light: "#e4e7ec"
  signal-success: "#0a714e"
  signal-pending: "#a55209"
  signal-problem: "#c1153d"
  signal-star: "#ce8c09"
  accent-emphasis: "#5d36c9"
  ascii-surface: "#f5f6f8"
typography:
  display:
    fontFamily: "Geist Variable, Geist, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 10.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.8
    letterSpacing: "normal"
  script:
    fontFamily: "Pacifico, ui-rounded, cursive"
    fontSize: "1.05em"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Geist Variable, Geist, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 4vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Geist Variable, Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono Variable, Geist Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  md: "0.5rem"
  lg: "0.75rem"
  full: "9999px"
spacing:
  section: "6rem"
  section-lg: "8rem"
  card: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.fg-dark}"
    textColor: "{colors.bg-dark}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.fg-dark}"
    textColor: "{colors.bg-dark}"
  button-glass:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.fg-dark}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.25rem"
  card:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.fg-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card}"
---

# Design System: Ehsanul Haque Siam Portfolio

## 1. Overview

**Creative North Star: "The After-Dark Workshop"**

This is the desk of an engineer who ships at night: the room is dark, the light is a
screen, and everything on the surface is either information or a tool. The system is
monochrome by conviction. A neutral slate grayscale carries every heading, paragraph,
border, and surface; the near-black `#030712` background is the default, and light mode is
a first-class alternate, not an afterthought. Depth comes from tonal layering — cards sit a
step lighter than the page — never from heavy shadow. The polish is the pitch: for a
technical-hire audience, a site that is fast, quiet, and exact is more persuasive than one
that shouts.

Color is rationed like a scarce resource. It appears only where it *means* something —
amber for after-hours and "Accepted" status, green for "awake / available" — plus two
deliberate, sealed-off moments of full spectrum: the single rainbow contact button in the
footer and the ASCII particle fields that breathe behind a few sections. The personality
lives in earned surprises (a peeking studio cat, an emoji cursor trail, a ⌘K command
palette, headings that scramble-decode on scroll-in), never in the base surface.

What it explicitly rejects: the dark-mode-with-purple-gradients SaaS template; neon accents;
glassmorphism as decoration; a brand hue that drenches the page. There is no violet identity,
no gradient text, no eyebrow kicker above every section. The restraint is the voice.

**Key Characteristics:**
- Monochrome slate grayscale; **default dark**, light mode as a peer.
- Color is strictly semantic (status) plus two sealed decorative exceptions.
- Depth by tonal layering, not shadow.
- Geist (sans + mono) with Pacifico as a single script accent.
- Motion is choreographed but gated: reduced-motion + offscreen pauses everywhere.

## 2. Colors

A neutral slate grayscale is the entire working palette; the only chromatic values are two
status signals and two intentionally isolated decorative effects.

### Primary
- **Ink / Foreground** (`hsl(210 20% 98%)` dark, `hsl(224 71% 4%)` light): the workhorse.
  Carries headings, body copy, primary buttons (foreground fill on the background color),
  and the `::selection` swap. In this system the "primary" is the neutral itself — its
  contrast against the surface is the hierarchy.

### Secondary — the Signal Set
One meaning per hue, exposed as theme-aware tokens (`--signal-*`, light values darkened for
WCAG AA on white and on their own `/15` tint; the `.dark` block lifts each to a brighter
shade). Consumed as `text-signal-{role}` / `bg-signal-{role}/15`. Never a surface or heading.
- **Signal Success** (`#0a714e` light / `hsl(158 64% 52%)` dark): live / published /
  "Pursuing" / "Approach" / copy-success / "awake · available" status dot / GitHub heat-max.
  Unifies the old drift where the Hero used `green-500` but everything else used emerald.
- **Signal Pending** (`#a55209` light / `hsl(43 96% 56%)` dark): pending / after-hours
  ("Building after dark") / "Accepted" / "In press" — the amber process-state family.
- **Signal Problem** (`#c1153d` light / `hsl(351 95% 71%)` dark): the CaseStudies "Problem"
  label; reserved slot for future error/critical states.
- **Signal Star** (`#ce8c09` light / `hsl(43 96% 56%)` dark): featured / GitHub-star hover
  flourish only (shape carries the meaning; color is the flourish). `--signal-info` is
  defined but reserved.

### Tertiary — the Earned Accent
- **Accent Emphasis** (`#5d36c9` light / `hsl(252 90% 78%)` dark, iris-violet borrowed from
  the ASCII glyph + ambient ellipse): the ONE non-status accent. Applied only to the
  **numerals** of the count-up proof metrics (About / WhyMe / CaseStudies), static, never on
  labels. ~6:1 on white, high on dark. Its rarity is the whole point.

### Neutral
- **Background** (`hsl(224 71% 4%)` = `#030712` dark / `hsl(0 0% 100%)` light): the page.
  Also the value of `theme-color`.
- **Card / Surface** (`hsl(221 39% 11%)` dark / `hsl(0 0% 100%)` light): one tonal step off
  the page for glass panels, bento tiles, and code chrome.
- **Muted Foreground** (`hsl(218 11% 65%)` dark / `hsl(220 9% 46%)` light): secondary text,
  metadata, captions. Held above 4.5:1 against the surface — the deliberate anti-slop choice.
- **Secondary-Foreground** (`hsl(210 20% 98%)` dark): section-heading and icon color; a hair
  softer than pure foreground so headings read as structure, not shouting.
- **Border / Input** (`hsl(220 18% 14%)` dark / `hsl(220 13% 91%)` light): hairline
  1px dividers, card edges, glass outlines. Applied globally via `* { @apply border-border }`.
- **Ring** (`hsl(220 9% 46%)` dark / `hsl(218 11% 65%)` light): focus rings (double
  box-shadow: background halo + ring) and card-hover border lift.

### Named Rules
**The Signal-Plus-One Rule.** Color on the base surface is forbidden unless it carries
meaning. Two kinds of meaning qualify: (1) a **signal** — one of the `--signal-*` tokens for
a real status (success/pending/problem/star); (2) the **one earned accent** —
`--accent-emphasis` on proof-metric numerals only. Everything else is grayscale. No color
for "warmth," no third accent, no accent on labels/headings/body.

**The Earned-Accent Rarity Rule.** The iris-violet accent appears on exactly three surfaces
(About / WhyMe / CaseStudies metrics) and nowhere else. It reads as "earned" precisely
because it is scarce — the moment it spreads to a fourth place it becomes decoration. If you
add a metric surface, it gets the accent; if you're tempted to accent anything that isn't a
count-up proof number, don't.

**The Two Exceptions Rule.** Exactly two full-color *decorative* moments are sanctioned: the
single footer `RainbowButton` (the one contact CTA) and the `AsciiField`/`AsciiTorus`
particle scenes (violet→cyan→magenta→amber, now theme-aware via `--ascii-surface`). The
`GlowCard` hover glow draws from that same sealed violet→cyan palette — it is not a third
exception, it reuses the second. They are effects, not palette. Do not multiply them.

## 3. Typography

**Display / Body Font:** Geist Variable (with Geist, system-ui, sans-serif)
**Label / Mono Font:** Geist Mono Variable (with Geist Mono, ui-monospace, monospace)
**Script Accent Font:** Pacifico (with ui-rounded, cursive)

**Character:** One neutral, engineered grotesque doing nearly all the work across weights and
sizes, with Geist Mono for anything that should read as "data" (keycaps, metadata, the skip
link) and a single Pacifico flourish for warmth. The pairing is contrast-by-role, not
contrast-by-two-similar-sans: Geist is the machine, Pacifico is the signature.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 10.5vw, 3rem)` → `sm:text-7xl`, line-height 1.8): the
  hero H1 name only. The generous line-height is intentional for the stacked/animated name.
- **Script accent** (Pacifico 400, `1.05em`): the first name in the hero and one word of hero
  copy via `.script-accent`. Used sparingly — it is the signature, not a headline face.
- **Title** (700, `text-xl` → `sm:text-2xl`): centered section headings (`SectionHeading`),
  icon + `ScrambleText` decode, in `secondary-foreground`. Deliberately modest — headings
  orient, they don't dominate.
- **Body** (400, `1rem`, line-height ~1.6): paragraphs and descriptions in `foreground` /
  `muted-foreground`. Keep measure at 65–75ch inside the `max-w-5xl` column.
- **Label** (Geist Mono 600, `0.625rem`, tracking `0.05em`, often uppercase): keycaps
  (`kbd`), the focus skip-link, and small metadata. Mono signals "machine data," not costume.

### Named Rules
**The One Flourish Rule.** Pacifico appears at most twice per viewport and never in body
copy or a section heading. It is a signature, not a typeface for the page.

**The Quiet Heading Rule.** Section headings stay at `text-xl`/`text-2xl`. Display scale is
reserved for the hero. No section competes with the name.

## 4. Elevation

Flat by conviction. Depth is conveyed through **tonal layering** — the card/surface token
sits one lightness step off the background — not through drop shadows. The only shadows in
the system are functional-on-state: a soft diffuse lift on card hover
(`0 8px 30px -12px hsl(foreground / 0.18)`) and the focus ring's double box-shadow. Glass
chrome (navbar, command palette, glass cards) uses `backdrop-filter: blur()` + a hairline
border for separation, never a heavy shadow.

### Shadow Vocabulary
- **Card hover lift** (`box-shadow: 0 8px 30px -12px hsl(var(--foreground) / 0.18)`): the
  only ambient shadow; appears on `:hover` of `.glass-card`, paired with a border-color lift.
- **Focus ring** (`0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring))`): a
  background halo then a ring, so focus reads on any surface.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat by default. Elevation is a *response* to state
(hover, focus), never a resting decoration. If a card has a shadow while idle, it is wrong.

**The Tonal-Depth Rule.** To lift a surface, step its lightness toward the card token — do
not reach for a shadow. In dark mode, higher = lighter, same hue and chroma.

## 5. Components

### Buttons
- **Shape:** fully pill-rounded (`rounded-full`, `9999px`). `press-feedback` scales to
  `0.97` on `:active` across all buttons.
- **Primary** (`.btn-primary`): `foreground` fill, `background`-colored text; hover drops to
  `foreground / 0.88`. The highest-contrast, lowest-color affordance in the system.
- **Glass** (`.btn-glass`): `card / 0.6` background, hairline border, `blur(12px)`; hover
  lifts border to `ring / 0.7` and background to `secondary / 0.8`. Default secondary action.
- **Rainbow CTA** (`RainbowButton`): the single sanctioned full-color button; footer contact
  CTA only. Animated rainbow bands (`--color-1..5`). Do not reuse elsewhere.

### Cards / Containers
- **Corner Style:** `rounded-lg` (`0.75rem`); bento tiles and glass panels.
- **Background:** `card / 0.55` for `.glass-card`, `card / 0.6` for chrome; `backdrop-filter`.
- **Shadow Strategy:** flat at rest; hover lift only (see Elevation).
- **Border:** 1px `border / 0.8`, rising to `ring / 0.6` on hover.
- **Internal Padding:** `~1rem` (`spacing.card`); the About section uses a named bento grid
  (`.dashboard-grid`) rather than uniform cards.

### Navigation
- **Style:** floating glass pill (`.glass-chrome`: `background / 0.6`, `blur(16px)
  saturate(140%)`, hairline border). Links use `.link-underline` (a 0→100% width underline
  that draws in on hover/focus via `--ease-out-strong`).
- **States:** default `muted-foreground` → hover/active `foreground`; ⌘K opens the command
  palette; `ThemeToggle` cross-fades theme via the View Transitions API.
- **Mobile:** hamburger nav; touch targets floored at 44×44px (`@media max-width: 767px`).

### Inputs / Fields
- **Style:** `input` token background, 1px `border`, `rounded-md`. `kbd` chips use
  `secondary` fill + `border` + Geist Mono.
- **Focus:** the global `:focus-visible` ring (background halo + `ring`), never an outline.

### Signature Components
- **CommandPalette** (⌘K / Ctrl+K): glass-chrome overlay, fuzzy section jump — the power-user
  affordance that signals "built by someone who lives in tools."
- **ASCII scenes** (`AsciiField`, `AsciiTorus`): canvas particle fields cycling the signal
  palette; IO-gated, ≤30fps, reduced-motion aware. One of the two color exceptions.
  **Theme-aware:** the plate (`--ascii-surface`) and glyph colors read `.dark` per frame and
  repaint on toggle via a `MutationObserver` — dark glyphs on the light plate, bright glyphs
  on the dark plate (never a black box on a white page).
- **StudioCat / PeekCat / EmojiCursor:** the personality layer — a peeking cat and a cursor
  trail, both reduced-motion safe. Delight, rationed.

## 6. Do's and Don'ts

### Do:
- **Do** keep the base surface grayscale. Reach for `foreground` / `muted-foreground` /
  `border` before any hue.
- **Do** use the `--signal-*` tokens (`text-signal-success`, `bg-signal-pending/15`, …) for
  status — never raw `amber-500` / `emerald-500` / `green-500` / `rose-500` literals. One
  hue, one meaning, theme-aware, WCAG-checked.
- **Do** apply `--accent-emphasis` (iris-violet) only to count-up proof-metric numerals, and
  apply it to ALL three metric surfaces (About / WhyMe / CaseStudies) or none — never a subset.
- **Do** convey depth by stepping the surface lightness toward the `card` token; add shadow
  only as a hover/focus response.
- **Do** keep `muted-foreground` above 4.5:1 on its surface — light-gray-for-elegance is the
  single biggest reason a design reads as hard to use.
- **Do** gate every animation behind `prefers-reduced-motion` and pause every canvas/rAF loop
  offscreen and on `document.hidden` (Lighthouse mobile ≥94 is a hard floor).
- **Do** reserve Pacifico for at most two flourishes per viewport; reserve display scale for
  the hero name.

### Don't:
- **Don't** let any hue *own* the surface. The one iris-violet accent is a scalpel on proof
  numerals, not a brand color — it never touches backgrounds, headings, body, or nav. The
  page is Restrained-monochrome-plus-one-accent, not "Committed-dark with violet."
- **Don't** ship the dark-mode-with-purple-gradients SaaS template, neon accents, or
  glassmorphism as decoration — glass is chrome-only and purposeful.
- **Don't** use gradient text (`background-clip: text`), side-stripe borders
  (`border-left/right` > 1px as an accent), or an all-caps tracked eyebrow above every
  section. Emphasis is weight and size.
- **Don't** multiply the color exceptions. Exactly one RainbowButton (footer CTA) and the
  ASCII fields; nothing else earns full spectrum.
- **Don't** let a section heading compete with the hero — headings stay `text-xl`/`text-2xl`.
- **Don't** gate content visibility on a reveal transition; reveals must enhance
  already-visible, crawlable HTML (SSR/SEO invariant).
