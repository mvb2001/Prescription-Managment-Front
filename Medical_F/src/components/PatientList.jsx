import React, { useState, useEffect } from 'react';
import { patientAPI } from '../services/api';
import PrescriptionModal from './PrescriptionModal';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [expandedPrescriptions, setExpandedPrescriptions] = useState({});

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
  
  const handleViewPrescriptions = async (patient) => {
    try {
      setLoading(true);
      const response = await patientAPI.getPrescriptions(patient.id);
      setPrescriptions(response.data);
      setSelectedPatient(patient);
      setShowPrescriptionModal(false);
    } catch (err) {
      alert('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = (patient) => {
    setSelectedPatient(patient);
    setPrescriptions([]);
    setShowPrescriptionModal(true);
  };

  const handlePrescriptionCreated = async () => {
    setShowPrescriptionModal(false);
    if (selectedPatient) {
      await handleViewPrescriptions(selectedPatient);
    }
    await loadPatients(); // Reload patient list
  };

  const togglePrescriptionDetails = (prescriptionId) => {
    setExpandedPrescriptions(prev => ({
      ...prev,
      [prescriptionId]: !prev[prescriptionId]
    }));
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">My Patients</h3>
      
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

      {patients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
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
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                >
                  View Prescriptions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPatient && !showPrescriptionModal && prescriptions.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Prescriptions for {selectedPatient.firstName} {selectedPatient.lastName}</h4>
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              const isExpanded = expandedPrescriptions[prescription.id];
              return (
                <div key={prescription.id} className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : (prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : 'N/A')}</p>
                    <button 
                      onClick={() => togglePrescriptionDetails(prescription.id)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      {isExpanded ? 'Hide Details' : 'View All'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <p className="text-sm text-gray-700"><span className="font-medium">BP Level:</span> {prescription.bpLevel || 'N/A'}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">FBS Level:</span> {prescription.fbsLevel || 'N/A'}</p>
                    <p className="text-sm text-gray-700 col-span-2"><span className="font-medium">Medicine:</span> {prescription.medicineToGet || 'N/A'}</p>
                    <p className="text-sm text-gray-700 col-span-2"><span className="font-medium">Note:</span> {prescription.note || 'N/A'}</p>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 mb-2">Vital Signs</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-sm text-gray-600"><span className="font-medium">Temperature:</span> {prescription.bodyTemperature ? `${prescription.bodyTemperature}°C` : 'N/A'}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Heart Rate:</span> {prescription.heartRate ? `${prescription.heartRate} bpm` : 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 mb-2">Physical Measurements</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-sm text-gray-600"><span className="font-medium">Height:</span> {prescription.height ? `${prescription.height} cm` : 'N/A'}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Weight:</span> {prescription.weight ? `${prescription.weight} kg` : 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 mb-2">Medical Information</h5>
                        <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Test Needed:</span> {prescription.testNeed || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Allergies:</span> {prescription.allergies || 'None reported'}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Medicine Issues:</span> {prescription.medicineIssue || 'None reported'}</p>
                      </div>

                      {prescription.otherNote && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-800 mb-2">Additional Notes</h5>
                          <p className="text-sm text-gray-600">{prescription.otherNote}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
