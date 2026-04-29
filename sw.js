/* PANASIA CMS — Service Worker v4 (강제 업데이트) */
const CACHE = 'panasia-cms-v4';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(resp => {
      if(resp && resp.ok){
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
      }
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
