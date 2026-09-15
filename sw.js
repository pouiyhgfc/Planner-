/**
 * Minimale service worker: cachet de app-shell zodat de app volledig
 * offline werkt. Er is geen dynamisch netwerkverkeer (geen API, geen
 * externe bestanden — CLAUDE.md §2), dus cache-first is hier voldoende
 * en correct voor alles.
 */

const CACHE_NAAM = "planner-v23";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./fonts/DMSans-Variable.woff2",
  "./fonts/Outfit-Variable.woff2",
  "./fonts/SchibstedGrotesk-Variable.woff2",
  "./src/ui/main.js",
  "./src/ui/nav.js",
  "./src/ui/schermMaand.js",
  "./src/ui/maandGrid.js",
  "./src/ui/dagblad.js",
  "./src/ui/schermWeken.js",
  "./src/ui/wekenGrid.js",
  "./src/ui/schermOverzicht.js",
  "./src/ui/overzichtData.js",
  "./src/ui/schermVakken.js",
  "./src/ui/vakkenData.js",
  "./src/ui/datumlabels.js",
  "./src/ui/planner.js",
  "./src/ui/tekst.js",
  "./src/ui/knoppen.js",
  "./src/ui/legenda.js",
  "./src/ui/verborgen.js",
  "./src/lib/date.js",
  "./src/lib/academicWeek.js",
  "./src/lib/dayStatus.js",
  "./src/lib/blocks.js",
  "./src/lib/overzicht.js",
  "./src/lib/weekgewicht.js",
  "./src/data/semester.js",
  "./src/data/holidays.js",
  "./src/data/courses.js",
  "./src/data/coursedates.js",
  "./src/data/trips.js",
  "./src/data/deadlines.js",
  "./src/data/opleveringen.js",
  "./src/data/season.js",
  "./src/data/projects.js",
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
