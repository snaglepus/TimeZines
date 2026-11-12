// Offline support: serve the app shell from cache, refresh it in the background.
const CACHE = 'timezines-v2';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'cities.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-512.png',
  'fonts/jetbrains-mono.woff2', 'fonts/plex-condensed-500.woff2', 'fonts/plex-condensed-600.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request).then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => hit);
    return hit || fresh;
  }));
});
