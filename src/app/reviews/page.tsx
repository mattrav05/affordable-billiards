'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReviewForm from '@/components/ReviewForm';
import Navigation from '@/components/Navigation';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  service: string;
  images?: string[];
  dateSubmitted: string;
  status: string;
  adminResponse?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(25);
  const [showMobileForm, setShowMobileForm] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Public endpoint only returns approved reviews
        const response = await fetch('/api/reviews?status=approved');
        const data = await response.json();
        // Make sure data is an array
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error('API returned non-array data:', data);
          setReviews([]);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const approvedReviews = reviews;

  // Pagination logic
  const totalPages = Math.ceil(approvedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = approvedReviews.slice(startIndex, endIndex);

  // Reset to page 1 when changing items per page
  const handleReviewsPerPageChange = (newPerPage: number) => {
    setReviewsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleReviewSubmitted = () => {
    // Optionally reload reviews or show success message
    console.log('Review submitted successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Page Header */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <p className="text-xl text-gray-600">See what our customers say about our pool table services</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mobile: Review Form at top */}
        <div className="lg:hidden mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Share Your Experience</h3>
            <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>

        {/* Desktop: Two column layout, Mobile: Single column */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews Display Section */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Loading reviews...</p>
              </div>
            ) : approvedReviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No reviews yet. Be the first to leave a review!</p>
              </div>
            ) : (
              <div className="space-y-8">
            {/* Average Rating */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Satisfaction</h3>
                <div className="flex items-center justify-center mb-2">
                  <div className="text-4xl font-bold text-green-700">
                    {approvedReviews.length > 0 ? (approvedReviews.reduce((acc, review) => acc + review.rating, 0) / approvedReviews.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="ml-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => {
                        const avgRating = approvedReviews.reduce((acc, review) => acc + review.rating, 0) / approvedReviews.length;
                        return (
                          <svg key={i} className={`w-6 h-6 ${i < Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        );
                      })}
                    </div>
                    <p className="text-sm text-gray-600">Based on {approvedReviews.length} reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="reviewsPerPage" className="text-sm font-medium text-gray-900">
                    Reviews per page:
                  </label>
                  <select
                    id="reviewsPerPage"
                    value={reviewsPerPage}
                    onChange={(e) => handleReviewsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 font-medium">
                    Showing {startIndex + 1}-{Math.min(endIndex, approvedReviews.length)} of {approvedReviews.length} reviews
                  </span>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors text-gray-900 font-medium"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-bold text-gray-900">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors text-gray-900 font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Reviews - Current Page Only */}
            <div className="space-y-6">
              {currentReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        <p className="text-sm text-gray-600">{review.service}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.dateSubmitted).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {review.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Review image ${imgIndex + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Admin Response */}
                    {review.adminResponse && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              Response from Affordable Billiards:
                            </p>
                            <p className="mt-1 text-sm text-green-700">
                              {review.adminResponse}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Desktop: Review Form Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                <div className="p-6 pb-0">
                  <h3 className="text-2xl font-bold text-gray-900 text-center">Share Your Experience</h3>
                </div>
                <div className="overflow-y-auto flex-1 p-6 pt-2">
                  <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready for Professional Pool Table Service?</h3>
          <p className="text-lg mb-6">Join our satisfied customers across Michigan</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/inventory" 
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Browse Tables
            </Link>
            <a 
              href="tel:586-552-6053" 
              className="border-2 border-green-400 text-green-400 px-6 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-gray-900 transition-colors"
            >
              Call (586) 552-6053
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}