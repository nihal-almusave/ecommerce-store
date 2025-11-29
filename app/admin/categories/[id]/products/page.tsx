'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Search, RefreshCw } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  status: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ManageCategoryProductsPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Fetch category with products
      const categoryResponse = await fetch(`/api/categories/${categoryId}`);
      const categoryResult = await categoryResponse.json();

      if (!categoryResult.success) {
        setError(categoryResult.error || 'Failed to load category');
        return;
      }

      setCategory(categoryResult.data);

      // Fetch category products
      const productsResponse = await fetch(`/api/categories/${categoryId}/products`);
      const productsResult = await productsResponse.json();

      if (productsResult.success) {
        const products = productsResult.data.products || [];
        // Ensure products have proper _id format
        setCategoryProducts(
          products.map((p: any) => ({
            ...p,
            _id: p._id?.toString() || p._id,
          }))
        );
      }

      // Fetch all products
      const allProductsResponse = await fetch('/api/products?admin=true');
      const allProductsResult = await allProductsResponse.json();

      if (allProductsResult.success) {
        const products = allProductsResult.data || [];
        // Ensure products have proper _id format
        setAllProducts(
          products.map((p: any) => ({
            ...p,
            _id: p._id?.toString() || p._id,
          }))
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProducts = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      const response = await fetch(`/api/categories/${categoryId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: selectedProducts }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Successfully added ${selectedProducts.length} product(s) to category`);
        setSelectedProducts([]);
        // Clear search to show all products
        setSearchTerm('');
        // Refresh data after a short delay to ensure backend has processed
        setTimeout(() => {
          fetchData();
        }, 500);
      } else {
        setError(result.error || 'Failed to add products');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add products');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product from the category?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');

      const response = await fetch(
        `/api/categories/${categoryId}/products?productIds=${productId}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess('Product removed from category');
        fetchData();
      } else {
        setError(result.error || 'Failed to remove product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove product');
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAll = () => {
    const available = filteredAvailableProducts.map((p) => p._id);
    setSelectedProducts(available);
  };

  const deselectAll = () => {
    setSelectedProducts([]);
  };

  // Filter products that are not already in category
  const availableProducts = allProducts.filter((product) => {
    if (!product._id) return false;
    const productId = product._id.toString();
    const isNotInCategory = !categoryProducts.some((cp) => {
      if (!cp._id) return false;
      return cp._id.toString() === productId;
    });
    return isNotInCategory;
  });

  // Filter category products
  const filteredCategoryProducts = categoryProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter available products
  const filteredAvailableProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading...</div>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Products - {category?.name}
            </h1>
            <p className="text-gray-600 mt-2">Add or remove products from this category</p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Products Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Products to Category</h2>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 hover:text-blue-900"
              >
                Select All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={deselectAll}
                className="text-sm text-blue-600 hover:text-blue-900"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto mb-4">
            {filteredAvailableProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No products found' : 'All products are already in this category'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAvailableProducts.map((product) => (
                  <label
                    key={product._id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => toggleProductSelection(product._id)}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        ৳{product.price.toLocaleString()} • Stock: {product.stock}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleAddProducts}
            disabled={isSubmitting || selectedProducts.length === 0}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isSubmitting
              ? 'Adding...'
              : `Add ${selectedProducts.length} Product${selectedProducts.length !== 1 ? 's' : ''}`}
          </button>
        </div>

        {/* Category Products Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Products in Category ({categoryProducts.length})
          </h2>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
            {filteredCategoryProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No products found' : 'No products in this category'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCategoryProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        ৳{product.price.toLocaleString()} • Stock: {product.stock}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(product._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Remove from category"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

