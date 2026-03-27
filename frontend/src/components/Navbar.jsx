import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-black text-white flex items-center justify-between px-6 shadow-lg relative z-10">
      <div className="text-lg font-medium hidden md:block">
        Welcome back, <span className="text-green-400">{user?.name || 'User'}</span>
      </div>
      <div className="text-lg font-bold text-green-400 md:hidden">MailGen AI</div>
      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          
          className="flex items-center text-gray-300 hover:text-green-400 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;