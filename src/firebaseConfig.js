// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAGgDjnazoRCnrqw3AtMipDa-6MwGNzIJU",
  authDomain: "vue-twitter-d87a1.firebaseapp.com",
  projectId: "vue-twitter-d87a1",
  storageBucket: "vue-twitter-d87a1.appspot.com",
  messagingSenderId: "106415468661",
  appId: "1:106415468661:web:3a9e92b85d0c31dfe9c83c",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const storage = getStorage()
