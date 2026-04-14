// public/firebase-messaging-sw.js

// Use compat libraries with importScripts (browser-friendly)
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDHUEaVYWL5ksrTX5yn3OMHIXIcwLuZe5Q",
  authDomain: "jd-project-c1a0b.firebaseapp.com",
  projectId: "jd-project-c1a0b",
  storageBucket: "jd-project-c1a0b.firebasestorage.app",
  messagingSenderId: "93647692331",
  appId: "1:93647692331:web:0b47f379c01798893dc06e",
  measurementId: "G-67FCY553C0",
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Health Alert';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico', // optional icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});