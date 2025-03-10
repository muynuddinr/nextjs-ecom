'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaThLarge, FaUser, FaShoppingBag, FaListAlt, 
  FaShoppingCart, FaTruck, FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setStoreName(user.storeDetails?.storeName || 'My Store');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/reseller-login');
  };

  const navItems = [
    { name: 'Dashboard', icon: FaThLarge, path: '/reseller/dashboard' },
    { name: 'Profile', icon: FaUser, path: '/reseller/profile' },
    { name: 'Products', icon: FaShoppingBag, path: '/reseller/products' },
    { name: 'Categories', icon: FaListAlt, path: '/reseller/categories' },
    { name: 'Orders', icon: FaShoppingCart, path: '/reseller/orders' },
    { name: 'Delivery', icon: FaTruck, path: '/reseller/delivery' },
  ];

  return (
    <div className="w-64 bg-white h-full shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">{storeName}</h1>
        <p className="text-sm text-gray-600 mt-1">Reseller Panel</p>
      </div>
      
      <nav className="mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200
              ${pathname === item.path ? 'bg-blue-50 text-blue-600' : ''}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 w-full"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar; 