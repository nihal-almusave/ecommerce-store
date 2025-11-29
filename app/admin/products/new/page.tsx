'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    sku: '',
    stock: '',
    status: 'active',
    featured: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        return data.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(error.message || 'Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        images: images,
        sku: formData.sku || undefined,
        stock: parseInt(formData.stock),
        status: formData.status,
        featured: formData.featured,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        compareAtPrice: '',
        sku: '',
        stock: '',
        status: 'active',
        featured: false,
      });
      setImages([]);

      alert('Product added successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(error.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new product for your store</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Product SKU"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured Product
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Compare at Price (৳)
                  </label>
                  <input
                    type="number"
                    id="compareAtPrice"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if not on sale</p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Images</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-2"></div>
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, JPEG, GIF, WEBP (MAX. 5MB per image)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+Image';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Publish</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-3 px-4 font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <Link
                    href="/admin/products"
                    className="block w-full text-center text-gray-600 hover:text-gray-900 py-2"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

