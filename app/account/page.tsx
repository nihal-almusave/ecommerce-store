'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { User, Mail, Phone, Save, LogOut } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const auth = localStorage.getItem('userAuth');
    const userDataStr = localStorage.getItem('userData');

    if (auth !== 'true' || !userDataStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Validate
      if (!formData.name || !formData.email) {
        setError('Name and email are required');
        setIsSaving(false);
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          name: formData.name,
          phone: formData.phone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      if (data.success) {
        // Update local storage
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">My Account</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-black">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.email}</p>
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.phone || 'Not set'}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                      });
                      setError('');
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-black mb-6">Account Actions</h2>
            <div className="space-y-4">
              <Link
                href="/orders"
                className="block px-6 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition"
              >
                View My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

