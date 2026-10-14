/**
 * Bnei Menashe Sacred Calendar - Service Worker v1.0.0
 * Enables complete offline operations for remote communities in India and Israel.
 * Caches static files (App Shell) and intercepts API/Supabase requests with resilient fallbacks.
 */

const CACHE_NAME = 'bnei-menashe-sacred-cache-v1';

// Assets to pre-cache immediately on Service Worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
];

// Install Event - Pre-cache App Shell assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event triggered.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Core App Shell assets...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log('[Service Worker] Pre-caching complete. Force active.');
      return self.skipWaiting();
    })
  );
});

// Activate Event - Purge stale cache namespaces
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event triggered.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log(`[Service Worker] Pruning obsolete cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated and claiming clients.');
      return self.clients.claim();
    })
  );
});

// Helper to determine if a URL represents a static asset or page
function isStaticAsset(url) {
  const extension = url.pathname.split('.').pop();
  const staticExtensions = ['js', 'css', 'png', 'jpg', 'jpeg', 'svg', 'woff', 'woff2', 'ttf', 'ico', 'json'];
  return staticExtensions.includes(extension) || 
         url.hostname.includes('fonts.googleapis.com') || 
         url.hostname.includes('fonts.gstatic.com');
}

// Fetch Event - Handle intelligent intercept and routing strategies
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests (e.g. mutations, analytics posts, authentication token requests)
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip web sockets and Chrome extensions
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    return;
  }

  // 1. API & Supabase Requests: Network-First with Cache Fallback
  const isApiRequest = requestUrl.pathname.includes('/api/');
  const isSupabaseRequest = requestUrl.hostname.includes('supabase.co') || requestUrl.pathname.includes('/rest/v1/');

  if (isApiRequest || isSupabaseRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If valid response, clone and cache it for future offline use
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed (offline) -> serve from cache
          console.warn(`[Service Worker] Offline fallback triggered for: ${event.request.url}`);
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Custom offline JSON response if not in cache
            if (isApiRequest) {
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'This sacred content is currently offline. Please connect to sync.',
                  offline: true,
                  timestamp: new Date().toISOString()
                }),
                {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
            
            // Return empty list for supabase endpoints to avoid client crash
            return new Response(JSON.stringify([]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // 2. Static Assets & App Shell: Cache-First, fallback to Network + dynamic cache write
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately
        return cachedResponse;
      }

      // If not in cache, fetch and store dynamically
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error('[Service Worker] Static fetch failed and no cache match:', error);
          
          // Return index.html fallback for navigation requests to enable SPA routing offline
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          throw error;
        });
    })
  );
});

// 3. Push/Local Notification Dispatcher and Event Handlers
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon } = event.data;
    
    const options = {
      body: body || 'Important Halachic Zman alert.',
      icon: icon || '/favicon.ico',
      badge: icon || '/favicon.ico',
      vibrate: [300, 100, 300],
      tag: tag || 'zman-alert',
      renotify: true,
      data: {
        dateOfNotification: Date.now(),
        url: '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus or open the app shell window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

