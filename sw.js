/* Ashen Imperium offline shell. Bump CACHE when shipping a new build. */
const CACHE = 'ashen-imperium-v11';
const ASSETS = [
  './assets/cinzel-latin-600-normal-CH_LB4su.woff',
  './assets/cinzel-latin-600-normal-Dd5YO2UX.woff2',
  './assets/cinzel-latin-700-normal-C-gK7hA8.woff',
  './assets/cinzel-latin-700-normal-Dkw14w9r.woff2',
  './assets/cinzel-latin-ext-600-normal-BEFdM_VE.woff2',
  './assets/cinzel-latin-ext-600-normal-BY9Mq9iK.woff',
  './assets/cinzel-latin-ext-700-normal-C24KFjuG.woff2',
  './assets/cinzel-latin-ext-700-normal-CORa-yIv.woff',
  './assets/crimson-pro-latin-400-italic-BJbyz_Tg.woff2',
  './assets/crimson-pro-latin-400-italic-iL-nM4zC.woff',
  './assets/crimson-pro-latin-400-normal-B4SlG4wx.woff2',
  './assets/crimson-pro-latin-400-normal-BzhyrSeK.woff',
  './assets/crimson-pro-latin-600-normal-Ca4fy0Cf.woff',
  './assets/crimson-pro-latin-600-normal-vJ8oEdKU.woff2',
  './assets/crimson-pro-latin-ext-400-italic-C6Jf9c7d.woff2',
  './assets/crimson-pro-latin-ext-400-italic-DuC2towc.woff',
  './assets/crimson-pro-latin-ext-400-normal-B3ID4PT2.woff2',
  './assets/crimson-pro-latin-ext-400-normal-BWiDT69a.woff',
  './assets/crimson-pro-latin-ext-600-normal-ChXPf8Fx.woff',
  './assets/crimson-pro-latin-ext-600-normal-DTIcmTiA.woff2',
  './assets/crimson-pro-vietnamese-400-italic-NXtqStND.woff2',
  './assets/crimson-pro-vietnamese-400-italic-XRYdg6KH.woff',
  './assets/crimson-pro-vietnamese-400-normal-C3m3Wqkz.woff2',
  './assets/crimson-pro-vietnamese-400-normal-CEHt5KbE.woff',
  './assets/crimson-pro-vietnamese-600-normal-BD5z241x.woff2',
  './assets/crimson-pro-vietnamese-600-normal-WXpto_XS.woff',
  './assets/index-BgmCFNQW.css',
  './assets/index-CkDh-r5-.js',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.html',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match('./index.html'));
    }),
  );
});
