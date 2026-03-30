import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PatientList from '../components/PatientList';
import RegisterPatient from '../components/RegisterPatient';
import RegisterPharmacist from '../components/RegisterPharmacist';
import DoctorChatbot from '../components/DoctorChatbot';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('patients');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900">
      {/* Elegant animated wave background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
        </div>

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.4) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.35) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-xl relative z-10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
              <p className="text-teal-100 text-sm mt-1">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-700 px-8 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-8 py-10 relative z-10">
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
              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  activeTab === 'assistant'
                    ? 'bg-white text-teal-700'
                    : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
                }`}
              >
                AI Assistant
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
            {activeTab === 'assistant' && (
              <div className="animate-fade-in">
                <DoctorChatbot />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx global>{`
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 600px;
          background: linear-gradient(transparent, rgba(255,255,255,0.8));
          border-radius: 50%;
          animation: wave 15s linear infinite;
        }
        .wave1 { animation-duration: 25s; background: radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(34,211,238,0.4) 40%, transparent 70%); }
        .wave2 { animation-duration: 20s; animation-delay: -5s; background: radial-gradient(circle, rgba(20,184,166,0.55) 0%, rgba(16,185,129,0.35) 40%, transparent 70%); }
        .wave3 { animation-duration: 18s; animation-delay: -10s; background: radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(6,182,212,0.3) 40%, transparent 70%); height: 500px; }
        .wave4 { animation-duration: 22s; animation-delay: -2s; background: radial-gradient(circle, rgba(16,185,129,0.45) 0%, rgba(20,184,166,0.25) 40%, transparent 70%); height: 700px; }

        @keyframes wave {
          0% { transform: translateX(0) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
          100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }

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