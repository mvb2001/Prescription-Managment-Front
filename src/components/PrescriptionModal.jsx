import React, { useState } from 'react';
import { patientAPI } from '../services/api';

const PrescriptionModal = ({ patient, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    note: '',
    bpLevel: '',
    fbsLevel: '',
    testNeed: '',
    height: '',
    weight: '',
    bodyTemperature: '',
    heartRate: '',
    allergies: '',
    medicineIssue: '',
    medicineToGet: '',
    otherNote: '',
  });
  const [currentMedicines, setCurrentMedicines] = useState([{ id: Date.now(), name: '', dosage: '', frequency: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addMedicine = () => {
    setCurrentMedicines([...currentMedicines, { id: Date.now(), name: '', dosage: '', frequency: '' }]);
  };

  const removeMedicine = (id) => {
    if (currentMedicines.length > 1) {
      setCurrentMedicines(currentMedicines.filter(med => med.id !== id));
    }
  };

  const handleMedicineChange = (id, field, value) => {
    setCurrentMedicines(currentMedicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format current medicines into a string
      const medicineIssueText = currentMedicines
        .filter(med => med.name.trim())
        .map(med => {
          const parts = [med.name];
          if (med.dosage) parts.push(`Dosage: ${med.dosage}`);
          if (med.frequency) parts.push(`Frequency: ${med.frequency}`);
          return parts.join(' - ');
        })
        .join(' | ');

      const prescriptionData = {
        ...formData,
        medicineIssue: medicineIssueText,
        patientId: patient.id,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        bodyTemperature: formData.bodyTemperature ? parseFloat(formData.bodyTemperature) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
      };

      await patientAPI.createPrescription(patient.id, prescriptionData);
      alert('Prescription created successfully!');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-800">Create Prescription for {patient.firstName} {patient.lastName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Vital Signs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BP Level</label>
                  <input
                    type="text"
                    name="bpLevel"
                    value={formData.bpLevel}
                    onChange={handleChange}
                    placeholder="e.g., 120/80"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">FBS Level</label>
                  <input
                    type="text"
                    name="fbsLevel"
                    value={formData.fbsLevel}
                    onChange={handleChange}
                    placeholder="Fasting blood sugar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Height in cm"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Weight in kg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="bodyTemperature"
                    value={formData.bodyTemperature}
                    onChange={handleChange}
                    placeholder="e.g., 37.0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    placeholder="e.g., 72"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Needed</label>
                  <input
                    type="text"
                    name="testNeed"
                    value={formData.testNeed}
                    onChange={handleChange}
                    placeholder="Required tests"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Known allergies"
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Prescription</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medicine provide</label>
                  <div className="space-y-3">
                    {currentMedicines.map((medicine, index) => (
                      <div key={medicine.id} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={medicine.name}
                            onChange={(e) => handleMedicineChange(medicine.id, 'name', e.target.value)}
                            placeholder="Medicine name"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <input
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(medicine.id, 'dosage', e.target.value)}
                            placeholder="Dosage (e.g., 500mg)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <input
                            type="text"
                            value={medicine.frequency}
                            onChange={(e) => handleMedicineChange(medicine.id, 'frequency', e.target.value)}
                            placeholder="Frequency (e.g., 2x daily)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        {currentMedicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicine(medicine.id)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                            title="Remove medicine"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">+</span>
                      <span>Add New Medicine</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicine to Get *</label>
                  <textarea
                    name="medicineToGet"
                    value={formData.medicineToGet}
                    onChange={handleChange}
                    placeholder="Prescribed medicines"
                    rows="3"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prescription Note *</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="General notes and instructions"
                    rows="3"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Notes</label>
                  <textarea
                    name="otherNote"
                    value={formData.otherNote}
                    onChange={handleChange}
                    placeholder="Additional information"
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white rounded-lg transition duration-200 shadow-md"
            >
              {loading ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
