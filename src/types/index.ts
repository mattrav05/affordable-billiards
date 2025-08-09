export interface PoolTable {
  id: string;
  name: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  images: string[];
  description: string;
  features: string[];
  status: 'available' | 'sold' | 'pending';
  dateAdded: string;
  dateSold?: string;
}

export interface Review {
  id: string;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected';
  service: string;
}

export interface ServiceInfo {
  title: string;
  description: string;
  features: string[];
  pricing?: string;
}