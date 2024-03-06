// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFGApRPLD5U3vEC0twrGQOAncNq6iahbs",
  authDomain: "interiordesign-ed595.firebaseapp.com",
  projectId: "interiordesign-ed595",
  storageBucket: "interiordesign-ed595.appspot.com",
  messagingSenderId: "956316285026",
  appId: "1:956316285026:web:b6946b26686efe59fbf93b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export const auth = getAuth(app);
