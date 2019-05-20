const cacheName = "cache-v1";
const precacheResources = [
  "/",
  "index.html",
  "js/script.js",
  "images/favicon.ico",
  "*.jpg",
  "*.css",
  "*.woff",
  "*.eot",
  "*.ttf",
  "*.svg",
  "*.woff2"
];

self.addEventListener("install", event => {
  console.log("Service worker installing...");
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(precacheResources);
    })
  );
  // Add a call to skipWaiting here
});

self.addEventListener("activate", event => {
  console.log("Service worker activating...");
  console.log("Activating new service worker...");

  const cacheWhitelist = [precacheResources];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
