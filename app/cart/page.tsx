'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { getCart, updateCartItemQuantity, removeFromCart, CartItem } from '@/lib/cart';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      const cart = getCart();
      setCartItems(cart);
    };

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(id, newQuantity);
    setCartItems(updatedCart);
  };

  const removeItem = (id: string) => {
    const updatedCart = removeFromCart(id);
    setCartItems(updatedCart);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 60; // Default shipping cost
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-3 font-semibold rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-black">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row gap-3 md:gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Product';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm md:text-base text-gray-600">৳ {item.price.toLocaleString()}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2.5 md:p-2 hover:bg-gray-100 transition min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 md:px-4 py-2 min-w-[2.5rem] md:min-w-[3rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2.5 md:p-2 hover:bg-gray-100 transition min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right min-w-[80px] md:min-w-[100px]">
                            <p className="font-semibold text-sm md:text-base text-gray-900">
                              ৳ {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2.5 md:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center text-gray-600 hover:text-black transition"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">৳ {shipping}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>৳ {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-black text-white py-3 md:py-3 px-4 font-semibold rounded-lg hover:bg-gray-800 transition mb-4 min-h-[44px]"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block w-full text-center text-gray-600 hover:text-black transition text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

