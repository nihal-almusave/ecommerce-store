'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Minus, Plus, ShoppingCart, Truck, Headphones, Shield, Loader2, Check, Award, TrendingUp, RotateCcw, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { addToCart } from '@/lib/cart';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  status: string;
  category?: string;
  sku?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product');
      }

      if (data.success && data.data) {
        setProduct(data.data);
        // Set first image as selected if images exist
        if (data.data.images && data.data.images.length > 0) {
          setSelectedImage(0);
        }
      } else {
        throw new Error('Product not found');
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      // Fetch products from the same category or random products
      const response = await fetch('/api/products');
      const data = await response.json();

      if (response.ok && data.success) {
        // Filter out current product and get up to 4 related products
        const related = data.data
          .filter((p: Product) => p._id !== productId && p.status === 'active')
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    try {
      addToCart(
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
        },
        quantity
      );

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;

    try {
      addToCart(
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
        },
        quantity
      );

      // Navigate to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    
    const phoneNumber = '01572915263'; // TANNARO phone number
    const message = `Hi! I'm interested in this product:\n\n${product.name}\nPrice: ৳${product.price.toLocaleString()}\nQuantity: ${quantity}\n\nProduct Link: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
                <p className="text-gray-600">Loading product...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold mb-4 text-black">Product Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-3 font-semibold rounded-lg hover:bg-gray-800 transition"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = isOnSale && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const displayImages = product.images && product.images.length > 0 ? product.images : ['/images/placeholder.png'];
  const isOutOfStock = product.stock === 0 || product.status === 'out_of_stock';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black">Products</Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-gray-600">{product.category}</span>
              </>
            )}
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <span className="text-black font-semibold text-lg">Out of Stock</span>
                </div>
              )}
              <img
                src={displayImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x800?text=Product+Image';
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Thumb';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-4 font-poppins tracking-tight">{product.name}</h1>
              
              {/* Category and SKU */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                {product.category && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full">{product.category}</span>
                )}
                {product.sku && (
                  <span>SKU: {product.sku}</span>
                )}
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <span className="text-xl md:text-2xl font-bold">৳ {product.price.toLocaleString()}</span>
                  {isOnSale && product.compareAtPrice && (
                    <>
                      <span className="text-base text-gray-500 line-through ml-2">৳ {product.compareAtPrice.toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold ml-3">
                          Save {discount}%
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {isOutOfStock ? (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                ) : (
                  <span className="text-green-600 font-semibold">In Stock ({product.stock} available)</span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="font-semibold text-sm md:text-base">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="p-2.5 md:p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 md:px-4 py-2 min-w-[50px] md:min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        disabled={isOutOfStock || quantity >= product.stock}
                        className="p-2.5 md:p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 md:py-2.5 px-4 md:px-6 font-semibold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-white min-h-[44px] ${
                      addedToCart ? 'bg-green-600' : ''
                    }`}
                    style={!addedToCart ? { backgroundColor: '#8B664E' } : {}}
                    onMouseEnter={(e) => {
                      if (!addedToCart && !isOutOfStock) {
                        e.currentTarget.style.backgroundColor = '#7a5642';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!addedToCart && !isOutOfStock) {
                        e.currentTarget.style.backgroundColor = '#8B664E';
                      }
                    }}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to cart
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full bg-white border-2 border-black text-black py-3 md:py-2.5 px-6 font-semibold hover:bg-black hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px]"
                >
                  Buy Now
                </button>

                {/* WhatsApp Button */}
                <button
                  onClick={handleWhatsApp}
                  disabled={isOutOfStock}
                  className="w-full bg-[#25D366] text-white py-3 md:py-2.5 px-6 font-semibold hover:bg-[#20BA5A] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Order On Whats App
                </button>

                {/* Social Media Icons */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#1877F2] transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#E4405F] transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#000000] transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>

                {/* Product Description */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-bold mb-4">Product Description</h2>
                  <p className="text-gray-700 leading-relaxed text-sm tracking-tight">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-t border-gray-200">
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12 pb-12 px-4" style={{ backgroundColor: '#FDF6F5' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Related Products</h2>
              <p className="text-gray-600">You may also like these products</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  id={relatedProduct._id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  compareAtPrice={relatedProduct.compareAtPrice}
                  image={relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : '/images/placeholder.png'}
                  isSale={!!relatedProduct.compareAtPrice && relatedProduct.compareAtPrice > relatedProduct.price}
                  isSoldOut={relatedProduct.stock === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      </main>

      <Footer />
    </div>
  );
}

