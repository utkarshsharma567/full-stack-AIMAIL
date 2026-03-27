import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      const verifyData = { userId: data.userId, email };
      localStorage.setItem('verifyData', JSON.stringify(verifyData));

      toast.success(data.message);
      navigate('/verify-otp', { state: verifyData });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden font-sans">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-900/20 to-black"></div>

      {/* Glow Effects */}
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
        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Join us and start your journey 🚀
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition shadow-inner"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition shadow-inner"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition shadow-inner"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold text-lg tracking-wide hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,255,150,0.5)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;