'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, Award, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  status: string;
  category?: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchNewArrivals();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoadingFeatured(true);
      // Fetch products with featured flag (only active products)
      const response = await fetch('/api/products?featured=true&limit=4', {
        cache: 'no-store', // Ensure fresh data
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // Get featured products (already limited to 4 by API)
        const featured = data.data || [];
        setFeaturedProducts(featured);
      } else {
        console.error('Failed to fetch featured products:', data.error);
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      setLoadingNewArrivals(true);
      // Fetch latest active products (sorted by creation date, newest first)
      const response = await fetch('/api/products?limit=4');
      const data = await response.json();

      if (response.ok && data.success) {
        // Get the 4 most recent products (already sorted by createdAt desc)
        const latestProducts = data.data.slice(0, 4);
        setNewArrivals(latestProducts || []);
      }
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoadingNewArrivals(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section className="py-8 md:py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Truck className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Get your order with-in 3-5 days</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <RotateCcw className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Easy Return</h3>
              <p className="text-sm text-gray-600">Money back guaranteed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Award className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Experience luxury with every purchase</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <TrendingUp className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Future Trends</h3>
              <p className="text-sm text-gray-600">Stay ahead of what&apos;s next with us.</p>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-8 md:py-16 container mx-auto px-4 bg-white">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-black">Featured Products</h2>
            <p className="text-sm md:text-base text-gray-600 px-4">A timeless premium leather tote crafted for women who value elegance, durability, and effortless everyday style.</p>
          </div>
          {loadingFeatured ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No featured products available yet.</p>
              <p className="text-gray-500 text-sm">Mark products as featured in the admin panel to see them here.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProducts.map((product) => (
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
              <div className="text-center">
                <Link
                  href="/products"
                  className="inline-block text-white px-6 md:px-8 py-3 md:py-3 font-semibold transition min-h-[44px] flex items-center justify-center"
                  style={{ backgroundColor: '#8B664E' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7a5642';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#8B664E';
                  }}
                >
                  View All
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Hand and Body Cream Promotional Section */}
        <section className="relative py-8 md:py-10 overflow-hidden" style={{ backgroundColor: '#FCF7F1' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Text Content - Left Side */}
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-1 text-[#6F432C] tracking-tight">
                  Signature Leather Collection
                </h2>
                <p className="text-base md:text-lg text-gray-700 font-light mt-4 leading-relaxed">
                  Designed for those who lead, not follow. Each piece is crafted with premium leather, refined details, and a bold sense of individuality. Made for trendsetters who value quality, style, and confidence in every step.
                </p>
              </div>
              {/* Image - Right Side */}
              <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden">
                <img
                  src="/images/handbag-promo.png"
                  alt="Signature Leather Collection - Premium leather handbag"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Try JPG version if PNG doesn't exist
                    const currentSrc = (e.target as HTMLImageElement).src;
                    if (currentSrc.includes('.png')) {
                      (e.target as HTMLImageElement).src = currentSrc.replace('.png', '.jpg');
                    } else if (currentSrc.includes('.jpg')) {
                      (e.target as HTMLImageElement).src = currentSrc.replace('.jpg', '.jpeg');
                    } else {
                      // Final fallback
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Hand+and+Body+Cream';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-8 md:py-16 container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-black">New Arrivals</h2>
            <p className="text-sm md:text-base text-gray-600 px-4">The best quality products are waiting for you & choose it now.</p>
          </div>
          {loadingNewArrivals ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading new arrivals...</p>
            </div>
          ) : newArrivals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No new arrivals available yet.</p>
              <p className="text-gray-500 text-sm">New products will appear here as they are added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
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
        </section>

        {/* Newsletter Section */}
        <section className="py-8 md:py-16" style={{ backgroundColor: '#FCF7F1' }}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 px-4 text-black">Subscribe to our newsletter</h2>
            <p className="mb-6 md:mb-8 text-sm md:text-base text-gray-700">Sign up and receive information on new collections, events and offers from us.</p>
            <form 
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 px-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email');
                // TODO: Implement newsletter subscription
                console.log('Newsletter subscription:', email);
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none text-base min-h-[44px]"
                required
              />
              <button
                type="submit"
                className="px-6 md:px-8 py-3 bg-black hover:bg-gray-800 transition font-semibold min-h-[44px] whitespace-nowrap text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
