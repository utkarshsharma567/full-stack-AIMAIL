import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <div className="w-64 bg-black text-white flex flex-col hidden md:flex shadow-lg">
      <div className="h-16 flex items-center px-6 border-b border-green-500/20">
        <h1 className="text-xl font-bold text-green-400">MailGen AI</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-green-500/20 text-green-400'
                : 'text-gray-300 hover:bg-green-500/10 hover:text-green-400'
            }`
          }
        >
          <HomeIcon className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
      </nav>
      <div className="p-4 border-t border-green-500/20">
        <div className="text-xs text-center text-gray-400">Built with React & MERN</div>
      </div>
    </div>
  );
};

export default Sidebar;