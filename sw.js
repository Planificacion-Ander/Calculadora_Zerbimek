const CACHE_NAME = 'zerbimek-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Si lo tenemos guardado en el móvil, lo usa sin internet
        }
        return fetch(event.request); // Si no, lo baja de internet
      })
  );
});
