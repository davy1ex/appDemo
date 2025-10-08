import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '127.0.0.1',        // или '0.0.0.0' если нужно
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      host: 'sladkolapka.ru',
      clientPort: 443
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
