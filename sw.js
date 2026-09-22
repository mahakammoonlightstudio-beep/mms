/**
 * Mahakam Moonlight Studio — Service Worker
 * Network-first dengan cache fallback (konten selalu segar, tetap bisa offline).
 */
const CACHE_NAME = "mms-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./assets/css/main.css",
  "./logo.png",
  "./founder-v2.png",
  "./logo-forum.png",
  "./favicon-32x32.png",
  "./favicon-16x16.png",
  "./android-chrome-192x192.png",
  "./android-chrome-512x512.png",
  "./apple-touch-icon.png",
  "./site.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // Hanya same-origin. Font/CDN (Google Fonts, Font Awesome) lewat langsung.
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match("./")))
  );
});
