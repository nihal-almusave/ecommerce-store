'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  products: {
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    lowStock: number;
    featured: number;
  };
  orders?: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    revenue: number;
    deliveredRevenue?: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/admin/stats', {
        cache: 'no-store', // Ensure fresh data
      });
      const result = await response.json();

      if (result.success) {
        console.log('Dashboard stats loaded:', result.data);
        console.log('Revenue:', result.data.orders?.revenue);
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to load statistics');
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=5');
      const result = await response.json();

      if (result.success) {
        setRecentOrders(result.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch recent orders:', err);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  const statsCards = stats ? [
    {
      title: 'Total Products',
      value: formatNumber(stats.products.total),
      change: `${stats.products.active} active`,
      trend: 'up' as const,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Products',
      value: formatNumber(stats.products.active),
      change: `${stats.products.inactive} inactive`,
      trend: 'up' as const,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: formatNumber(stats.orders?.total || 0),
      change: `${stats.orders?.pending || 0} pending`,
      trend: (stats.orders?.pending || 0) > 0 ? 'down' as const : 'up' as const,
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.orders?.revenue || 0),
      change: `${stats.orders?.delivered || 0} delivered orders`,
      trend: (stats.orders?.revenue || 0) > 0 ? 'up' as const : 'up' as const,
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ] : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProductNames = (items: any[]) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) return items[0].name;
    return `${items[0].name} + ${items.length - 1} more`;
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to TANNARO Admin Panel</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading dashboard statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to TANNARO Admin Panel</p>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to TANNARO Admin Panel</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
          title="Refresh statistics"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer.firstName} {order.customer.lastName || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getProductNames(order.items)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

