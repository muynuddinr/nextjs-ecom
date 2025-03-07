'use client';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>All Orders</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Completed</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export Orders
          </button>
        </div>
        {/* Orders Table Placeholder */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">#12345</td>
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    Pending
                  </span>
                </td>
                <td className="px-4 py-2">$99.99</td>
                <td className="px-4 py-2">2024-02-20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 