import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

let adminApp: App;

// Server-side Firebase Admin initialization
if (getApps().length === 0) {
  let credential;
  
  // Option 1: Environment variable (for production/Vercel)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      credential = cert(serviceAccount);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    }
  }
  
  // Option 2: Local file (for development)
  if (!credential) {
    const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        credential = cert(serviceAccount);
      } catch (e) {
        console.error('Failed to read serviceAccountKey.json:', e);
      }
    }
  }

  if (credential) {
    adminApp = initializeApp({ credential });
  } else {
    // Fallback without credentials (will fail for Firestore operations)
    console.warn('No Firebase Admin credentials found. API routes will not work.');
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'daiostea',
    });
  }
} else {
  adminApp = getApps()[0];
}

const adminDb: Firestore = getFirestore(adminApp);
const adminAuth: Auth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
