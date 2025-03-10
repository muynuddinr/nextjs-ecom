'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaStore, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, 
} from 'react-icons/fa';
import Image from 'next/image';

export default function ResellerLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      landmark: '',
      city: '',
      state: '',
      pinCode: '',
    },
    photo: '',
    storeDetails: {
      storeName: '',
      description: '',
      category: '',
      openingTime: '',
      closingTime: '',
      storeAddress: {
        street: '',
        landmark: '',
        city: '',
        state: '',
        pinCode: '',
      }
    },
    gstNumber: '',
    panNumber: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: '',
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (keys.length === 2) {
      const [parent, child] = keys;
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as object), [child]: value }
      }));
    } else if (keys.length === 3) {
      const [parent, child, grandChild] = keys;
      setFormData(prev => {
        const parentObj = (prev[parent as keyof typeof prev] as unknown) as { [key: string]: { [key: string]: string } };
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: {
              ...parentObj[child],
              [grandChild]: value
            }
          }
        };
      });
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
          setFormData(prev => ({ ...prev, photo: data.url }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure all nested objects are properly structured
      const formDataToSubmit = {
        ...formData,
        storeDetails: {
          ...formData.storeDetails,
          storeAddress: {
            street: formData.storeDetails.storeAddress.street || '',
            landmark: formData.storeDetails.storeAddress.landmark || '',
            city: formData.storeDetails.storeAddress.city || '',
            state: formData.storeDetails.storeAddress.state || '',
            pinCode: formData.storeDetails.storeAddress.pinCode || ''
          }
        }
      };

      console.log('Submitting form data:', {
        action: isLogin ? 'login' : 'signup',
        ...formDataToSubmit
      });

      const response = await fetch('/api/auth/reseller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'signup',
          ...formDataToSubmit
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/reseller/dashboard');
      } else {
        alert(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An error occurred while processing your request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <FaStore className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back Reseller!' : 'Join Our Reseller Network'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Sign in to your reseller account' : 'Create your reseller account to start selling'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative inline-block group">
                      <div className="w-32 h-32 rounded-full border-4 border-blue-100 flex items-center justify-center overflow-hidden">
                        {photoPreview ? (
                          <Image 
                            src={photoPreview}
                            alt="Profile Preview"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaCamera className="h-12 w-12 text-blue-300" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address.street"
                      placeholder="Street Address"
                      required
                      className="block w-full border-gray-300 rounded-lg shadow-sm"
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="address.landmark"
                      placeholder="Landmark"
                      className="block w-full border-gray-300 rounded-lg shadow-sm"
                      onChange={handleInputChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="address.city"
                        placeholder="City"
                        required
                        className="block w-full border-gray-300 rounded-lg shadow-sm"
                        onChange={handleInputChange}
                      />
                      <select
                        name="address.state"
                        required
                        className="block w-full border-gray-300 rounded-lg shadow-sm"
                        onChange={handleInputChange}
                      >
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      name="address.pinCode"
                      placeholder="PIN Code"
                      required
                      pattern="[0-9]{6}"
                      className="block w-full border-gray-300 rounded-lg shadow-sm"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Store Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaStore className="mr-2 text-blue-600" /> 
                    Store Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Store Name</label>
                      <input
                        type="text"
                        name="storeDetails.storeName"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Store Description</label>
                      <textarea
                        name="storeDetails.description"
                        required
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Store Category</label>
                      <select
                        name="storeDetails.category"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleInputChange}
                      >
                        <option value="">Select Category</option>
                        <option value="clothing">Clothing</option>
                        <option value="electronics">Electronics</option>
                        <option value="food">Food & Beverages</option>
                        <option value="furniture">Furniture</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Opening Time</label>
                        <input
                          type="time"
                          name="storeDetails.openingTime"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Closing Time</label>
                        <input
                          type="time"
                          name="storeDetails.closingTime"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Address */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-600" /> 
                    Store Location
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="storeDetails.storeAddress.street"
                      placeholder="Street Address"
                      required
                      className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="storeDetails.storeAddress.landmark"
                      placeholder="Landmark"
                      className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleInputChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="storeDetails.storeAddress.city"
                        placeholder="City"
                        required
                        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleInputChange}
                      />
                      <select
                        name="storeDetails.storeAddress.state"
                        required
                        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleInputChange}
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      name="storeDetails.storeAddress.pinCode"
                      placeholder="PIN Code"
                      required
                      pattern="[0-9]{6}"
                      className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Login Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
