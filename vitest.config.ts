import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Astro's virtual modules exist only inside an Astro build; tests get a stand-in.
  resolve: { alias: { 'astro:transitions/client': fileURLToPath(new URL('./src/test/astro-transitions.ts', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
