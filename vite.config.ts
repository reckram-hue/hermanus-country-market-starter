import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use repo subpath in production (GitHub Pages), root in dev
  base: mode === "development" ? "/" : "/hermanus-country-market-starter/",
  test: {
    globals: true,
    environment: "jsdom",
  },
}))
