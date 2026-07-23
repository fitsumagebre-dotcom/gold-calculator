const CACHE = 'gold-calc-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request))
  );
});
