const CACHE_NAME = "qs-planner-v23";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "items/bolt.js",
  "items/hose.js",
  "items/nut.js",
  "items/screw.js",
  "items/sandpaper.js",
  "items/hosejoint.js",
  "items/pipe.js",
  "items/bearing.js",
  "items/elbow.js",
  "items/tee.js",
  "items/reducer.js",
  "items/nipple.js",
  "items/ubolt.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isNetworkFirstRequest(req, url) {
  if (req.mode === "navigate") return true;

  const scopePath = new URL(self.registration.scope).pathname;
  const pathname = url.pathname;

  if (
    pathname === scopePath ||
    pathname === scopePath + "index.html" ||
    pathname === "/" ||
    pathname.endsWith("/index.html")
  ) {
    return true;
  }

  if (pathname.includes("/items/")) {
    return true;
  }

  return false;
}

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isNetworkFirstRequest(req, url)) {
    event.respondWith(
      fetch(req).then(function (response) {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return response;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          if (cached) {
            return cached;
          }
          if (req.mode === "navigate") {
            return caches.match("index.html").then(function (fallback) {
              return fallback || caches.match("./");
            });
          }
          return Response.error();
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) {
        return cached;
      }
      return fetch(req).then(function (response) {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return response;
      }).catch(function () {
        return Response.error();
      });
    })
  );
});
