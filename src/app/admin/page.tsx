'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Package, 
  MessageCircle, 
  FileText, 
  Upload,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Settings
} from 'lucide-react';

interface DashboardStats {
  totalTables: number;
  availableTables: number;
  soldTables: number;
  pendingReviews: number;
  newRFQs: number;
  totalRFQs: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalTables: 0,
    availableTables: 0,
    soldTables: 0,
    pendingReviews: 0,
    newRFQs: 0,
    totalRFQs: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Load dashboard stats
  useEffect(() => {
    if (!session) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [tablesRes, reviewsRes, rfqsRes] = await Promise.all([
          fetch('/api/tables'),
          fetch('/api/reviews'),
          fetch('/api/rfqs')
        ]);

        const tables = await tablesRes.json();
        const reviews = await reviewsRes.json();
        const rfqs = await rfqsRes.json();

        // Calculate stats
        const availableTables = tables.filter((t: any) => t.status === 'available').length;
        const soldTables = tables.filter((t: any) => t.status === 'sold').length;
        const pendingReviews = reviews.filter((r: any) => r.status === 'pending').length;
        const newRFQs = rfqs.filter((r: any) => r.status === 'new').length;

        setStats({
          totalTables: tables.length,
          availableTables,
          soldTables,
          pendingReviews,
          newRFQs,
          totalRFQs: rfqs.length,
          recentActivity: [
            ...rfqs.slice(0, 3).map((rfq: any) => ({
              type: 'rfq',
              title: `New quote request for ${rfq.tableName}`,
              subtitle: `from ${rfq.customerName}`,
              time: new Date(rfq.submittedAt).toLocaleDateString()
            })),
            ...reviews.filter((r: any) => r.status === 'pending').slice(0, 2).map((review: any) => ({
              type: 'review',
              title: `New review pending approval`,
              subtitle: `${review.rating} stars from ${review.customerName}`,
              time: new Date(review.dateSubmitted).toLocaleDateString()
            }))
          ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const statCards = [
    {
      title: 'Total Tables',
      value: stats.totalTables,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/tables'
    },
    {
      title: 'Available Tables',
      value: stats.availableTables,
      icon: CheckCircle,
      color: 'bg-green-500',
      href: '/admin/tables?filter=available'
    },
    {
      title: 'Sold Tables',
      value: stats.soldTables,
      icon: TrendingUp,
      color: 'bg-purple-500',
      href: '/admin/tables?filter=sold'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: MessageCircle,
      color: 'bg-yellow-500',
      href: '/admin/reviews?filter=pending'
    },
    {
      title: 'New RFQs',
      value: stats.newRFQs,
      icon: AlertCircle,
      color: 'bg-red-500',
      href: '/admin/rfqs?filter=new'
    },
    {
      title: 'Total RFQs',
      value: stats.totalRFQs,
      icon: FileText,
      color: 'bg-indigo-500',
      href: '/admin/rfqs'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Table',
      description: 'List a new pool table for sale',
      icon: Package,
      href: '/admin/tables/new',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Review Approvals',
      description: 'Approve or reject customer reviews',
      icon: MessageCircle,
      href: '/admin/reviews',
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      title: 'Manage RFQs',
      description: 'View and respond to quote requests',
      icon: FileText,
      href: '/admin/rfqs',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Manage Blog',
      description: 'Create and manage blog posts',
      icon: FileText,
      href: '/admin/blogs',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Affordable Billiards</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user?.name || session.user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your pool table business today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className={`${action.color} text-white p-4 rounded-lg flex items-center space-x-4 transition-colors`}
                  >
                    <Icon className="w-6 h-6" />
                    <div>
                      <h4 className="font-semibold">{action.title}</h4>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'rfq' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.subtitle}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/admin/tables" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Tables</p>
              </Link>
              <Link href="/admin/reviews" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Reviews</p>
              </Link>
              <Link href="/admin/rfqs" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">RFQs</p>
              </Link>
              <Link href="/admin/blogs" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Blog</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}