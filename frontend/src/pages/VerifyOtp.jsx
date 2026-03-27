import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [checkingData, setCheckingData] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const stateData = location.state;

    if (stateData?.userId && stateData?.email) {
      setUserData(stateData);
      localStorage.setItem('verifyData', JSON.stringify(stateData));
    } else {
      const storedData = JSON.parse(localStorage.getItem('verifyData') || '{}');
      if (storedData?.userId && storedData?.email) {
        setUserData(storedData);
      } else {
        navigate('/signup');
      }
    }

    setCheckingData(false);
  }, []);

  if (checkingData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', {
        email: userData.email,
        otp: otp
      });
      login(data);
      toast.success('Email verified successfully!');
      localStorage.removeItem('verifyData');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-900/20 to-black"></div>

      {/* Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-400/20 blur-[120px] rounded-full"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,255,150,0.15)] p-10">

        {/* Close */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
          Verify Email
        </h2>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Enter the 6-digit code sent to
          <br />
          <span className="text-green-400 font-medium">
            {userData?.email}
          </span>
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* OTP Input */}
          <div>
            <label className="block text-center text-xs text-gray-400 mb-3">
              One-Time Password
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-4xl tracking-[0.6em] font-mono px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition shadow-inner"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold text-lg tracking-wide hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,255,150,0.5)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Resend */}
        <p className="text-center text-sm text-gray-400">
          Didn’t receive the code?{' '}
          <button
            onClick={() => toast('Resend functionality coming soon')}
            className="text-green-400 hover:text-green-300 font-medium"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;