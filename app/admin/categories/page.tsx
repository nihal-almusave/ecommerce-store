'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, RefreshCw, Search } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCategories();
  }, [statusFilter]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      const response = await fetch(`/api/categories?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setCategories(result.data || []);
      } else {
        setError(result.error || 'Failed to load categories');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Category deleted successfully');
        fetchCategories();
      } else {
        alert(result.error || 'Failed to delete category');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600 mt-2">Manage product categories</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600 mt-2">Manage product categories</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
            title="Refresh categories"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/admin/categories/new"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm
                    ? 'No categories found matching your search'
                    : 'No categories found. Create your first category!'}
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.description || (
                      <span className="text-gray-400">No description</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/admin/categories/${category._id}/products`}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      {category.productCount || 0} products
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/categories/${category._id}/edit`}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id, category.name)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

