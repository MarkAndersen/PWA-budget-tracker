console.log('working!')
//defining caches
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/db.js",
    "/styles.css",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];
const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

//upon service worker install => put files into cache
self.addEventListener("install", event => {
    event.waitUntil(
        caches
        .open(STATIC_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
});
//clearing old caches
self.addEventListener('activate', (event) => {
    const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        })
        .then((cachesToDelete) => {
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  //this block below may be all that is breaking this app
  // self.addEventListener('fetch', (event) => {
  //   if (event.request.url.startsWith(self.location.origin)) {
  //     event.respondWith(
  //       caches.match(event.request).then((cachedResponse) => {
  //         if (cachedResponse) {
  //           return cachedResponse;
  //         }
  
  //         return caches.open(RUNTIME_CACHE).then((cache) => {
  //           return fetch(event.request).then((response) => {
  //             return cache.put(event.request, response.clone()).then(() => {
  //               return response;
  //             });
  //           });
  //         });
  //       })
  //     );
  //   }
  // });