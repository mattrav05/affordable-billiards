'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Globe
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  image?: string;
}

export default function BlogsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [seeding, setSeeding] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Load blog posts
  useEffect(() => {
    if (!session) return;
    loadBlogs();
  }, [session]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      const data = await response.json();
      
      // Auto-seed if no blogs exist
      if (Array.isArray(data) && data.length === 0) {
        console.log('No blogs found, auto-seeding initial posts...');
        await handleSeedBlogs(true); // silent mode
        return; // handleSeedBlogs will reload the blogs
      }
      
      setBlogs(data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadBlogs(); // Reload blogs
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleStatusToggle = async (blogId: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadBlogs(); // Reload blogs
      }
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const handleSeedBlogs = async (silent = false) => {
    if (!silent && !confirm('This will create initial blog posts. Continue?')) return;
    
    const samplePosts = [
      {
        title: "How to Choose the Right Pool Table Size for Your Home",
        slug: "choosing-pool-table-size",
        excerpt: "Learn about the different pool table sizes and how to determine which one fits best in your space.",
        content: `When choosing a pool table for your home, size is one of the most important factors to consider. The standard sizes are 7-foot (bar size), 8-foot (home size), and 9-foot (tournament size).

For most home game rooms, an 8-foot table provides the perfect balance of playability and space efficiency. However, you'll need to consider not just the table dimensions, but also the room space required for comfortable play.

Here's what you need to know about room requirements:

**7-Foot Tables:** Need a room at least 13' x 16'
**8-Foot Tables:** Need a room at least 13.5' x 17'
**9-Foot Tables:** Need a room at least 14' x 18'

Remember, these measurements assume standard 58-inch cues. If your room is smaller, consider shorter cues or a smaller table size.

At Affordable Billiards, we help you measure your space and recommend the perfect table size for your home. Contact us for a free consultation!`,
        author: "Matt - Affordable Billiards",
        category: "Buying Guide",
        tags: ["pool table size", "home setup", "buying guide"],
        status: "published"
      },
      {
        title: "Professional Pool Table Moving: Why DIY Isn't Worth the Risk",
        slug: "professional-pool-table-moving",
        excerpt: "Discover why professional pool table moving services are essential for protecting your investment.",
        content: `Moving a pool table might seem straightforward, but it's one of the most complex furniture moves you can undertake. Here's why you should always use professional movers:

**Proper Disassembly is Critical**
Pool tables must be completely disassembled for moving. The slate (which can weigh 200-800 pounds) must be removed carefully to avoid cracking. The legs, rails, and felt all require specific handling.

**Specialized Equipment Required**
- Dollies rated for slate weight
- Proper lifting straps
- Tools for precise reassembly
- New felt (often needed after a move)

**Precision Leveling**
Reassembly isn't just putting pieces back together. The table must be perfectly level - even 1/16th of an inch can affect play. Professional installers use precision levels and shimming techniques.

At Affordable Billiards, we've moved hundreds of tables across Michigan. Our experienced team ensures your table arrives in perfect condition and plays like new.`,
        author: "Matt - Affordable Billiards",
        category: "Moving Tips",
        tags: ["table moving", "professional service", "Michigan"],
        status: "published"
      },
      {
        title: "What to Look for When Buying a Used Pool Table",
        slug: "buying-used-pool-table-guide",
        excerpt: "A comprehensive guide to inspecting and evaluating used pool tables before purchase.",
        content: `Buying a used pool table can save you thousands, but knowing what to look for is crucial. Here's our professional buyer's guide:

**Check the Slate**
The slate is the heart of any quality pool table. Look for cracks, chips, proper thickness, and level installation.

**Inspect the Frame**
Look for solid wood construction, no loose joints, and check for water damage or warping.

**Examine the Rails**
Rubber cushions should be responsive with no dead spots. Rails should be firmly attached.

At Affordable Billiards, all our used tables are thoroughly inspected and refurbished as needed.`,
        author: "Matt - Affordable Billiards",
        category: "Buying Guide",
        tags: ["used tables", "inspection", "buying tips"],
        status: "published"
      }
    ];
    
    setSeeding(true);
    let created = 0;
    
    try {
      for (const post of samplePosts) {
        try {
          const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
          });

          if (response.ok) {
            created++;
            if (!silent) console.log(`Created: ${post.title}`);
          } else {
            const errorData = await response.json();
            console.error(`Failed to create ${post.title}:`, errorData);
          }
        } catch (error) {
          console.error(`Error creating ${post.title}:`, error);
        }
      }
      
      if (!silent && created > 0) {
        alert(`Success! Created ${created} blog posts.`);
      } else if (!silent) {
        alert('No blog posts were created. Check the console for errors.');
      }
      
      // Reload blogs after seeding
      if (created > 0) {
        const blogResponse = await fetch('/api/blogs');
        const blogData = await blogResponse.json();
        setBlogs(blogData);
      }
    } catch (error) {
      console.error('Error seeding blogs:', error);
      if (!silent) {
        alert('Error seeding blogs. Please try again.');
      }
    } finally {
      setSeeding(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'all') return true;
    return blog.status === filter;
  });

  const draftCount = blogs.filter(b => b.status === 'draft').length;
  const publishedCount = blogs.filter(b => b.status === 'published').length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-sm text-gray-600">Create and manage blog posts</p>
              </div>
            </div>
            
            <Link
              href="/admin/blogs/new"
              className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Blog Post</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
              </div>
              <Globe className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              <option value="all">All Posts ({blogs.length})</option>
              <option value="published">Published ({publishedCount})</option>
              <option value="draft">Drafts ({draftCount})</option>
            </select>
          </div>
        </div>

        {/* Blog Posts List */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't created any blog posts yet." 
                : `No ${filter} posts found.`}
            </p>
            <Link
              href="/admin/blogs/new"
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {blog.image ? (
                              <img className="h-10 w-10 rounded object-cover" src={blog.image} alt={blog.title} />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {blog.excerpt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Tag className="w-4 h-4 mr-1" />
                          {blog.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(blog.publishedAt || blog.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {blog.status === 'published' && (
                            <Link
                              href={`/blog/${blog.slug}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Post"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/blogs/${blog.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleStatusToggle(blog.id, blog.status)}
                            className="text-purple-600 hover:text-purple-900"
                            title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {blog.status === 'published' ? '📝' : '🌐'}
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}