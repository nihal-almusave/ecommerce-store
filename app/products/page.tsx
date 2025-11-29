'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      if (data.success) {
        setProducts(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">All Products</h1>
              <p className="text-gray-600">Browse our complete collection</p>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">All Products</h1>
              <p className="text-gray-600">Browse our complete collection</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-black">All Products</h1>
            <p className="text-sm md:text-base text-gray-600">Browse our complete collection</p>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-4">No products available yet.</p>
              <p className="text-gray-500">Check back soon for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  image={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                  isSale={!!product.compareAtPrice && product.compareAtPrice > product.price}
                  isSoldOut={product.stock === 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

