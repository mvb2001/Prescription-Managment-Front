import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API's
export const authAPI = {
  loginDoctor: (credentials) => api.post('/api/auth/login', credentials),
  signupDoctor: (data) => api.post('/api/auth/signup/doctor', data),
  signupPharmacist: (data) => api.post('/api/auth/signup/pharmacist', data),
};

// Patient API
export const patientAPI = {
  getAllPatients: () => api.get('/api/patient/all'),
  registerPatient: (patientData) => api.post('/api/patient/register', patientData),
  createPrescription: (patientId, prescriptionData) => 
    api.post(`/api/patient/${patientId}/prescriptions`, prescriptionData),
  getPrescriptions: (patientId) => 
    api.get(`/api/patient/${patientId}/prescriptions`),
};

// Pharmacist API
export const pharmacistAPI = {
  getAllPrescriptions: () => api.get('/pharmacist/prescriptions'),
};

export default api;
