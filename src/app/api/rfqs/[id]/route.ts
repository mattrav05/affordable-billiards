import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, updateDocument, deleteDocument, getDocument } from '@/lib/firebase-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT - Update RFQ status (admin only)
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
    const validStatuses = ['new', 'contacted', 'quoted', 'closed'];
    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the RFQ
    await updateDocument('rfqs', id, data);
    
    const updatedRFQ = await getDocument('rfqs', id);
    return NextResponse.json(updatedRFQ);
  } catch (error) {
    console.error('Error updating RFQ:', error);
    return NextResponse.json({ error: 'Failed to update RFQ' }, { status: 500 });
  }
}

// DELETE - Delete RFQ (admin only)
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
    
    await deleteDocument('rfqs', id);
    
    return NextResponse.json({ message: 'RFQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting RFQ:', error);
    return NextResponse.json({ error: 'Failed to delete RFQ' }, { status: 500 });
  }
}