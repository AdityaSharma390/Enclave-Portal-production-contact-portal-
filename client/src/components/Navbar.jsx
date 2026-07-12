import React from 'react';
import { Menu, Sun, Moon, Bell, Shield } from 'lucide-react';
import useTheme from '../hooks/useTheme.js';
import useAuth from '../hooks/useAuth.js';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/95 dark:bg-brand-900/95 border-b border-slate-200/80 dark:border-brand-800/40 backdrop-blur-md shadow-xs transition-colors duration-300">
      {/* Left Action Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-brand-800 dark:hover:text-slate-200 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-display">
            Portal Control Panel
          </h2>
        </div>
      </div>

      {/* Right Control Panels */}
      <div className="flex items-center gap-3">
        {/* Admin Tag */}
        {user?.role === 'Admin' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-brand-600 bg-brand-50 rounded-full border border-brand-200/50 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-400">
            <Shield className="w-3.5 h-3.5" />
            Security Root
          </div>
        )}

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-brand-800 dark:hover:text-slate-200 rounded-lg transition-colors duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Dynamic Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-brand-800 dark:hover:text-slate-200 rounded-lg transition-colors duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-brand-800"></div>

        {/* Quick Profile info */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-3">
              {user?.fullName}
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
