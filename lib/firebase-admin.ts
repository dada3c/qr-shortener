import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  // Vercel stores with actual newlines; local .env.local uses \n escape
  const formattedKey = privateKey?.includes("\\n")
    ? privateKey.replace(/\\n/g, "\n")
    : privateKey;

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: formattedKey,
    }),
  });
}

export function getDb() {
  getFirebaseAdmin();
  return getFirestore();
}
