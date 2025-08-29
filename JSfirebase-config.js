// File: JS/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBByaLNk5eYEnV4YfH7LoMcNkLzBV1j78U",
  authDomain: "mypractice-project-bus-service.firebaseapp.com",
  projectId: "mypractice-project-bus-service",
  storageBucket: "mypractice-project-bus-service.appspot.com",
  messagingSenderId: "1034194037517",
  appId: "1:1034194037517:web:42a3bb5789a6468722de44"
};

export const app = initializeApp(firebaseConfig);
