// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC92JtYAdCwFERy61um1y1fl0G_9ZirHJs",
  authDomain: "cobien-9620d.firebaseapp.com",
  projectId: "cobien-9620d",
  storageBucket: "cobien-9620d.firebasestorage.app",
  messagingSenderId: "859701737427",
  appId: "1:859701737427:web:98efbca3ba6350227ba126",
  measurementId: "G-3E4RPELZ5B"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
