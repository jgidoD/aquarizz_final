// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4IICM-BTOhbcbRteWnyZIqc8b61zvmpY",
  authDomain: "aquarizz-9687c.firebaseapp.com",
  projectId: "aquarizz-9687c",
  storageBucket: "aquarizz-9687c.appspot.com",
  messagingSenderId: "876015324611",
  appId: "1:876015324611:web:5475e022b55d50feea0176",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
