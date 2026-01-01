// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get them from Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCxq8_sOUtbVLWirhJsx69d9ixBXLta_HA",
  authDomain: "medibook-6a017.firebaseapp.com",
  databaseURL: "https://medibook-6a017-default-rtdb.firebaseio.com",
  projectId: "medibook-6a017",
  storageBucket: "medibook-6a017.firebasestorage.app",
  messagingSenderId: "64715730094",
  appId: "1:64715730094:web:f00b1de0a75bbc6c7c113f",
  measurementId: "G-GZ6NYL328H"
};

// Check if credentials are still placeholders
export const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

export default app;

