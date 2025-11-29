'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, ShoppingBag, Home, Package, Mail, Phone, MapPin } from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('order');
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderNumber) {
      setIsLoading(false);
      return;
    }

    // Fetch order details if order ID is provided
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setIsLoading(false);
    }
  }, [orderNumber, orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError('Could not load order details');
      }
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="max-w-2xl w-full px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">We couldn&apos;t find your order information.</p>
            <Link
              href="/"
              className="bg-black text-white px-6 py-3 font-semibold rounded-lg hover:bg-gray-800 transition inline-block"
            >
              Go Home
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
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Your order number is: <span className="font-semibold text-black">{orderNumber}</span>
            </p>
            <p className="text-gray-600">
              Thank you for your order! We&apos;ve received your order and will begin processing it right away.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              📧 An invoice email has been sent to your email address.
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </h2>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 bg-white p-3 rounded">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Product';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Shipping ({order.shippingMethod === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}):
                    </span>
                    <span className="font-semibold">{formatCurrency(order.shipping)}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold">{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.customer && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </h3>
                  <div className="bg-white p-3 rounded text-sm text-gray-700">
                    <p className="font-medium">
                      {order.customer.firstName} {order.customer.lastName || ''}
                    </p>
                    <p>{order.customer.address}</p>
                    {order.customer.city && <p>{order.customer.city}</p>}
                    {order.customer.province && <p>{order.customer.province}</p>}
                    {order.customer.zip && <p>{order.customer.zip}</p>}
                    <p>{order.customer.country}</p>
                    <p className="mt-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {order.customer.phone}
                    </p>
                    <p className="mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {order.customer.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Date */}
              {order.createdAt && (
                <div className="border-t pt-4 mt-4 text-sm text-gray-600">
                  <p>Order placed on: {formatDate(order.createdAt)}</p>
                  <p className="mt-1">Status: <span className="font-semibold capitalize">{order.status || 'Pending'}</span></p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="bg-black text-white px-6 py-3 font-semibold rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </Link>
            <Link
              href="/products"
              className="bg-gray-100 text-gray-800 px-6 py-3 font-semibold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="bg-gray-100 text-gray-800 px-6 py-3 font-semibold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1 flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

