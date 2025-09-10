// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker with correct scope under GitHub Pages
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const base = import.meta.env.BASE_URL || "/";
    const swUrl = `${base}sw.js`;
    navigator.serviceWorker
      .register(swUrl, { scope: base })
      .catch((err) => console.error("SW register failed:", err));
  });
}