import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, User, LogOut, ShieldAlert, X } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import { getInitials, getAvatarColor } from '../utils/helpers.js';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Contacts List', path: '/contacts', icon: Users },
    { name: 'Create Contact', path: '/contacts/new', icon: UserPlus },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-black text-slate-300 border-r border-slate-900 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:flex-shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-900 bg-black">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#dffe00] text-black font-display font-extrabold text-lg">
              E
            </div>
            <span className="font-display font-bold tracking-tight text-white text-lg">
              Enclave Portal
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-slate-400 hover:bg-[#1c1c1e] hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Badge */}
        {user && (
          <div className="p-4 mx-4 my-4 rounded-xl bg-[#1c1c1e] border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white shadow-inner text-sm"
                style={{ backgroundColor: getAvatarColor(user.fullName) }}
              >
                {getInitials(user.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.fullName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {user.role === 'Admin' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#dffe00] bg-[#dffe00]/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      User
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
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
                  `flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#dffe00] text-black shadow-md shadow-[#dffe00]/5'
                      : 'text-slate-400 hover:bg-[#1c1c1e]/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={() => {
              logout();
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-full hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
