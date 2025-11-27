// Service Worker vazio para remover o SW anterior
// Este arquivo será removido após limpar o cache do navegador

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      // Desregistra este service worker
      return self.registration.unregister();
    })
  );
});
