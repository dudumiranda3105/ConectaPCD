const CACHE_NAME = 'conectapcd-v2';
const STATIC_CACHE = 'conectapcd-static-v2';
const DYNAMIC_CACHE = 'conectapcd-dynamic-v2';

// Arquivos para cache offline
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// URLs que sempre devem buscar da rede
const NETWORK_FIRST_URLS = [
  '/api/',
  '/auth/',
  '/stats',
];

// URLs externas para ignorar completamente
const IGNORED_URLS = [
  'goskip.dev',
  'api.goskip.dev',
  'chrome-extension://',
  'moz-extension://',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cacheando arquivos estáticos');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker ativado');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Removendo cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar extensões do Chrome, requisições não-HTTP e URLs externas
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Ignorar URLs externas que causam problemas de CORS
  if (IGNORED_URLS.some(ignored => request.url.includes(ignored))) {
    return;
  }

  // Ignorar requisições para outros domínios (não cachear)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Network first para API
  if (NETWORK_FIRST_URLS.some(path => url.pathname.includes(path))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache first para assets estáticos
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale while revalidate para HTML/navegação
  event.respondWith(staleWhileRevalidate(request));
});

// Estratégia: Network First
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Retornar página offline para navegação
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Estratégia: Cache First
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Falha ao buscar:', request.url);
    throw error;
  }
}

// Estratégia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => {
      if (request.mode === 'navigate') {
        return caches.match('/offline.html');
      }
    });

  return cachedResponse || fetchPromise;
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido');
  
  let data = { title: 'ConectaPCD', body: 'Nova notificação', icon: '/favicon.ico' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || data.message,
    icon: data.icon || '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificação clicada:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já tem uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Senão, abrir nova janela
        return clients.openWindow(urlToOpen);
      })
  );
});

// Background Sync (para enviar dados offline depois)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-candidaturas') {
    event.waitUntil(syncCandidaturas());
  }
});

async function syncCandidaturas() {
  // Implementar sincronização de candidaturas pendentes
  console.log('[SW] Sincronizando candidaturas pendentes...');
}
