'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories/${categoryId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch category');
      }

      if (data.success && data.data) {
        const category = data.data;
        setFormData({
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          image: category.image || '',
          status: category.status || 'active',
        });
      } else {
        throw new Error('Category not found');
      }
    } catch (err: any) {
      console.error('Error fetching category:', err);
      setError(err.message || 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category');
      }

      alert('Category updated successfully!');
      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.message || 'Failed to update category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Edit Category</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading category...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Category</h1>
        <p className="text-gray-600 mt-2">Update category information</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly version of the name
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/admin/categories"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

