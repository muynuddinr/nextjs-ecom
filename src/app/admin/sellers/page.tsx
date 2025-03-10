'use client';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Seller } from '@/types';

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/admin/sellers');
      const data = await response.json();
      if (data.success) {
        setSellers(data.sellers);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Sellers Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sellers List</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New Seller
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Business Name</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Store Details</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sellers.map((seller) => (
              <tr key={seller._id}>
                <td className="px-6 py-4">{seller.businessName}</td>
                <td className="px-6 py-4">
                  <div>{seller.email}</div>
                  <div>{seller.phone}</div>
                </td>
                <td className="px-6 py-4">
                  {seller.storeDetails?.name || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded ${seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {seller.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 