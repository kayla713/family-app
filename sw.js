importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA-6xhrP0Oylg3XTuHMNPavFvu_xmSWCKU",
    authDomain: "family-app-3ae7f.firebaseapp.com",
    projectId: "family-app-3ae7f",
    storageBucket: "family-app-3ae7f.firebasestorage.app",
    messagingSenderId: "481015624622",
    appId: "1:481015624622:web:03547ecc2705f11f4c8e3f"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(p => {
  const n = p.notification || {}; const d = p.data || {};
  const title = n.title || d.title || '우리집';
  return self.registration.showNotification(title, {
    body: n.body || d.body || '새 메시지가 있어요',
    icon: './IMG_0898.png', badge: './IMG_0898.png', tag: 'fam-chat', renotify: true,
    data: { url: './index.html#chat' }
  });
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.navigate && c.navigate(c.url); return c.focus(); } }
    return clients.openWindow('./index.html');
  }));
});

const CACHE = 'family-app-v3';
const FILES = ['./', './index.html', './manifest.json', './IMG_0898.png', './IMG_0899.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
