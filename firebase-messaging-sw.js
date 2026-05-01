// firebase-messaging-sw.js
// Place this file in the ROOT of your GitHub Pages repo (same folder as index_v2.html)

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB0gTstlQG6FpoZQy-mTeQXXjcNjACYFH0",
  authDomain: "tps-emergency.firebaseapp.com",
  databaseURL: "https://tps-emergency-default-rtdb.firebaseio.com",
  projectId: "tps-emergency",
  storageBucket: "tps-emergency.firebasestorage.app",
  messagingSenderId: "349680838922",
  appId: "1:349680838922:web:d7b0780510dd41d1c332f3"
});

const messaging = firebase.messaging();

// Handle background push notifications
// This fires when the website is closed or in the background
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);

  const title = payload.notification.title || 'TPS Emergency Alert';
  const body  = payload.notification.body  || 'An emergency has been reported.';

  const options = {
    body:  body,
    icon:  '/icon-192.png',   // optional — add a 192x192 icon to your repo
    badge: '/icon-72.png',    // optional badge icon
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true, // keeps notification on screen until dismissed
    data: { url: self.location.origin },
    actions: [
      { action: 'view',    title: 'View Alert' },
      { action: 'dismiss', title: 'Dismiss'    }
    ]
  };

  self.registration.showNotification(title, options);
});

// Handle notification click — opens the website
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
