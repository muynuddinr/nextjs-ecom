'use client';

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Delivery Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Track order number..."
              className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Track
            </button>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option>All Shipments</option>
            <option>In Transit</option>
            <option>Delivered</option>
            <option>Pending</option>
          </select>
        </div>
        {/* Delivery Status List Placeholder */}
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order #12345</h3>
                  <p className="text-gray-600">In Transit</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 