import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
// Fully static output (SSG) — no SSR, no adapter (per Astro docs, static
// Netlify sites only need the adapter for astro:assets, which we don't use).
// The Netlify Image CDN is still used: OptimizedImage builds /.netlify/images
// srcsets directly against the platform endpoint.
//
// NOTE on CSP: Astro's `security.csp` (hash-based) was evaluated and does NOT
// work here — the island runtime injects an inline <style>, whose hash makes
// browsers ignore 'unsafe-inline', which in turn blocks the SSR'd style=""
// attributes (Framer Motion initial states, bento grid-area). The CSP
// therefore lives in netlify.toml as a response header.
export default defineConfig({
  site: 'https://ehsanulhaquesiam.netlify.app',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react()],
  build: {
    // Emit hashed assets under /_astro/ (matched by netlify.toml cache headers)
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Keep bundles lean; Netlify serves Brotli at the edge
      cssMinify: true,
      rollupOptions: {
        output: {
          // Long-lived vendor chunks: content edits re-hash only the app
          // chunk, so returning visitors keep motion/react-dom cached.
          manualChunks(id) {
            if (id.includes('framer-motion')) return 'motion';
          },
        },
      },
    },
  },
});
