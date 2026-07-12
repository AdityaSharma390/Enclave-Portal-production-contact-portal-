import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-brand-950 transition-colors duration-300">
      {/* Collapsible Sidebar Nav */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Page Content Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic Nested Pages Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 animate-slide-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
