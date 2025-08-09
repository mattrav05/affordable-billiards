import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, createDocument, getCollection, updateDocument, deleteDocument } from '@/lib/firebase-admin';
import { PoolTable } from '@/lib/firebase';

// GET - Fetch all tables
export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json([]);
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let tables: any[] = [];
    
    // Get all tables first
    tables = await getCollection('tables');
    
    // Filter by status if specified
    if (status && Array.isArray(tables)) {
      tables = tables.filter(table => (table as any).status === status);
      console.log(`Filtered to ${tables.length} tables with status: ${status}`);
    }
    
    // Sort by creation date (newest first)
    if (Array.isArray(tables)) {
      tables.sort((a, b) => {
        const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : new Date((a as any).dateAdded || 0).getTime();
        const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : new Date((b as any).dateAdded || 0).getTime();
        return dateB - dateA;
      });
    }

    // Ensure we always return an array
    if (!Array.isArray(tables)) {
      console.error('Tables is not an array, converting:', tables);
      tables = [];
    }

    console.log(`Returning ${tables.length} tables`);
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error object
  }
}

// POST - Create new table (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'brand', 'size', 'condition', 'price', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Create table object
    const tableData: Partial<PoolTable> = {
      name: data.name,
      brand: data.brand,
      size: data.size,
      condition: data.condition,
      price: Number(data.price),
      originalPrice: Number(data.price),
      images: data.images || [],
      description: data.description,
      features: data.features || [],
      additionalInfo: data.additionalInfo || '',
      status: 'available',
      dateAdded: new Date().toISOString(),
      dateSold: undefined,
      soldPrice: undefined,
      customerInfo: undefined,
    };

    const id = await createDocument('tables', tableData);
    
    return NextResponse.json({ id, ...tableData }, { status: 201 });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }
}