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

## 🗂️ Project Structure

```
Medical_F/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, icons, etc.
│   ├── components/           # Reusable components
│   │   ├── PatientList.jsx
│   │   ├── PrescriptionModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RegisterPatient.jsx
│   │   └── RegisterPharmacist.jsx
│   ├── context/              # React Context
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── pages/                # Page components
│   │   ├── Login.jsx
│   │   ├── SignupDoctor.jsx
│   │   ├── SignupPharmacist.jsx
│   │   ├── DoctorDashboard.jsx
│   │   └── PharmacistDashboard.jsx
│   ├── services/             # API services
│   │   └── api.js            # Axios instance & API calls
│   ├── App.jsx               # Main app component with routes
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles & Tailwind imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Doctor/Pharmacist login |
| `POST` | `/api/auth/signup/doctor` | Register new doctor |
| `POST` | `/api/auth/signup/pharmacist` | Register new pharmacist |

### Patient Management (Doctor only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/all` | Get all registered patients |
| `POST` | `/api/patient/register` | Register new patient |
| `POST` | `/api/patient/{patientId}/prescriptions` | Create prescription for patient |
| `GET` | `/api/patient/{patientId}/prescriptions` | Get patient's prescription history |

### Pharmacist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/pharmacist/prescriptions` | Get all prescriptions in system |

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
- **Form Validation** - Client-side validation for all forms
- **Loading States** - User feedback during API calls
- **Error Handling** - User-friendly error messages

## 🔧 Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
- `eslint.config.js` - ESLint rules for code quality

## 📝 Environment Variables

Create a `.env` file in the root directory (optional):

```env
VITE_API_BASE_URL=http://localhost:9090
```

Then update `api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
```

## 🚧 Development Notes

- The app automatically redirects to `/login` for unauthenticated users
- JWT tokens are stored in localStorage
- Role-based routing ensures doctors and pharmacists see different dashboards
- All API requests include JWT token in Authorization header

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder ready for deployment.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a medical prescription management system.

---

**Note:** Ensure the backend API is running before starting the frontend application.
