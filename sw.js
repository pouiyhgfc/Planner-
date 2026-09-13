/**
 * Minimale service worker: cachet de app-shell zodat de app volledig
 * offline werkt. Er is geen dynamisch netwerkverkeer (geen API, geen
 * externe bestanden — CLAUDE.md §2), dus cache-first is hier voldoende
 * en correct voor alles.
 */

const CACHE_NAAM = "planner-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./src/ui/main.js",
  "./src/ui/render.js",
  "./src/ui/planner.js",
  "./src/ui/overzicht.js",
  "./src/lib/date.js",
  "./src/lib/dayStatus.js",
  "./src/lib/blocks.js",
  "./src/lib/overzicht.js",
  "./src/data/semester.js",
  "./src/data/holidays.js",
  "./src/data/courses.js",
  "./src/data/coursedates.js",
  "./src/data/trips.js",
  "./src/data/deadlines.js",
  "./src/data/season.js",
  "./src/state/schema.js",
  "./src/state/store.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAAM).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((namen) => Promise.all(namen.filter((naam) => naam !== CACHE_NAAM).map((naam) => caches.delete(naam))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((gecached) => gecached || fetch(event.request))
  );
});
