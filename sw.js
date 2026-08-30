// Galexer Service Worker — proxies Seraph game requests to bypass X-Frame-Options + CORS
const PROXY_TARGETS = [
  'a456pur.github.io/seraph/games'
];

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });

self.addEventListener('fetch', e => {
  const url = e.request.url;
  const isGame = PROXY_TARGETS.some(t => url.includes(t));
  if (!isGame) return; // let browser handle normally

  e.respondWith(
    fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    .then(r => {
      // Strip X-Frame-Options and CSP so iframe can display it
      const headers = new Headers(r.headers);
      headers.delete('x-frame-options');
      headers.delete('content-security-policy');
      headers.delete('x-content-type-options');
      return new Response(r.body, {
        status: r.status,
        statusText: r.statusText,
        headers
      });
    })
    .catch(() => fetch(url)) // fallback to direct if SW fetch fails
  );
});
