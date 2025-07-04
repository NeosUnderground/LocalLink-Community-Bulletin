// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDGHJbSkxN4kADJsqOh_Fqm8sXP5Y6bY4w",
  authDomain: "locallink-97426.firebaseapp.com",
  projectId: "locallink-97426",
  storageBucket: "locallink-97426.firebasestorage.app",
  messagingSenderId: "1001108113629",
  appId: "1:1001108113629:web:18722b2d87bd7d2790f334",
  measurementId: "G-08F964WNT2"
};

const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const firebaseApp = app;
