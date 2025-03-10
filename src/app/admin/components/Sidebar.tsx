"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaThLarge, FaUsers, FaStore, FaShoppingBag,
  FaListAlt, FaShoppingCart, FaTruck, FaBlog,
  FaEnvelope, FaNewspaper, FaSignOutAlt, FaList
} from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: FaThLarge, path: '/admin/dashboard' },
    { name: 'Resellers', icon: FaUsers, path: '/admin/resellers' },
    { name: 'Sellers', icon: FaStore, path: '/admin/sellers' },
    { name: 'Customers', icon: FaUsers, path: '/admin/customers' },
    { name: 'Navigation', icon: FaList, path: '/admin/navigation' },
    { name: 'Products', icon: FaShoppingBag, path: '/admin/products' },
    { name: 'Categories', icon: FaListAlt, path: '/admin/categories' },
    { name: 'Orders', icon: FaShoppingCart, path: '/admin/orders' },
    { name: 'Delivery', icon: FaTruck, path: '/admin/delivery' },
    { name: 'Blogs', icon: FaBlog, path: '/admin/blogs' },
    { name: 'Contact', icon: FaEnvelope, path: '/admin/contact' },
    { name: 'Newsletter', icon: FaNewspaper, path: '/admin/newsletter' },
   
  ];

  return (
    <div className="w-64 bg-white h-full shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
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
          onClick={() => {/* Add logout logic here */}}
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