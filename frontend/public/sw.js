self.addEventListener("push", event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/Logo.png",
    data: { url: data.url }
  });
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
      // Check if your site is already open in any tab
      for (let client of windowClients) {
        if (client.url.includes(self.location.origin)) {
          // Focus the existing tab and navigate to the target URL
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      // If your site isn't open, open a new tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

