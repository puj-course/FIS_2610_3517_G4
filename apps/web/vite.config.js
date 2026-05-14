mport { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Se reconstruye __dirname porque Vite usa ESM y no expone esa variable por defecto.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  // La app web mantiene sus variables VITE_* en apps/web/.env.
  // Si Vite lee la raiz del repo, Google Auth queda sin client id y el boton se oculta.
  envDir: __dirname,
  resolve: {
    alias: {
      // El alias @ evita imports relativos largos dentro de src.
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // En desarrollo, las llamadas API se redirigen al backend local sin exponer CORS al frontend.
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
