import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, updateDocument, deleteDocument, getDocument } from '@/lib/firebase-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT - Update review status (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the review
    await updateDocument('reviews', id, data);
    
    const updatedReview = await getDocument('reviews', id);
    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE - Delete review (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    await deleteDocument('reviews', id);
    
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}