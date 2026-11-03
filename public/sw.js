// The old Gatsby blog registered a service worker here that serves its cached pages
// offline. Browsers keep checking this URL for updates, so this version replaces it,
// clears its caches, unregisters itself and reloads open tabs onto the new site.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
