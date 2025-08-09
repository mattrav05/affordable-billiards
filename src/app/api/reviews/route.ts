import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, createDocument, getCollection } from '@/lib/firebase-admin';
import { Review } from '@/lib/firebase';

// GET - Fetch reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const session = await getServerSession();
    
    let reviews = [];
    
    if (session?.user?.email) {
      // Admin can see all reviews
      if (status) {
        const snapshot = await adminDb
          .collection('reviews')
          .where('status', '==', status)
          .get();
        reviews = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dateSubmitted: data.dateSubmitted?.toDate ? data.dateSubmitted.toDate().toISOString() : data.dateSubmitted
          };
        });
      } else {
        const snapshot = await adminDb.collection('reviews').get();
        reviews = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dateSubmitted: data.dateSubmitted?.toDate ? data.dateSubmitted.toDate().toISOString() : data.dateSubmitted
          };
        });
      }
    } else {
      // Public can only see approved reviews
      const snapshot = await adminDb
        .collection('reviews')
        .where('status', '==', 'approved')
        .get();
      reviews = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateSubmitted: data.dateSubmitted?.toDate ? data.dateSubmitted.toDate().toISOString() : data.dateSubmitted
        };
      });
    }

    // Sort by submission date (newest first) if we have reviews
    if (Array.isArray(reviews) && reviews.length > 0) {
      reviews.sort((a, b) => {
        const dateA = new Date(a.dateSubmitted || 0).getTime();
        const dateB = new Date(b.dateSubmitted || 0).getTime();
        return dateB - dateA;
      });
    }

    // Always return an array (empty if no reviews)
    return NextResponse.json(reviews || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json([]);
  }
}

// POST - Submit new review
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['customerName', 'email', 'rating', 'comment', 'service'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Create review object
    const reviewData: Partial<Review> = {
      customerName: data.customerName,
      email: data.email,
      rating: Number(data.rating),
      comment: data.comment,
      service: data.service,
      images: data.images || [],
      status: 'pending', // All new reviews start as pending
      dateSubmitted: new Date().toISOString(),
    };

    const id = await createDocument('reviews', reviewData);
    
    // TODO: Send email notification to admin about new review
    
    return NextResponse.json({ id, message: 'Review submitted for approval' }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}