'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Store,
  Heart,
  Package,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, toggleCart } from '@/contexts/CartContext';
import NotificationDropdown from './NotificationDropdown';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { state: authState, logout } = useAuth();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleCartClick = () => {
    toggleCart(cartDispatch);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-reverse space-x-4">
            <Link href="/" className="flex items-center space-x-reverse space-x-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">فروشگاه‌ساز مال</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-reverse space-x-8 mr-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                خانه
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                دسته‌بندی‌ها
              </Link>
              <Link href="/stores" className="text-gray-700 hover:text-blue-600 font-medium">
                فروشگاه‌ها
              </Link>
              <Link href="/deals" className="text-gray-700 hover:text-blue-600 font-medium">
                تخفیف‌ها
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجوی محصولات، فروشگاه‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            {/* Mobile search toggle */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notifications (authenticated users only) */}
            {authState.isAuthenticated && <NotificationDropdown />}

            {/* Wishlist (authenticated users only) */}
            {authState.isAuthenticated && (
              <Link href="/wishlist" className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Heart className="h-6 w-6 text-gray-600" />
              </Link>
            )}

            {/* Shopping Cart */}
            <button
              onClick={handleCartClick}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -left-1 h-5 w-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartState.itemCount > 99 ? '99+' : cartState.itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {authState.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-reverse space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {authState.user?.firstName?.charAt(0) || 'ک'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {authState.user?.firstName}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {authState.user?.firstName} {authState.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{authState.user?.email}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 ml-3" />
                        پروفایل
                      </Link>
                      
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 ml-3" />
                        سفارش‌ها
                      </Link>

                      {authState.user?.profile?.isStoreOwner && (
                        <Link
                          href="/seller/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Store className="h-4 w-4 ml-3" />
                          پنل فروشنده
                        </Link>
                      )}

                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 ml-3" />
                        تنظیمات
                      </Link>

                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 ml-3" />
                          خروج
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-reverse space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  عضویت
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی محصولات، فروشگاه‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            />
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="space-y-4">
              <Link
                href="/"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                خانه
              </Link>
              <Link
                href="/categories"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                دسته‌بندی‌ها
              </Link>
              <Link
                href="/stores"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                فروشگاه‌ها
              </Link>
              <Link
                href="/deals"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                تخفیف‌ها
              </Link>
              
              {authState.isAuthenticated && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    href="/profile"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    پروفایل
                  </Link>
                  <Link
                    href="/orders"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    سفارش‌ها
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    علاقه‌مندی‌ها
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;