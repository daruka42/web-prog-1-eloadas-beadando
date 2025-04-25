import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/beadando/react/',
  build: {
    outDir: '../beadando/react',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})