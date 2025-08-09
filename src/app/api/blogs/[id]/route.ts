import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb, updateDocument, deleteDocument, getDocument } from '@/lib/firebase-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single blog post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    
    const { id } = await params;
    const session = await getServerSession();
    
    const blog = await getDocument('blog_posts', id);
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // If not admin and blog is not published, deny access
    if (!session?.user?.email && (blog as any).status !== 'published') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT - Update blog post (admin only)
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

    // Generate slug from title if title was updated
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Update timestamps
    data.updatedAt = new Date().toISOString();
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    // Update the blog post
    await updateDocument('blog_posts', id, data);
    
    const updatedBlog = await getDocument('blog_posts', id);
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE - Delete blog post (admin only)
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
    
    await deleteDocument('blog_posts', id);
    
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}