'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default function EditBlogPost({ params }: RouteParams) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogId, setBlogId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image: '',
    status: 'draft' as 'draft' | 'published'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Get the blog ID from params
  useEffect(() => {
    const getBlogId = async () => {
      const resolvedParams = await params;
      setBlogId(resolvedParams.id);
    };
    getBlogId();
  }, [params]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Load blog post data
  useEffect(() => {
    if (!blogId || !session) return;
    loadBlogPost();
  }, [blogId, session]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${blogId}`);
      if (response.ok) {
        const blog = await response.json();
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category,
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
          image: blog.image || '',
          status: blog.status
        });
      } else {
        router.push('/admin/blogs');
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      router.push('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Buying Guide',
    'Moving Tips', 
    'Maintenance',
    'Reviews',
    'Industry News',
    'How-To'
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if storage is initialized
    if (!storage) {
      alert('Image upload is currently unavailable. Please try again later.');
      return;
    }

    setUploadingImage(true);

    try {
      // Validate file size (5MB max for blog images)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }

      // Create a unique filename
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `blog/${timestamp}-${safeName}`;
      
      const storageRef = ref(storage, filename);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update form data with the image URL
      setFormData(prev => ({
        ...prev,
        image: downloadURL
      }));
      
      console.log('Image uploaded successfully:', downloadURL);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });

      if (response.ok) {
        router.push('/admin/blogs');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('There was an error updating the blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
    setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 0);
  };

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
    setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 0);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
              <Link href="/admin/blogs" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
                <p className="text-sm text-gray-600">Update your blog post</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-800 caret-black"
                placeholder="Enter blog post title..."
              />
            </div>

            {/* Slug */}
            <div className="mb-6">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-900 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-800 caret-black"
                placeholder="auto-generated-from-title"
              />
              <p className="text-xs text-gray-600 mt-1">
                URL: /blog/{formData.slug || 'your-slug-here'}
              </p>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                required
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief description of the blog post..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-800 caret-black"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                rows={15}
                required
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog post content here. You can use markdown formatting..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-800 caret-black font-mono text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">
                Supports basic HTML and markdown formatting
              </p>
            </div>

            {/* Category and Tags Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-900 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-800 caret-black"
                  placeholder="pool tables, moving, maintenance"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Featured Image
              </label>
              
              {!formData.image ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="imageUpload"
                    className={`cursor-pointer flex flex-col items-center ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-700 font-medium">
                      {uploadingImage ? 'Uploading...' : 'Click to upload featured image'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Featured image"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Keep the URL input as a fallback option */}
              <details className="mt-3">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  Or enter image URL manually
                </summary>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-800 caret-black text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </details>
            </div>

            {/* Current Status */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Current Status: <span className={`font-medium ${formData.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {formData.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin/blogs"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Draft'}</span>
              </button>
              
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing...' : 'Publish Now'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}