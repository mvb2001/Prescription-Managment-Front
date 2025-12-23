import React, { useState } from 'react';
import { authAPI } from '../services/api';

const RegisterPharmacist = () => {
  const [formData, setFormData] = useState({
    nic: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contact: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Debug: Check if token exists
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    console.log('Token value:', token);

    try {
      const response = await authAPI.signupPharmacist(formData);
      console.log('Pharmacist registration response:', response.data);
      setMessage({ type: 'success', text: 'Pharmacist registered successfully!' });
      setFormData({
        nic: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contact: '',
      });
    } catch (err) {
      console.error('Pharmacist registration error:', err);
      console.error('Error response:', err.response);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.response?.data || 'Failed to register pharmacist',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Register New Pharmacist</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIC *</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="National Identity Card"
              required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact *</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Phone number"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        {message.text && (
          <div className={`px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? 'Registering...' : 'Register Pharmacist'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPharmacist;
