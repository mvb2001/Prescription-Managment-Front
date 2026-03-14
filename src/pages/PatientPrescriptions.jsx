import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { patientAPI } from '../services/api';

const PatientPrescriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient;
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPrescriptions, setExpandedPrescriptions] = useState({});

  useEffect(() => {
    if (!patient) {
      navigate('/doctor/dashboard');
      return;
    }
    loadPrescriptions();
  }, [patient, navigate]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPrescriptions(patient.id);
      setPrescriptions(response.data);
    } catch (err) {
      alert('Failed to load prescriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePrescriptionDetails = (prescriptionId) => {
    setExpandedPrescriptions(prev => ({
      ...prev,
      [prescriptionId]: !prev[prescriptionId]
    }));
  };

  if (!patient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-cyan-50 p-6">
    
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-md p-6 mb-6">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="flex items-center text-white hover:text-gray-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Patient Prescriptions
              </h1>
              <div className="flex items-center space-x-6 text-white">
                <p className="text-lg">
                  <span className="font-semibold">{patient.firstName} {patient.lastName}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">NIC:</span> {patient.nic || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Contact:</span> {patient.contactNumber}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading prescriptions...</p>
          </div>
        )}

        {/* No Prescriptions */}
        {!loading && prescriptions.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-600">This patient doesn't have any prescriptions yet.</p>
          </div>
        )}

        {/* Prescriptions List */}
        {!loading && prescriptions.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                All Prescriptions ({prescriptions.length})
              </h2>
            </div>
            
            <div className="space-y-4">
              {prescriptions.map((prescription) => {
                const isExpanded = expandedPrescriptions[prescription.id];
                return (
                  <div key={prescription.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Prescription Date</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {prescription.createdAt 
                                ? new Date(prescription.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })
                                : (prescription.created_at 
                                  ? new Date(prescription.created_at).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })
                                  : 'N/A')}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => togglePrescriptionDetails(prescription.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-medium"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View All Details'}</span>
                          <svg 
                            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">BP Level</p>
                          <p className="text-lg font-semibold text-gray-800">{prescription.bpLevel || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">FBS Level</p>
                          <p className="text-lg font-semibold text-gray-800">{prescription.fbsLevel || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-xs text-green-700 uppercase font-semibold mb-2">Medicine Prescribed</p>
                          <p className="text-gray-800">{prescription.medicineToGet || 'N/A'}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-xs text-blue-700 uppercase font-semibold mb-2">Doctor's Note</p>
                          <p className="text-gray-800">{prescription.note || 'N/A'}</p>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                          <div>
                            <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              Vital Signs
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-red-50 rounded-lg p-3">
                                <p className="text-xs text-red-700 font-semibold mb-1">Temperature</p>
                                <p className="text-lg font-semibold text-gray-800">
                                  {prescription.bodyTemperature ? `${prescription.bodyTemperature}°C` : 'N/A'}
                                </p>
                              </div>
                              <div className="bg-red-50 rounded-lg p-3">
                                <p className="text-xs text-red-700 font-semibold mb-1">Heart Rate</p>
                                <p className="text-lg font-semibold text-gray-800">
                                  {prescription.heartRate ? `${prescription.heartRate} bpm` : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              Physical Measurements
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-xs text-purple-700 font-semibold mb-1">Height</p>
                                <p className="text-lg font-semibold text-gray-800">
                                  {prescription.height ? `${prescription.height} cm` : 'N/A'}
                                </p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-xs text-purple-700 font-semibold mb-1">Weight</p>
                                <p className="text-lg font-semibold text-gray-800">
                                  {prescription.weight ? `${prescription.weight} kg` : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              Medical Information
                            </h5>
                            <div className="space-y-3">
                              <div className="bg-amber-50 rounded-lg p-3">
                                <p className="text-xs text-amber-700 font-semibold mb-1">Test Needed</p>
                                <p className="text-gray-800">{prescription.testNeed || 'N/A'}</p>
                              </div>
                              <div className="bg-amber-50 rounded-lg p-3">
                                <p className="text-xs text-amber-700 font-semibold mb-1">Allergies</p>
                                <p className="text-gray-800">{prescription.allergies || 'None reported'}</p>
                              </div>
                              <div className="bg-amber-50 rounded-lg p-3">
                                <p className="text-xs text-amber-700 font-semibold mb-1">Medicine Issues</p>
                                <p className="text-gray-800">{prescription.medicineIssue || 'None reported'}</p>
                              </div>
                            </div>
                          </div>

                          {prescription.otherNote && (
                            <div>
                              <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Additional Notes
                              </h5>
                              <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-gray-800">{prescription.otherNote}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
