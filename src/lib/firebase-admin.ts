// Firebase Admin Configuration (Server-side only)
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Check if all required environment variables are present
const hasRequiredEnvVars = 
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_STORAGE_BUCKET;

let adminInitialized = false;

// Only initialize if environment variables are present
if (hasRequiredEnvVars && !getApps().length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
  
  adminInitialized = true;
}

// Export Firebase services (will be null if not initialized)
export const adminDb = adminInitialized ? getFirestore() : null;
export const adminAuth = adminInitialized ? getAuth() : null;
export const adminStorage = adminInitialized ? getStorage() : null;

// Helper functions for common operations
export const isAdmin = async (email: string): Promise<boolean> => {
  // Add admin emails here (you can add more later)
  const adminEmails = [
    'mattrav05@yahoo.com',
    'matt@affordablebilliards.com',
    'admin@affordablebilliards.com',
  ];
  
  return adminEmails.includes(email.toLowerCase());
};

// Database helper functions
export const createDocument = async (collection: string, data: any) => {
  if (!adminDb) throw new Error('Firebase Admin not initialized');
  const docRef = adminDb.collection(collection).doc();
  await docRef.set({
    ...data,
    id: docRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

export const updateDocument = async (collection: string, id: string, data: any) => {
  if (!adminDb) throw new Error('Firebase Admin not initialized');
  await adminDb.collection(collection).doc(id).update({
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteDocument = async (collection: string, id: string) => {
  if (!adminDb) throw new Error('Firebase Admin not initialized');
  await adminDb.collection(collection).doc(id).delete();
};

export const getDocument = async (collection: string, id: string) => {
  if (!adminDb) throw new Error('Firebase Admin not initialized');
  const doc = await adminDb.collection(collection).doc(id).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  // Convert Firestore timestamps to ISO strings
  if (data?.dateSubmitted?.toDate) {
    data.dateSubmitted = data.dateSubmitted.toDate().toISOString();
  }
  if (data?.createdAt?.toDate) {
    data.createdAt = data.createdAt.toDate().toISOString();
  }
  if (data?.updatedAt?.toDate) {
    data.updatedAt = data.updatedAt.toDate().toISOString();
  }
  
  return { id: doc.id, ...data };
};

export const getCollection = async (collection: string) => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection(collection).get();
    const docs = snapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamps to ISO strings
      if (data?.dateSubmitted?.toDate) {
        data.dateSubmitted = data.dateSubmitted.toDate().toISOString();
      }
      if (data?.createdAt?.toDate) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data?.updatedAt?.toDate) {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      return { id: doc.id, ...data };
    });
    console.log(`getCollection(${collection}): Found ${docs.length} documents`);
    return docs;
  } catch (error) {
    console.error(`Error getting collection ${collection}:`, error);
    return []; // Return empty array on error
  }
};