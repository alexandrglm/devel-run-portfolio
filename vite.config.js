import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';


dotenv.config();

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001';

console.log('[VITE] API URL:', API_URL);

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_FRONTEND_PORT) || 3000,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[VITE] ➡️ Proxy:', req.method, req.url, '->', API_URL);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[VITE] ⬅️ Response:', proxyRes.statusCode);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[VITE] ❌ Proxy Error:', err.message);
          });
        }
      }
    }
  },
  define: {
    global: 'globalThis',

    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(API_URL),
    'import.meta.env.VITE_FRONTEND_BASE_URL': JSON.stringify(process.env.VITE_FRONTEND_BASE_URL || 'http://localhost:3000')
  }
});