/* global self, importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAj7_jxYZUJv4UGsh5MFHUpI2g0Lme_G2s",
  authDomain: "reanent.firebaseapp.com",
  projectId: "reanent",
  storageBucket: "reanent.firebasestorage.app",
  messagingSenderId: "851609664231",
  appId: "1:851609664231:web:eebb7394495a2252a64042",
  measurementId: "G-VEM7LDWLKT"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
