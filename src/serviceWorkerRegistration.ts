/**
 * Bnei Menashe Service Worker Registration Helper
 * Safely registers and updates the Service Worker to enable reliable offline-first functionality.
 */

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Register after the page has fully loaded for optimal performance
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[Service Worker] Active scope detected:', registration.scope);

          // Update cycle listener
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[Service Worker] Update found: New dual-calendar content is cached and ready.');
                  } else {
                    console.log('[Service Worker] App shell successfully synced for offline-first usage.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('[Service Worker] Installation registration failed:', error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister().then(() => {
          console.log('[Service Worker] Successfully unregistered.');
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Unregistration error:', error);
      });
  }
}
