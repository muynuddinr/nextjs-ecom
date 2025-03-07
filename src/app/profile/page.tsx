'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCamera } from 'react-icons/fa';
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        
        if (data.success) {
          setEditedData(prev => ({ ...prev!, photo: data.filePath }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedData)
      });

      const data = await response.json();
      if (data.success) {
        setUserData(editedData);
        localStorage.setItem('user', JSON.stringify(editedData));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!userData || !editedData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <FaEdit className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="space-x-4">
              <button 
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(userData);
                  setPhotoPreview(null);
                }}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Profile Photo */}
          <div className="flex items-center space-x-6 mb-8 pb-6 border-b">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {(isEditing && photoPreview) ? (
                  <Image 
                    src={photoPreview}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userData.photo ? (
                    <Image 
                      src={userData.photo}
                      alt={userData.fullName}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-gray-400" />
                  )
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer">
                  <FaCamera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={editedData.fullName}
                  onChange={handleInputChange}
                  className="text-2xl font-semibold border rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-2xl font-semibold">{userData.fullName}</h2>
              )}
              <p className="text-gray-600">{userData.role}</p>
            </div>
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