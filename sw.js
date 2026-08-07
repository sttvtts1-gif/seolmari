const CACHE = "jjanae-alarm-v3";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))); self.clients.claim(); });
self.addEventListener("fetch", event => { event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request))); });
self.addEventListener("message", event => {
  const data = event.data || {};
  if (data.type === "SHOW_ALARM") {
    event.waitUntil(self.registration.showNotification(data.title || "전화 알림", {
      body: data.body || "", icon: "./icon-192.png", badge: "./icon-192.png",
      tag: data.tag || "alarm", requireInteraction: true, silent: false,
      data: { entryId: data.entryId || null }
    }));
  }
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(clients => {
    if (clients.length) return clients[0].focus();
    return self.clients.openWindow("./index.html");
  }));
});
