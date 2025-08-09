'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RFQForm from '@/components/RFQForm';
import Navigation from '@/components/Navigation';
import { useParams } from 'next/navigation';

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

export default function TablePage() {
  const params = useParams();
  const tableId = params.tableId as string;
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTable = async () => {
      try {
        const response = await fetch(`/api/tables/${tableId}`);
        if (response.ok) {
          const data = await response.json();
          setTable(data);
        } else {
          setTable(null);
        }
      } catch (error) {
        console.error('Error loading table:', error);
        setTable(null);
      } finally {
        setLoading(false);
      }
    };

    if (tableId) {
      loadTable();
    }
  }, [tableId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading table...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!table) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="text-sm">
            <Link href="/" className="text-gray-500 hover:text-green-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/inventory" className="text-gray-500 hover:text-green-700">Tables for Sale</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{table.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
              {table.images && table.images.length > 0 ? (
                <img 
                  src={table.images[0]} 
                  alt={table.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7 2a5 5 0 100 10 5 5 0 000-10z"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Additional Images */}
            {table.images && table.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {table.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${table.name} - Image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Additional Information Tile */}
            {table.additionalInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-blue-900 mb-2">Additional Information</h4>
                <div 
                  className="text-blue-800 text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: table.additionalInfo }}
                />
              </div>
            )}
          </div>

          {/* Table Details */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{table.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  table.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                  table.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {table.condition}
                </span>
              </div>

              <div className="text-3xl font-bold text-green-700 mb-6">
                ${table.price.toLocaleString()}
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Brand</h3>
                    <p className="text-gray-800">{table.brand}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Size</h3>
                    <p className="text-gray-800">{table.size}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-800">{table.description}</p>
                </div>

                {table.features && table.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-800">
                      {table.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Service Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">🚚 Professional Service Available</h4>
                <p className="text-blue-900 text-sm">
                  We offer disassembly, transport, and complete reassembly with precision leveling. 
                  Request a quote for full service or pickup only.
                </p>
              </div>
            </div>

            {/* RFQ Form */}
            <RFQForm table={table} />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Affordable Billiards?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Service</h4>
              <p className="text-gray-800 text-sm">
                Over 10 years of experience in pool table moving and installation. 
                We treat your table like our own.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Michigan-Based</h4>
              <p className="text-gray-800 text-sm">
                Local business serving all of Michigan. We understand the local market 
                and provide personalized service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h4>
              <p className="text-gray-800 text-sm">
                All used tables are thoroughly inspected and refurbished as needed. 
                We stand behind our quality.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Full Service</h4>
              <p className="text-gray-800 text-sm">
                From selection to installation, we handle everything. You get a 
                perfectly leveled table ready to play.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}