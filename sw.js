self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data.json(); } catch (err) { d = { title: 'VentiloTech', body: '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'VentiloTech', {
    body: d.body || '',
    icon: './icon-192.png',
    badge: './icon-192.png',
    data: { url: d.url || self.registration.scope }
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf(self.registration.scope) === 0) { return list[i].focus(); }
    }
    return clients.openWindow(e.notification.data && e.notification.data.url ? e.notification.data.url : self.registration.scope);
  }));
});
