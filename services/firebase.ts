import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANeb1W-FlUQflpCGAcFXBzwr1vL_hxivg",
  authDomain: "pillbow-851fa.firebaseapp.com",
  projectId: "pillbow-851fa",
  storageBucket: "pillbow-851fa.firebasestorage.app",
  messagingSenderId: "848112131979",
  appId: "1:848112131979:web:4418ac88f389d7fb92598e",
  measurementId: "G-8BV2CGW60J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported in this browser');
  }
});
