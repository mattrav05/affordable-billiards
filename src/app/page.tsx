'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useEffect } from 'react';

// Add structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Affordable Billiards",
  "image": "https://affordablebilliards.com/logo.jpg",
  "description": "Family-owned pool table business serving Michigan for 20+ years with professional moving, installation, repair and sales services.",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Michigan",
    "addressCountry": "US"
  },
  "telephone": "+1-586-552-6053",
  "email": "cathies4@yahoo.com",
  "url": "https://affordablebilliards.com",
  "priceRange": "$$",
  "foundingDate": "2004",
  "areaServed": {
    "@type": "State",
    "name": "Michigan"
  },
  "serviceArea": [
    {
      "@type": "City",
      "name": "Detroit",
      "addressRegion": "Michigan"
    },
    {
      "@type": "City", 
      "name": "Grand Rapids",
      "addressRegion": "Michigan"
    },
    {
      "@type": "City",
      "name": "Ann Arbor", 
      "addressRegion": "Michigan"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Pool Table Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Pool Table Moving",
          "description": "Professional pool table disassembly, transport and reassembly services"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Pool Table Installation",
          "description": "Expert pool table setup and precision leveling services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Used Pool Tables",
          "description": "Quality pre-owned pool tables inspected and refurbished"
        }
      }
    ]
  }
};

export default function Home() {
  useEffect(() => {
    // Add structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Set page-specific meta tags
    document.title = 'Affordable Billiards - Family Pool Table Business Michigan | 20+ Years Experience';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Family-owned Michigan pool table company with 20+ years experience. Professional moving, installation, repair & quality used table sales. Serving Detroit, Grand Rapids, Ann Arbor.');
    }

    return () => {
      // Cleanup structured data when component unmounts
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Michigan's Trusted Pool Table Experts Since 2004
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Professional Pool Table Moving • Installation • Repair • Quality Used Tables Sales • Serving All Michigan Communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/inventory" 
              className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:text-white transition-colors"
            >
              View Tables for Sale
            </Link>
            <Link 
              href="/services" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Our Services
            </Link>
            <a 
              href="/rfq" 
              className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:text-white transition-colors inline-block text-center no-underline"
            >
              Request Quote
            </a>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Professional Pool Table Services Michigan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/services" className="text-center p-6 block hover:transform hover:scale-105 transition-transform">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-black mb-2">Professional Installation</h4>
              <p className="text-gray-800">Expert setup and installation of pool tables with precision leveling</p>
            </Link>
            <Link href="/services" className="text-center p-6 block hover:transform hover:scale-105 transition-transform">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-black mb-2">Table Moving</h4>
              <p className="text-gray-800">Safe and professional pool table moving and relocation services</p>
            </Link>
            <Link href="/inventory" className="text-center p-6 block hover:transform hover:scale-105 transition-transform">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-black mb-2">Quality Used Tables</h4>
              <p className="text-gray-800">Buy and sell high-quality used pool tables at affordable prices</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-6 h-6 text-green-400" />
              <span>(586) 552-6053</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-6 h-6 text-green-400" />
              <span>cathies4@yahoo.com</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="w-6 h-6 text-green-400" />
              <span>Serving All of Michigan</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
