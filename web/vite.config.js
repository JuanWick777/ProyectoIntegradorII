import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor';
          }

          if (id.includes('react-router')) {
            return 'router-vendor';
          }

          if (id.includes('bootstrap')) {
            return 'bootstrap-vendor';
          }

          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }

          if (id.includes('zustand')) {
            return 'state-vendor';
          }

          if (id.includes('qrcode.react')) {
            return 'qr-vendor';
          }
        },
      },
    },
  },
})
