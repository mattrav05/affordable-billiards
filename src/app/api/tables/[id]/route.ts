import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, updateDocument, deleteDocument, getDocument } from '@/lib/firebase-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch single table
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    
    const { id } = await params;
    const table = await getDocument('tables', id);
    
    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json(table);
  } catch (error) {
    console.error('Error fetching table:', error);
    return NextResponse.json({ error: 'Failed to fetch table' }, { status: 500 });
  }
}

// PUT - Update table (admin only)
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

    // Update the table
    await updateDocument('tables', id, data);
    
    const updatedTable = await getDocument('tables', id);
    return NextResponse.json(updatedTable);
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}

// DELETE - Delete table (admin only)
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
    
    await deleteDocument('tables', id);
    
    return NextResponse.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}