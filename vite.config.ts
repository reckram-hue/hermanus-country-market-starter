// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal config for GitHub Pages. If there was a PWA plugin before,
// we can re-add later; keep this focused on deployment.
export default defineConfig({
  // IMPORTANT for GitHub Pages (repo path)
  base: '/hermanus-country-market-starter/',
  plugins: [react()],
})