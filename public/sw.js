// public/sw.js
const CACHE_NAME = 'swasthya-setu-cache-v1';

const urlsToCache = [
    '/',
    '/login',
    '/asha/dashboard',
    '/asha/symptoms',
    '/asha/register',
    '/asha/high-risk',
    '/asha/patients',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Don't intercept API requests here, let indexedDB/client handle offline fallback 
    // for POST requests like `/api/analyze` or `/api/translate`
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // Not in cache - fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clone the response because it's a stream and can only be consumed once
                const responseToCache = networkResponse.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // If fetch fails (offline) and not in cache, we could return a generic offline page here if we had one
                // For HTML pages, we return the root to let the React app load and handle its own offline UI
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/');
                }
            });
        })
    );
});
