import React from 'react';
import { Menu, Bell, Shield } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-black border-b border-slate-900 shadow-xs">
      {/* Left Action Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:bg-[#1c1c1e] hover:text-white lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-slate-400 font-display">
            Portal Control Panel
          </h2>
        </div>
      </div>

      {/* Right Control Panels */}
      <div className="flex items-center gap-3">
        {/* Admin Tag - Lime Green */}
        {user?.role === 'Admin' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#dffe00] bg-[#dffe00]/10 border border-[#dffe00]/20 rounded-full uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Security Root
          </div>
        )}

        {/* Dynamic Notification Bell - Lime dot */}
        <button className="relative p-2 text-slate-400 hover:bg-[#1c1c1e] hover:text-white rounded-lg transition-colors duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#dffe00] rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        {/* Quick Profile info */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-white leading-3">
              {user?.fullName}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
