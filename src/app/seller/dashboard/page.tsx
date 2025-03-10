'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/seller-login');
      return;
    }

    const user = JSON.parse(userStr);
    setStoreName(user.businessName || 'My Store');
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to {storeName}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Products</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Sales</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">₹0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">This Month</h2>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹0</p>
        </div>
      </div>
    </div>
  );
} 