# 🏥 Medical Prescription Management System - Frontend

A modern, responsive React application for managing medical prescriptions with separate interfaces for doctors and pharmacists.

## ✨ Features

### 👨‍⚕️ For Doctors
- **Secure Authentication** - Login and registration system
- **Patient Management** - Register and view all patients
- **Prescription Creation** - Create detailed prescriptions with:
  - Patient vital signs (BP, temperature, pulse, weight, height)
  - Measurements and symptoms
  - Multiple medicines with dosage and duration
- **Pharmacist Registration** - Onboard new pharmacists to the system
- **Patient History** - View complete prescription history for each patient

### 💊 For Pharmacists
- **View Prescriptions** - Access all prescriptions in the system
- **Advanced Search** - Search by patient name, NIC, or medicine name
- **Prescription Details** - View complete prescription information including patient vitals and medicines

## 🛠️ Tech Stack

- **React 19.2.0** - Latest React with modern features
- **React Router DOM 6.23.1** - Client-side routing with protected routes
- **Axios 1.7.2** - HTTP client for API communication
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **Framer Motion 12.23.26** - Animation library
- **Vite 7.2.4** - Lightning-fast build tool and dev server

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Backend API running on `http://localhost:9090` (or update the URL)

## 🚀 Getting Started

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd Medical_F
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL** (if needed)
   
   Edit `src/services/api.js` and update the base URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:9090';
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |


## 🔐 Security Features

- **JWT Authentication** - Token-based authentication stored in localStorage
- **Protected Routes** - Role-based access control (DOCTOR/PHARMACIST)
- **Request Interceptors** - Automatic token attachment to requests
- **Response Interceptors** - Automatic logout on 401 unauthorized
- **Credentials Support** - HTTP-only cookie support with `withCredentials: true`

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-friendly interface
- **Modern UI** - Clean and professional medical interface
- **Smooth Animations** - Framer Motion for enhanced UX
- **Loading States** - User feedback during API calls
- **Error Handling** - User-friendly error messages



This project is part of a medical prescription management system.

---

**Note:** Ensure the backend API is running before starting the frontend application.
