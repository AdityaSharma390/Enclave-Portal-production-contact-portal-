import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, User, LogOut, ShieldAlert, X } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import { getInitials, getAvatarColor } from '../utils/helpers.js';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Contacts', path: '/contacts', icon: Users },
    { name: 'Add New', path: '/contacts/new', icon: UserPlus },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-24 bg-[#0a1128] text-slate-400 border-r border-slate-800/80 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:flex-shrink-0`}
      >
        {/* Sidebar Header Logo */}
        <div className="flex items-center justify-center h-16 border-b border-slate-800/60 bg-[#070b1a]">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white font-display font-extrabold text-lg shadow-md shadow-brand-500/10">
            E
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden absolute right-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Avatar Circle */}
        {user && (
          <div className="flex flex-col items-center py-5 border-b border-slate-800/40">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-inner text-xs border border-slate-700/50"
              style={{ backgroundColor: getAvatarColor(user.fullName) }}
              title={user.fullName}
            >
              {getInitials(user.fullName)}
            </div>
            {user.role === 'Admin' && (
              <span className="text-[8px] font-bold text-teal-400 mt-1 uppercase tracking-widest bg-teal-400/10 px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
        )}

        {/* Navigation Items (Icons stacked vertically with text below) */}
        <nav className="flex-1 py-6 space-y-5 overflow-y-auto flex flex-col items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-20 py-2.5 rounded-xl transition-all duration-200 gap-1.5 ${
                    isActive
                      ? 'bg-brand-500/10 text-white font-semibold'
                      : 'text-slate-500 hover:bg-slate-800/30 hover:text-slate-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                          : 'bg-transparent text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-semibold">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="py-4 border-t border-slate-800/40 flex justify-center">
          <button
            onClick={() => {
              logout();
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            title="Sign Out"
            className="flex flex-col items-center justify-center w-20 py-2 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 gap-1"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider font-semibold">Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
