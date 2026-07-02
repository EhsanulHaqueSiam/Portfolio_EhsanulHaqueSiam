# DESIGN SPEC — "PROOF OF WORK — Director's Cut"

> **V2 ADDENDUM — CINEMATIC PIVOT (overrides anything below that conflicts)**
>
> The material system stays (paper/ink/vermilion, hairlines, plates, mono
> annotations, dotted leaders) but the personality shifts from *static print
> journal* to *directed film*. Rules:
>
> 1. **Poster type**: all section H2s and hero-scale type use the `.poster`
>    class (Archivo Variable — heavy, wide, uppercase) instead of light
>    Fraunces. An `<em>` inside poster type automatically renders as Fraunces
>    italic in vermilion (the "accent word"): `SELECTED <em>work</em>`.
>    Fraunces (font-display) remains for pull quotes, bios, big numerals, and
>    accent italics — never for section titles anymore.
> 2. **Section naming — recruiter-legible, no journal conceits**: use plain
>    names in folio rows: 01 ABOUT · 02 PROOF · 03 EXPERIENCE · 04 SKILLS ·
>    05 SELECTED WORK · 06 TESTIMONIALS · 07 AWARDS & CERTS · 08 RESEARCH ·
>    09 EDUCATION · 10 FAQ · 11 CONTACT. Titles confident and plain with one
>    <em> accent (e.g. `Proof, <em>measured</em>` / `The <em>record</em>`).
> 3. **Never needy**: no "OPEN TO WORK" stamps or badges anywhere. He has
>    three current roles — lead with "NOW — Research Assistant @ Deepchain
>    Labs". Availability appears ONCE, in Contact, phrased as
>    "Taking on select AI/full-stack engagements — worldwide, remote".
>    Stamps are for achievements only (PUBLISHED, ACCEPTED, CERTIFIED, 7×
>    FASTER) — proof, not pleading.
> 4. **Google XYZ framing**: metrics lead. Every experience/project line
>    surfaces "accomplished X measured by Y by doing Z" — value first, huge
>    numerals, method second.
> 5. **Emil Kowalski motion**: fast-out springs, clip-path/mask reveals,
>    subtle blur-up (filter: blur(4px)→0 with opacity), scale 0.98→1 — motion
>    always 150–700ms, eased [0.16,1,0.3,1] or [0.32,0.72,0,1]; hover states
>    respond <150ms; nothing bounces twice. Choreograph one clear focal
>    reveal per viewport — direct the eye like a film cut.
> 6. **Interactive wow set-pieces** (owned by lead): ferrofluid hero name
>    (FerroText), crosshair cursor, cursor-following project previews,
>    studio cat easter egg, marquee tickers. Sections may add small
>    physics-feel micro-interactions but keep them tactile and quick.

Master art direction for the 2026 portfolio redesign. Every component must follow this
document exactly. When in doubt, choose *editorial print* over *web app*.

## 1. Concept

Ehsanul is a **published researcher who ships production systems**. The site is designed
as a beautifully typeset **research journal / print edition about his work**: warm paper,
warm ink, vermilion rubber stamps, mono annotations, hairline rules, figure captions,
citations, dotted leaders, registration marks. Sections read like parts of a paper:
Abstract, Findings, Records, Instrumentation, Selected Works, Correspondence, Bibliography.

Two full-bleed **inverted ink spreads** (dark sections) punctuate the paper flow:
**Projects** and **Contact**. Everything else sits on paper.

The wow factor comes from: giant Fraunces display type with kinetic reveals, cursor-
following project image previews, rubber-stamp motifs, marquee tickers, duotone plates
that develop into full color on hover, and obsessive print details — NOT from glows,
gradients, or glassmorphism. **Never use**: violet/purple, glassmorphism (`backdrop-blur`
+ translucent cards), neon glows, `rounded-2xl` cards with borders, emoji icons.

## 2. Palette (Tailwind tokens already configured)

| Token | Hex | Use |
|---|---|---|
| `paper-50` | `#FAF7F0` | raised cards / plates on paper |
| `paper-100` | `#F5F1E8` | page background (DEFAULT `paper`) |
| `paper-200` | `#ECE5D6` | tinted panels, image placeholder |
| `paper-300/400` | `#DED4BF` `#C7BA9F` | deep tints, borders on paper |
| `ink-900` | `#171412` | body text, ink spreads background (DEFAULT `ink`) |
| `ink-950` | `#0F0D0B` | deepest layer inside ink spreads |
| `ink-800/700` | `#252019` `#3B342B` | raised panels inside ink spreads |
| `ink-600/500` | `#544A3E` `#6B6152` | muted text on paper |
| `ink-400/300` | `#8D8371` `#B0A794` | faint annotations, muted text on ink |
| `vermilion` (500) | `#D93A0D` | THE accent: stamps, active states, links hover, key data |
| `vermilion-600/700` | darker | hover states of accent |
| `vermilion-50` | `#FBEAE3` | rare soft tint fills |
| `cobalt` | `#2C45C9` | RARE second accent: hyperlink-flavored details, ~1–2 uses per section max |

Hairlines: use CSS vars — `border-[color:var(--hairline)]` on paper,
`border-[color:var(--hairline-inverse)]` on ink. Or classes `.rule`, `.rule-inverse`
(they set border-color only; you still need `border-t` etc.).

Contrast rules: body text on paper = `text-ink-900` or `text-ink-700`; muted = `ink-500`.
On ink spreads: body = `text-paper-100`, muted = `text-ink-300`/`paper-300`. Vermilion
text only at `text-sm`+ bold/mono or large sizes (AA).

## 3. Typography

- `font-display` → **Fraunces** (variable, optical sizing auto). Headlines, pull quotes,
  giant numerals. Use weights 300–600 — light/regular at huge sizes looks editorial;
  ALSO use `italic` Fraunces generously for emphasis words inside headlines.
- `font-body` → **Instrument Sans**. All body copy, UI labels. 400/500/600.
- `font-mono` → **Spline Sans Mono**. ALL-CAPS micro-labels, folios, dates, tags, data,
  captions. Usually `text-[11px]`–`text-xs`, `tracking-[0.14em]`–`[0.2em]`, uppercase.

Prebuilt helpers (index.css / tailwind config):
- `.folio` — mono uppercase label on paper (`.folio-inverse` on ink)
- `text-display-xl / -lg / -md` — fluid clamp() display sizes with tight leading
- `.text-outline` / `.text-outline-inverse` — transparent fill, hairline stroke (ghost numerals)

Headline pattern: mix roman + `<em class="italic font-light">` inside the same Fraunces
headline, e.g. `Records of <em>employment</em>`.

## 4. Print furniture (shared vocabulary — use these everywhere)

- **Folio row**: every section starts with a hairline-topped row:
  `NN — SECTION NAME` (mono, left) and a right-aligned mono annotation
  (e.g. `EST. READ 2 MIN`, `5 ENTRIES`, `2023—2026`). Then the giant Fraunces title.
  Section numbers: 01 Abstract(About) · 02 Findings(WhyMe) · 03 Records(Experience) ·
  04 Instrumentation(Skills) · 05 Selected Works(Projects) · 06 Letters(Testimonials) ·
  07 Honours(Awards) · 08 Bibliography(Publications) · 09 Academic Record(Education) ·
  10 Inquiries(FAQ) · 11 Correspondence(Contact).
  Use the shared `<SectionHeader>` (rewritten — see ui/SectionHeader.tsx) unless the
  section spec says custom.
- **Stamps**: `.stamp` class (mono uppercase, double vermilion ring, grunge mask).
  Rotate slightly (`-rotate-6`). Uses: OPEN TO WORK, ONGOING, PUBLISHED, ACCEPTED 2026,
  1ST RUNNER-UP, CERTIFIED. `.stamp-on-ink` variant inside ink spreads.
- **Plates** (images): wrap every `<img>`/`OptimizedImage` in `<div class="plate">` —
  grayscale + warm tint that develops to full color on hover (or `group` hover). Add
  `.reg-marks` (print crop corners) + a mono caption below: `FIG. 04 — CAPTION TEXT`.
  Number figures sequentially per section.
- **Dotted leaders**: `<span class="leader" />` between a left label and right value
  (TOC/ledger look). `.leader-inverse` on ink.
- **Ghost numerals**: giant `font-display .text-outline` numbers (01, 02…) positioned
  behind/beside content, `select-none pointer-events-none`.
- **Marquee tickers**: thin hairline-bounded strips between certain sections with mono
  uppercase content + `✦`/`·` separators (use existing `<Marquee>`).
- **Corners/edges**: NO rounded corners anywhere (`rounded-none`); rectangles + hairlines.
  Buttons: rectangular, mono uppercase text, 1px ink border; primary = solid ink bg +
  paper text (on paper) or solid paper bg + ink text (on ink); hover swaps to vermilion
  bg + paper text. Use `.press-feedback`.

## 5. Motion language

Framer Motion (`m.` from LazyMotion — ALWAYS `import { m } from 'framer-motion'`, never
`motion.`). Ease: `[0.16, 1, 0.3, 1]`. Durations 0.6–0.9s.

- Reveals: mask reveals (child `y: '100%'` → `0%` inside `overflow-hidden` parent) for
  headlines; `opacity 0 / y: 24→0` for blocks; stagger 0.06–0.1.
- `whileInView` + `viewport={{ once: true, margin: '-10%' }}`.
- Hover: underline draw (`.link-ink` / `.link-drawn`), plates developing color,
  arrow nudge (`.arrow-bounce`), stamp thump (`whileHover={{ rotate: -3, scale: 1.04 }}`).
- Big moments only — no scattered micro-wiggles. Respect `useReducedMotion` for anything
  scroll-linked/parallax; CSS handles the rest via media queries.
- Numbers: count-up on inView is welcome for stats (SSR must still render final value as
  text — animate FROM final value only after hydration, e.g. render value, then animate).

## 6. Hard engineering contracts (DO NOT BREAK)

1. **SSR parity**: every piece of text/content must exist in the server-rendered HTML.
   Framer initial-hidden is fine (Layout no-js fallback reveals it). Never gate content
   behind `useEffect`/`useState` mounts. `useMediaQuery` returns `false` on server — the
   `false` branch must render full content.
2. **Section ids stay exactly**: `about, why-me, experience, skills, projects,
   testimonials, awards, publications, education, blog, faq, contact` + `<main
   id="main-content">`. Hash links `#resume` (Resume overlay) and `/resume.pdf` stay.
3. **Data via `src/data/content.ts` only** — same imports/fields as the current
   component (check before rewriting). Never hardcode content that exists in data.
   FAQ must render `faqItems` VERBATIM (JSON-LD parity).
4. **Images**: keep using `OptimizedImage` + `getProjectImage`/`getAchievementImage`/
   `getPublicationImage`. WebP only. `priority` for anything above the fold.
5. **Accessibility**: keep/im­prove all aria labels, focus-visible states, keyboard
   operability, 44px touch targets, alt text. Decorative elements `aria-hidden`.
6. **rel="me"** on GitHub/LinkedIn profile links; `rel="noopener noreferrer"` +
   `target="_blank"` on external links.
7. Mobile-first responsive: every section must be flawless at 360px, 768px, 1440px.
   Marquee/cursor/tilt effects disabled on touch (existing components handle this).
8. Icons: use `ui/Icons.tsx` SVGs (extended set available), never emoji.

## 7. Per-section art direction

### Navbar — "masthead"
Fixed top. Paper bg with bottom hairline once scrolled (NO blur/translucency — solid
`bg-paper-100`). Left: wordmark `EHSANUL HAQUE SIAM` in small-caps mono (or `E.H.S.` on
mobile). Center-right: nav links in mono uppercase 11px with index numbers
(`01 About … 08 Contact`), `.link-ink` hover, vermilion for active section. Right edge:
`[ HIRE ME ]` solid-ink button → `#contact`. Keep hide-on-scroll-down behavior. Mobile
menu: full-screen PAPER overlay, giant Fraunces index list (numbered, hairline rows,
stagger reveal), mono footer row with email + location.

### Hero — "front page" (OWNED BY LEAD — do not touch)

### About `#about` — "01 / Abstract"
Two-column editorial spread. Left rail (sticky on lg): folio `01 — ABSTRACT`, portrait
plate (`profileImage`, FIG. 01 — THE AUTHOR, reg marks), location/mono details with
dotted leaders (BASED IN … DHAKA, BD / FOCUS … AI × FULL-STACK / STATUS … OPEN TO WORK
in vermilion). Right: bio typeset large (`text-xl/2xl` Fraunces light, 1.6 leading) with
a **drop cap** (first letter `float-left` Fraunces ~5rem vermilion). Key phrases
underlined with `.link-drawn`-style permanent underline (spans, not links). Below bio:
GitHubGraph restyled as `FIG. 02 — CONTRIBUTION DENSITY, 52 WEEKS` with mono caption +
hairline frame. Keep the GitHub profile link.

### WhyMe `#why-me` — "02 / Findings"
Reframe "Why hire me?" as **peer review findings**. Title: `Findings` + italic aside
`(or: why hire me)`. Render the existing 3–4 value props as numbered findings rows:
huge ghost numeral, claim in Fraunces `text-display-md`, supporting copy in body font,
each with a mono proof chip (real stats: 1.5x revenue, 50K+ users, 3 papers, 8+ apps).
End with a delight moment: a reviewer-comment card in mono —
`REVIEWER #2: "Strong accept. No revisions required." — stamped ACCEPT` (vermilion stamp).

### Experience `#experience` — "03 / Records of Employment"
Ledger table, not cards. Each row: mono date range (left, fixed width), company in
Fraunces `text-2xl/3xl` + role in body font, dotted leader, right-aligned mono
annotations (REMOTE / PART-TIME etc. parsed from role text where present). Rows divided
by hairlines; rows with `/present/i` in date get a small vermilion `ONGOING` stamp.
Row hover: bg `paper-50` and company shifts to vermilion; keep desc visible (static,
no accordion) as a second line `text-ink-500`. Company logos (deepchain, unies) as small
grayscale plates. Keep `#resume` CTA at the end: `VIEW FULL RECORD → (#resume)`.

### Skills `#skills` — "04 / Instrumentation"
Type-specimen index, NOT tabs and NOT progress bars. All 8 categories rendered as an
open ledger: each category = hairline-topped row with mono index (04.1 … 04.8), category
name in Fraunces `text-display-md` (light), then its skills as inline mono chips
separated by ` · `; `expert` skills in vermilion, `advanced` in ink-900, `intermediate`
in ink-500 — with a mono legend up top (`VERMILION = EXPERT` etc.). Desktop hover on a
category row can reveal a right-aligned mono count (`9 INSTRUMENTS`). Drop the devicon
CDN icons entirely (removes jsdelivr dependency from this section). No filtering state —
everything visible = crawlable.

### Projects `#projects` — INK SPREAD — "05 / Selected Works"
`bg-ink-900 text-paper-100`, full-bleed, generous `py-32`. Folio row inverse. Title:
`Selected <em>works</em>` in paper. Two zones:
1. **Case plates** (top): the 3 projects with strongest caseStudy metrics (ScholarHub,
   Indian Claypit, TTT Autos) as large alternating editorial plates: image plate
   (FIG. caption, reg marks) + huge Fraunces title + one-line desc + 2–3 mono result
   chips (from caseStudy.results / metrics) + links (LIVE ↗ / CODE ↗ with `.link-ink`).
2. **The index** (below): remaining `featuredProjects` as a ledger list — mono index
   `004…0NN`, project name Fraunces `text-2xl/4xl`, dotted leader, tags (first 3, mono),
   arrow. **Desktop wow**: hovering a row shows a cursor-following floating image
   preview (fixed-position `m.div` w-[320px] plate, springs x/y to cursor, image swaps
   per row; render with plain `<img>` since previews are decorative — guard behind
   `(hover:hover) and (pointer:fine)` via useMediaQuery and reduced-motion). Mobile: each
   row includes a static small thumbnail instead. Every row links to `links.view ||
   links.code`. Section footer: mono link `FULL ARCHIVE ON GITHUB ↗` → profile.github.
Keep aria-labels on links (`View ${name} …`). No category filter — the ledger shows all
featured projects (crawlability > filtering).

### Testimonials `#testimonials` — "06 / Letters"
Keep paper. Oversized opening quote glyph in Fraunces vermilion (~10rem, absolute).
Testimonials as typeset letters: quote in Fraunces italic `text-xl/3xl` light, hanging
punctuation feel, author block in mono (`— NAME · ROLE, COMPANY`) with hairline above.
Asymmetric 2-col layout with offset vertical rhythm (staggered `lg:mt-16`), NOT a
uniform card grid. Hairline frames only on hover.

### Awards `#awards` — "07 / Honours & Certifications"
Keep the existing gallery/lightbox functionality and aria labels, restyle fully:
certificates as archival plates on paper — plate image + mono catalog number
(`CAT. 07-01`), name in Fraunces, desc `text-ink-500`, category as stamp-style chip
(CEH gets a proper vermilion `.stamp` "CERTIFIED"). Masonry-ish asymmetric grid
(first item spans 2 cols). Lightbox: ink-950 overlay, paper chrome, mono controls,
keep keyboard/focus handling.

### Publications `#publications` — "08 / Selected Bibliography"
The strongest natural fit — typeset real citations. Numbered `[1] [2] [3]` hanging-
indent entries: title in Fraunces `text-2xl/3xl`, then a mono citation line
(`CONFERENCE · DATE`), desc in body. Status parsed from date/desc: `ACCEPTED` /
`PUBLISHED` / `PRESENTED` as stamps. Keep the expandable image behavior + aria-expanded
(restyle as "VIEW PLATE"). If `paperLink` exists render `READ ↗`. Footer note stays
(mono): more in progress.

### Education `#education` — "09 / Academic Record"
Transcript excerpt aesthetic: institution in Fraunces, degree + years mono, CGPA and
honours as ledger rows with dotted leaders (CGPA … 3.9X / DEAN'S LIST … 3×). Small
plate for the university image. Single strong entry layout (AIUB), hairline-framed.

### FAQ `#faq` — "10 / Inquiries"
Keep native `<details>/<summary>` (works pre-hydration). Questions in Fraunces
`text-xl/2xl`, mono index `Q.01`, plus→× rotation kept but as hairline square button
look. Answers `text-ink-600` max-w-prose. Hairline dividers between items. Text VERBATIM
from `faqItems`.

### Contact `#contact` — INK SPREAD — "11 / Correspondence"
Full-bleed ink finale. Folio inverse row. Giant Fraunces: `Let's put your next
<em>system</em> in production.` (`text-display-xl`, paper). The email as the hero
interaction: gigantic mono/Fraunces link with underline draw + copy button (keep copy
behavior + aria). Recruiter mailto template kept. Ledger rows (inverse leaders):
LOCATION … DHAKA, BD (UTC+6) / AVAILABILITY … OPEN — FULL-TIME / REMOTE … WORLDWIDE /
RESPONSE … < 24 HRS. Social links mono with ↗. `HIRE-ME DOSSIER ↗` link to /hire-me.html
styled as a stamped file link. Big `OPEN TO WORK — 2026` stamp (`.stamp-on-ink`).

### Footer — "colophon"
On ink (continuous with Contact — footer sits inside the same ink field, hairline-topped).
Three mono columns: (1) `© 2026 EHSANUL HAQUE SIAM — DHAKA, BANGLADESH`,
(2) colophon: `SET IN FRAUNCES, INSTRUMENT SANS & SPLINE SANS MONO · BUILT WITH ASTRO 7 ·
DEPLOYED ON NETLIFY`, (3) quick links + `RETURN TO MASTHEAD ↑` (`#main-content`).
Keep GitHub/LinkedIn/Email aria-labeled links.

### SocialLinks (fixed rail)
Left-edge vertical rail (lg+ only, keep hidden on mobile): rotated mono text links
`GITHUB / LINKEDIN / CV` with hairline separators, ink on paper, `.link-ink` hover.
Keep rel="me" and #resume link.

### Blog `#blog` (component exists but unmounted — restyle for future)
"12 / Field Notes" — ledger rows like Projects index, `COMING SOON` entries get mono
`IN PRESS` chips and no link.

### Resume overlay (`#resume` hash)
KEEP all behavior + print classes + structure (`resume-paper`, `resume-bullets`, etc.).
Restyle only the overlay chrome: ink-950/90 backdrop, paper sheet, mono controls
(BACK / PRINT). The sheet itself is already print-optimized — align its screen colors
to paper/ink.

### 404.astro + hire-me.html
Restyle standalone pages to the same palette (self-contained inline CSS, serif via
Georgia fallback is fine). 404: `PAGE NOT FOUND — return to the front page` with folio
+ stamp `MISPRINT`.

## 8. App shell (App.tsx)

Order unchanged. Replace the fixed violet/amber gradient background with: `.ruled-columns`
fixed layer + `.grain-overlay` fixed layer (both aria-hidden). Marquee ticker strips
(hairline-bounded, mono) inserted between: Hero→About (`OPEN TO WORK · AI ENGINEERING ·
LLM/RAG SYSTEMS · FULL-STACK · DHAKA→WORLDWIDE`), and Skills→Projects
(`SELECTED WORKS · 2023—2026 · SHIPPED & MEASURED`). Keep SmoothScroll, CustomCursor
(rewritten), ScrollProgress (rewritten), cv-auto wrappers, Resume overlay.
