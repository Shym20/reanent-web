import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAj7_jxYZUJv4UGsh5MFHUpI2g0Lme_G2s",
  authDomain: "reanent.firebaseapp.com",
  projectId: "reanent",
  storageBucket: "reanent.firebasestorage.app",
  messagingSenderId: "851609664231",
  appId: "1:851609664231:web:eebb7394495a2252a64042",
  measurementId: "G-VEM7LDWLKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
