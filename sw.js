importScripts("./scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    // Remove older Galexer service-worker caches so stale app data cannot
    // keep an outdated Scramjet worker active.
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  // Only handle same-origin requests here. If Scramjet's IndexedDB config
  // isn't initialized yet (or Safari rejects its transaction), let the
  // browser perform the ordinary request rather than failing the page load.
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      await scramjet.loadConfig();
      if (scramjet.route(event)) return await scramjet.fetch(event);
    } catch (error) {
      console.warn("Galexer Scramjet interception skipped:", error);
    }
    return fetch(event.request);
  })());
});
