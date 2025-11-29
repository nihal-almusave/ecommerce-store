'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

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
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`/api/orders/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrder(result.data);
        setStatus(result.data.status);
      } else {
        setError(result.error || 'Failed to load order');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || status === order.status) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        setOrder(result.data);
        alert('Order status updated successfully');
      } else {
        alert(result.error || 'Failed to update order status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order {order.orderNumber}</h1>
            <p className="text-gray-600 mt-2">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <button
            onClick={fetchOrder}
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h2>
            <div className="flex items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || status === order.status}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
            <div className="mt-4">
              <span
                className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : order.status === 'processing'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{' '}
                {order.customer.firstName} {order.customer.lastName || ''}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.customer.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.customer.phone}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="font-medium mb-2">Shipping Address:</p>
                <p className="text-gray-600">
                  {order.customer.address}
                  {order.customer.city && `, ${order.customer.city}`}
                  {order.customer.province && `, ${order.customer.province}`}
                  {order.customer.zip && ` ${order.customer.zip}`}
                  <br />
                  {order.customer.country}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping ({order.shippingMethod === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                <span className="font-medium">{formatCurrency(order.shipping)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formatCurrency(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="font-bold text-lg text-gray-800">{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm">
                <span className="font-medium">Payment Method:</span>{' '}
                <span className="text-gray-600 capitalize">
                  {order.paymentMethod.replace('_', ' ')}
                </span>
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

