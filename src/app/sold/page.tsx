import Link from 'next/link';
import tablesData from '@/data/tables.json';
import Navigation from '@/components/Navigation';

export default function SoldTablesPage() {
  const soldTables = tablesData.filter(table => table.status === 'sold');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Page Header */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recently Sold Tables</h2>
          <p className="text-xl text-gray-600 mb-2">Success stories from happy customers across Michigan</p>
          <p className="text-lg text-gray-500">See the quality tables we've helped find new homes</p>
        </div>
      </section>

      {/* Sold Tables Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {soldTables.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No sold tables to display yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">{soldTables.length}</h3>
                  <p className="text-gray-600">Tables Sold</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    ${soldTables.reduce((acc, table) => acc + (table.soldPrice || 0), 0).toLocaleString()}
                  </h3>
                  <p className="text-gray-600">Total Sales Value</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">100%</h3>
                  <p className="text-gray-600">Customer Satisfaction</p>
                </div>
              </div>

              {/* Sold Tables Display */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {soldTables.map((table) => (
                  <div 
                    key={table.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden relative"
                  >
                    {/* Sold Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full">
                        SOLD
                      </span>
                    </div>

                    {/* Table Image */}
                    <div className="h-64 bg-gray-200 relative">
                      {table.images && table.images.length > 0 ? (
                        <img 
                          src={table.images[0]} 
                          alt={table.name}
                          className="w-full h-full object-cover opacity-75"
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
                      <div className="text-sm text-gray-600 mb-3 space-y-1">
                        <p><span className="font-medium">Brand:</span> {table.brand}</p>
                        <p><span className="font-medium">Size:</span> {table.size}</p>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">{table.description}</p>
                      
                      {/* Sale Details */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Sold Price:</span>
                          <span className="text-lg font-bold text-green-700">
                            ${table.soldPrice?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Sold Date:</span>
                          <span className="text-sm text-gray-800">
                            {table.dateSold ? new Date(table.dateSold).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {table.customerInfo && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Customer:</span>
                            <span className="text-sm text-gray-800">
                              {table.customerInfo.name}
                            </span>
                          </div>
                        )}
                        {table.customerInfo?.location && (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-600">Location:</span>
                            <span className="text-sm text-gray-800">
                              {table.customerInfo.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Customer Success Stories</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Matt found us the perfect tournament table for our sports bar. 
                Professional installation and great communication throughout!"
              </p>
              <p className="font-semibold text-gray-900">- Mike's Sports Bar, Detroit</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Excellent service from start to finish. The table was exactly as described 
                and looks amazing in our game room!"
              </p>
              <p className="font-semibold text-gray-900">- Johnson Family, Grand Rapids</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Looking for Your Perfect Table?</h3>
          <p className="text-lg mb-6">Browse our current inventory or let us know what you're looking for</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/inventory" 
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              View Available Tables
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