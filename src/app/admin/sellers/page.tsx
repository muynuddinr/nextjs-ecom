'use client';
import { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import type { Seller } from '@/types'; 

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const filterSellers = useCallback(() => {
    if (statusFilter === 'all') {
      setFilteredSellers(sellers);
    } else {
      setFilteredSellers(sellers.filter(seller => 
        statusFilter === 'active' ? seller.isActive : !seller.isActive
      ));
    }
  }, [statusFilter, sellers]);

  const calculateStats = useCallback(() => {
    setStats({
      total: sellers.length,
      active: sellers.filter(seller => seller.isActive).length,
      inactive: sellers.filter(seller => !seller.isActive).length
    });
  }, [sellers]);

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

  const toggleStatus = async (sellerId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (response.ok) {
        setSellers(sellers.map(seller => 
          seller._id === sellerId ? { ...seller, isActive: !currentStatus } : seller
        ));
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [filterSellers]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Sellers Management</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-500">Total Sellers</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-500">Active Sellers</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-500">Inactive Sellers</div>
          <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Business Logo</th>
              <th className="px-6 py-3 text-left">Business Name</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Store Details</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSellers.map((seller) => (
              <tr key={seller._id}>
                <td className="px-6 py-4">
                  {seller.photo ? (
                    <Image
                      src={seller.photo}
                      alt={`${seller.businessName}'s logo`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xl">
                        {seller.businessName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{seller.businessName}</td>
                <td className="px-6 py-4">
                  <div>{seller.email}</div>
                  <div>{seller.phone}</div>
                </td>
                <td className="px-6 py-4">
                  {seller.storeDetails?.name || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(seller._id, seller.isActive)}
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${seller.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                  >
                    {seller.isActive ? 'Active' : 'Inactive'}
                  </button>
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