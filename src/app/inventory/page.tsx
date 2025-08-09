'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

// SEO optimization for inventory page
const addInventoryPageSEO = () => {
  document.title = 'Used Pool Tables for Sale Michigan | Quality Pre-Owned Billiard Tables | Affordable Billiards';
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Quality used pool tables for sale in Michigan. Inspected and refurbished pre-owned billiard tables with professional installation. Browse our inventory of Brunswick, Olhausen and more.');
  }

  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', 'used pool tables Michigan, pool tables for sale Michigan, pre-owned billiard tables, refurbished pool tables Michigan, Brunswick used tables, Olhausen used pool tables');
};

interface Table {
  id: string;
  name: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  images?: string[];
  description: string;
  features?: string[];
  additionalInfo?: string;
  status: string;
}

export default function InventoryPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    addInventoryPageSEO();
    
    const loadTables = async () => {
      try {
        const response = await fetch('/api/tables?status=available');
        const data = await response.json();
        // Make sure data is an array
        if (Array.isArray(data)) {
          setTables(data);
        } else {
          console.error('API returned non-array data:', data);
          setTables([]);
        }
      } catch (error) {
        console.error('Error loading tables:', error);
        setTables([]);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  // Since we're filtering by status in the API call, just use all returned tables
  const availableTables = tables;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Page Header */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quality Used Pool Tables for Sale in Michigan</h1>
          <p className="text-xl text-gray-700 mb-2">Quality used pool tables • Serving Michigan</p>
          <p className="text-lg text-gray-700">Click any table for details and to request a quote</p>
        </div>
      </section>

      {/* Tables Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading tables...</p>
            </div>
          ) : availableTables.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No tables currently available. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableTables.map((table) => (
                <Link 
                  key={table.id}
                  href={`/inventory/${table.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Table Image */}
                  <div className="h-64 bg-gray-200 relative">
                    {table.images && table.images.length > 0 ? (
                      <img 
                        src={table.images[0]} 
                        alt={table.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7 2a5 5 0 100 10 5 5 0 000-10z"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Condition Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        table.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                        table.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {table.condition}
                      </span>
                    </div>
                  </div>

                  {/* Table Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{table.name}</h3>
                    <div className="text-sm text-gray-800 mb-3 space-y-1">
                      <p><span className="font-medium">Brand:</span> {table.brand}</p>
                      <p><span className="font-medium">Size:</span> {table.size}</p>
                    </div>
                    
                    <p className="text-gray-800 mb-4 line-clamp-2">{table.description}</p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-700">
                        ${table.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-700">
                        Best prices
                      </div>
                    </div>
                    
                    {/* Call to Action */}
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                        View Details & Request Quote
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Don't See What You're Looking For?</h3>
          <p className="text-lg mb-6">We get new tables regularly. Contact us about specific brands or sizes you need.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:586-552-6053" 
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Call (586) 552-6053
            </a>
            <a 
              href="mailto:info@affordablebilliards.com" 
              className="border-2 border-green-400 text-green-400 px-6 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-gray-900 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}