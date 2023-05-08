importScripts('push-handler.js');

const CACHE_NAME = 'pwa-cache-v1';

const urlsToCache = [
    '/',
    'index.html',
    'main.css',
    'main.js',
    'icons/icon-192x192.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    )
});

self.addEventListener('fetch', event => {
    event.respondeWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    )
});

async function subscribeToPushNotifications() {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();

    if (!existingSubscription) {
        const response = await fetch('public-key');
        const publicKey = await response.arrayBuffer();
        const convertedKey = new Uint8Array(publicKey);
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey
        });

        // Send subscription to your server, so you can send push notifications later
        console.log('Push Subscription:', subscription);
    }
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            subscribeToPushNotifications();
        }
    });
}
