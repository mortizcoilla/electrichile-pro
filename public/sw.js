/* ElectriChile Pro · Service Worker
 *
 * Estrategia:
 *   - Pre-cache del app shell en la instalación.
 *   - Network-first para navegaciones (HTML), con fallback a cache.
 *   - Cache-first para assets estáticos (JS, CSS, imágenes, fuentes).
 *   - Mensajes SKIP_WAITING para activar SW nuevo sin recargar forzado.
 */

const VERSION = 'electrichile-v1.0.0';
const APP_SHELL_CACHE = `app-shell-${VERSION}`;
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((k) => k !== APP_SHELL_CACHE && k !== STATIC_CACHE && k !== RUNTIME_CACHE)
        .map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo manejar GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegaciones (HTML): network-first, fallback a cache
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) =>
          cached || caches.match('/').then((root) => root || new Response('Offline', { status: 503 }))
        ))
    );
    return;
  }

  // Assets estáticos: cache-first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'manifest'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        }).catch(() => cached || new Response('', { status: 504 }));
      })
    );
  }
});
