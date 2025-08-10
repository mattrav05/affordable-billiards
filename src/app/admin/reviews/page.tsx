'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MessageCircle, 
  ArrowLeft,
  Check,
  X,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Reply,
  Send
} from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
  service: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
  adminResponse?: string;
}

export default function ReviewsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Load reviews
  useEffect(() => {
    if (!session) return;
    loadReviews();
  }, [session]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadReviews(); // Reload reviews
      }
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadReviews(); // Reload reviews
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminResponse: replyText.trim() })
      });

      if (response.ok) {
        setReplyingTo(null);
        setReplyText('');
        loadReviews(); // Reload reviews
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleStartReply = (reviewId: string, existingReply?: string) => {
    setReplyingTo(reviewId);
    setReplyText(existingReply || '');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                <p className="text-sm text-gray-600">Approve or reject customer reviews</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
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
              <option value="all">All Reviews ({reviews.length})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="approved">Approved ({approvedCount})</option>
              <option value="rejected">Rejected ({rejectedCount})</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "No customer reviews yet." 
                : `No ${filter} reviews found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        review.status === 'approved' ? 'bg-green-100 text-green-800' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{review.service}</span>
                      <span>•</span>
                      <span>{new Date(review.dateSubmitted).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({review.rating} stars)</span>
                    </div>

                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Customer Photos ({review.images.length}):</p>
                        <div className="grid grid-cols-4 gap-3">
                          {review.images.map((image, imgIndex) => (
                            <div 
                              key={imgIndex}
                              className="cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                            >
                              <img
                                src={image}
                                alt={`Review image ${imgIndex + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                style={{ backgroundColor: '#f3f4f6' }}
                                onError={(e) => {
                                  console.error('Failed to load image:', image);
                                  (e.target as HTMLImageElement).style.backgroundColor = '#fecaca';
                                }}
                                onLoad={() => console.log('Admin image loaded:', image)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Response */}
                    {review.adminResponse && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                        <div className="flex items-start space-x-2">
                          <div className="text-green-600 font-medium text-sm">Response from Affordable Billiards:</div>
                        </div>
                        <p className="text-gray-700 mt-1">{review.adminResponse}</p>
                      </div>
                    )}

                    {/* Reply Interface */}
                    {replyingTo === review.id ? (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {review.adminResponse ? 'Edit Response:' : 'Add Response:'}
                        </label>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your response to this customer..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
                          rows={4}
                        />
                        <div className="flex items-center space-x-2 mt-3">
                          <button
                            onClick={() => handleReplySubmit(review.id)}
                            disabled={!replyText.trim()}
                            className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                            <span>{review.adminResponse ? 'Update Response' : 'Send Response'}</span>
                          </button>
                          <button
                            onClick={handleCancelReply}
                            className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    {/* Status Actions */}
                    {review.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(review.id, 'approved')}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {review.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    )}

                    {review.status === 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Reply Action - Only for approved reviews */}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => handleStartReply(review.id, review.adminResponse)}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        <span>{review.adminResponse ? 'Edit Reply' : 'Add Reply'}</span>
                      </button>
                    )}

                    {/* Delete Action - Always Available */}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Enlarged review image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}