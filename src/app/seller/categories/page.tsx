'use client';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Categories Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Electronics', 'Clothing', 'Accessories', 'Home'].map((category) => (
            <div key={category} className="border rounded-lg p-4 hover:bg-blue-50 cursor-pointer">
              <h3 className="font-semibold">{category}</h3>
              <p className="text-gray-600 text-sm">20 products</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 