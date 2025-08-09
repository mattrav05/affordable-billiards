// Firebase Configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Check if all required environment variables are present
const hasClientFirebaseConfig = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Initialize Firebase only if config is available
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (hasClientFirebaseConfig && !getApps().length) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} else if (hasClientFirebaseConfig && getApps().length) {
  app = getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

// Export Firebase services (will be null if not initialized)
export { db, auth, storage };
export default app;

// Type definitions for our data
export interface PoolTable {
  id: string;
  name: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  features: string[];
  additionalInfo?: string;
  status: 'available' | 'sold' | 'pending';
  dateAdded: string;
  dateSold?: string;
  soldPrice?: number;
  customerInfo?: {
    name: string;
    location: string;
  };
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
  service: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RFQ {
  id: string;
  tableId: string;
  tableName: string;
  tablePrice: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  message: string;
  installationNeeded: boolean;
  preferredContact: 'phone' | 'email' | 'text';
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  submittedAt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  image?: string;
  createdAt: Date;
}