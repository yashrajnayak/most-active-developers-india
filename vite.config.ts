import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/most-active-developers-india/',
  build: {
    outDir: 'docs' // GitHub Pages can serve from /docs on the main branch
  }
})
