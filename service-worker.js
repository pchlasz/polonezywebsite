const CACHE_NAME = 'czarnobyl-cache-v1';
const ASSETS = [
  '/',
  '/czarnobyl.html',
  '/chernobyl_background.avif',
  '/chernobyl_logo.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k=>{ if(k!==CACHE_NAME) return caches.delete(k); })
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(r=>{
      return caches.open(CACHE_NAME).then(cache=>{ cache.put(event.request, r.clone()); return r; });
    })).catch(()=>caches.match('/czarnobyl.html'))
  );
});
