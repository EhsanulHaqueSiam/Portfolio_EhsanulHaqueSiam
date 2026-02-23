import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // Note: Compression removed - Netlify handles Brotli/Gzip at edge
  ],
  build: {
    // Terser for smaller bundle output
    minify: 'terser',
    terserOptions: {
      compress: {
        // Keep console.error/warn, drop log/debug/info
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        drop_debugger: true,
      },
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate chunk for cache efficiency
          'framer-motion': ['framer-motion'],
          // Split Lenis smooth scroll
          'lenis': ['@studio-freight/lenis'],
          // Vendor chunk for React
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', '@studio-freight/lenis'],
  },
})
