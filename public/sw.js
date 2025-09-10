// public/sw.js
// Very tiny service worker good enough for dev installs.
const CACHE = "hcm-dev-v1";
const APP_SHELL = [
  "/",                    // the app
  "/index.html",
  "/manifest.webmanifest",
  "/icons/app-icon.svg",
  "/icons/app-icon-maskable.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for navigation; cache-first for static files
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GETs
  if (req.method !== "GET") return;

  // For HTML navigations, try network then cache.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // For others, cache first then network
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
