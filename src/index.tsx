// FULL DROP-IN for src/index.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Register the PWA service worker with the correct scope for GitHub Pages
// This works with vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register'
registerSW({
  immediate: true,
  scope: import.meta.env.BASE_URL, // e.g. "/hermanus-country-market-starter/"
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)