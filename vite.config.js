import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('Proxy', env.VITE_PROXY, 'mode:', mode)
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react(), eslint()],
    loader: { '.js': 'jsx' },
    proxy: {
      '/api': {
        target: env.VITE_PROXY || 'http://localhost',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/media': {
        target: env.VITE_PROXY || 'http://localhost',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  }
})
