// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHJ9Gw-s_FKswSJOZfEX78u3TERggLKyw",
  authDomain: "pr11-firebase.firebaseapp.com",
  databaseURL: "https://pr11-firebase-default-rtdb.firebaseio.com",
  projectId: "pr11-firebase",
  storageBucket: "pr11-firebase.appspot.com",
  messagingSenderId: "109215112022",
  appId: "1:109215112022:web:1081ec8fa14e60964814f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)