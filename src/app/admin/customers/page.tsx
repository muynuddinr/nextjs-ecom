'use client';
import { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import Image from 'next/image';

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    landmark: string;
    city: string;
    state: string;
    pinCode: string;
  };
  photo: string;
  isActive: boolean;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filterCustomers = useCallback(() => {
    if (statusFilter === 'all') {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(customers.filter(customer => 
        statusFilter === 'active' ? customer.isActive : !customer.isActive
      ));
    }
  }, [statusFilter, customers]);

  const calculateStats = useCallback(() => {
    setStats({
      total: customers.length,
      active: customers.filter(customer => customer.isActive).length,
      inactive: customers.filter(customer => !customer.isActive).length
    });
  }, [customers]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [filterCustomers]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  useEffect(() => {
    console.log('Filtered customers:', filteredCustomers);
  }, [filteredCustomers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.customers);
      } else {
        console.error('Failed to fetch customers:', data.error);
        alert('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          isActive: !currentStatus 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer._id === id 
              ? { ...customer, isActive: !currentStatus } 
              : customer
          )
        );
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update customer status');
    }
  };

  const CustomerDetailsModal = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {selectedCustomer.photo ? (
                <Image 
                  src={selectedCustomer.photo} 
                  alt={selectedCustomer.fullName}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold">{selectedCustomer.fullName}</h3>
                <p className="text-gray-600">{selectedCustomer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <p>Phone: {selectedCustomer.phone}</p>
                <p>Email: {selectedCustomer.email}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${selectedCustomer.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'}`}>
                  {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p>{selectedCustomer.address?.street}</p>
              <p>{selectedCustomer.address?.landmark}</p>
              <p>
                {selectedCustomer.address?.city}, {selectedCustomer.address?.state}
              </p>
              <p>PIN: {selectedCustomer.address?.pinCode}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Account Information</h4>
              <p>Member since: {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Customers</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Active Customers</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Inactive Customers</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.inactive}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Customers List</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{customer.address?.street}</div>
                    <div className="text-sm text-gray-500">{customer.address?.landmark}</div>
                    <div className="text-sm text-gray-500">
                      {customer.address?.city}, {customer.address?.state}
                    </div>
                    <div className="text-sm text-gray-500">PIN: {customer.address?.pinCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(customer._id, customer.isActive)}
                      className={`px-3 py-1 rounded-full text-sm font-medium
                        ${customer.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
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
      {showModal && <CustomerDetailsModal />}
    </div>
  );
} 