'use client';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Accessories</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New Product
          </button>
        </div>
        {/* Product Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <div className="h-40 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="font-semibold">Product Name</h3>
              <p className="text-gray-600">$99.99</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 