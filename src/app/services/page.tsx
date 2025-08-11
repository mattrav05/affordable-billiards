'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Settings, 
  Home,
  DollarSign,
  Award,
  Phone,
  MapPin
} from 'lucide-react';

export default function ServicesPage() {
  const [showColorChart, setShowColorChart] = useState(false);

  // SEO optimization
  useEffect(() => {
    document.title = 'Pool Table Services Michigan | Buy, Sell, Move, Install | Affordable Billiards';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional pool table services in Michigan. Buy & sell used tables, expert moving, installation, setup, delivery & repair. Serving Detroit, Grand Rapids, Ann Arbor & all Michigan.');
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'pool table services Michigan, buy sell used pool tables, pool table moving Michigan, pool table installation, pool table delivery Michigan, Detroit pool tables, Grand Rapids billiards, Ann Arbor pool tables, Lansing billiards service');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* SEO Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Pool Table Services in Michigan
          </h1>
          <p className="text-xl text-gray-800 mb-4">
            Buy • Sell • Move • Install • Setup • Delivery
          </p>
          <p className="text-lg text-gray-800 max-w-4xl mx-auto">
            Michigan's trusted pool table experts with over 20+ years of experience. 
            We handle everything from professional moving and installation to buying and selling used tables, 
            plus delivery and repair services throughout Michigan.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Pool Table Moving */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-yellow-500 p-6 text-white text-center relative">
                <Truck className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Pool Table Moving</h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Expert Transportation</h3>
                <ul className="space-y-3 text-gray-800 mb-6">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    Professional disassembly service
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    Safe transport with equipment
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    Local and long-distance moves
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    Fully insured service
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    Same-day service available
                  </li>
                </ul>
                <Link 
                  href="/rfq?service=moving" 
                  className="block bg-yellow-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Get Moving Quote
                </Link>
              </div>
            </div>

            {/* 2. Installation & Setup */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 p-6 text-white text-center relative">
                <Settings className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Installation & Setup</h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Professional Assembly</h3>
                <ul className="space-y-3 text-gray-800 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Precision leveling for perfect play
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    New felt installation service
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Pocket liner replacement
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Bumper cushion replacement
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Complete assembly service
                  </li>
                </ul>
                <Link 
                  href="/rfq?service=installation" 
                  className="block bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Schedule Installation
                </Link>
              </div>
            </div>

            {/* 3. Buy & Sell Tables */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-red-600 p-6 text-white text-center relative">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Buy & Sell Tables</h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Quality Pre-Owned Tables</h3>
                <ul className="space-y-3 text-gray-800 mb-6">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    Quality used pool tables in stock
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    All major brands available
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    Thoroughly inspected condition
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    Fair cash offers provided
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    Professional consultation included
                  </li>
                </ul>
                <Link 
                  href="/rfq?service=buy-sell" 
                  className="block bg-red-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Request Buy/Sell Quote
                </Link>
              </div>
            </div>

            {/* 4. Delivery Service */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-purple-700 p-6 text-white text-center relative">
                <Home className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Delivery Service</h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Convenient Delivery</h3>
                <ul className="space-y-3 text-gray-800 mb-6">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Scheduled delivery service
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    White glove service available
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Basement and upstairs access
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Flexible scheduling options
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Professional handling guaranteed
                  </li>
                </ul>
                <Link 
                  href="/rfq?service=delivery" 
                  className="block bg-purple-700 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
                >
                  Schedule Delivery
                </Link>
              </div>
            </div>

            {/* 5. Repair & Maintenance */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-orange-600 p-6 text-white text-center relative">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Repair & Maintenance</h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Professional Repairs</h3>
                <ul className="space-y-3 text-gray-800 mb-6">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Felt replacement service
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Cushion and bumper repair
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Pocket replacement available
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Table releveling service
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Hardware replacement service
                  </li>
                </ul>
                <Link 
                  href="/rfq?service=repair" 
                  className="block bg-orange-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Request Repair Service
                </Link>
              </div>
            </div>

            {/* 6. Appraisal & Consultation */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-green-700 p-6 text-white text-center relative">
                <DollarSign className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Appraisal & Consultation</h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Expert Evaluation</h3>
                <ul className="space-y-3 text-gray-800 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Professional table appraisals
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Insurance claim assistance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Expert buying consultation
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Room measurement service
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Free estimates provided
                  </li>
                </ul>
                <Link 
                  href="/rfq?service=consultation" 
                  className="block bg-green-700 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                >
                  Get Free Consultation
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Color Chart Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Pool Table Felt Color Options</h2>
          <p className="text-xl text-gray-700 mb-8">
            Choose from our wide selection of premium felt colors for your pool table installation or re-felting service
          </p>
          <div className="max-w-4xl mx-auto">
            <img 
              src="/color-chart.webp" 
              alt="Pool Table Felt Color Chart" 
              className="w-full rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setShowColorChart(true)}
            />
            <p className="text-lg text-gray-600 mt-4">Click to enlarge color chart</p>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Serving All of Michigan
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Professional pool table services throughout Michigan including Detroit, Grand Rapids, 
              Ann Arbor, Lansing, Flint, and surrounding areas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-green-700" />
                Major Service Areas
              </h3>
              <div className="grid grid-cols-2 gap-4 text-gray-800">
                <div className="space-y-2">
                  <p>• Detroit Metro</p>
                  <p>• Grand Rapids</p>
                  <p>• Ann Arbor</p>
                  <p>• Lansing</p>
                  <p>• Flint</p>
                  <p>• Kalamazoo</p>
                </div>
                <div className="space-y-2">
                  <p>• Battle Creek</p>
                  <p>• Jackson</p>
                  <p>• Bay City</p>
                  <p>• Saginaw</p>
                  <p>• Holland</p>
                  <p>• Muskegon</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                Don't see your city? We travel throughout Michigan! 
                Call us to discuss service in your area.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-2 text-green-700" />
                Why Choose Affordable Billiards?
              </h3>
              <ul className="space-y-4 text-gray-800">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span><strong>20+ Years Experience:</strong> Michigan's trusted pool table experts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span><strong>Licensed & Insured:</strong> Professional service with peace of mind</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span><strong>Satisfaction Guarantee:</strong> We stand behind our work 100%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span><strong>Competitive Pricing:</strong> Fair rates with no hidden fees</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span><strong>Same Day Service:</strong> Often available for urgent needs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready for Professional Pool Table Service?
          </h2>
          <p className="text-xl mb-8">
            Get a free quote today! We're Michigan's most trusted pool table service company.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:586-552-6053" 
              className="bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition-colors"
            >
              Call (586) 552-6053
            </a>
            <Link 
              href="/rfq" 
              className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-400 hover:text-gray-900 transition-colors"
            >
              Request a Quote
            </Link>
            <Link 
              href="/inventory" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Browse Tables
            </Link>
          </div>
        </div>
      </section>

      {/* Color Chart Modal */}
      {showColorChart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto"
          onClick={() => setShowColorChart(false)}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative max-w-7xl w-full">
              <img
                src="/color-chart.webp"
                alt="Pool Table Felt Color Chart - Full Size"
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setShowColorChart(false)}
                className="fixed top-4 right-4 bg-black bg-opacity-75 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 transition-all text-2xl font-bold z-10"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}