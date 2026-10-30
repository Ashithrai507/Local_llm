import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/explorer': 'http://127.0.0.1:8001',
      '/folder': 'http://127.0.0.1:8001',
      '/upload': 'http://127.0.0.1:8001',
      '/download': 'http://127.0.0.1:8001',
      '/delete': 'http://127.0.0.1:8001',
      '/login': 'http://127.0.0.1:8001',
      '/register': 'http://127.0.0.1:8001',
      '/me': 'http://127.0.0.1:8001',
      '/movies': 'http://127.0.0.1:8001',
      '/openapi.json': 'http://127.0.0.1:8001',
      '/docs': 'http://127.0.0.1:8001',
    },
  },
})
