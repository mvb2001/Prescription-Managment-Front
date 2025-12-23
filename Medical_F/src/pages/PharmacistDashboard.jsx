import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pharmacistAPI } from '../services/api';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await pharmacistAPI.getAllPrescriptions();
      setPrescriptions(response.data);
    } catch (err) {
      setError('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      prescription.patient?.firstName?.toLowerCase().includes(searchLower) ||
      prescription.patient?.lastName?.toLowerCase().includes(searchLower) ||
      prescription.patient?.nic?.toLowerCase().includes(searchLower) ||
      prescription.medicineToGet?.toLowerCase().includes(searchLower) ||
      prescription.medicineIssue?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Pharmacist Dashboard</h1>
              <p className="text-teal-100 text-sm mt-1">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <h2 className="text-3xl font-bold text-white">All Prescriptions</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, NIC, or medicine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-96 pl-12 pr-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-teal-300 outline-none text-gray-800 placeholder-gray-500 shadow-inner"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={loadPrescriptions}
                  className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-md transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent"></div>
                <p className="mt-6 text-lg text-gray-600">Loading prescriptions...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {!loading && filteredPrescriptions.length === 0 && !error && (
              <div className="text-center py-20">
                <div className="mx-auto w-32 h-32 text-gray-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-600">No prescriptions found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or refresh the list.</p>
              </div>
            )}

            {!loading && filteredPrescriptions.length > 0 && (
              <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-semibold text-gray-900">
                          {prescription.patient?.firstName} {prescription.patient?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">NIC</p>
                        <p className="font-medium text-gray-800">{prescription.patient?.nic || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Medicine</p>
                        <p className="font-medium text-gray-900">{prescription.medicineIssue || prescription.medicineToGet}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Note</p>
                        <p className="text-gray-700 italic">{prescription.note || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;