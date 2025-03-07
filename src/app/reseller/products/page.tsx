export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Products Catalog</h1>
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
            Download Catalog
          </button>
        </div>
        {/* Add product grid here */}
      </div>
    </div>
  );
} 