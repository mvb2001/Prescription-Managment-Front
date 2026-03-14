import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.loginDoctor(formData);
      const { token, role } = response.data;
      
      login({ email: formData.email, role }, token);
      
      if (role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (role === 'PHARMACIST') {
        navigate('/pharmacist/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 p-4">
      {/* Elegant animated wave background */}
      <div className="absolute inset-0">
        {/* Multiple layered waves with parallax-like animation */}
        <div className="absolute inset-0 opacity-40">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
        </div>

        {/* Soft radial glows for depth */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.35) 0%, transparent 50%)`,
        }}></div>
      </div>

      {/* Medical icons decoration  */}
      <div className="absolute top-10 left-10 text-cyan-400 opacity-60">
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 text-teal-400 opacity-60">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 border border-cyan-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">DigitalRx</h2>
          <p className="text-gray-600">Welcome back! Please sign in</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (form fields remain the same) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:from-cyan-400 disabled:to-teal-400 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-3">Don't have an account?</p>
          <button 
            onClick={() => navigate('/signup/doctor')} 
            className="text-cyan-600 hover:text-cyan-700 font-medium text-sm hover:underline"
          >
            Sign up as Doctor →
          </button>
        </div>
      </div>

      {/* CSS for animated waves - add this to your global CSS file  */}
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
      `}</style>
    </div>
  );
};

export default Login;