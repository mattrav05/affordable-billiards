'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface RFQ {
  id: string;
  tableId: string;
  tableName: string;
  tablePrice: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  message: string;
  installationNeeded: boolean;
  preferredContact: 'phone' | 'email' | 'text';
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  submittedAt: string;
}

export default function RFQManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'quoted' | 'closed'>('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Load RFQs
  useEffect(() => {
    if (!session) return;
    loadRFQs();
  }, [session]);

  const loadRFQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rfqs');
      const data = await response.json();
      setRfqs(data);
    } catch (error) {
      console.error('Error loading RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (rfqId: string, newStatus: 'new' | 'contacted' | 'quoted' | 'closed') => {
    try {
      const response = await fetch(`/api/rfqs/${rfqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadRFQs(); // Reload RFQs
      }
    } catch (error) {
      console.error('Error updating RFQ status:', error);
    }
  };

  const filteredRFQs = rfqs.filter(rfq => {
    if (filter === 'all') return true;
    return rfq.status === filter;
  });

  const newCount = rfqs.filter(r => r.status === 'new').length;
  const contactedCount = rfqs.filter(r => r.status === 'contacted').length;
  const quotedCount = rfqs.filter(r => r.status === 'quoted').length;
  const closedCount = rfqs.filter(r => r.status === 'closed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'contacted': return <Phone className="w-4 h-4" />;
      case 'quoted': return <FileText className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RFQs...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">RFQ Management</h1>
                <p className="text-sm text-gray-600">Manage customer quote requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{rfqs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-red-600">{newCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-blue-600">{contactedCount}</p>
              </div>
              <Phone className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quoted</p>
                <p className="text-2xl font-bold text-yellow-600">{quotedCount}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-green-600">{closedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
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
              <option value="all">All RFQs ({rfqs.length})</option>
              <option value="new">New ({newCount})</option>
              <option value="contacted">Contacted ({contactedCount})</option>
              <option value="quoted">Quoted ({quotedCount})</option>
              <option value="closed">Closed ({closedCount})</option>
            </select>
          </div>
        </div>

        {/* RFQs List */}
        {filteredRFQs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "No quote requests yet." 
                : `No ${filter} RFQs found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRFQs.map((rfq) => (
              <div key={rfq.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{rfq.tableName}</h3>
                      <span className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rfq.status)}`}>
                        {getStatusIcon(rfq.status)}
                        <span>{rfq.status.toUpperCase()}</span>
                      </span>
                    </div>
                    
                    <p className="text-lg font-medium text-green-700 mb-4">${rfq.tablePrice.toLocaleString()}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(rfq.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">{rfq.customerName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${rfq.email}`} className="hover:text-green-700">
                          {rfq.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${rfq.phone}`} className="hover:text-green-700">
                          {rfq.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{rfq.address}, {rfq.city}, {rfq.zipCode}</span>
                      </div>

                      <div className="pt-2">
                        <span className="text-sm font-medium text-gray-700">Preferred Contact: </span>
                        <span className="text-sm text-gray-600 capitalize">{rfq.preferredContact}</span>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Installation: </span>
                        <span className="text-sm text-gray-600">
                          {rfq.installationNeeded ? 'Required' : 'Not needed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message & Actions */}
                  <div>
                    {rfq.message && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Customer Message</h4>
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                          {rfq.message}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {rfq.status !== 'contacted' && (
                          <button
                            onClick={() => handleStatusChange(rfq.id, 'contacted')}
                            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Mark Contacted</span>
                          </button>
                        )}
                        
                        {rfq.status !== 'quoted' && (
                          <button
                            onClick={() => handleStatusChange(rfq.id, 'quoted')}
                            className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Mark Quoted</span>
                          </button>
                        )}
                        
                        {rfq.status !== 'closed' && (
                          <button
                            onClick={() => handleStatusChange(rfq.id, 'closed')}
                            className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark Closed</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}