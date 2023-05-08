self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'icons/icon-192x192.png',
        badge: 'icons/badge.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});
