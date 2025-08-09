import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, createDocument, getCollection } from '@/lib/firebase-admin';
import { RFQ } from '@/lib/firebase';

// GET - Fetch RFQs (admin only)
export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json([]);
    }
    
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let rfqs;
    if (status) {
      const snapshot = await adminDb
        .collection('rfqs')
        .where('status', '==', status)
        .orderBy('createdAt', 'desc')
        .get();
      rfqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      rfqs = await getCollection('rfqs');
    }

    return NextResponse.json(rfqs);
  } catch (error) {
    console.error('Error fetching RFQs:', error);
    return NextResponse.json({ error: 'Failed to fetch RFQs' }, { status: 500 });
  }
}

// POST - Submit new RFQ
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    
    const data = await request.json();
    
    // Determine if this is a table-specific RFQ or a service RFQ
    const isTableRFQ = !!(data.tableId && data.tableName && data.tablePrice);
    const isServiceRFQ = !!(data.serviceType);
    
    // Validate required fields based on RFQ type
    let requiredFields;
    if (isTableRFQ) {
      // Table-specific RFQ (from individual table pages)
      requiredFields = ['tableId', 'tableName', 'tablePrice', 'name', 'email', 'phone', 'address', 'city', 'zipCode'];
    } else if (isServiceRFQ) {
      // Service RFQ (from services page or /rfq page)
      requiredFields = ['name', 'email', 'phone', 'address', 'city', 'zipCode', 'serviceType'];
    } else {
      return NextResponse.json({ error: 'Invalid RFQ type - must include either table information or service type' }, { status: 400 });
    }
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Create RFQ object based on type
    let rfqData: any = {
      customerName: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      message: data.message || '',
      preferredContact: data.preferredContact || 'phone',
      status: 'new',
      submittedAt: new Date().toISOString(),
      source: data.source || 'website'
    };

    if (isTableRFQ) {
      // Table-specific RFQ
      rfqData = {
        ...rfqData,
        tableId: data.tableId,
        tableName: data.tableName,
        tablePrice: Number(data.tablePrice),
        installationNeeded: Boolean(data.installationNeeded),
        rfqType: 'table'
      };
    } else {
      // Service RFQ
      rfqData = {
        ...rfqData,
        serviceType: data.serviceType,
        rfqType: 'service'
      };
    }

    const id = await createDocument('rfqs', rfqData);
    
    // TODO: Send email notification to admin about new RFQ
    // TODO: Send confirmation email to customer
    
    return NextResponse.json({ 
      id, 
      message: 'Quote request submitted successfully. We will contact you within 24 hours.' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating RFQ:', error);
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 });
  }
}