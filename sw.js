const CACHE = 'gold-calc-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for the HTML page itself, so updates show up immediately
// instead of waiting on a stale cached copy. Other assets stay cache-first.
self.addEventListener('fetch', e=>{
  if(e.request.mode === 'navigate' || e.request.url.endsWith('index.html') || e.request.url.endsWith('/')){
    e.respondWith(
      fetch(e.request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copy));
        return res;
      }).catch(()=> caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached=> cached || fetch(e.request))
    );
  }
});
