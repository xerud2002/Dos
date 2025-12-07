import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;

// Server-side Firebase Admin initialization
if (getApps().length === 0) {
  // In production, use environment variables or service account file
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Fallback for development - requires service account file
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'daiostea',
    });
  }
} else {
  adminApp = getApps()[0];
}

adminDb = getFirestore(adminApp);
adminAuth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
