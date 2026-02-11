# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Push Process

When pushing changes to the remote repository:

1. **Source Directory**: Development happens in `/home/siam/Personal/portfolio`
2. **Target Directory**: Push to `/home/siam/Personal/Portfolio_EhsanulHaqueSiam`
3. **Files to Copy**: Only essential files (no node_modules, dist, test-results, .claude)
4. **Images**: Only WebP format allowed - no PNG, JPG, or JPEG files
5. **Commit Messages**: Clean commit messages without `Co-Authored-By: Claude` attribution

### Push Workflow

```bash
# 1. Clear target (keep .git)
cd /home/siam/Personal/Portfolio_EhsanulHaqueSiam
find . -mindepth 1 -maxdepth 1 -not -name '.git' -exec rm -rf {} +

# 2. Copy essential files from source
cp -r /home/siam/Personal/portfolio/{src,public,assets/data} .
cp /home/siam/Personal/portfolio/{index.html,package.json,postcss.config.js,tailwind.config.js,tsconfig.json,vite.config.ts,netlify.toml,CLAUDE.md,.gitignore} .

# 3. Verify no png/jpeg
find . -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \)

# 4. Commit and push
git add -A
git commit -m "commit message here"
git push
```

## Build & Development Commands

```bash
# Development
bun run dev          # Start Vite dev server

# Build
bun run build        # TypeScript check + Vite production build
bun run preview      # Preview production build locally
```

Uses Bun as package manager. The build outputs to `dist/` and deploys to Netlify.

## Architecture Overview

This is a React + TypeScript portfolio site using Vite, TailwindCSS, and Framer Motion.

### Data Flow
- **Content source**: JSON files in `assets/data/` (skills, projects, experience, achievements, publications, testimonials)
- **Type definitions**: `src/data/types.ts` defines interfaces for all content types
- **Content hub**: `src/data/content.ts` imports JSON, exports typed data + filtered subsets (e.g., `featuredProjects`)
- **Path aliases**: `@/*` maps to `src/*`, `@data/*` maps to `assets/data/*`

### Component Structure
```
src/
├── App.tsx              # Main app with loading screen, section composition
├── components/
│   ├── [Section].tsx    # Page sections (Hero, About, Skills, Projects, etc.)
│   └── ui/              # Reusable animation/effect components
│       ├── index.ts     # Barrel export for all UI components
│       ├── SmoothScroll.tsx   # Lenis-based smooth scrolling
│       ├── Cursor.tsx         # Custom cursor (desktop only)
│       └── ...                # TextReveal, TiltCard, MagneticButton, etc.
└── hooks/               # useScrollReveal, useMousePosition, useFrame
```

### Key Libraries
- **Framer Motion**: All animations and transitions
- **@studio-freight/lenis**: Smooth scroll behavior (wrapped in `SmoothScroll` component)
- **TailwindCSS**: Styling with custom `space-*`, `violet-*` colors and `display`/`body` fonts

### Image Handling
- Images stored in `public/images/` (projects/, achievements/, publications/, education/)
- All images use WebP format for optimization
- Helper functions in `content.ts`: `getProjectImage()`, `getAchievementImage()`, `getPublicationImage()`
- `OptimizedImage` component handles lazy loading and preloading

### Custom Tailwind Config
Extended theme in `tailwind.config.js`:
- Colors: `space-600..900`, `violet-400..600`, `amber-400..600`
- Fonts: `font-display` (Clash Display), `font-body` (Satoshi)
- Custom animations: `float`, `pulse-glow`, `gradient-x`, `glitch`, `shimmer`
