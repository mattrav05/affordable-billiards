'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  image?: string;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [otherPosts, setOtherPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  // Get the slug from params
  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const loadBlogPost = async () => {
      try {
        // Load all published blogs to find by slug
        const response = await fetch('/api/blogs');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const foundPost = data.find(p => p.slug === slug);
          
          if (!foundPost) {
            router.push('/blog');
            return;
          }

          setPost(foundPost);
          
          // Get other posts
          const others = data
            .filter(p => p.id !== foundPost.id)
            .slice(0, 3);
          setOtherPosts(others);
        } else {
          router.push('/blog');
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPost();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <Link href="/blog" className="text-green-700 hover:text-green-800 font-semibold">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm">
            <Link href="/" className="text-gray-500 hover:text-green-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/blog" className="text-gray-500 hover:text-green-700">Blog</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="bg-green-700 text-white px-3 py-1 text-sm font-medium rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <time>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</time>
            {post.updatedAt !== post.publishedAt && (
              <>
                <span className="mx-2">•</span>
                <span className="text-sm">
                  Updated {new Date(post.updatedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </>
            )}
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-6">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null;
              
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc list-inside mb-4 space-y-1">
                    <li>{paragraph.substring(2)}</li>
                  </ul>
                );
              }
              
              return (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Pool Table Services?</h3>
          <p className="text-gray-700 mb-4">
            Get professional pool table installation, moving, or purchase advice from Michigan's experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/inventory" 
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors text-center"
            >
              Browse Tables
            </Link>
            <a 
              href="tel:586-552-6053" 
              className="border-2 border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-700 hover:text-white transition-colors text-center"
            >
              Call (586) 552-6053
            </a>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {otherPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">More Pool Table Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {otherPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {relatedPost.image ? (
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-700 text-white px-2 py-1 text-xs font-medium rounded-full">
                      {relatedPost.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 hover:text-green-700 transition-colors">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{relatedPost.excerpt}</p>
                  <Link 
                    href={`/blog/${relatedPost.slug}`}
                    className="text-green-700 font-semibold text-sm hover:text-green-800 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}