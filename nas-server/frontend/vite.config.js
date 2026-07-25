import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< Updated upstream
=======
  server: {
    proxy: {
      '/explorer': 'http://127.0.0.1:8002',
      '/folder': 'http://127.0.0.1:8002',
      '/upload': 'http://127.0.tag] 127.0.0.1:8002',
      '/download': 'http://127.0.0.1:8002',
      '/delete': 'http://127.0.0.1:8002',
      '/login': 'http://127.0.0.1:8002',
      '/register': 'http://127.0.0.1:8002',
      '/me': 'http://127.0.0.1:8002',
      '/movies': 'http://127.0.0.1:8002',
      '/openapi.json': 'http://127.0.0.1:8002',
      '/docs': 'http://127.0.0.1:8002',
    },
  },
>>>>>>> Stashed changes
})
