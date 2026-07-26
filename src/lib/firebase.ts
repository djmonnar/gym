import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId
];

export const isFirebaseConfigured = requiredConfig.every(Boolean);

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export async function getFirebaseAuth(): Promise<Auth | null> {
  if (!firebaseApp) return null;

  const { getAuth } = await import("firebase/auth");
  return getAuth(firebaseApp);
}

export async function getFirestoreDatabase(): Promise<Firestore | null> {
  if (!firebaseApp) return null;

  const { getFirestore } = await import("firebase/firestore");
  return getFirestore(firebaseApp);
}

export async function getFirebaseStorage(): Promise<FirebaseStorage | null> {
  if (!firebaseApp) return null;

  const { getStorage } = await import("firebase/storage");
  return getStorage(firebaseApp);
}
