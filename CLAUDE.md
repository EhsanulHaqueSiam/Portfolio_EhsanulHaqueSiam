# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack (migrated to Astro 7, July 2026)

This repository **is the primary, standalone project** and is what deploys to Netlify.
It was migrated from a Vite React SPA to **Astro 7 (static output, no SSR)**.

- The entire React + Framer Motion experience mounts as a **single Astro island**
  (`src/pages/index.astro` → `<App client:load />`). Astro server-renders it to
  static HTML at build time (SEO/AEO/GEO), then hydrates it in the browser so every
  animation, Lenis smooth-scroll, and interaction works exactly as before.
- **No SSR / no adapter** — `output: 'static'`. Netlify serves the pre-built `dist/`.
- React 18, Tailwind v3 (via PostCSS), framer-motion 11, `@studio-freight/lenis`.
- The legacy Vite SPA lives in `/home/siam/Personal/portfolio` (now stale — do not
  copy from it; work directly in this repo).

## Build & Development Commands

```bash
bun install          # install deps
bun run dev          # Astro dev server (http://localhost:4321)
bun run build        # regenerate SEO files (scripts/generate-seo.mjs) + astro build → dist/
bun run preview      # serve the production build locally
bun run seo:gen      # regenerate public SEO files only
```

Uses Bun locally; Netlify runs `npm run build` with `NODE_VERSION=22.12.0` (see netlify.toml).

## Git / Deploy Process

Work directly in this repo. Netlify auto-deploys the `main` branch of the GitHub remote.

1. **Images**: WebP only — no PNG/JPG/JPEG (favicons `favicon-32x32.png` / `apple-touch-icon.png` excepted).
2. **Commit messages**: clean, no `Co-Authored-By: Claude` attribution.
3. `git add -A && git commit -m "…" && git push`.

## Architecture Overview

Astro 7 + React islands + TailwindCSS + Framer Motion.

### Data Flow — single source of truth
- **Content**: JSON in `assets/data/` — `profile.json` (identity/stats), plus skills,
  projects, experience, achievements, publications, testimonials, blog.
- **Types**: `src/data/types.ts`.
- **Content hub**: `src/data/content.ts` imports the JSON and exports typed data +
  filtered subsets (`featuredProjects`, `awards`, …). Components import from here.
- The SAME JSON drives both the UI and the SEO layer, so metadata can never drift.

### Astro structure
```
src/
├── pages/index.astro     # mounts <App client:load /> inside Layout
├── pages/404.astro       # static 404 (noindex)
├── layouts/Layout.astro  # <head>: meta, OG/Twitter, JSON-LD, fonts, favicons, no-JS reveal
├── seo/schema.ts         # builds full JSON-LD @graph + META from content.ts (data-driven)
├── App.tsx               # composes all sections (static imports so they SSR into HTML)
├── index.css             # global styles + Tailwind directives (imported by Layout)
├── components/            # section components + ui/ (animation/effect components)
└── hooks/                 # useMediaQuery, useMousePosition (all SSR-safe / effect-guarded)
scripts/generate-seo.mjs   # prebuild: regenerates public/{robots.txt,sitemap.xml,llms.txt,llms-full.txt}
```

### SEO / AEO / GEO
- `src/seo/schema.ts` → JSON-LD `@graph` (Person, ProfilePage, WebSite, 3× ScholarlyArticle,
  ItemList of projects, ProfessionalService, BreadcrumbList, FAQPage, WebPage) + meta config,
  all generated from `assets/data`. Rendered in `Layout.astro`.
- `scripts/generate-seo.mjs` regenerates `robots.txt`, `sitemap.xml`, `llms.txt`,
  `llms-full.txt` from the same data on every build — keep it in sync when data changes.
- SSR-hidden content: Framer Motion emits `opacity:0` inline until hydration. Layout injects
  an `html.no-js` fallback + inline JS so JS-off visitors and crawlers still see all content.

### Key Libraries
- **Astro 7** — static site generator, React integration (`@astrojs/react`).
- **Framer Motion 11** — all animations via `LazyMotion` + `m` (strict mode: import `m`, never `motion`).
- **@studio-freight/lenis** — smooth scroll (`SmoothScroll`, browser-only, effect-guarded).
- **cobe** — WebGL globe in the About bento (Dhaka marker, drag to spin, IO-gated).
- **TailwindCSS v3** — shadcn-style semantic tokens (July 2026 rebuild modeled on
  shivypatel.com): `background/foreground/card/muted/secondary/border/ring` as HSL
  triplets in `src/index.css` (`:root` light + `.dark` dark; class dark mode, default
  dark, toggled via `ThemeToggle` with View Transition cross-fade, saved in
  localStorage `theme`). Fonts: Geist (sans), Geist Mono, Pacifico (`.script-accent`).
  Legacy `paper/ink/vermilion` color tokens remain ONLY for the Resume overlay sheet
  (`.resume-paper`), which intentionally stays light for print.
  Utilities in `index.css`: `.glass-chrome`, `.glass-card`, `.fade-mask-left/right`,
  `.bg-ellipse`, `.dashboard-grid` (bento areas), `.btn-glass`, `.btn-primary`.
- **Interactive ui/ components** (magicui/aceternity ports, all SSR-safe + IO/reduced-motion
  gated): BlurFade, Marquee, NumberTicker, ShimmerButton/Border, SpotlightGlow,
  GlowingEffect, BorderBeam, TracingBeam, HeroConstellation, RainbowButton, TiltCard,
  ScrambleText, ScratchToReveal, AnimatedName, Globe, AsciiTorus, AsciiField, StudioCat
  (footer cat), EmojiCursor (`data-cursor-emoji="…"`), CommandPalette (Ctrl/Cmd+K).
- **Performance invariant (Lighthouse mobile ≥94)**: every canvas/WebGL/rAF loop MUST
  pause offscreen (IntersectionObserver) and on `document.hidden`, and cap at ~30fps.
  The cobe Globe uses `threshold: 0.25` — do not loosen; headless/software-GL renders
  it on the CPU and it alone cost 60s of TBT.

### Image Handling
- WebP in `public/images/` (projects/, achievements/, publications/, education/).
- Helpers in `content.ts`: `getProjectImage()`, `getAchievementImage()`, `getPublicationImage()`.
- `OptimizedImage` lazy-loads via IntersectionObserver (non-priority images are absent from
  static HTML — use `priority` for anything that must be crawlable/LCP).
