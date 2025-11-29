'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Package, Calendar, DollarSign, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    email: string;
    firstName: string;
    lastName?: string;
    phone: string;
    address: string;
    city?: string;
    province?: string;
    zip?: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Clock },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const auth = localStorage.getItem('userAuth');
    const userDataStr = localStorage.getItem('userData');

    if (auth !== 'true' || !userDataStr) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(userDataStr);
      const userEmail = userData.email;

      const response = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`, {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      if (data.success) {
        setOrders(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">My Orders</h1>
            <p className="text-gray-600">View and track all your orders</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-black">Order #{order.orderNumber}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig[order.status].label}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <p className="font-semibold text-black">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {order.customer.firstName} {order.customer.lastName || ''}
                          <br />
                          {order.customer.address}
                          <br />
                          {order.customer.city && `${order.customer.city}, `}
                          {order.customer.province && `${order.customer.province} `}
                          {order.customer.zip && `${order.customer.zip}`}
                          <br />
                          {order.customer.country}
                          <br />
                          Phone: {order.customer.phone}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping ({order.shippingMethod === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                            <span>{formatCurrency(order.shipping)}</span>
                          </div>
                          {order.tax > 0 && (
                            <div className="flex justify-between text-gray-600">
                              <span>Tax:</span>
                              <span>{formatCurrency(order.tax)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-black pt-2 border-t">
                            <span>Total:</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

