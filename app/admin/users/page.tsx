'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, RefreshCw, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image?: string;
  orders: number;
  totalSpent: number;
  joined: string | Date;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/users', {
        cache: 'no-store',
      });
      const result = await response.json();

      if (result.success) {
        setUsers(result.data || []);
        setFilteredUsers(result.data || []);
      } else {
        setError(result.error || 'Failed to load users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 mt-2">Manage customer accounts</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 mt-2">Manage customer accounts</p>
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
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 mt-2">Manage customer accounts</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
          title="Refresh users"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? 'No users found matching your search' : 'No users found'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.role === 'admin' && (
                          <span className="text-xs text-blue-600 font-medium">Admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(user.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.joined)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/orders?email=${encodeURIComponent(user.email)}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Orders
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

