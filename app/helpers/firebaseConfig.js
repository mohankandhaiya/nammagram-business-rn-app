// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
   apiKey: "AIzaSyAfxOA26V6j8ol1RtRwefbfhGun52E2Z8w",
  authDomain: "seller-2022e.firebaseapp.com",
  projectId: "seller-2022e",
  storageBucket: "seller-2022e.firebasestorage.app",
  messagingSenderId: "57526083111",
  appId: "1:57526083111:web:9d2d63840763dddcc2b802",
  measurementId: "G-JZJV16WLNT"
};

const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
export const db = getFirestore(app);
