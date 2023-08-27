import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    loader: { '.js': 'jsx' },
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY || 'http://localhost',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/media': {
        target: process.env.VITE_PROXY || 'http://localhost',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  }
})
