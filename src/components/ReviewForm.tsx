'use client';

import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface ReviewFormProps {
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ onReviewSubmitted }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    rating: 5,
    service: '',
    comment: ''
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    console.log('uploadedImages state changed:', uploadedImages);
    console.log('Number of images:', uploadedImages.length);
  }, [uploadedImages]);

  const services = [
    'Table Moving',
    'Table Installation',
    'Table Purchase',
    'Table Repair',
    'General Service'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload triggered');
    const files = e.target.files;
    console.log('Files selected:', files?.length || 0);
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    // Check if storage is initialized
    if (!storage) {
      console.error('Firebase Storage is not initialized');
      alert('Image upload is currently unavailable. Please try again later.');
      return;
    }

    setUploadingImages(true);
    const newImages: string[] = [];

    for (const file of files) {
      try {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Create a unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `reviews/${timestamp}-${safeName}`;
        
        console.log('Uploading file:', filename);
        const storageRef = ref(storage, filename);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Upload successful:', snapshot);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL obtained:', downloadURL);
        newImages.push(downloadURL);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        console.error('Error details:', error.code, error.message);
        
        // More specific error messages
        if (error.code === 'storage/unauthorized') {
          alert('You do not have permission to upload images. Please check Firebase Storage rules.');
        } else if (error.code === 'storage/canceled') {
          alert('Upload was cancelled.');
        } else if (error.code === 'storage/unknown') {
          alert('An unknown error occurred. Please check your internet connection and try again.');
        } else {
          alert(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
        }
      }
    }

    if (newImages.length > 0) {
      setUploadedImages(prev => {
        const updated = [...prev, ...newImages];
        console.log('Setting uploadedImages state to:', updated);
        return updated;
      });
      console.log('Images added to form:', newImages);
    }
    
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Submitting review with images:', uploadedImages);

    try {
      const reviewData = {
        ...formData,
        images: uploadedImages,
        dateSubmitted: new Date().toISOString()
      };
      
      console.log('Review data being sent:', reviewData);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        onReviewSubmitted?.();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Thank You!</h3>
          <p className="text-gray-700 mb-4">
            Your review has been submitted and is pending approval. 
            We appreciate your feedback!
          </p>
          <p className="text-sm text-gray-900">
            Reviews are typically approved within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>
      <p className="text-gray-900 mb-6 text-sm">
        Share your experience with our pool table services
      </p>
      
      {/* Debug info - TEMPORARY */}
      <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded text-xs">
        <p>Debug: {uploadedImages.length} images in state</p>
        {uploadedImages.length > 0 && (
          <p className="truncate">URLs: {uploadedImages.join(', ')}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-900 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            required
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
          />
          <p className="text-xs text-gray-900 mt-1">Your email won't be displayed publicly</p>
        </div>

        {/* Service Type */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-900 mb-1">
            Service Received *
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white caret-black"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className="focus:outline-none"
              >
                <svg 
                  className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`} 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-900">
              ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-900 mb-1">
            Your Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            required
            value={formData.comment}
            onChange={handleChange}
            placeholder="Tell us about your experience with our service..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Photos (Optional)
          </label>
          <p className="text-xs text-gray-900 mb-2">Upload photos of your table to help others see your experience</p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <input
              type="file"
              id="review-image-upload"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImages}
            />
            <div
              onClick={() => {
                const input = document.getElementById('review-image-upload') as HTMLInputElement;
                if (input && !uploadingImages) {
                  console.log('Programmatically clicking file input');
                  input.click();
                }
              }}
              className={`cursor-pointer flex flex-col items-center ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-900">
                {uploadingImages ? 'Uploading...' : 'Click to upload photos'}
              </span>
              <span className="text-xs text-gray-800 mt-1">
                PNG, JPG, GIF up to 10MB each
              </span>
            </div>
          </div>
        </div>
        
        {/* Image Previews - Moved outside the upload div */}
        {uploadedImages.length > 0 ? (
          <div className="mt-4 p-4 border-2 border-green-500 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-800 mb-3">✓ {uploadedImages.length} Image{uploadedImages.length > 1 ? 's' : ''} Uploaded Successfully!</p>
            <div className="grid grid-cols-2 gap-3">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative" style={{ backgroundColor: '#e5e7eb', height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('Image failed to load:', image);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onLoad={() => console.log('Image loaded successfully:', image)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    style={{ zIndex: 10 }}
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
        
        <p className="text-xs text-gray-900 text-center">
          Reviews are moderated and will appear after approval
        </p>
      </form>
    </div>
  );
}