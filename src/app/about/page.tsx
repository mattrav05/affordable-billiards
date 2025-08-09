'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { 
  Users, 
  Award, 
  MapPin, 
  Phone,
  Mail,
  Clock,
  Truck,
  Settings,
  ShoppingCart,
  CheckCircle
} from 'lucide-react';

export default function AboutPage() {
  // SEO optimization
  useEffect(() => {
    document.title = 'About Affordable Billiards - Family Pool Table Business Michigan | 20+ Years Experience';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Family-owned pool table business serving Michigan for 20+ years. Professional installation, moving, repair and sales of quality used pool tables. Trusted by thousands of customers.');
    }

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'family pool table business Michigan, pool table company 20 years, Michigan billiards family business, professional pool table services, trusted pool table experts');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Affordable Billiards
          </h1>
          <p className="text-2xl text-gray-800 mb-4">
            Michigan's Trusted Family Pool Table Business
          </p>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Moving, assembling and recovering a wide range of pool tables since 2002. 
            Professional pool table services with affordable pricing and exceptional craftsmanship.
          </p>
        </div>
      </section>

      {/* Family Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Family Story</h2>
              <div className="space-y-6 text-lg text-gray-800">
                <p>
                  <strong>Since 2002</strong>, we've been moving, assembling, and recovering a wide range of pool tables 
                  throughout Michigan. What started as a passion for quality craftsmanship has grown into Michigan's 
                  most trusted pool table service company.
                </p>
                <p>
                  We <strong>take pride in our work</strong> and take great care in your home or business. 
                  We work around your schedule with <strong>weekends and evenings availability</strong> because 
                  we understand that your time is valuable.
                </p>
                <p>
                  We offer <strong>affordable billiard table services</strong> and buy and sell used pool tables 
                  at reasonable prices with <strong>delivery and setup included</strong>. Our commitment to quality 
                  and customer satisfaction has made us Michigan's go-to pool table experts.
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-green-900 mb-6">Why Choose Our Family Business?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-green-700 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-green-900">Family Values</h4>
                    <p className="text-green-800 text-sm">Honest pricing, reliable service, and personal attention to every customer</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-6 h-6 text-green-700 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-green-900">20+ Years Experience</h4>
                    <p className="text-green-800 text-sm">Two decades of expertise serving Michigan's pool table needs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-green-700 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-green-900">Michigan-Based</h4>
                    <p className="text-green-800 text-sm">Local family business understanding Michigan communities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-700 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-green-900">Satisfaction Guarantee</h4>
                    <p className="text-green-800 text-sm">We stand behind our work with a 100% satisfaction promise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted Brand Partners
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We service and sell quality pool tables from the industry's most respected manufacturers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Brunswick</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Connelly</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Olhausen</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">American Heritage</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Legacy</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Wolverine</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">AMF</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Pro-Line</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Gandy</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Pete Vitalie</h3>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">
              Pool Table Sizes We Service
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-xl font-bold text-green-900">7′</h4>
                <p className="text-green-800 text-sm">Bar Size</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-xl font-bold text-green-900">8′</h4>
                <p className="text-green-800 text-sm">Home Size</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-xl font-bold text-green-900">8′ Pro</h4>
                <p className="text-green-800 text-sm">Tournament</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-xl font-bold text-green-900">9′</h4>
                <p className="text-green-800 text-sm">Regulation</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-xl font-bold text-green-900">10′</h4>
                <p className="text-green-800 text-sm">Snooker</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Truck className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-900 mb-2">Pool Table Moving</h3>
              <p className="text-blue-800 text-sm">
                Professional billiard table moving and in-home relocations with expert care
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Settings className="w-12 h-12 text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-900 mb-2">Assembly & Setup</h3>
              <p className="text-purple-800 text-sm">
                Precision installation, leveling, and assembly for perfect gameplay
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <ShoppingCart className="w-12 h-12 text-green-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">Table Recovery</h3>
              <p className="text-green-800 text-sm">
                Professional pool table recovering with quality felt and expert craftsmanship
              </p>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <Award className="w-12 h-12 text-orange-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-900 mb-2">Re-leveling</h3>
              <p className="text-orange-800 text-sm">
                Billiard table re-leveling and dismantles for floods, construction, and remodels
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proudly Serving Michigan Communities
            </h2>
            <p className="text-xl text-gray-700">
              Our family business has deep roots in Michigan, serving communities from Detroit to Grand Rapids
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Service Territory</h3>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-700 mr-2" />
                  <p className="text-blue-900 font-semibold">Flexible Scheduling Available</p>
                </div>
                <p className="text-blue-800 text-sm mt-1">We work around your schedule with weekend and evening availability</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-800">
                <div className="space-y-2">
                  <p><strong>Metro Detroit:</strong></p>
                  <p className="text-sm">• Detroit • Troy • Rochester</p>
                  <p className="text-sm">• Warren • Sterling Heights</p>
                  <p className="text-sm">• Livonia • Dearborn</p>
                  
                  <p className="pt-3"><strong>West Michigan:</strong></p>
                  <p className="text-sm">• Grand Rapids • Kalamazoo</p>
                  <p className="text-sm">• Battle Creek • Holland</p>
                  <p className="text-sm">• Muskegon • Wyoming</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Central Michigan:</strong></p>
                  <p className="text-sm">• Lansing • Ann Arbor</p>
                  <p className="text-sm">• Jackson • Flint</p>
                  <p className="text-sm">• Bay City • Saginaw</p>
                  
                  <p className="pt-3"><strong>And Many More:</strong></p>
                  <p className="text-sm">• Traverse City • Midland</p>
                  <p className="text-sm">• Port Huron • Monroe</p>
                  <p className="text-sm">• Everywhere in Michigan!</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Complete Services</h3>
              <div className="space-y-4 text-gray-800 mb-6">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-green-700 mt-1 mr-3" />
                  <div>
                    <p className="font-semibold">Billiard Table Moving</p>
                    <p className="text-sm">Professional moving services and in-home relocations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Settings className="w-5 h-5 text-green-700 mt-1 mr-3" />
                  <div>
                    <p className="font-semibold">Pool Table Recovering</p>
                    <p className="text-sm">Quality felt replacement and professional recovery services</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-green-700 mt-1 mr-3" />
                  <div>
                    <p className="font-semibold">Re-leveling & Dismantles</p>
                    <p className="text-sm">Table dismantles for floods, construction, remodeling, carpet installation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShoppingCart className="w-5 h-5 text-green-700 mt-1 mr-3" />
                  <div>
                    <p className="font-semibold">Buy & Sell Used Tables</p>
                    <p className="text-sm">Quality used pool tables at reasonable prices with delivery and setup</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-100 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-700 mr-3" />
                  <div>
                    <p className="font-bold text-green-900">Free Quotes on All Services</p>
                    <p className="text-green-800 text-sm">We provide honest, upfront estimates with no hidden fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Experience the Family Difference
          </h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied Michigan customers who trust our family for their pool table needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-400 mr-3" />
              <div className="text-left">
                <p className="font-semibold">(586) 552-6053</p>
                <p className="text-sm text-gray-300">Call our family directly</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-400 mr-3" />
              <div className="text-left">
                <p className="font-semibold">cathies4@yahoo.com</p>
                <p className="text-sm text-gray-300">Email for quick response</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-400 mr-3" />
              <div className="text-left">
                <p className="font-semibold">All of Michigan</p>
                <p className="text-sm text-gray-300">We come to you</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/rfq" 
              className="bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition-colors"
            >
              Request Free Quote
            </Link>
            <Link 
              href="/services" 
              className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-400 hover:text-gray-900 transition-colors"
            >
              View Our Services
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
    </div>
  );
}