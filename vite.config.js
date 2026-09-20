import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config. The dev server runs on http://localhost:5173 by default.
// /api requests are forwarded to the backend (Express) running on port 5000,
// so the React app can call fetch('/api/...') without CORS issues.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
