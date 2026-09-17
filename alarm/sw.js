const CACHE = "jjanae-alarm-v5";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))); self.clients.claim(); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  // HTML 이동 요청은 최신 서버 파일을 먼저 사용한다. 오프라인일 때만 캐시로 대체한다.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // 아이콘과 설정 파일은 캐시를 먼저 사용한다.
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
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
