'use client';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface NavigationItem {
  _id: string;
  title: string;
  path: string;
  order: number;
  isActive: boolean;
}

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [newItem, setNewItem] = useState({ title: '', path: '', order: 0 });
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchItems = async () => {
    const res = await fetch('/api/admin/navigation');
    const data = await res.json();
    if (data.success) {
      setItems(data.items);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/navigation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const data = await res.json();
    if (data.success) {
      fetchItems();
      setNewItem({ title: '', path: '', order: 0 });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const res = await fetch('/api/admin/navigation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem),
    });
    const data = await res.json();
    if (data.success) {
      fetchItems();
      setEditingItem(null);
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const res = await fetch(`/api/admin/navigation?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      fetchItems();
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Navigation Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Navigation Item' : 'Add New Navigation Item'}
        </h2>
        <form onSubmit={isEditing ? handleEdit : handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={isEditing ? editingItem?.title : newItem.title}
              onChange={(e) => isEditing 
                ? setEditingItem({...editingItem!, title: e.target.value})
                : setNewItem({...newItem, title: e.target.value})
              }
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Path"
              value={isEditing ? editingItem?.path : newItem.path}
              onChange={(e) => isEditing
                ? setEditingItem({...editingItem!, path: e.target.value})
                : setNewItem({...newItem, path: e.target.value})
              }
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Order"
              value={isEditing ? editingItem?.order : newItem.order}
              onChange={(e) => isEditing
                ? setEditingItem({...editingItem!, order: Number(e.target.value)})
                : setNewItem({...newItem, order: Number(e.target.value)})
              }
              className="px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              {isEditing ? 'Update Item' : 'Add Item'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingItem(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Navigation Items</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500">{item.path}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">Order: {item.order}</span>
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsEditing(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 