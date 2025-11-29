'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'TANNARO',
    email: 'tannaro.contract@gmail.com',
    phone: '01572915263',
    shippingInsideDhaka: 60,
    shippingOutsideDhaka: 120,
    currency: 'BDT',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings save
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-2">Manage website settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inside Dhaka Shipping Cost (৳)
                </label>
                <input
                  type="number"
                  value={settings.shippingInsideDhaka}
                  onChange={(e) => setSettings({ ...settings, shippingInsideDhaka: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outside Dhaka Shipping Cost (৳)
                </label>
                <input
                  type="number"
                  value={settings.shippingOutsideDhaka}
                  onChange={(e) => setSettings({ ...settings, shippingOutsideDhaka: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

