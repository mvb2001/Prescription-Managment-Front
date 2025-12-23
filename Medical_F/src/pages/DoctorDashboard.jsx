import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PatientList from '../components/PatientList';
import RegisterPatient from '../components/RegisterPatient';
import RegisterPharmacist from '../components/RegisterPharmacist';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('patients');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
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
          {/* Header with Tabs */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-3xl font-bold text-white">Manage Patients & Staff</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  activeTab === 'patients'
                    ? 'bg-white text-teal-700'
                    : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
                }`}
              >
                My Patients
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  activeTab === 'register'
                    ? 'bg-white text-teal-700'
                    : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
                }`}
              >
                Register Patient
              </button>
              <button
                onClick={() => setActiveTab('pharmacist')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  activeTab === 'pharmacist'
                    ? 'bg-white text-teal-700'
                    : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
                }`}
              >
                Register Pharmacist
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="p-8 min-h-screen bg-gray-50">
            {activeTab === 'patients' && (
              <div className="animate-fade-in">
                <PatientList />
              </div>
            )}
            {activeTab === 'register' && (
              <div className="animate-fade-in">
                <RegisterPatient />
              </div>
            )}
            {activeTab === 'pharmacist' && (
              <div className="animate-fade-in">
                <RegisterPharmacist />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;