import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/most-active-developers-india/',
  build: {
    outDir: 'dist' // Changed from 'docs' to 'dist' for standard output directory
  }
})
