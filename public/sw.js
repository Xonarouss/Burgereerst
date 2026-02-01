/* BurgerEerst push service worker */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // ignore
  }

  const title = data.title || "BurgerEerst.nl";
  const options = {
    body: data.body || "Nieuw bericht",
    icon: data.icon || "/favicon.png",
    badge: data.badge || "/favicon.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = allClients.find((c) => c.url.includes(url));
      if (existing) {
        existing.focus();
        return;
      }
      await clients.openWindow(url);
    })()
  );
});
