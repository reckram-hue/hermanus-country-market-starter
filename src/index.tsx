import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { AuthProvider } from './hooks/useAuth';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// --- Service Worker registration (for PWA install in dev) ---
if ('serviceWorker' in navigator) {
  // In dev, Vite serves files from http://localhost:5173/
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        console.log('[SW] registered', reg.scope);
      })
      .catch(err => {
        console.warn('[SW] registration failed:', err);
      });
  });
}
