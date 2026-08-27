/* Service worker: app-shell cache + network-first data. */
const VERSION = "fb-live-v59";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/ifa-mark.png",
  "./assets/ifa-mark-white.png",
  "./icons/favicon-64.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  // Cache the new shell and take over immediately (auto-update): the page's
  // controllerchange listener reloads once. Prompt-mode left phones stuck on
  // an old app.js (e.g. missing the weather strip).
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Only the same-origin app shell is cached. Everything cross-origin (Firestore,
  // Google Sheets, Open-Meteo weather, fonts…) goes straight to the network so the
  // SW can never hand back index.html in place of an API/JSON response.
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  // App shell: cache-first, fall back to network.
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
