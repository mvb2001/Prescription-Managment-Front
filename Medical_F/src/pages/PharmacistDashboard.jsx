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

  const handlePrintSingle = (prescription, index) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription #${index + 1}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0d9488;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #0d9488;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .prescription-number {
            background: #0d9488;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 20px;
            font-weight: bold;
            font-size: 18px;
          }
          .content {
            border: 2px solid #d1d5db;
            border-radius: 12px;
            padding: 30px;
            background: #f9fafb;
          }
          .field-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
            margin-bottom: 20px;
          }
          .field {
            margin-bottom: 15px;
          }
          .field-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .field-value {
            font-size: 16px;
            color: #111827;
            font-weight: 500;
          }
          .medicine-field {
            background: #e0f2f1;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0d9488;
          }
          .medicine-field .field-value {
            font-size: 18px;
            font-weight: 700;
            color: #0d9488;
          }
          .full-width {
            grid-column: span 2;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #d1d5db;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Prescription</h1>
          <p>Pharmacist: ${user?.email || 'N/A'}</p>
          <p>Print Date: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div class="prescription-number">Prescription #${index + 1}</div>
        
        <div class="content">
          <div class="field-group">
            <div class="field">
              <div class="field-label">Date</div>
              <div class="field-value">${new Date(prescription.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Patient Name</div>
              <div class="field-value">${prescription.patient?.firstName || ''} ${prescription.patient?.lastName || ''}</div>
            </div>
            
            <div class="field">
              <div class="field-label">NIC</div>
              <div class="field-value">${prescription.patient?.nic || 'N/A'}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Medical Issue</div>
              <div class="field-value">${prescription.medicineIssue || '-'}</div>
            </div>
            
            <div class="field full-width medicine-field">
              <div class="field-label">Medicine to Get</div>
              <div class="field-value">${prescription.medicineToGet || '-'}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Tests Required</div>
              <div class="field-value">${prescription.testNeed || '-'}</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an official medical prescription document</p>
          <p>Digital px powered by MB group</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleDelete = async (prescriptionId) => {
    if (window.confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
      try {
        await pharmacistAPI.deletePrescription(prescriptionId);
        // Remove from local state
        setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId));
      } catch (err) {
        setError('Failed to delete prescription');
      }
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
      prescription.medicineIssue?.toLowerCase().includes(searchLower) ||
      prescription.testNeed?.toLowerCase().includes(searchLower)
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
              className="bg-red-500 text-white hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
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
                {filteredPrescriptions.map((prescription, index) => (
                  <div
                    key={prescription.id}
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200"
                  >
                    {/* Header with Print Button */}
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
                      <h3 className="text-lg font-bold text-teal-700">Prescription #{index + 1}</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePrintSingle(prescription, index)}
                          className="bg-teal-600 text-white hover:bg-teal-700 px-6 py-2.5 rounded-lg font-semibold shadow-md transition transform hover:scale-105 flex items-center gap-2"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print
                        </button>
                        <button
                          onClick={() => handleDelete(prescription.id)}
                          className="bg-red-600 text-white hover:bg-red-700 px-6 py-2.5 rounded-lg font-semibold shadow-md transition transform hover:scale-105 flex items-center gap-2"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Patient Name</p>
                        <p className="font-semibold text-gray-900">
                          {prescription.patient?.firstName} {prescription.patient?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">NIC</p>
                        <p className="font-medium text-gray-800">{prescription.patient?.nic || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Medical Issue</p>
                        <p className="font-medium text-gray-900">{prescription.medicineIssue || '-'}</p>
                      </div>
                      <div className="print:col-span-2">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Medicine to Get</p>
                        <p className="font-semibold text-teal-700 print:text-black print:font-bold print:text-lg">{prescription.medicineToGet || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tests Required</p>
                        <p className="font-medium text-gray-900">{prescription.testNeed || '-'}</p>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Additional Notes</p>
                        <p className="font-medium text-gray-900">{prescription.note || '-'}</p>
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