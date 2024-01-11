import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import vitePluginString from 'vite-plugin-string'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  if (mode !== 'production') {
    console.log('Proxy', env.VITE_PROXY, 'mode:', mode, process.cwd())
    return {
      optimizeDeps: {
        include: ['react', 'react-dom'],
      },
      build: {
        outDir: 'build',
      },
      plugins: [react(), eslint(), vitePluginString()],
      server: {
        proxy: {
          '/api/pebbles': {
            target: env.VITE_PEBBLE_API_PROXY,
            changeOrigin: true,
            secure: false,
            ws: false,
          },
          '/api': {
            target: env.VITE_PROXY,
            changeOrigin: true,
            secure: false,
            ws: false,
          },
          '/media': {
            target: env.VITE_PROXY,
            changeOrigin: true,
            secure: false,
            ws: false,
          },
          '/pagefind': {
            target: env.VITE_PROXY,
            changeOrigin: true,
            secure: false,
            ws: false,
          },
        },
      },
    }
  }
  return {
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    build: {
      outDir: 'build',
    },
    plugins: [react(), eslint(), vitePluginString()],
  }
})
