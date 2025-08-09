'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  image?: string;
}

export default function BlogPage() {
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        // Public endpoint only returns published blogs
        const response = await fetch('/api/blogs');
        const data = await response.json();
        console.log('Public blog page received:', data);
        if (Array.isArray(data)) {
          console.log(`Setting ${data.length} published posts`);
          setPublishedPosts(data);
        } else {
          console.error('API returned non-array data:', data);
          setPublishedPosts([]);
        }
      } catch (error) {
        console.error('Error loading blogs:', error);
        setPublishedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const categories = [...new Set(publishedPosts.map(post => post.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Page Header */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pool Table Expert Blog</h2>
          <p className="text-xl text-gray-600">Tips, guides, and insights from Michigan's pool table professionals</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {publishedPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {publishedPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Featured Image */}
                    <div className="h-64 bg-gray-200 relative">
                      {post.image ? (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                          </svg>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-700 text-white px-3 py-1 text-sm font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <time>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</time>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-green-700 transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-700 mb-4">{post.excerpt}</p>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition-colors"
                      >
                        Read More 
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const count = publishedPosts.filter(post => post.category === category).length;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-gray-700 hover:text-green-700 cursor-pointer transition-colors">
                          {category}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-green-700 text-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Need Pool Table Help?</h3>
                <p className="text-green-100 mb-4 text-sm">
                  Get expert advice from Michigan's pool table professionals.
                </p>
                <div className="space-y-2">
                  <a 
                    href="tel:586-552-6053" 
                    className="block text-center bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                  >
                    Call (586) 552-6053
                  </a>
                  <Link 
                    href="/inventory" 
                    className="block text-center border border-green-400 text-green-100 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                  >
                    Browse Tables
                  </Link>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Get Updates</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Subscribe for pool table tips and new inventory alerts.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}