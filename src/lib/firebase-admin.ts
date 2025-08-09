// Firebase Admin Configuration (Server-side only)
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();

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
  await adminDb.collection(collection).doc(id).update({
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteDocument = async (collection: string, id: string) => {
  await adminDb.collection(collection).doc(id).delete();
};

export const getDocument = async (collection: string, id: string) => {
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