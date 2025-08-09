import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, createDocument, getCollection } from '@/lib/firebase-admin';
import { BlogPost } from '@/lib/firebase';

// GET - Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const session = await getServerSession();
    
    let blogs = [];
    
    if (session?.user?.email) {
      // Admin can see all blogs
      if (status) {
        const snapshot = await adminDb
          .collection('blog_posts')
          .where('status', '==', status)
          .get();
        blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        const snapshot = await adminDb
          .collection('blog_posts')
          .get();
        blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } else {
      // Public can only see published blogs
      console.log('Public request - fetching published blogs...');
      const snapshot = await adminDb
        .collection('blog_posts')
        .where('status', '==', 'published')
        .get();
      blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Found ${blogs.length} published blogs for public`);
    }

    // Sort manually to avoid Firestore index requirements
    if (Array.isArray(blogs) && blogs.length > 0) {
      blogs.sort((a, b) => {
        const dateA = new Date((a as any).publishedAt || (a as any).updatedAt || 0).getTime();
        const dateB = new Date((b as any).publishedAt || (b as any).updatedAt || 0).getTime();
        return dateB - dateA; // Newest first
      });
    }

    // Always return an array (empty if no blogs)
    return NextResponse.json(blogs || []);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'excerpt', 'category'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Generate slug from title if not provided
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create blog post object
    const blogData: Partial<BlogPost> = {
      title: data.title,
      slug: slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author || session.user.name || 'Admin',
      publishedAt: data.status === 'published' ? new Date().toISOString() : data.publishedAt,
      updatedAt: new Date().toISOString(),
      status: data.status || 'draft',
      category: data.category,
      tags: data.tags || [],
      image: data.image || '',
      createdAt: new Date(),
    };

    const id = await createDocument('blog_posts', blogData);
    
    return NextResponse.json({ id, message: 'Blog post created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}