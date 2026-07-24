var CACHE_NAME = "inzzi-cache-v1";
var FILES_TO_CACHE = [
  "./index.html",
  "./manifest.json",
  "./firebase-config.js",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(evt){
  evt.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(evt){
  evt.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(evt){
  evt.respondWith(
    caches.match(evt.request).then(function(cached){
      return cached || fetch(evt.request).catch(function(){
        return caches.match("./index.html");
      });
    })
  );
});
