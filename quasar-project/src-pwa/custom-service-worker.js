/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */
// dependencies
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
// import { clientsClaim } from 'workbox-core'

// import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
// import { registerRoute, NavigationRoute } from 'workbox-routing'

// self.skipWaiting()
// clientsClaim()

// cleanupOutdatedCaches()

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
// if (process.env.MODE !== 'ssr' || process.env.PROD) {
//   registerRoute(
//     new NavigationRoute(
//       createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
//       { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
//     )
//   )
// }

// config
// precache injection
precacheAndRoute(self.__WB_MANIFEST);
// precacheAndRoute([
//   { url: "/index.html", revision: null },
//   // 其他資源
// ]);

// caching strategies
registerRoute(({ url }) => {
  console.log("url: ", url);
  // return request.destination === 'style'
}, new CacheFirst());

registerRoute(
  ({ url }) => url.href.startsWith("http"),
  new StaleWhileRevalidate()
);
