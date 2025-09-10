import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  // Use repo subpath in production (GitHub Pages), root in dev
  base: mode === "development" ? "/" : "/hermanus-country-market-starter/",
  test: {
    globals: true,
    environment: "jsdom",
  },
}))