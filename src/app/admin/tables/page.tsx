'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
  GripVertical
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Table {
  id: string;
  name: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  status: 'available' | 'sold' | 'pending';
  dateAdded: string;
  images?: string[];
  additionalInfo?: string;
  sortOrder?: number;
}

interface SortableTableProps {
  table: Table;
  onStatusChange: (id: string, status: 'available' | 'sold') => void;
  onDelete: (id: string) => void;
}

function SortableTable({ table, onStatusChange, onDelete }: SortableTableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: table.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Drag Handle Header */}
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
        <div {...attributes} {...listeners} className="flex items-center space-x-2 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Drag to reorder</span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          table.status === 'available' ? 'bg-green-100 text-green-800' :
          table.status === 'sold' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {table.status.toUpperCase()}
        </span>
      </div>

      {/* Table Image */}
      <div className="h-48 bg-gray-200 relative">
        {table.images && table.images.length > 0 ? (
          <img 
            src={table.images[0]} 
            alt={table.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Table Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{table.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{table.brand} • {table.size} • {table.condition}</p>
        <p className="text-lg font-bold text-green-700 mb-4">${table.price.toLocaleString()}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Link
              href={`/inventory/${table.id}`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              href={`/admin/tables/${table.id}/edit`}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(table.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Status Toggle */}
          <div className="flex space-x-1">
            {table.status !== 'available' && (
              <button
                onClick={() => onStatusChange(table.id, 'available')}
                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Mark as Available"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {table.status !== 'sold' && (
              <button
                onClick={() => onStatusChange(table.id, 'sold')}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Mark as Sold"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TablesManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Load tables
  useEffect(() => {
    if (!session) return;
    loadTables();
  }, [session]);

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tables');
      const data = await response.json();
      console.log('Admin loadTables received:', data);
      if (Array.isArray(data)) {
        // Sort by sortOrder, then by date added as fallback
        const sortedTables = data.sort((a, b) => {
          if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
            return a.sortOrder - b.sortOrder;
          }
          if (a.sortOrder !== undefined) return -1;
          if (b.sortOrder !== undefined) return 1;
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        });
        setTables(sortedTables);
      } else {
        console.error('Admin API returned non-array data:', data);
        setTables([]);
      }
    } catch (error) {
      console.error('Error loading tables:', error);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tables.findIndex((table) => table.id === active.id);
      const newIndex = tables.findIndex((table) => table.id === over.id);

      const newTables = arrayMove(tables, oldIndex, newIndex);
      setTables(newTables);

      // Update sort orders on server
      setSaving(true);
      try {
        const updates = newTables.map((table, index) => ({
          id: table.id,
          sortOrder: index
        }));

        await fetch('/api/tables/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates })
        });
      } catch (error) {
        console.error('Error updating table order:', error);
        // Reload tables to revert on error
        loadTables();
      } finally {
        setSaving(false);
      }
    }
  };

  const handleStatusChange = async (tableId: string, newStatus: 'available' | 'sold') => {
    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadTables(); // Reload tables
      }
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  const handleDelete = async (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadTables(); // Reload tables
      }
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true;
    return table.status === filter;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tables...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
                <p className="text-sm text-gray-600">Manage your pool table inventory</p>
              </div>
            </div>
            
            <Link
              href="/admin/tables/new"
              className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Table</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              <option value="all">All Tables ({tables.length})</option>
              <option value="available">Available ({tables.filter(t => t.status === 'available').length})</option>
              <option value="sold">Sold ({tables.filter(t => t.status === 'sold').length})</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Info */}
        {filteredTables.length > 1 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">
                Drag and drop table cards to reorder them. Changes are saved automatically.
              </p>
              {saving && (
                <div className="text-xs text-blue-600 ml-auto">Saving...</div>
              )}
            </div>
          </div>
        )}

        {/* Tables Grid */}
        {filteredTables.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't added any tables yet." 
                : `No ${filter} tables found.`}
            </p>
            <Link
              href="/admin/tables/new"
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Add Your First Table
            </Link>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={filteredTables.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTables.map((table) => (
                  <SortableTable 
                    key={table.id} 
                    table={table}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}