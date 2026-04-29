const CACHE_NAME = 'zerbimek-cache-auto';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza a que se instale el nuevo service worker enseguida
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Toma el control de la página inmediatamente
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // 1º INTENTO: Buscar en internet la versión más fresca
    fetch(event.request)
      .then(response => {
        // Si hay internet, guardamos una copia nueva en la caché por si luego perdemos cobertura
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // 2º INTENTO: Si el fetch falla (no hay internet), tiramos de la memoria guardada
        return caches.match(event.request);
      })
  );
});
