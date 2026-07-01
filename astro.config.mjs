import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
// Fully static output (SSG) — no SSR, no adapter. The entire React app is
// server-rendered to static HTML at build time and hydrated as a single island.
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
    },
  },
});
