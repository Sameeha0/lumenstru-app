/* Lumenstru service worker: keeps a copy of the app so it opens offline.
   Network first, so testers always get the newest version when online;
   the saved copy is used only when there is no connection. */
var CACHE = 'lumenstru-v1';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(function (response) {
      var copy = response.clone();
      if (response.ok) caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return response;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
