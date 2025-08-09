'use client';

import { useState } from 'react';

interface Table {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
}

interface RFQFormProps {
  table: Table;
}

export default function RFQForm({ table }: RFQFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    message: '',
    installationNeeded: true,
    preferredContact: 'phone'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Submit RFQ to API
    try {
      const rfqData = {
        ...formData,
        tableId: table.id,
        tableName: table.name,
        tablePrice: table.price,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('/api/rfqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rfqData)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit RFQ');
      }
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      alert('There was an error submitting your request. Please try again or call us directly.');
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h3>
          <p className="text-gray-700 mb-4">
            Thank you for your interest in the {table.name}. We'll contact you within 24 hours 
            with a detailed quote for your selected service options.
          </p>
          <div className="text-sm text-gray-800 space-y-1">
            <p><strong>Next Steps:</strong></p>
            <p>1. We'll review your request and prepare a detailed quote</p>
            <p>2. We'll contact you via {formData.preferredContact} to discuss details</p>
            <p>3. If you approve, we'll schedule service at your convenience</p>
          </div>
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-700">
              Have questions? Call us at <a href="tel:586-552-6053" className="text-green-700 font-semibold">(586) 552-6053</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Request a Quote</h3>
      <p className="text-gray-800 mb-6 text-sm">
        Get a personalized quote for the {table.name}. Let us know your service needs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Installation Address */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Installation Address</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Options */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Options</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="fullService"
                name="serviceType"
                value="full-service"
                checked={formData.installationNeeded}
                onChange={() => setFormData(prev => ({ ...prev, installationNeeded: true }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <label htmlFor="fullService" className="ml-2 block text-sm text-gray-700">
                Full service (disassembly, transport, setup, leveling)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="pickupOnly"
                name="serviceType"
                value="pickup-only"
                checked={!formData.installationNeeded}
                onChange={() => setFormData(prev => ({ ...prev, installationNeeded: false }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <label htmlFor="pickupOnly" className="ml-2 block text-sm text-gray-700">
                Table pickup only (I'll handle setup myself)
              </label>
            </div>
          </div>
          {!formData.installationNeeded && (
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mt-3">
              ⚠️ Note: Pool tables require precise leveling and setup. Consider our professional installation service.
            </p>
          )}
        </div>

        {/* Preferred Contact */}
        <div>
          <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Method
          </label>
          <select
            id="preferredContact"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white caret-black"
          >
            <option value="phone">Phone Call</option>
            <option value="email">Email</option>
            <option value="text">Text Message</option>
          </select>
        </div>

        {/* Additional Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Questions or Comments
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Any specific requirements, timeline, or questions about this table?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-800 text-gray-900 caret-black"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting Request...' : 'Request Quote'}
          </button>
          <p className="text-xs text-gray-700 text-center mt-2">
            We'll respond within 24 hours with a detailed quote
          </p>
        </div>
      </form>
    </div>
  );
}