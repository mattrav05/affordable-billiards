import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, updateDocument } from '@/lib/firebase-admin';

interface ReorderUpdate {
  id: string;
  sortOrder: number;
}

// POST - Reorder tables (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { updates }: { updates: ReorderUpdate[] } = await request.json();

    // Validate updates
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Invalid updates array' }, { status: 400 });
    }

    // Update each table's sortOrder
    const promises = updates.map(update => 
      updateDocument('pool_tables', update.id, { 
        sortOrder: update.sortOrder,
        updatedAt: new Date()
      })
    );

    await Promise.all(promises);
    
    return NextResponse.json({ message: 'Tables reordered successfully' });
  } catch (error) {
    console.error('Error reordering tables:', error);
    return NextResponse.json({ error: 'Failed to reorder tables' }, { status: 500 });
  }
}