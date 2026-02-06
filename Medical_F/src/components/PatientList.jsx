import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';
import PrescriptionModal from './PrescriptionModal';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAllPatients();
      setPatients(response.data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewPrescriptions = (patient) => {
    navigate(`/doctor/patient/${patient.id}/prescriptions`, {
      state: { patient }
    });
  };

  const handleCreatePrescription = (patient) => {
    setSelectedPatient(patient);
    setShowPrescriptionModal(true);
  };

  const handlePrescriptionCreated = async () => {
    setShowPrescriptionModal(false);
    await loadPatients(); // Reload patient list
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const nic = (patient.nic || '').toLowerCase();
    const contact = (patient.contactNumber || '').toLowerCase();
    
    return fullName.includes(query) || 
           nic.includes(query) || 
           contact.includes(query);
  });

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">My Patients</h3>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, NIC, or mobile number..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      )}
      
      {patients.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="mt-4 text-gray-600">No patients registered yet. Use the "Register Patient" tab to add new patients.</p>
        </div>
      )}

      {filteredPatients.length === 0 && patients.length > 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="mt-4 text-gray-600">No patients found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Clear search
          </button>
        </div>
      )}

      {filteredPatients.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredPatients.length} of {patients.length} patient{patients.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-gray-200 border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{`${patient.firstName} ${patient.lastName}`}</h4>
                <p className="text-sm text-gray-600"><span className="font-medium">NIC:</span> {patient.nic || 'N/A'}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Contact:</span> {patient.contactNumber}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Area:</span> {patient.livingArea}</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleCreatePrescription(patient)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium shadow-md"
                >
                  Create Prescription
                </button>
                <button
                  onClick={() => handleViewPrescriptions(patient)}
                  className="w-full bg-white hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                >
                  View Prescriptions
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}

      {showPrescriptionModal && selectedPatient && (
        <PrescriptionModal
          patient={selectedPatient}
          onClose={() => setShowPrescriptionModal(false)}
          onSuccess={handlePrescriptionCreated}
        />
      )}
    </div>
  );
};

export default PatientList;
