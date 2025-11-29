'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCartItemCount } from '@/lib/cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const auth = localStorage.getItem('userAuth');
    const userDataStr = localStorage.getItem('userData');
    const email = localStorage.getItem('userEmail');
    
    if (auth === 'true') {
      setIsLoggedIn(true);
      
      // Try to get email from userData first, then fallback to userEmail
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setUserEmail(userData.email || userData.name || email || '');
        } catch (e) {
          setUserEmail(email || '');
        }
      } else {
        setUserEmail(email || '');
      }
    }

    // Load cart count
    const updateCartCount = () => {
      setCartCount(getCartItemCount());
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserEmail('');
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#FFF5EC' }}>
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            TANNARO
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <Link href="/products" className="hover:text-gray-600 transition">Shop</Link>
            <Link href="/contact" className="hover:text-gray-600 transition">Contact</Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 md:p-2 hover:bg-gray-100 rounded-full transition min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition">
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm">{userEmail.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block text-sm">Sign In</span>
              </Link>
            )}
            <Link
              href="/cart"
              className="relative p-2.5 md:p-2 hover:bg-gray-100 rounded-full transition min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 pb-4">
            <div className="flex items-center border-b-2 border-black">
              <Search className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search our store"
                className="flex-1 py-2 outline-none"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-1 border-t border-gray-200 pt-4">
            <Link href="/" className="block py-3 px-2 hover:bg-gray-100 rounded transition min-h-[44px] flex items-center">Home</Link>
            <Link href="/products" className="block py-3 px-2 hover:bg-gray-100 rounded transition min-h-[44px] flex items-center">Shop</Link>
            <Link href="/contact" className="block py-3 px-2 hover:bg-gray-100 rounded transition min-h-[44px] flex items-center">Contact</Link>
            {isLoggedIn ? (
              <>
                <Link href="/account" className="block py-3 px-2 hover:bg-gray-100 rounded transition min-h-[44px] flex items-center">My Account</Link>
                <Link href="/orders" className="block py-3 px-2 hover:bg-gray-100 rounded transition min-h-[44px] flex items-center">My Orders</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 px-2 hover:bg-gray-100 rounded transition min-h-[44px] flex items-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block py-3 px-2 hover:bg-gray-100 rounded transition min-h-[44px] flex items-center">Sign In</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

