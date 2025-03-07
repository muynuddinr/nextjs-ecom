export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
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
        {/* Add orders table here */}
      </div>
    </div>
  );
} 