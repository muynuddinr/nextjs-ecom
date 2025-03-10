'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaStore, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, FaBuilding, 
  FaCreditCard, FaIdCard, FaPhone 
} from 'react-icons/fa';
import Image from 'next/image';

export default function SellerLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
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
      description: '',
      category: '',
      openingTime: '',
      closingTime: '',
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
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as object), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
      const response = await fetch('/api/auth/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'signup',
          ...formData,
          role: 'seller'
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/seller/dashboard');
        window.location.reload();
      } else {
        alert(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <FaStore className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Join Our Seller Community'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Sign in to manage your store' : 'Create your seller account to start selling'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="text-center">
                  <div className="relative inline-block group">
                    <div className="w-40 h-40 rounded-full border-4 border-blue-100 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50 hover:border-blue-200 transition-all duration-300 shadow-inner">
                      {photoPreview ? (
                        <Image 
                          src={photoPreview}
                          alt={`${formData.businessName || 'Business'} Logo Preview`}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <FaCamera className="h-12 w-12 text-blue-300" />
                          <span className="text-sm text-blue-400 mt-2">Upload Logo</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Upload business logo"
                    />
                    <div className="absolute -bottom-2 right-0 bg-blue-600 rounded-full p-2.5 shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <FaCamera className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaBuilding className="mr-2 text-blue-600" /> 
                        Store Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Business Name</label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <FaStore className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="businessName"
                            required
                            className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Store Description</label>
                        <textarea
                          name="storeDetails.description"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
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

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" /> 
                        Store Location
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Street Address</label>
                          <input
                            type="text"
                            name="address.street"
                            required
                            placeholder="Street name, Building no."
                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Landmark</label>
                          <input
                            type="text"
                            name="address.landmark"
                            placeholder="Near by landmark"
                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                              type="text"
                              name="address.city"
                              required
                              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <select
                              name="address.state"
                              required
                              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              onChange={handleInputChange}
                            >
                              <option value="">Select State</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                          <input
                            type="text"
                            name="address.pinCode"
                            required
                            pattern="[0-9]{6}"
                            placeholder="6-digit PIN code"
                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaIdCard className="mr-2 text-blue-600" /> 
                        Legal Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GST Number</label>
                        <input
                          type="text"
                          name="gstNumber"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                        <input
                          type="text"
                          name="panNumber"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaCreditCard className="mr-2 text-blue-600" /> 
                        Banking Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          name="bankDetails.accountNumber"
                          placeholder="Account Number"
                          required
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="bankDetails.ifscCode"
                          placeholder="IFSC Code"
                          required
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="bankDetails.accountHolderName"
                          placeholder="Account Holder Name"
                          required
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="bankDetails.bankName"
                          placeholder="Bank Name"
                          required
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-6 max-w-md mx-auto">
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
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit phone number"
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300"
              >
                {isLogin ? 'Sign in' : 'Create Seller Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
            >
              {isLogin ? "Don't have a seller account? Register" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
