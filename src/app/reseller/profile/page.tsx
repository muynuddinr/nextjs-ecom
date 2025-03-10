'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaStore, FaEnvelope, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';

interface ResellerData {
  id: string;
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
  storeDetails: {
    storeName: string;
    description: string;
    category: string;
    openingTime: string;
    closingTime: string;
    storeAddress: {
      street: string;
      landmark: string;
      city: string;
      state: string;
      pinCode: string;
    };
  };
  role: string;
}

export default function ResellerProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<ResellerData | null>(null);
  const [editedData, setEditedData] = useState<ResellerData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/reseller-login');
      return;
    }
    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);
    setEditedData(parsedUser);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedData((prev: ResellerData | null) => prev ? {
        ...prev,
        [parent]: { ...(prev[parent as keyof ResellerData] as object), [child]: value }
      } : null);
    } else {
      setEditedData(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/cloudinary', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        
        if (data.success) {
          setEditedData(prev => prev ? { ...prev, photo: data.url } : null);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/reseller-login');
        return;
      }

      const response = await fetch('/api/reseller/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUserData(data.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the profile');
    }
  };

  if (!userData || !editedData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Profile Photo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={photoPreview || editedData.photo || '/default-avatar.png'}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaEnvelope className="mr-2" /> Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editedData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editedData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaStore className="mr-2" /> Store Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Name</label>
                <input
                  type="text"
                  name="storeDetails.storeName"
                  value={editedData.storeDetails?.storeName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="storeDetails.description"
                  value={editedData.storeDetails?.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="storeDetails.category"
                  value={editedData.storeDetails?.category}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Store Address */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Store Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  name="storeDetails.storeAddress.street"
                  value={editedData.storeDetails?.storeAddress?.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="storeDetails.storeAddress.city"
                    value={editedData.storeDetails?.storeAddress?.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="storeDetails.storeAddress.state"
                    value={editedData.storeDetails?.storeAddress?.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                <input
                  type="text"
                  name="storeDetails.storeAddress.pinCode"
                  value={editedData.storeDetails?.storeAddress?.pinCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 