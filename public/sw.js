// public/sw.js
// Custom service worker with auto-versioning
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { createHandlerBoundToURL } from 'workbox-precaching';

const CACHE = "hcm-__CACHE_VERSION__";

// Skip waiting and claim clients immediately
self.skipWaiting();
self.clients.claim();

// Precache files (injected by Workbox)
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Handle navigations
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);
