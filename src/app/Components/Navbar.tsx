"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

interface User {
  fullName: string;
  photo: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [navItems, setNavItems] = useState([
    { title: 'Men', path: '/mens' },
    { title: 'Women', path: '/womens' },
    { title: 'Kids', path: '/kids' },
    { title: 'New Arrivals', path: '/new-arrivals' }
  ]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const res = await fetch('/api/admin/navigation');
        const data = await res.json();
        if (data.success) {
          setNavItems(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch navigation items:', error);
      }
    };
    fetchNavItems();
  }, []);

  return (
    <nav className="bg-white text-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition duration-300">
              ShopName
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-gray-700 hover:text-blue-600 hover:scale-105 transition duration-300 font-medium"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 rounded-full border-2 border-gray-200 bg-gray-50
                         focus:outline-none focus:border-blue-500 focus:bg-white transition duration-300
                         text-gray-800 placeholder-gray-500"
              />
              <FaSearch className="absolute right-4 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition duration-300 relative">
              <FaShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs
                             animate-pulse">
                0
              </span>
            </Link>
            <div className="relative" ref={accountMenuRef}>
              <button
                className="flex items-center space-x-2"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {user?.photo ? (
                    <Image 
                      src={user.photo} 
                      alt={user.fullName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
              </button>
              
              {/* Enhanced Account Mega Menu */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl py-4 z-50 border border-gray-100">
                  {user ? (
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                          <Image 
                            src={user.photo} 
                            alt={user.fullName}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-gray-500">View Profile</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('user');
                          localStorage.removeItem('token');
                          setUser(null);
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-300"
                      >
                        <div className="p-2 bg-red-100 rounded-lg mr-3">
                          <FaSignOutAlt className="h-5 w-5 text-red-600" />
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Link
                        href="/customer-login"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                                  transition duration-300 group"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 mr-3">
                          <FaUser className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Customer Login</p>
                          <p className="text-sm text-gray-500">Shop and manage your orders</p>
                        </div>
                      </Link>
                      <Link
                        href="/seller-login"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                                  transition duration-300 group"
                      >
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 mr-3">
                          <FaUser className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Seller Portal</p>
                          <p className="text-sm text-gray-500">Manage your store</p>
                        </div>
                      </Link>
                      <Link
                        href="/reseller-login"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                                  transition duration-300 group"
                      >
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 mr-3">
                          <FaUser className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Reseller Portal</p>
                          <p className="text-sm text-gray-500">Access wholesale options</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              className="md:hidden text-gray-700 hover:text-blue-600 transition duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border rounded-lg mt-2 mb-4 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 rounded-full border-2 border-gray-200
                         focus:outline-none focus:border-blue-600 transition duration-300
                         text-gray-800 placeholder-gray-500 mb-2 hover:border-blue-400"
              />
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-300"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
