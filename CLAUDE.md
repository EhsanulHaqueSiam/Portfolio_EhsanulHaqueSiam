# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack (migrated to Astro 7, July 2026)

This repository **is the primary, standalone project** and is what deploys to Netlify.
It was migrated from a Vite React SPA to **Astro 7 (static output, no SSR)**.

- The whole site is one React island (`<App client:load page=... />`) mounted by
  `src/pages/index.astro` and `src/pages/publications.astro`. Astro server-renders it to
  static HTML at build time (SEO/AEO/GEO), then hydrates it for sounds, the dock, the
  project pile and the Resume overlay.
- **No SSR / no adapter** — `output: 'static'`. Netlify serves the pre-built `dist/`.
- React 18, Tailwind v3 (via PostCSS), framer-motion 11.
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
├── pages/index.astro         # home; fetches open-source stars/PR states at build (loadOpenSource)
├── pages/publications.astro  # /publications
├── pages/404.astro           # static 404 (noindex)
├── layouts/Layout.astro      # <head>: meta, OG/Twitter, JSON-LD, fonts, favicons, no-JS reveal
├── seo/schema.ts             # builds full JSON-LD @graph + META from content.ts (data-driven)
├── App.tsx                   # one column between dashed rails; picks home or publications
├── components/home/          # Nov 2026 redesign: chrome (Nav, Section, Dock), Profile, Shipped,
│                             #   OpenSource, Rows (Experience/Research/Education), StackActivity,
│                             #   Publications, icons + brandPaths (Simple Icons, CC0)
├── components/Resume.tsx     # CV overlay: #resume, and #resume-print for hq's PDF printer
├── components/ui/            # Icons, ThemeToggle (still used)
├── lib/sound.ts              # synthesized Web Audio UI sounds, toggle persisted in localStorage `sound`
├── lib/haptics.ts            # haptic(): Vibration API, or the iOS `<input switch>` trick
└── data/                     # content.ts (typed JSON hub), opensource.ts, types.ts
scripts/generate-seo.mjs      # prebuild: regenerates public/{robots.txt,sitemap.xml,llms.txt,llms-full.txt}
```

### SEO / AEO / GEO
- `src/seo/schema.ts` → JSON-LD `@graph` (Person, ProfilePage, WebSite, 3× ScholarlyArticle,
  ItemList of projects, ProfessionalService, BreadcrumbList, FAQPage, WebPage) + meta config,
  all generated from `assets/data`. Rendered in `Layout.astro`.
- `scripts/generate-seo.mjs` regenerates `robots.txt`, `sitemap.xml`, `llms.txt`,
  `llms-full.txt` from the same data on every build — keep it in sync when data changes.
- SSR-hidden content: Framer Motion emits `opacity:0` inline until hydration. Layout injects
  an `html.no-js` fallback + inline JS so JS-off visitors and crawlers still see all content.

### Key Libraries and design
- **Astro 7** static output with `@astrojs/react`. **Framer Motion 11** via `LazyMotion` + `m`
  (strict mode: import `m`, never `motion`).
- **TailwindCSS v3**, shadcn-style HSL tokens in `src/index.css` (`:root` light, `.dark` true
  black). Class dark mode, default dark, `ThemeToggle` saves localStorage `theme`.
- Fonts: Geist (sans), Geist Mono, Instrument Serif (`font-serif`, display titles).
- Shell utilities in `index.css`: `.rails` (680px column, dashed sides), `.hatch` (section band),
  `.press`, `.icon-pop` / `.icon-nudge` (hover micro-animations), `.sticker`, `.pile` / `.print`.
- Open source section: `assets/data/opensource.json` is hand-kept (PR numbers, titles, fallback
  stars); `loadOpenSource()` refreshes stars and merged/open state from the GitHub API at build
  (set `GITHUB_TOKEN` to lift the 60 req/h limit) and drops closed-unmerged PRs.
- GitHub activity grid fetches `github-contributions-api.jogruber.de` client-side (CSP allows it).
- Every hover/tap sound goes through `sound.*`; it stays silent until the first user gesture
  and while muted. Haptics only fire on coarse pointers.

### Image Handling
- WebP in `public/images/` (projects/, achievements/, publications/, education/).
- Helpers in `content.ts`: `getProjectImage()`, `getAchievementImage()`, `getPublicationImage()`.
- Header banner (pixel art, generated Nov 2026): `public/images/banner-anim.webp` is an 8-frame
  loop (river shimmer, lantern flicker, star twinkle) made from the still `banner.webp`, which
  reduced-motion visitors get instead. The loop is the LCP image, preloaded in `Layout.astro`.
