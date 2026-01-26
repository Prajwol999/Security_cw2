import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This is still needed for the 'simple-peer' video call library
    'global': 'globalThis',
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  }
});