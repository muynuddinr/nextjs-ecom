'use client';
import { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import type { Reseller } from '@/types';

export default function ResellersPage() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredResellers, setFilteredResellers] = useState<Reseller[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const filterResellers = useCallback(() => {
    if (statusFilter === 'all') {
      setFilteredResellers(resellers);
    } else {
      setFilteredResellers(resellers.filter(reseller => 
        statusFilter === 'active' ? reseller.isActive : !reseller.isActive
      ));
    }
  }, [statusFilter, resellers]);

  const calculateStats = useCallback(() => {
    setStats({
      total: resellers.length,
      active: resellers.filter(reseller => reseller.isActive).length,
      inactive: resellers.filter(reseller => !reseller.isActive).length
    });
  }, [resellers]);

  const fetchResellers = async () => {
    try {
      const response = await fetch('/api/admin/resellers');
      const data = await response.json();
      if (data.success) {
        setResellers(data.resellers);
      }
    } catch (error) {
      console.error('Error fetching resellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (resellerId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/resellers/${resellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (response.ok) {
        setResellers(resellers.map(reseller => 
          reseller._id === resellerId ? { ...reseller, isActive: !currentStatus } : reseller
        ));
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  useEffect(() => {
    fetchResellers();
  }, []);

  useEffect(() => {
    filterResellers();
    calculateStats();
  }, [statusFilter, resellers, filterResellers, calculateStats]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Resellers Management</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Resellers</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700">Active Resellers</h2>
          <p className="text-4xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700">Inactive Resellers</h2>
          <p className="text-4xl font-bold text-red-600">{stats.inactive}</p>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Resellers List</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Profile Photo</th>
              <th className="px-6 py-3 text-left">Full Name</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Store Details</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredResellers.map((reseller) => (
              <tr key={reseller._id}>
                <td className="px-6 py-4">
                  <Image
                    src={reseller.photo || '/default-avatar.png'}
                    alt={`${reseller.fullName}'s profile picture`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </td>
                <td className="px-6 py-4">{reseller.fullName}</td>
                <td className="px-6 py-4">
                  <div>{reseller.email}</div>
                  <div className="text-sm text-gray-500">{reseller.phone}</div>
                </td>
                <td className="px-6 py-4">
                  {reseller.storeDetails?.storeName || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(reseller._id, reseller.isActive)}
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${reseller.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                  >
                    {reseller.isActive ? 'Active' : 'Inactive'}
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