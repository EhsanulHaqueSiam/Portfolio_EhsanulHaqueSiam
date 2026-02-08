import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // Note: Compression removed - Netlify handles Brotli/Gzip at edge
  ],
  build: {
    // Enable minification with terser for better tree-shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Framer Motion into separate chunk (~150KB savings on initial load)
          'framer-motion': ['framer-motion'],
          // Split Lenis smooth scroll
          'lenis': ['@studio-freight/lenis'],
          // Vendor chunk for React
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning limit (our chunks are optimized)
    chunkSizeWarningLimit: 500,
    // Generate source maps for production debugging (optional, can be disabled)
    sourcemap: false,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', '@studio-freight/lenis'],
  },
})
