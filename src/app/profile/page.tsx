'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Image from 'next/image';

interface Address {
  street: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: Address;
  photo: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/customer-login');
      return;
    }
    const parsedUser = JSON.parse(user);
    console.log('Parsed user:', parsedUser);
    setUserData(parsedUser);
    setEditedData(parsedUser);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedData(prev => ({
        ...prev!,
        [parent]: { ...(prev![parent as keyof typeof prev] as object), [child]: value }
      }));
    } else {
      setEditedData(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    
    // Add the old image URL if it exists
    if (editedData?.photo) {
      formData.append('oldImageUrl', editedData.photo);
    }

    try {
      const uploadResponse = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      
      if (uploadData.success) {
        // Update user data with new photo URL
        const token = localStorage.getItem('token');
        const updateResponse = await fetch('/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...editedData,
            photo: uploadData.url
          })
        });

        if (!updateResponse.ok) {
          throw new Error(`Profile update failed: ${updateResponse.status}`);
        }

        const updateData = await updateResponse.json();
        
        if (updateData.success) {
          setEditedData(prev => ({
            ...prev!,
            photo: uploadData.url
          }));
          localStorage.setItem('user', JSON.stringify({
            ...editedData,
            photo: uploadData.url
          }));
        } else {
          throw new Error(updateData.message || 'Failed to update profile');
        }
      } else {
        throw new Error(uploadData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error:', error);
      setPhotoPreview(null);
      alert(error instanceof Error ? error.message : 'Failed to update profile picture. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/customer-login');
        return;
      }

      console.log('Sending update data:', editedData); // Debug log

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });

      const data = await response.json();
      console.log('Update response:', data); // Debug log

      if (data.success) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        setUserData(data.user);
        setIsEditing(false);
        setPhotoPreview(null);
        // Force a page refresh to update the navbar
        window.location.reload();
      } else {
        console.error('Failed to update profile:', data.message);
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile');
    }
  };

  // Add this to display the profile image
  const profileImage = photoPreview || editedData?.photo || '/default-avatar.png';

  if (!userData || !editedData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(userData);
                  setPhotoPreview(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={profileImage}
                alt="Profile"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="rounded-full object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <FaCamera />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>
            <h2 className="text-2xl font-semibold">{editedData?.fullName}</h2>
            <p className="text-gray-600">{editedData?.email}</p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editedData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editedData.phone}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-gray-400 w-5 h-5" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-gray-400 w-5 h-5" />
                      <span>{userData.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="address.street"
                    value={editedData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    name="address.landmark"
                    value={editedData.address.landmark}
                    onChange={handleInputChange}
                    placeholder="Landmark"
                    className="w-full border rounded px-3 py-2"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.city"
                      value={editedData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={editedData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <input
                    type="text"
                    name="address.pinCode"
                    value={editedData.address.pinCode}
                    onChange={handleInputChange}
                    placeholder="PIN Code"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-gray-400 w-5 h-5 mt-1" />
                  <div>
                    <p>{userData.address.street}</p>
                    {userData.address.landmark && (
                      <p className="text-gray-600">Near {userData.address.landmark}</p>
                    )}
                    <p>{userData.address.city}, {userData.address.state}</p>
                    <p>PIN: {userData.address.pinCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 