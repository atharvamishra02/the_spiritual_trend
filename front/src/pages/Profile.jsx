import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage || 'https://via.placeholder.com/150x150/666666/FFFFFF?text=User');
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobile: user.mobile || '',
        email: user.email || '',
        address: {
          address1: user.address?.address1 || '',
          address2: user.address?.address2 || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || ''
        }
      });
      // Construct full URL for profile image
      const imageUrl = user.profileImage 
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${user.profileImage}`
        : 'https://via.placeholder.com/150x150/666666/FFFFFF?text=User';
      setProfileImage(imageUrl);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-yellow-500">Please Log In</h1>
          <p className="text-lg mb-6">You need to be logged in to view your profile.</p>
          <motion.button
            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/loginpage')}
          >
            Log In
          </motion.button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local user state
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMessage('Error updating profile.');
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size should be less than 5MB.');
        return;
      }
      
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
      setMessage(''); // Clear any previous error messages
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setLoading(true);
    setImageLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/users/upload-profile-image`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      
      const imageUrl = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${res.data.url}`;
      setProfileImage(imageUrl);
      
      // Update local user state
      const updatedUser = { ...user, profileImage: res.data.url };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile image updated successfully!');
      setImageFile(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setMessage('Error uploading image. Please try again.');
    }
    setLoading(false);
    setImageLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 md:pt-44 md:pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-8">
            <h1 className="text-3xl font-bold text-center">My Profile</h1>
          </div>

          <div className="p-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-yellow-400 bg-gray-800 shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x150/666666/FFFFFF?text=User';
                  }}
                />
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-yellow-500 text-black p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition-all">
                  <FaCamera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                  />
                </label>
              </div>
              
              {imageFile && (
                <motion.button
                  onClick={handleImageUpload}
                  className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Upload Image'}
                </motion.button>
              )}
            </div>

            {/* Profile Form */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                  <FaUser className="mr-2" />
                  Personal Information
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1 flex items-center">
                    <FaEnvelope className="mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email should not be editable
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1 flex items-center">
                    <FaPhone className="mr-2" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  />
                </div>
      </div>

              {/* Address Information */}
      <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  Address Information
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="address.address1"
                    value={formData.address.address1}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="address.address2"
                    value={formData.address.address2}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                    />
                  </div>
                </div>

        <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Pincode</label>
          <input
            type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 disabled:opacity-50"
          />
        </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {!isEditing ? (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-600 transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSave className="mr-2" />
                  Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button
          onClick={handleSave}
                    className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-600 transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
                    <FaSave className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data to original values
                      setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        mobile: user.mobile || '',
                        email: user.email || '',
                        address: {
                          address1: user.address?.address1 || '',
                          address2: user.address?.address2 || '',
                          city: user.address?.city || '',
                          state: user.address?.state || '',
                          pincode: user.address?.pincode || ''
                        }
                      });
                    }}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </>
              )}
              
              <motion.button
                onClick={logout}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-all flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </motion.button>
            </div>

            {message && (
              <div className="mt-4 text-center text-sm p-3 rounded-lg bg-yellow-500 bg-opacity-20 text-yellow-400">
                {message}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;