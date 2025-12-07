// Firebase configuration for client-side
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBVO990LOpv_0dd3Y8SgKinNupUNk0ywT4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "daiostea.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "daiostea",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "daiostea.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "920704732192",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:920704732192:web:04401eae940ff41a514045"
};
