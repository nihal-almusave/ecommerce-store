'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShoppingCart, ChevronDown, MapPin, Wallet } from 'lucide-react';
import Link from 'next/link';
import { getCart, clearCart, CartItem } from '@/lib/cart';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);

    // Pre-fill user information if logged in
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setFormData((prev) => ({
          ...prev,
          email: userData.email || prev.email,
          firstName: userData.name?.split(' ')[0] || prev.firstName,
          lastName: userData.name?.split(' ').slice(1).join(' ') || prev.lastName,
          phone: userData.phone || prev.phone,
        }));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCart = getCart();
      setCartItems(updatedCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zip: '',
    country: 'Bangladesh',
  });

  const [shippingMethod, setShippingMethod] = useState<'inside' | 'outside'>('inside');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingMethod === 'inside' ? 60 : 120;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.phone || !formData.address) {
      setSubmitError('Please fill in all required fields (Email, First Name, Phone, Address)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Prepare order data
      const orderData = {
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName || '',
          phone: formData.phone,
          address: formData.address,
          city: formData.city || '',
          province: formData.province || '',
          zip: formData.zip || '',
          country: formData.country,
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        shippingMethod: shippingMethod,
        paymentMethod: 'cash_on_delivery',
      };

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Show detailed error message
        const errorMsg = result.error || result.details || 'Failed to create order. Please try again.';
        console.error('Order creation error:', result);
        setSubmitError(errorMsg);
        return;
      }

      // Order created successfully
      // Clear cart using the proper function
      clearCart();

      // Redirect to success page with order details
      const orderId = result.data._id || result.data.orderNumber;
      router.push(`/checkout/success?order=${result.data.orderNumber}&id=${orderId}`);
    } catch (err: any) {
      console.error('Order creation exception:', err);
      setSubmitError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show empty cart message if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-8 md:py-16">
          <div className="text-center px-4">
            <ShoppingCart className="w-20 h-20 md:w-24 md:h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">Add some products to your cart before checkout.</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 md:px-8 py-3 font-semibold rounded-lg hover:bg-gray-800 transition min-h-[44px] flex items-center justify-center"
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
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2">
              <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Checkout</h1>

              {/* Contact Information */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Contact</h2>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                  />
                </div>
              </div>

              {/* Delivery */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Delivery</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Shipping address</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Country/Region</label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                      >
                        <option>Bangladesh</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">Last name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc."
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1.5">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5">Postal code</label>
                        <input
                          type="text"
                          value={formData.zip}
                          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                          className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-base md:text-sm min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Shipping method</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer border border-gray-300 rounded p-3 hover:border-black transition">
                    <input
                      type="radio"
                      name="shipping"
                      value="inside"
                      checked={shippingMethod === 'inside'}
                      onChange={() => setShippingMethod('inside')}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Inside Dhaka</div>
                      <div className="text-xs text-gray-600">৳ 60</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer border border-gray-300 rounded p-3 hover:border-black transition">
                    <input
                      type="radio"
                      name="shipping"
                      value="outside"
                      checked={shippingMethod === 'outside'}
                      onChange={() => setShippingMethod('outside')}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Outside Dhaka</div>
                      <div className="text-xs text-gray-600">৳ 120</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Payment</h2>
                
                {/* Cash on Delivery Option */}
                <div className="border border-gray-300 rounded p-3">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Cash on Delivery</div>
                      <div className="text-xs text-gray-600">Pay when you receive</div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-3">
                  <p className="text-sm text-gray-600">
                    আপনি পণ্য হাতে পাওয়ার পরই টাকা পরিশোধ করবেন, তাই অর্ডার করুন একদম নিশ্চিন্তে। কোনো প্রকার অগ্রিম পেমেন্ট ছাড়াই। দ্রুত ডেলিভারির জন্য সঠিক নাম্বার ও ঠিকানা দিন।
                  </p>
                </div>
              </div>

              {/* Return to Cart */}
              <Link
                href="/cart"
                className="text-gray-600 hover:text-black transition flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Return to cart
              </Link>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Order summary</h2>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Product';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xs mb-1 line-clamp-2">{item.name}</h3>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-xs font-semibold mt-1">৳{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary Details */}
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">৳{shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">৳{tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span>৳{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Complete Order Button */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-black text-white py-3 md:py-3 px-4 font-semibold hover:bg-gray-800 transition mt-4 text-base md:text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    {isSubmitting ? 'Processing...' : 'Complete order'}
                  </button>
                  {submitError && (
                    <p className="text-xs text-red-600 text-center mt-2">{submitError}</p>
                  )}

                  {/* Security Note */}
                  <p className="text-xs text-gray-500 text-center mt-3">
                    🔒 Secure checkout. Your payment information is encrypted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

