// Firebase Configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
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